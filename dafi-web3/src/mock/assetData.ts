export const mockFarmerAssets = {
  crops: [
    {
      id: 'crop1',
      name: 'Organic Corn',
      quantity: '500 tons',
      status: 'Growing',
      plantedDate: '2024-10-01',
      expectedHarvest: '2024-12-30',
      estimatedValue: 75000,
      location: 'Field A',
    },
    {
      id: 'crop2',
      name: 'Soybeans',
      quantity: '300 tons',
      status: 'Ready for Harvest',
      plantedDate: '2024-09-15',
      expectedHarvest: '2024-12-20',
      estimatedValue: 45000,
      location: 'Field B',
    },
    {
      id: 'crop3',
      name: 'Wheat',
      quantity: '400 tons',
      status: 'Growing',
      plantedDate: '2024-11-01',
      expectedHarvest: '2025-01-15',
      estimatedValue: 60000,
      location: 'Field C',
    },
  ],
  equipment: [
    {
      id: 'equip1',
      name: 'John Deere Tractor',
      model: '8R 410',
      status: 'Operational',
      purchaseDate: '2023-05-15',
      value: 350000,
      maintenanceSchedule: '2024-12-30',
    },
    {
      id: 'equip2',
      name: 'Harvester',
      model: 'Case IH 8250',
      status: 'Under Maintenance',
      purchaseDate: '2023-08-20',
      value: 275000,
      maintenanceSchedule: '2024-12-25',
    },
    {
      id: 'equip3',
      name: 'Irrigation System',
      model: 'Valley 8000',
      status: 'Operational',
      purchaseDate: '2024-01-10',
      value: 125000,
      maintenanceSchedule: '2025-01-10',
    },
  ],
  tokens: [
    {
      id: 'token1',
      name: 'DAFI Token',
      symbol: 'DAFI',
      balance: 10000,
      value: 50000,
      lastUpdated: '2024-12-18',
    },
    {
      id: 'token2',
      name: 'Yield Token',
      symbol: 'YLD',
      balance: 5000,
      value: 25000,
      lastUpdated: '2024-12-18',
    },
    {
      id: 'token3',
      name: 'Farm Credit',
      symbol: 'FCRD',
      balance: 7500,
      value: 37500,
      lastUpdated: '2024-12-18',
    },
  ],
};

export const mockInvestorAssets = {
  investments: [
    {
      id: 'inv1',
      farmName: 'Green Valley Farms',
      type: 'Crop Investment',
      amount: 100000,
      expectedReturn: 15,
      maturityDate: '2025-06-30',
      status: 'Active',
    },
    {
      id: 'inv2',
      farmName: 'Sunrise Agriculture',
      type: 'Equipment Financing',
      amount: 75000,
      expectedReturn: 12,
      maturityDate: '2025-03-15',
      status: 'Active',
    },
    {
      id: 'inv3',
      farmName: 'Highland Organic Farms',
      type: 'Expansion Project',
      amount: 150000,
      expectedReturn: 18,
      maturityDate: '2025-09-30',
      status: 'Active',
    },
  ],
  tokens: [
    {
      id: 'token1',
      name: 'DAFI Token',
      symbol: 'DAFI',
      balance: 25000,
      value: 125000,
      lastUpdated: '2024-12-18',
    },
    {
      id: 'token2',
      name: 'Yield Token',
      symbol: 'YLD',
      balance: 15000,
      value: 75000,
      lastUpdated: '2024-12-18',
    },
    {
      id: 'token3',
      name: 'Farm Credit',
      symbol: 'FCRD',
      balance: 20000,
      value: 100000,
      lastUpdated: '2024-12-18',
    },
  ],
  stakingPositions: [
    {
      id: 'stake1',
      pool: 'DAFI-ETH LP',
      amount: 50000,
      apr: 25,
      rewards: 3500,
      lockPeriod: '90 days',
    },
    {
      id: 'stake2',
      pool: 'YLD Staking',
      amount: 30000,
      apr: 18,
      rewards: 1500,
      lockPeriod: '30 days',
    },
    {
      id: 'stake3',
      pool: 'FCRD Vault',
      amount: 40000,
      apr: 22,
      rewards: 2500,
      lockPeriod: '60 days',
    },
  ],
};
