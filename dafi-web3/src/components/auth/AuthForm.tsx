import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button, Input, Select, Alert } from '@/components/ui';

interface AuthFormProps {
  type: 'farmer' | 'investor';
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess }) => {
  const { connect, isConnected, principal } = useWeb3();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: type,
    experience: '',
    specialization: '',
    investmentGoals: '',
    riskProfile: 'moderate',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isConnected) {
        await connect();
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          walletAddress: principal,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {type === 'farmer' && (
          <>
            <Input
              label="Farming Experience (years)"
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />

            <Input
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g., Organic Farming, Livestock"
              required
            />
          </>
        )}

        {type === 'investor' && (
          <>
            <Input
              label="Investment Goals"
              name="investmentGoals"
              value={formData.investmentGoals}
              onChange={handleChange}
              placeholder="e.g., Long-term Growth, Regular Income"
              required
            />

            <Select
              label="Risk Profile"
              name="riskProfile"
              value={formData.riskProfile}
              onChange={handleChange}
              options={[
                { value: 'conservative', label: 'Conservative' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'aggressive', label: 'Aggressive' },
              ]}
              required
            />
          </>
        )}
      </div>

      {error && (
        <Alert variant="error" className="mt-4">
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={loading}
        disabled={loading || (!isConnected && !principal)}
      >
        {isConnected ? 'Register' : 'Connect Wallet to Register'}
      </Button>
    </form>
  );
};
