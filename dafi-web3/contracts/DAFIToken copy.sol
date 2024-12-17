// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract DAFIToken is ERC20, Ownable, Pausable {
    mapping(address => bool) public verifiedFarmers;
    mapping(address => FarmerDetails) public farmerProfiles;
    
    struct FarmerDetails {
        string did;  // Decentralized Identifier
        uint256 reputationScore;
        bool isOrganic;
        string location;
        uint256 landSize;  // in square meters
    }

    event FarmerVerified(address indexed farmer, string did);
    event ReputationUpdated(address indexed farmer, uint256 newScore);

    constructor() ERC20("DAFI Agricultural Token", "DAFI") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function verifyFarmer(
        address farmer,
        string memory did,
        bool isOrganic,
        string memory location,
        uint256 landSize
    ) external onlyOwner {
        require(!verifiedFarmers[farmer], "Farmer already verified");
        
        verifiedFarmers[farmer] = true;
        farmerProfiles[farmer] = FarmerDetails({
            did: did,
            reputationScore: 100,
            isOrganic: isOrganic,
            location: location,
            landSize: landSize
        });

        emit FarmerVerified(farmer, did);
    }

    function updateReputationScore(address farmer, uint256 newScore) external onlyOwner {
        require(verifiedFarmers[farmer], "Farmer not verified");
        require(newScore <= 100, "Score must be <= 100");
        
        farmerProfiles[farmer].reputationScore = newScore;
        emit ReputationUpdated(farmer, newScore);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
