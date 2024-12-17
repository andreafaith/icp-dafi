// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CropToken is ERC20, Ownable {
    mapping(address => bool) public isValidator;
    
    constructor() ERC20("DAFI Crop Token", "CROP") {
        isValidator[msg.sender] = true;
    }
    
    function addValidator(address _validator) external onlyOwner {
        isValidator[_validator] = true;
    }
    
    function removeValidator(address _validator) external onlyOwner {
        isValidator[_validator] = false;
    }
    
    function mint(address to, uint256 amount) external {
        require(isValidator[msg.sender], "Only validators can mint");
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
