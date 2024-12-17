// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InsuranceToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18;
    bool public isClaimable = false;

    constructor() ERC20("InsuranceToken", "ITK") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function setClaimable(bool _isClaimable) public onlyOwner {
        isClaimable = _isClaimable;
    }

    function claimInsurance() public {
        require(isClaimable, "Insurance is not claimable yet");
        uint256 payout = 1000 * 10**18; // Example payout
        _transfer(owner(), msg.sender, payout);
    }
}
