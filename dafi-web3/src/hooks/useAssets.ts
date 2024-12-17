import { useState, useEffect } from 'react';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
  image?: string;
  type: 'token' | 'pool' | 'farm';
  apy?: number;
}

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - Replace with actual API calls
  const mockAssets: Asset[] = [
    {
      id: '1',
      name: 'DAFI Token',
      symbol: 'DAFI',
      price: 1.23,
      change24h: 5.67,
      marketCap: '$1.2M',
      volume24h: '$500K',
      type: 'token',
      image: '/assets/dafi-logo.png',
    },
    {
      id: '2',
      name: 'DAFI-ICP Pool',
      symbol: 'DAFI-ICP',
      price: 2.45,
      change24h: -2.34,
      marketCap: '$2.5M',
      volume24h: '$1.2M',
      type: 'pool',
      apy: 25.5,
    },
    {
      id: '3',
      name: 'Yield Farm',
      symbol: 'FARM',
      price: 3.67,
      change24h: 1.23,
      marketCap: '$3.7M',
      volume24h: '$2.1M',
      type: 'farm',
      apy: 45.2,
    },
  ];

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAssets(mockAssets);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch assets');
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const filterAssets = (
    searchTerm: string,
    type: string,
    sortBy: string
  ): Asset[] => {
    let filtered = [...assets];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        asset =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (type && type !== 'all') {
      filtered = filtered.filter(asset => asset.type === type);
    }

    // Sort assets
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'marketCap':
            return parseFloat(b.marketCap.replace(/[$M]/g, '')) - parseFloat(a.marketCap.replace(/[$M]/g, ''));
          case 'volume':
            return parseFloat(b.volume24h.replace(/[$K]/g, '')) - parseFloat(a.volume24h.replace(/[$K]/g, ''));
          case 'price':
            return b.price - a.price;
          case 'change':
            return b.change24h - a.change24h;
          case 'apy':
            return (b.apy || 0) - (a.apy || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  return {
    assets,
    loading,
    error,
    filterAssets,
  };
};
