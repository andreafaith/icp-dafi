// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract WeatherDerivatives is ReentrancyGuard, Ownable, Pausable {
    IERC20 public dafiToken;
    
    struct Contract {
        address buyer;
        uint256 amount;
        uint256 strikeTemp;
        uint256 startTime;
        uint256 endTime;
        uint256 premium;
        bool settled;
        ContractType contractType;
    }
    
    enum ContractType { PUT, CALL }
    
    struct WeatherData {
        uint256 timestamp;
        int256 temperature;
        uint256 rainfall;
        uint256 humidity;
    }
    
    mapping(uint256 => Contract) public contracts;
    mapping(uint256 => WeatherData) public weatherData;
    
    uint256 public contractCounter;
    address public oracle;
    uint256 public minimumPremium = 100 * 10**18; // 100 tokens
    
    event ContractCreated(uint256 indexed contractId, address indexed buyer, uint256 amount, uint256 strikeTemp);
    event ContractSettled(uint256 indexed contractId, uint256 payout);
    event WeatherDataUpdated(uint256 timestamp, int256 temperature, uint256 rainfall);
    event OracleUpdated(address indexed newOracle);
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call");
        _;
    }
    
    constructor(address _dafiToken) {
        dafiToken = IERC20(_dafiToken);
        oracle = msg.sender;
    }
    
    function createContract(
        uint256 _amount,
        uint256 _strikeTemp,
        uint256 _duration,
        uint256 _premium,
        ContractType _type
    ) external nonReentrant whenNotPaused {
        require(_premium >= minimumPremium, "Premium too low");
        require(_duration >= 1 days && _duration <= 365 days, "Invalid duration");
        
        require(dafiToken.transferFrom(msg.sender, address(this), _premium), "Premium transfer failed");
        
        contractCounter++;
        contracts[contractCounter] = Contract({
            buyer: msg.sender,
            amount: _amount,
            strikeTemp: _strikeTemp,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            premium: _premium,
            settled: false,
            contractType: _type
        });
        
        emit ContractCreated(contractCounter, msg.sender, _amount, _strikeTemp);
    }
    
    function updateWeatherData(
        uint256 _timestamp,
        int256 _temperature,
        uint256 _rainfall,
        uint256 _humidity
    ) external onlyOracle whenNotPaused {
        require(_timestamp <= block.timestamp, "Invalid timestamp");
        
        weatherData[_timestamp] = WeatherData({
            timestamp: _timestamp,
            temperature: _temperature,
            rainfall: _rainfall,
            humidity: _humidity
        });
        
        emit WeatherDataUpdated(_timestamp, _temperature, _rainfall);
    }
    
    function settleContract(uint256 _contractId) external nonReentrant whenNotPaused {
        Contract storage contract_ = contracts[_contractId];
        require(!contract_.settled, "Already settled");
        require(block.timestamp >= contract_.endTime, "Contract not expired");
        
        WeatherData memory data = weatherData[contract_.endTime];
        require(data.timestamp > 0, "No weather data");
        
        uint256 payout = calculatePayout(_contractId, uint256(data.temperature));
        contract_.settled = true;
        
        if (payout > 0) {
            require(dafiToken.transfer(contract_.buyer, payout), "Payout transfer failed");
        }
        
        emit ContractSettled(_contractId, payout);
    }
    
    function calculatePayout(uint256 _contractId, uint256 _actualTemp) public view returns (uint256) {
        Contract memory contract_ = contracts[_contractId];
        
        if (contract_.contractType == ContractType.PUT) {
            if (_actualTemp < contract_.strikeTemp) {
                return contract_.amount * (contract_.strikeTemp - _actualTemp) / contract_.strikeTemp;
            }
        } else { // CALL
            if (_actualTemp > contract_.strikeTemp) {
                return contract_.amount * (_actualTemp - contract_.strikeTemp) / contract_.strikeTemp;
            }
        }
        
        return 0;
    }
    
    function updateOracle(address _newOracle) external onlyOwner {
        require(_newOracle != address(0), "Invalid address");
        oracle = _newOracle;
        emit OracleUpdated(_newOracle);
    }
    
    function updateMinimumPremium(uint256 _newMinimum) external onlyOwner {
        minimumPremium = _newMinimum;
    }
    
    function getContract(uint256 _contractId) external view returns (
        address buyer,
        uint256 amount,
        uint256 strikeTemp,
        uint256 startTime,
        uint256 endTime,
        uint256 premium,
        bool settled,
        ContractType contractType
    ) {
        Contract memory contract_ = contracts[_contractId];
        return (
            contract_.buyer,
            contract_.amount,
            contract_.strikeTemp,
            contract_.startTime,
            contract_.endTime,
            contract_.premium,
            contract_.settled,
            contract_.contractType
        );
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw(address _token) external onlyOwner {
        IERC20 token = IERC20(_token);
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner(), balance), "Transfer failed");
    }
}
