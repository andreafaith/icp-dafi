import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWeb3Provider } from './useWeb3Provider';
import { LoanRequest, Loan } from '../contracts/DAFILending';
import { useNotifications } from './useNotifications';

export function useLending() {
  const { provider, address } = useWeb3Provider();
  const lendingContract = useContract('DAFI_LENDING', provider);
  const { notifySuccess, notifyError } = useNotifications();
  const [loading, setLoading] = useState(false);

  const requestLoan = useCallback(
    async (loanRequest: LoanRequest) => {
      if (!lendingContract || !address) return;

      setLoading(true);
      try {
        const loanId = await lendingContract.requestLoan(loanRequest);
        notifySuccess('Loan request submitted successfully');
        return loanId;
      } catch (error: any) {
        notifyError('Failed to request loan: ' + error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [lendingContract, address, notifySuccess, notifyError]
  );

  const repayLoan = useCallback(
    async (loanId: string, amount: ethers.BigNumber) => {
      if (!lendingContract || !address) return;

      setLoading(true);
      try {
        await lendingContract.repayLoan(loanId, amount);
        notifySuccess('Loan repaid successfully');
      } catch (error: any) {
        notifyError('Failed to repay loan: ' + error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [lendingContract, address, notifySuccess, notifyError]
  );

  const fetchLoan = useCallback(
    async (loanId: string): Promise<Loan | null> => {
      if (!lendingContract) return null;

      try {
        return await lendingContract.getLoan(loanId);
      } catch (error: any) {
        notifyError('Failed to fetch loan: ' + error.message);
        return null;
      }
    },
    [lendingContract, notifyError]
  );

  const fetchUserLoans = useCallback(
    async (): Promise<Loan[]> => {
      if (!lendingContract || !address) return [];

      try {
        const loanIds = await lendingContract.getLoansByBorrower(address);
        const loans = await Promise.all(
          loanIds.map(id => lendingContract.getLoan(id))
        );
        return loans;
      } catch (error: any) {
        notifyError('Failed to fetch user loans: ' + error.message);
        return [];
      }
    },
    [lendingContract, address, notifyError]
  );

  return {
    requestLoan,
    repayLoan,
    fetchLoan,
    fetchUserLoans,
    loading,
  };
}
