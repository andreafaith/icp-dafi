// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DerivativeContract is Ownable {
    IERC20 public cropToken;
    uint256 public strikePrice;
    uint256 public expirationTime;

    event DerivativeSettled(address indexed buyer, uint256 payout);

    constructor(address _cropToken, uint256 _strikePrice, uint256 _expirationTime) {
        cropToken = IERC20(_cropToken);
        strikePrice = _strikePrice;
        expirationTime = _expirationTime;
    }

    function settleDerivative(address buyer) public onlyOwner {
        require(block.timestamp > expirationTime, "Derivative not expired");
        uint256 currentPrice = getCropTokenPrice(); // Placeholder for price oracle
        uint256 payout = 0;
        if (currentPrice > strikePrice) {
            payout = currentPrice - strikePrice;
        }
        emit DerivativeSettled(buyer, payout);
    }

    function getCropTokenPrice() public view returns (uint256) {
        // This is a placeholder for a price oracle.
        // In a real application, you would use a Chainlink oracle or similar.
        return 150; // Example price
    }
}
