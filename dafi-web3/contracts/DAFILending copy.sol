// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DAFILending is ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    struct Loan {
        address borrower;
        uint256 collateralTokenId;
        uint256 collateralAmount;
        uint256 loanAmount;
        uint256 interestRate;
        uint256 startTime;
        uint256 duration;
        bool active;
        bool defaulted;
    }

    struct LendingPool {
        uint256 totalDeposited;
        uint256 totalBorrowed;
        uint256 minLoanDuration;
        uint256 maxLoanDuration;
        uint256 baseInterestRate;
        uint256 utilizationMultiplier;
        uint256 collateralRatio;
        bool active;
    }

    IERC20 public usdcToken;
    IERC1155 public farmAssetToken;
    
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256) public deposits;
    mapping(address => uint256) public rewards;
    
    LendingPool public pool;
    uint256 public loanCount;
    uint256 public constant INTEREST_PRECISION = 10000;
    uint256 public constant UTILIZATION_PRECISION = 10000;
    
    event Deposited(address indexed depositor, uint256 amount);
    event Withdrawn(address indexed depositor, uint256 amount);
    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
    event CollateralLiquidated(uint256 indexed loanId, address indexed liquidator);

    constructor(
        address _usdcToken,
        address _farmAssetToken,
        uint256 _baseInterestRate,
        uint256 _utilizationMultiplier,
        uint256 _collateralRatio
    ) {
        usdcToken = IERC20(_usdcToken);
        farmAssetToken = IERC1155(_farmAssetToken);
        
        pool = LendingPool({
            totalDeposited: 0,
            totalBorrowed: 0,
            minLoanDuration: 7 days,
            maxLoanDuration: 365 days,
            baseInterestRate: _baseInterestRate,
            utilizationMultiplier: _utilizationMultiplier,
            collateralRatio: _collateralRatio,
            active: true
        });
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(pool.active, "Pool not active");
        
        usdcToken.transferFrom(msg.sender, address(this), amount);
        deposits[msg.sender] = deposits[msg.sender].add(amount);
        pool.totalDeposited = pool.totalDeposited.add(amount);
        
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        
        uint256 availableLiquidity = pool.totalDeposited.sub(pool.totalBorrowed);
        require(amount <= availableLiquidity, "Insufficient liquidity");
        
        deposits[msg.sender] = deposits[msg.sender].sub(amount);
        pool.totalDeposited = pool.totalDeposited.sub(amount);
        usdcToken.transfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }

    function createLoan(
        uint256 collateralTokenId,
        uint256 collateralAmount,
        uint256 loanAmount,
        uint256 duration
    ) external nonReentrant returns (uint256) {
        require(pool.active, "Pool not active");
        require(duration >= pool.minLoanDuration && duration <= pool.maxLoanDuration, "Invalid duration");
        require(loanAmount > 0, "Loan amount must be positive");
        
        uint256 collateralValue = getCollateralValue(collateralTokenId, collateralAmount);
        require(collateralValue.mul(pool.collateralRatio) >= loanAmount.mul(INTEREST_PRECISION), "Insufficient collateral");
        
        farmAssetToken.safeTransferFrom(msg.sender, address(this), collateralTokenId, collateralAmount, "");
        
        uint256 interestRate = calculateInterestRate();
        uint256 loanId = loanCount++;
        
        loans[loanId] = Loan({
            borrower: msg.sender,
            collateralTokenId: collateralTokenId,
            collateralAmount: collateralAmount,
            loanAmount: loanAmount,
            interestRate: interestRate,
            startTime: block.timestamp,
            duration: duration,
            active: true,
            defaulted: false
        });
        
        pool.totalBorrowed = pool.totalBorrowed.add(loanAmount);
        usdcToken.transfer(msg.sender, loanAmount);
        
        emit LoanCreated(loanId, msg.sender, loanAmount);
        return loanId;
    }

    function repayLoan(uint256 loanId) external nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.active, "Loan not active");
        require(!loan.defaulted, "Loan defaulted");
        
        uint256 interest = calculateInterest(loanId);
        uint256 totalRepayment = loan.loanAmount.add(interest);
        
        usdcToken.transferFrom(msg.sender, address(this), totalRepayment);
        farmAssetToken.safeTransferFrom(address(this), loan.borrower, loan.collateralTokenId, loan.collateralAmount, "");
        
        pool.totalBorrowed = pool.totalBorrowed.sub(loan.loanAmount);
        loan.active = false;
        
        // Distribute interest to depositors
        distributeInterest(interest);
        
        emit LoanRepaid(loanId, loan.borrower, totalRepayment);
    }

    function liquidateLoan(uint256 loanId) external nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.active, "Loan not active");
        require(!loan.defaulted, "Already defaulted");
        require(isLoanDefaulted(loanId), "Loan not eligible for liquidation");
        
        loan.defaulted = true;
        loan.active = false;
        
        // Transfer collateral to liquidator
        farmAssetToken.safeTransferFrom(address(this), msg.sender, loan.collateralTokenId, loan.collateralAmount, "");
        
        emit LoanDefaulted(loanId, loan.borrower);
        emit CollateralLiquidated(loanId, msg.sender);
    }

    function calculateInterestRate() public view returns (uint256) {
        if (pool.totalDeposited == 0) return pool.baseInterestRate;
        
        uint256 utilization = pool.totalBorrowed.mul(UTILIZATION_PRECISION).div(pool.totalDeposited);
        return pool.baseInterestRate.add(
            utilization.mul(pool.utilizationMultiplier).div(UTILIZATION_PRECISION)
        );
    }

    function calculateInterest(uint256 loanId) public view returns (uint256) {
        Loan memory loan = loans[loanId];
        uint256 timeElapsed = block.timestamp.sub(loan.startTime);
        return loan.loanAmount.mul(loan.interestRate).mul(timeElapsed).div(365 days).div(INTEREST_PRECISION);
    }

    function isLoanDefaulted(uint256 loanId) public view returns (bool) {
        Loan memory loan = loans[loanId];
        return block.timestamp > loan.startTime.add(loan.duration);
    }

    function getCollateralValue(uint256 tokenId, uint256 amount) public view returns (uint256) {
        // This should be implemented with an oracle for real asset prices
        return amount.mul(100); // Placeholder implementation
    }

    function distributeInterest(uint256 interest) internal {
        for (uint256 i = 0; i < loanCount; i++) {
            if (deposits[msg.sender] > 0) {
                uint256 share = interest.mul(deposits[msg.sender]).div(pool.totalDeposited);
                rewards[msg.sender] = rewards[msg.sender].add(share);
            }
        }
    }

    function claimRewards() external nonReentrant {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        
        rewards[msg.sender] = 0;
        usdcToken.transfer(msg.sender, reward);
    }

    function updatePoolParameters(
        uint256 _baseInterestRate,
        uint256 _utilizationMultiplier,
        uint256 _collateralRatio,
        uint256 _minLoanDuration,
        uint256 _maxLoanDuration
    ) external onlyOwner {
        pool.baseInterestRate = _baseInterestRate;
        pool.utilizationMultiplier = _utilizationMultiplier;
        pool.collateralRatio = _collateralRatio;
        pool.minLoanDuration = _minLoanDuration;
        pool.maxLoanDuration = _maxLoanDuration;
    }

    function pausePool() external onlyOwner {
        pool.active = false;
    }

    function unpausePool() external onlyOwner {
        pool.active = true;
    }
}
