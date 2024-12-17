// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IFlashLoanReceiver {
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

contract DAFIFlashLoan is ReentrancyGuard, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct ReserveData {
        bool isActive;
        uint256 totalLiquidity;
        uint256 availableLiquidity;
        uint256 flashLoanFee;
    }

    mapping(address => ReserveData) public reserves;
    mapping(address => bool) public flashLoanProviders;

    uint256 public constant FLASH_LOAN_FEE_PRECISION = 10000;
    uint256 public constant MAX_FLASH_LOAN_FEE = 1000; // 10%

    event ReserveInitialized(address indexed token, uint256 fee);
    event FlashLoan(
        address indexed receiver,
        address indexed token,
        uint256 amount,
        uint256 fee
    );
    event LiquidityProvided(address indexed token, uint256 amount);
    event LiquidityWithdrawn(address indexed token, uint256 amount);

    constructor() {}

    function initializeReserve(address token, uint256 fee) external onlyOwner {
        require(!reserves[token].isActive, "Reserve already initialized");
        require(fee <= MAX_FLASH_LOAN_FEE, "Fee too high");

        reserves[token] = ReserveData({
            isActive: true,
            totalLiquidity: 0,
            availableLiquidity: 0,
            flashLoanFee: fee
        });

        emit ReserveInitialized(token, fee);
    }

    function addFlashLoanProvider(address provider) external onlyOwner {
        require(!flashLoanProviders[provider], "Already a provider");
        flashLoanProviders[provider] = true;
    }

    function removeFlashLoanProvider(address provider) external onlyOwner {
        require(flashLoanProviders[provider], "Not a provider");
        flashLoanProviders[provider] = false;
    }

    function executeFlashLoan(
        address receiver,
        address[] calldata tokens,
        uint256[] calldata amounts,
        bytes calldata params
    ) external nonReentrant {
        require(tokens.length == amounts.length, "Invalid input");

        uint256[] memory premiums = new uint256[](tokens.length);
        
        // Calculate premiums and check liquidity
        for (uint256 i = 0; i < tokens.length; i++) {
            require(reserves[tokens[i]].isActive, "Reserve not active");
            require(
                amounts[i] <= reserves[tokens[i]].availableLiquidity,
                "Insufficient liquidity"
            );

            premiums[i] = amounts[i].mul(reserves[tokens[i]].flashLoanFee).div(
                FLASH_LOAN_FEE_PRECISION
            );

            reserves[tokens[i]].availableLiquidity = reserves[tokens[i]]
                .availableLiquidity
                .sub(amounts[i]);

            IERC20(tokens[i]).safeTransfer(receiver, amounts[i]);
        }

        // Execute operation
        require(
            IFlashLoanReceiver(receiver).executeOperation(
                tokens,
                amounts,
                premiums,
                msg.sender,
                params
            ),
            "Flash loan failed"
        );

        // Repay and update reserves
        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 repayAmount = amounts[i].add(premiums[i]);
            IERC20(tokens[i]).safeTransferFrom(
                receiver,
                address(this),
                repayAmount
            );

            reserves[tokens[i]].availableLiquidity = reserves[tokens[i]]
                .availableLiquidity
                .add(amounts[i]);

            emit FlashLoan(receiver, tokens[i], amounts[i], premiums[i]);
        }
    }

    function provideFlashLoanLiquidity(address token, uint256 amount)
        external
        nonReentrant
    {
        require(reserves[token].isActive, "Reserve not active");
        require(amount > 0, "Invalid amount");
        require(flashLoanProviders[msg.sender], "Not a provider");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        reserves[token].totalLiquidity = reserves[token].totalLiquidity.add(
            amount
        );
        reserves[token].availableLiquidity = reserves[token]
            .availableLiquidity
            .add(amount);

        emit LiquidityProvided(token, amount);
    }

    function withdrawFlashLoanLiquidity(address token, uint256 amount)
        external
        nonReentrant
    {
        require(reserves[token].isActive, "Reserve not active");
        require(amount > 0, "Invalid amount");
        require(flashLoanProviders[msg.sender], "Not a provider");
        require(
            amount <= reserves[token].availableLiquidity,
            "Insufficient liquidity"
        );

        reserves[token].totalLiquidity = reserves[token].totalLiquidity.sub(
            amount
        );
        reserves[token].availableLiquidity = reserves[token]
            .availableLiquidity
            .sub(amount);

        IERC20(token).safeTransfer(msg.sender, amount);

        emit LiquidityWithdrawn(token, amount);
    }
}
