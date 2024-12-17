// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract DAFILending is ReentrancyGuard, Ownable, Pausable {
    IERC20 public dafiToken;
    
    struct Loan {
        uint256 amount;
        uint256 collateral;
        uint256 startTime;
        uint256 duration;
        uint256 interestRate;
        bool active;
        bool defaulted;
    }
    
    struct LoanTerms {
        uint256 minAmount;
        uint256 maxAmount;
        uint256 minDuration;
        uint256 maxDuration;
        uint256 baseInterestRate;
        uint256 collateralRatio;
    }
    
    mapping(address => Loan) public loans;
    mapping(address => uint256) public collateralBalance;
    
    LoanTerms public loanTerms;
    uint256 public totalLoans;
    uint256 public totalCollateral;
    
    event LoanCreated(address indexed borrower, uint256 amount, uint256 collateral, uint256 duration);
    event LoanRepaid(address indexed borrower, uint256 amount, uint256 interest);
    event CollateralSeized(address indexed borrower, uint256 amount);
    event CollateralWithdrawn(address indexed borrower, uint256 amount);
    event LoanTermsUpdated(uint256 minAmount, uint256 maxAmount, uint256 baseInterestRate);
    
    constructor(address _dafiToken) {
        dafiToken = IERC20(_dafiToken);
        
        loanTerms = LoanTerms({
            minAmount: 1000 * 10**18, // 1000 tokens
            maxAmount: 100000 * 10**18, // 100,000 tokens
            minDuration: 30 days,
            maxDuration: 365 days,
            baseInterestRate: 500, // 5% APR (in basis points)
            collateralRatio: 15000 // 150% (in basis points)
        });
    }
    
    function requestLoan(uint256 _amount, uint256 _duration) external nonReentrant whenNotPaused {
        require(!loans[msg.sender].active, "Existing loan active");
        require(_amount >= loanTerms.minAmount && _amount <= loanTerms.maxAmount, "Invalid loan amount");
        require(_duration >= loanTerms.minDuration && _duration <= loanTerms.maxDuration, "Invalid duration");
        
        uint256 requiredCollateral = (_amount * loanTerms.collateralRatio) / 10000;
        require(dafiToken.transferFrom(msg.sender, address(this), requiredCollateral), "Collateral transfer failed");
        
        loans[msg.sender] = Loan({
            amount: _amount,
            collateral: requiredCollateral,
            startTime: block.timestamp,
            duration: _duration,
            interestRate: calculateInterestRate(_amount, _duration),
            active: true,
            defaulted: false
        });
        
        collateralBalance[msg.sender] += requiredCollateral;
        totalLoans += _amount;
        totalCollateral += requiredCollateral;
        
        require(dafiToken.transfer(msg.sender, _amount), "Loan transfer failed");
        
        emit LoanCreated(msg.sender, _amount, requiredCollateral, _duration);
    }
    
    function repayLoan() external nonReentrant whenNotPaused {
        Loan storage loan = loans[msg.sender];
        require(loan.active, "No active loan");
        require(!loan.defaulted, "Loan defaulted");
        
        uint256 interest = calculateInterestDue(msg.sender);
        uint256 totalDue = loan.amount + interest;
        
        require(dafiToken.transferFrom(msg.sender, address(this), totalDue), "Repayment transfer failed");
        
        uint256 collateral = loan.collateral;
        delete loans[msg.sender];
        collateralBalance[msg.sender] -= collateral;
        totalLoans -= loan.amount;
        totalCollateral -= collateral;
        
        require(dafiToken.transfer(msg.sender, collateral), "Collateral return failed");
        
        emit LoanRepaid(msg.sender, loan.amount, interest);
        emit CollateralWithdrawn(msg.sender, collateral);
    }
    
    function liquidateLoan(address _borrower) external nonReentrant whenNotPaused {
        Loan storage loan = loans[_borrower];
        require(loan.active, "No active loan");
        require(!loan.defaulted, "Already defaulted");
        require(isDefaulted(_borrower), "Loan not defaulted");
        
        loan.defaulted = true;
        uint256 collateral = loan.collateral;
        delete loans[_borrower];
        collateralBalance[_borrower] -= collateral;
        totalLoans -= loan.amount;
        totalCollateral -= collateral;
        
        require(dafiToken.transfer(owner(), collateral), "Collateral seizure failed");
        
        emit CollateralSeized(_borrower, collateral);
    }
    
    function calculateInterestRate(uint256 _amount, uint256 _duration) public view returns (uint256) {
        uint256 baseRate = loanTerms.baseInterestRate;
        
        // Adjust rate based on amount
        if (_amount > loanTerms.maxAmount / 2) {
            baseRate += 100; // +1% for large loans
        }
        
        // Adjust rate based on duration
        if (_duration > 180 days) {
            baseRate += 200; // +2% for long duration
        }
        
        return baseRate;
    }
    
    function calculateInterestDue(address _borrower) public view returns (uint256) {
        Loan memory loan = loans[_borrower];
        require(loan.active, "No active loan");
        
        uint256 timeElapsed = block.timestamp - loan.startTime;
        uint256 annualInterest = (loan.amount * loan.interestRate) / 10000;
        return (annualInterest * timeElapsed) / 365 days;
    }
    
    function isDefaulted(address _borrower) public view returns (bool) {
        Loan memory loan = loans[_borrower];
        return loan.active && (block.timestamp > loan.startTime + loan.duration);
    }
    
    function updateLoanTerms(
        uint256 _minAmount,
        uint256 _maxAmount,
        uint256 _minDuration,
        uint256 _maxDuration,
        uint256 _baseInterestRate,
        uint256 _collateralRatio
    ) external onlyOwner {
        loanTerms = LoanTerms({
            minAmount: _minAmount,
            maxAmount: _maxAmount,
            minDuration: _minDuration,
            maxDuration: _maxDuration,
            baseInterestRate: _baseInterestRate,
            collateralRatio: _collateralRatio
        });
        
        emit LoanTermsUpdated(_minAmount, _maxAmount, _baseInterestRate);
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
