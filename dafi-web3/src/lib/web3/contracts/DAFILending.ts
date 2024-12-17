import { ethers } from 'ethers';
import { BaseContract } from './base';
import DAFILendingABI from '../../../contracts/abis/DAFILending.json';

export interface LoanRequest {
  amount: ethers.BigNumber;
  duration: number;  // in days
  collateralTokenId: string;
  collateralType: 'farm' | 'crop' | 'equipment';
}

export interface Loan {
  id: string;
  borrower: string;
  amount: ethers.BigNumber;
  collateralTokenId: string;
  collateralType: string;
  startDate: number;
  endDate: number;
  interestRate: number;
  status: 'active' | 'repaid' | 'defaulted';
}

export class DAFILendingContract extends BaseContract {
  constructor(address: string, provider: ethers.providers.Web3Provider) {
    super(address, DAFILendingABI, provider);
  }

  async requestLoan(loanRequest: LoanRequest): Promise<string> {
    const tx = await this.executeTransaction('requestLoan', [
      loanRequest.amount,
      loanRequest.duration,
      loanRequest.collateralTokenId,
      loanRequest.collateralType,
    ]);

    if (tx.status === 'success') {
      const events = await this.getEvents('LoanRequested', {}, tx.blockNumber);
      return events[0].args.loanId.toString();
    }
    throw new Error('Failed to request loan');
  }

  async approveLoan(loanId: string): Promise<void> {
    await this.executeTransaction('approveLoan', [loanId]);
  }

  async repayLoan(loanId: string, amount: ethers.BigNumber): Promise<void> {
    await this.executeTransaction('repayLoan', [loanId], { value: amount });
  }

  async getLoan(loanId: string): Promise<Loan> {
    const loan = await this.contract.getLoan(loanId);
    return {
      id: loanId,
      borrower: loan.borrower,
      amount: loan.amount,
      collateralTokenId: loan.collateralTokenId,
      collateralType: loan.collateralType,
      startDate: loan.startDate.toNumber(),
      endDate: loan.endDate.toNumber(),
      interestRate: loan.interestRate.toNumber(),
      status: loan.status,
    };
  }

  async calculateInterestRate(
    amount: ethers.BigNumber,
    duration: number,
    collateralType: string
  ): Promise<number> {
    const rate = await this.contract.calculateInterestRate(
      amount,
      duration,
      collateralType
    );
    return rate.toNumber();
  }

  async getLoansByBorrower(borrower: string): Promise<string[]> {
    return await this.contract.getLoansByBorrower(borrower);
  }

  async getCollateralValue(
    tokenId: string,
    collateralType: string
  ): Promise<ethers.BigNumber> {
    return await this.contract.getCollateralValue(tokenId, collateralType);
  }

  subscribeLoanRequested(
    callback: (loanId: string, borrower: string) => void
  ): void {
    this.subscribeToEvent('LoanRequested', (loanId, borrower) => {
      callback(loanId.toString(), borrower);
    });
  }

  subscribeLoanApproved(
    callback: (loanId: string, approver: string) => void
  ): void {
    this.subscribeToEvent('LoanApproved', (loanId, approver) => {
      callback(loanId.toString(), approver);
    });
  }

  subscribeLoanRepaid(
    callback: (loanId: string, amount: ethers.BigNumber) => void
  ): void {
    this.subscribeToEvent('LoanRepaid', (loanId, amount) => {
      callback(loanId.toString(), amount);
    });
  }

  subscribeLoanDefaulted(
    callback: (loanId: string) => void
  ): void {
    this.subscribeToEvent('LoanDefaulted', (loanId) => {
      callback(loanId.toString());
    });
  }
}
