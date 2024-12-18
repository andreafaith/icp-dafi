export const mockMarketData = {
  listings: [
    {
      id: 'market1',
      type: 'Crop',
      name: 'Premium Organic Corn',
      seller: 'Green Valley Farms',
      quantity: '100 tons',
      price: 350,
      priceUnit: 'per ton',
      quality: 'Grade A',
      harvestDate: '2024-12-01',
      location: 'California, USA',
    },
    {
      id: 'market2',
      type: 'Crop',
      name: 'Non-GMO Soybeans',
      seller: 'Sunrise Agriculture',
      quantity: '75 tons',
      price: 420,
      priceUnit: 'per ton',
      quality: 'Grade A',
      harvestDate: '2024-12-05',
      location: 'Iowa, USA',
    },
    {
      id: 'market3',
      type: 'Equipment',
      name: 'John Deere Tractor',
      seller: 'Farm Equipment Co.',
      model: '8R 410',
      price: 325000,
      condition: 'New',
      warranty: '3 years',
      location: 'Texas, USA',
    },
    {
      id: 'market4',
      type: 'Crop',
      name: 'Organic Wheat',
      seller: 'Highland Farms',
      quantity: '150 tons',
      price: 280,
      priceUnit: 'per ton',
      quality: 'Grade B',
      harvestDate: '2024-12-10',
      location: 'Kansas, USA',
    },
    {
      id: 'market5',
      type: 'Equipment',
      name: 'Irrigation System',
      seller: 'AgTech Solutions',
      model: 'Valley 8000',
      price: 115000,
      condition: 'New',
      warranty: '2 years',
      location: 'Nebraska, USA',
    },
    {
      id: 'market6',
      type: 'Crop',
      name: 'Premium Rice',
      seller: 'Delta Farms',
      quantity: '200 tons',
      price: 500,
      priceUnit: 'per ton',
      quality: 'Grade A',
      harvestDate: '2024-12-15',
      location: 'Arkansas, USA',
    },
    {
      id: 'market7',
      type: 'Equipment',
      name: 'Harvester',
      seller: 'Farm Equipment Co.',
      model: 'Case IH 8250',
      price: 265000,
      condition: 'Used',
      warranty: '1 year',
      location: 'Illinois, USA',
    },
    {
      id: 'market8',
      type: 'Crop',
      name: 'Organic Barley',
      seller: 'Mountain View Farms',
      quantity: '80 tons',
      price: 310,
      priceUnit: 'per ton',
      quality: 'Grade A',
      harvestDate: '2024-12-20',
      location: 'Montana, USA',
    },
    {
      id: 'market9',
      type: 'Equipment',
      name: 'Drone System',
      seller: 'AgTech Solutions',
      model: 'DJI Agras T40',
      price: 45000,
      condition: 'New',
      warranty: '1 year',
      location: 'California, USA',
    },
    {
      id: 'market10',
      type: 'Crop',
      name: 'Premium Cotton',
      seller: 'Southern Farms',
      quantity: '120 tons',
      price: 1200,
      priceUnit: 'per ton',
      quality: 'Grade A',
      harvestDate: '2024-12-25',
      location: 'Georgia, USA',
    },
  ],
  marketTrends: {
    cropPrices: [
      { crop: 'Corn', currentPrice: 350, change: '+5%', trend: 'Increasing' },
      { crop: 'Soybeans', currentPrice: 420, change: '+3%', trend: 'Stable' },
      { crop: 'Wheat', currentPrice: 280, change: '-2%', trend: 'Decreasing' },
      { crop: 'Rice', currentPrice: 500, change: '+8%', trend: 'Increasing' },
      { crop: 'Cotton', currentPrice: 1200, change: '+1%', trend: 'Stable' },
    ],
    demandForecast: [
      { crop: 'Corn', demand: 'High', trend: 'Increasing', confidence: 85 },
      { crop: 'Soybeans', demand: 'Medium', trend: 'Stable', confidence: 80 },
      { crop: 'Wheat', demand: 'Medium', trend: 'Decreasing', confidence: 75 },
      { crop: 'Rice', demand: 'High', trend: 'Increasing', confidence: 90 },
      { crop: 'Cotton', demand: 'Medium', trend: 'Stable', confidence: 85 },
    ],
  },
};