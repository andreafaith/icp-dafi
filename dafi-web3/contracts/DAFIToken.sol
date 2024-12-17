// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract DAFIToken is ERC20, Ownable, Pausable {
    uint256 private constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    mapping(address => bool) public isValidator;
    
    constructor() ERC20("DAFI Token", "DAFI") {
        isValidator[msg.sender] = true;
    }
    
    function addValidator(address _validator) external onlyOwner {
        isValidator[_validator] = true;
    }
    
    function removeValidator(address _validator) external onlyOwner {
        isValidator[_validator] = false;
    }
    
    function mint(address to, uint256 amount) external whenNotPaused {
        require(isValidator[msg.sender], "Only validators can mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
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
    
    // Transfer override with pause functionality
    function transfer(address recipient, uint256 amount) public virtual override whenNotPaused returns (bool) {
        return super.transfer(recipient, amount);
    }
    
    // TransferFrom override with pause functionality
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override whenNotPaused returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }
}
