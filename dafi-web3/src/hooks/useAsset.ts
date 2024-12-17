import { useState, useEffect } from 'react';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: string;
  volume24h: string;
  change24h: number;
  description?: string;
  website?: string;
  explorer?: string;
  contractAddress?: string;
  socialLinks?: {
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  tags?: string[];
}

interface AssetPrice {
  timestamp: number;
  price: number;
}

interface AssetInvestor {
  id: string;
  name: string;
  avatar?: string;
  amount: string;
  share: number;
  joinedAt: string;
}

interface AssetTransaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  amount: string;
  price: string;
  total: string;
  from: string;
  to: string;
  timestamp: string;
  hash: string;
}

export const useAsset = (assetId: string) => {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [priceHistory, setPriceHistory] = useState<AssetPrice[]>([]);
  const [investors, setInvestors] = useState<AssetInvestor[]>([]);
  const [transactions, setTransactions] = useState<AssetTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API calls
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockAsset: Asset = {
          id: assetId,
          name: 'DAFI Token',
          symbol: 'DAFI',
          price: 1.23,
          marketCap: '$1.2M',
          volume24h: '$500K',
          change24h: 5.67,
          description: 'DAFI Protocol is a DeFi platform focused on synthetic assets.',
          website: 'https://example.com',
          explorer: 'https://explorer.example.com',
          contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
          socialLinks: {
            twitter: 'https://twitter.com/example',
            telegram: 'https://t.me/example',
            discord: 'https://discord.gg/example',
          },
          tags: ['DeFi', 'Synthetic Assets', 'Staking'],
        };

        const mockPriceHistory = Array.from({ length: 30 }, (_, i) => ({
          timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
          price: 1 + Math.random() * 0.5,
        }));

        const mockInvestors = Array.from({ length: 5 }, (_, i) => ({
          id: `investor-${i}`,
          name: `Investor ${i + 1}`,
          amount: `$${(Math.random() * 100000).toFixed(2)}`,
          share: Math.random() * 20,
          joinedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        }));

        const mockTransactions = Array.from({ length: 10 }, (_, i) => ({
          id: `tx-${i}`,
          type: ['buy', 'sell', 'transfer'][Math.floor(Math.random() * 3)] as 'buy' | 'sell' | 'transfer',
          amount: `${(Math.random() * 1000).toFixed(2)} DAFI`,
          price: `$${(Math.random() * 2).toFixed(2)}`,
          total: `$${(Math.random() * 2000).toFixed(2)}`,
          from: `0x${Math.random().toString(16).substr(2, 40)}`,
          to: `0x${Math.random().toString(16).substr(2, 40)}`,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        }));

        setAsset(mockAsset);
        setPriceHistory(mockPriceHistory);
        setInvestors(mockInvestors);
        setTransactions(mockTransactions);
        setError(null);
      } catch (err) {
        setError('Failed to fetch asset data');
      } finally {
        setLoading(false);
      }
    };

    if (assetId) {
      fetchAssetData();
    }
  }, [assetId]);

  return {
    asset,
    priceHistory,
    investors,
    transactions,
    loading,
    error,
  };
};
