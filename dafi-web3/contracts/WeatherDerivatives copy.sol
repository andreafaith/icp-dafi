// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract WeatherDerivatives is Ownable, ReentrancyGuard {
    IERC20 public usdcToken;
    AggregatorV3Interface public weatherOracle;
    
    struct WeatherContract {
        address farmer;
        uint256 amount;
        uint256 strikeTemp;
        uint256 duration;
        uint256 premium;
        uint256 payout;
        uint256 startTime;
        bool active;
        bool claimed;
    }
    
    mapping(uint256 => WeatherContract) public weatherContracts;
    uint256 public contractCount;
    uint256 public minPremium = 100 * 10**6; // 100 USDC
    uint256 public maxPayout = 10000 * 10**6; // 10,000 USDC
    
    event ContractCreated(
        uint256 indexed contractId,
        address indexed farmer,
        uint256 strikeTemp,
        uint256 duration,
        uint256 premium,
        uint256 payout
    );
    event ContractTriggered(uint256 indexed contractId, uint256 temperature);
    event ContractExpired(uint256 indexed contractId);
    
    constructor(address _usdcToken, address _weatherOracle) {
        usdcToken = IERC20(_usdcToken);
        weatherOracle = AggregatorV3Interface(_weatherOracle);
    }
    
    function createWeatherContract(
        uint256 strikeTemp,
        uint256 durationDays,
        uint256 premium,
        uint256 payout
    ) external nonReentrant returns (uint256) {
        require(premium >= minPremium, "Premium too low");
        require(payout <= maxPayout, "Payout too high");
        require(durationDays > 0 && durationDays <= 365, "Invalid duration");
        
        require(usdcToken.transferFrom(msg.sender, address(this), premium), "Premium transfer failed");
        
        uint256 contractId = contractCount++;
        weatherContracts[contractId] = WeatherContract({
            farmer: msg.sender,
            amount: premium,
            strikeTemp: strikeTemp,
            duration: durationDays * 1 days,
            premium: premium,
            payout: payout,
            startTime: block.timestamp,
            active: true,
            claimed: false
        });
        
        emit ContractCreated(
            contractId,
            msg.sender,
            strikeTemp,
            durationDays,
            premium,
            payout
        );
        
        return contractId;
    }
    
    function checkAndTriggerContract(uint256 contractId) external nonReentrant {
        WeatherContract storage wContract = weatherContracts[contractId];
        require(wContract.active, "Contract not active");
        require(!wContract.claimed, "Already claimed");
        require(block.timestamp < wContract.startTime + wContract.duration, "Contract expired");
        
        (, int256 temperature,,,) = weatherOracle.latestRoundData();
        
        if (uint256(temperature) >= wContract.strikeTemp) {
            wContract.claimed = true;
            wContract.active = false;
            require(usdcToken.transfer(wContract.farmer, wContract.payout), "Payout failed");
            emit ContractTriggered(contractId, uint256(temperature));
        }
    }
    
    function expireContract(uint256 contractId) external {
        WeatherContract storage wContract = weatherContracts[contractId];
        require(wContract.active, "Contract not active");
        require(block.timestamp >= wContract.startTime + wContract.duration, "Contract not expired");
        
        wContract.active = false;
        emit ContractExpired(contractId);
    }
    
    function updatePremiumLimits(uint256 _minPremium, uint256 _maxPayout) external onlyOwner {
        minPremium = _minPremium;
        maxPayout = _maxPayout;
    }
    
    function getContractDetails(uint256 contractId) external view returns (
        address farmer,
        uint256 amount,
        uint256 strikeTemp,
        uint256 duration,
        uint256 premium,
        uint256 payout,
        uint256 startTime,
        bool active,
        bool claimed
    ) {
        WeatherContract memory wContract = weatherContracts[contractId];
        return (
            wContract.farmer,
            wContract.amount,
            wContract.strikeTemp,
            wContract.duration,
            wContract.premium,
            wContract.payout,
            wContract.startTime,
            wContract.active,
            wContract.claimed
        );
    }
}
