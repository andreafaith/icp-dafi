import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useWeb3 } from '@/contexts/Web3Context';
import { Transaction } from '@/types';

interface TransactionHistoryProps {
  limit?: number;
  showFilters?: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  limit = 10,
  showFilters = true,
}) => {
  const { principal } = useWeb3();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: '30',
  });

  useEffect(() => {
    fetchTransactions();
  }, [principal, filters]);

  const fetchTransactions = async () => {
    try {
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        type: filters.type,
        status: filters.status,
        dateRange: filters.dateRange,
      });

      const response = await fetch(
        `/api/transactions?${queryParams.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'investment':
        return '💰';
      case 'withdrawal':
        return '📤';
      case 'dividend':
        return '💸';
      default:
        return '🔄';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex gap-4 mb-6">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300"
          >
            <option value="all">All Types</option>
            <option value="investment">Investment</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="dividend">Dividend</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {transactions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getTransactionTypeIcon(tx.type)}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {tx.type} - {tx.asset.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {format(new Date(tx.timestamp), 'PPp')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {tx.shares} shares
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        tx.status
                      )}`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>

                {tx.status === 'failed' && tx.error && (
                  <div className="mt-2 text-sm text-red-600">
                    Error: {tx.error}
                  </div>
                )}

                {tx.hash && (
                  <div className="mt-2 text-sm">
                    <a
                      href={`https://explorer.ic.network/transaction/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View on Explorer ↗
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
