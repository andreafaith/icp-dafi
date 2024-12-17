import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button, Input, Alert } from '@/components/ui';
import { Asset } from '@/types';

interface InvestmentFormProps {
  asset: Asset;
  onSuccess?: () => void;
}

export const InvestmentForm: React.FC<InvestmentFormProps> = ({ asset, onSuccess }) => {
  const { isConnected, principal } = useWeb3();
  const [formData, setFormData] = useState({
    amount: '',
    shares: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isConnected) {
        throw new Error('Please connect your wallet first');
      }

      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: asset.id,
          amount: parseFloat(formData.amount),
          shares: parseInt(formData.shares),
          investor: principal,
        }),
      });

      if (!response.ok) {
        throw new Error('Investment failed');
      }

      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Auto-calculate shares based on amount
    if (name === 'amount' && asset.pricePerShare) {
      const shares = Math.floor(parseFloat(value) / asset.pricePerShare);
      setFormData(prev => ({
        ...prev,
        shares: shares.toString(),
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Invest in {asset.name}</h3>
      
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Available Shares:</span>
            <span className="ml-2 font-medium">{asset.availableShares}</span>
          </div>
          <div>
            <span className="text-gray-600">Price per Share:</span>
            <span className="ml-2 font-medium">${asset.pricePerShare}</span>
          </div>
          <div>
            <span className="text-gray-600">Minimum Investment:</span>
            <span className="ml-2 font-medium">${asset.minimumInvestment}</span>
          </div>
          <div>
            <span className="text-gray-600">Expected ROI:</span>
            <span className="ml-2 font-medium">{asset.expectedRoi}%</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Investment Amount ($)"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min={asset.minimumInvestment}
          step="0.01"
          required
        />

        <Input
          label="Number of Shares"
          type="number"
          name="shares"
          value={formData.shares}
          onChange={handleChange}
          max={asset.availableShares}
          required
          disabled
        />

        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
          disabled={loading || !isConnected}
        >
          {isConnected ? 'Invest Now' : 'Connect Wallet to Invest'}
        </Button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p>By investing, you agree to our terms and conditions.</p>
        <p>Please review the asset details and risk factors before investing.</p>
      </div>
    </div>
  );
};
