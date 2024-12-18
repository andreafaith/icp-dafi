import { addDays, subDays, format } from 'date-fns';

// Generate dates for the last 30 days
const generateDates = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const date = subDays(new Date('2024-12-18'), count - 1 - i);
    return format(date, 'MMM dd');
  });
};

const dates = generateDates(30);

// Advanced Yield Predictions
export const yieldPredictionData = {
  historical: dates.map((date, index) => ({
    date,
    actual: 75 + Math.random() * 20,
    predicted: 80 + Math.random() * 15,
    confidence: 90 - (index % 10),
  })),
  forecast: Array.from({ length: 10 }, (_, i) => ({
    date: format(addDays(new Date('2024-12-18'), i), 'MMM dd'),
    predicted: 85 + Math.random() * 10,
    confidence: 90 - i * 2,
    factors: {
      weather: 0.7 + Math.random() * 0.3,
      soil: 0.6 + Math.random() * 0.4,
      historical: 0.8 + Math.random() * 0.2,
    },
  })),
  seasonalTrends: Array.from({ length: 4 }, (_, i) => ({
    season: ['Spring', 'Summer', 'Fall', 'Winter'][i],
    yield: 70 + Math.random() * 30,
    efficiency: 75 + Math.random() * 25,
  })),
};

// Weather and Environmental Data
export const weatherData = {
  current: {
    temperature: 23,
    humidity: 65,
    rainfall: 0.2,
    windSpeed: 12,
    soilMoisture: 42,
    uvIndex: 6,
    airQuality: 85,
  },
  forecast: Array.from({ length: 7 }, () => ({
    temperature: 20 + Math.random() * 10,
    humidity: 60 + Math.random() * 20,
    rainfall: Math.random() * 5,
    risk: Math.random() < 0.2 ? 'High' : Math.random() < 0.5 ? 'Medium' : 'Low',
    windSpeed: 5 + Math.random() * 15,
    uvIndex: Math.floor(1 + Math.random() * 10),
  })),
  alerts: [
    { type: 'Storm Warning', severity: 'Medium', probability: 65 },
    { type: 'Frost Risk', severity: 'Low', probability: 25 },
    { type: 'Heat Wave', severity: 'High', probability: 80 },
  ],
  climateImpact: {
    trends: dates.map((date) => ({
      date,
      temperature: 20 + Math.random() * 5,
      rainfall: 50 + Math.random() * 20,
      extremeEvents: Math.floor(Math.random() * 3),
    })),
    riskAssessment: {
      drought: { risk: 'Medium', trend: 'Increasing', impact: 7 },
      flood: { risk: 'Low', trend: 'Stable', impact: 4 },
      frost: { risk: 'High', trend: 'Decreasing', impact: 8 },
    },
  },
};

// Resource Optimization
export const resourceMetrics = {
  water: {
    current: 85,
    trend: '+5%',
    history: dates.map((date) => ({
      date,
      usage: 80 + Math.random() * 20,
      efficiency: 85 + Math.random() * 10,
      cost: 100 + Math.random() * 50,
    })),
    schedule: Array.from({ length: 7 }, (_, i) => ({
      day: format(addDays(new Date('2024-12-18'), i), 'EEE'),
      morning: Math.random() > 0.5,
      evening: Math.random() > 0.5,
      duration: 30 + Math.floor(Math.random() * 30),
    })),
  },
  fertilizer: {
    current: 78,
    trend: '-2%',
    distribution: [
      { type: 'Nitrogen', value: 40, efficiency: 85 },
      { type: 'Phosphorus', value: 30, efficiency: 78 },
      { type: 'Potassium', value: 30, efficiency: 82 },
    ],
    schedule: dates.slice(0, 7).map((date) => ({
      date,
      type: Math.random() > 0.5 ? 'Nitrogen' : 'Phosphorus',
      amount: 20 + Math.random() * 10,
      area: 100 + Math.random() * 50,
    })),
  },
  energy: {
    current: 92,
    trend: '+8%',
    breakdown: [
      { source: 'Solar', percentage: 45, efficiency: 88 },
      { source: 'Grid', percentage: 35, efficiency: 95 },
      { source: 'Generator', percentage: 20, efficiency: 75 },
    ],
    consumption: dates.map((date) => ({
      date,
      solar: 100 + Math.random() * 50,
      grid: 80 + Math.random() * 40,
      generator: 30 + Math.random() * 20,
    })),
  },
  optimization: {
    recommendations: [
      { resource: 'Water', action: 'Reduce evening irrigation', impact: 15 },
      { resource: 'Fertilizer', action: 'Adjust nitrogen levels', impact: 10 },
      { resource: 'Energy', action: 'Increase solar usage', impact: 20 },
    ],
  },
};

// Financial Analytics
export const financialMetrics = {
  costs: {
    monthly: dates.map((date) => ({
      date,
      operational: 5000 + Math.random() * 1000,
      maintenance: 2000 + Math.random() * 500,
      resources: 3000 + Math.random() * 800,
      labor: 4000 + Math.random() * 1000,
      marketing: 1000 + Math.random() * 300,
    })),
    breakdown: [
      { category: 'Labor', value: 35, trend: '+2%' },
      { category: 'Resources', value: 25, trend: '-3%' },
      { category: 'Equipment', value: 20, trend: '+1%' },
      { category: 'Maintenance', value: 15, trend: 'stable' },
      { category: 'Other', value: 5, trend: '+0.5%' },
    ],
    forecast: Array.from({ length: 6 }, (_, i) => ({
      month: format(addDays(new Date('2024-12-18'), i * 30), 'MMM'),
      projected: 15000 + Math.random() * 3000,
      optimistic: 14000 + Math.random() * 3000,
      pessimistic: 16000 + Math.random() * 3000,
    })),
  },
  revenue: {
    historical: dates.map((date) => ({
      date,
      actual: 20000 + Math.random() * 5000,
      projected: 19000 + Math.random() * 5000,
    })),
    forecast: Array.from({ length: 6 }, (_, i) => ({
      month: format(addDays(new Date('2024-12-18'), i * 30), 'MMM'),
      projected: 50000 + Math.random() * 10000,
      confidence: 95 - i * 5,
      factors: {
        market: 0.7 + Math.random() * 0.3,
        seasonal: 0.6 + Math.random() * 0.4,
        historical: 0.8 + Math.random() * 0.2,
      },
    })),
  },
  roi: {
    current: 22,
    trend: '+3.5%',
    history: dates.map((date) => ({
      date,
      value: 20 + Math.random() * 5,
      industry: 18 + Math.random() * 4,
    })),
    breakdown: [
      { category: 'Crops', roi: 25, risk: 'Medium' },
      { category: 'Equipment', roi: 15, risk: 'Low' },
      { category: 'Technology', roi: 35, risk: 'High' },
    ],
  },
};

// Soil Health Analytics
export const soilMetrics = {
  nutrients: {
    current: {
      nitrogen: { value: 85, trend: '+2%', status: 'Optimal' },
      phosphorus: { value: 75, trend: '-5%', status: 'Good' },
      potassium: { value: 90, trend: '+1%', status: 'Optimal' },
      calcium: { value: 82, trend: 'stable', status: 'Good' },
      magnesium: { value: 78, trend: '+3%', status: 'Good' },
    },
    history: dates.map((date) => ({
      date,
      nitrogen: 80 + Math.random() * 20,
      phosphorus: 70 + Math.random() * 20,
      potassium: 85 + Math.random() * 15,
    })),
  },
  ph: {
    current: 6.8,
    history: dates.map((date) => ({
      date,
      value: 6.5 + Math.random() * 0.6,
      optimal: 6.7,
    })),
    status: 'Optimal',
    zones: [
      { zone: 'A', ph: 6.7, status: 'Optimal' },
      { zone: 'B', ph: 6.4, status: 'Good' },
      { zone: 'C', ph: 7.1, status: 'Attention Needed' },
    ],
  },
  microbial: {
    activity: 82,
    diversity: 78,
    trend: '+4%',
    breakdown: [
      { type: 'Bacteria', value: 85, trend: '+2%' },
      { type: 'Fungi', value: 75, trend: '+5%' },
      { type: 'Protozoa', value: 70, trend: 'stable' },
    ],
    history: dates.map((date) => ({
      date,
      activity: 75 + Math.random() * 15,
      diversity: 70 + Math.random() * 15,
    })),
  },
  compaction: {
    average: 72,
    zones: [
      { zone: 'A', value: 75, status: 'Good' },
      { zone: 'B', value: 68, status: 'Attention Needed' },
      { zone: 'C', value: 82, status: 'Optimal' },
    ],
  },
};

// Market Intelligence
export const marketData = {
  prices: {
    current: {
      wheat: 320,
      corn: 175,
      soybeans: 450,
    },
    trends: dates.map((date) => ({
      date,
      wheat: 300 + Math.random() * 40,
      corn: 160 + Math.random() * 30,
      soybeans: 430 + Math.random() * 40,
    })),
    forecast: Array.from({ length: 6 }, (_, i) => ({
      month: format(addDays(new Date('2024-12-18'), i * 30), 'MMM'),
      wheat: 310 + Math.random() * 40,
      corn: 165 + Math.random() * 30,
      soybeans: 440 + Math.random() * 40,
      confidence: 90 - i * 5,
    })),
  },
  demand: {
    current: [
      { crop: 'Wheat', value: 85, trend: '+5%' },
      { crop: 'Corn', value: 75, trend: '-2%' },
      { crop: 'Soybeans', value: 90, trend: '+8%' },
    ],
    forecast: [
      { crop: 'Wheat', trend: 'Increasing', confidence: 85 },
      { crop: 'Corn', trend: 'Stable', confidence: 90 },
      { crop: 'Soybeans', trend: 'Decreasing', confidence: 75 },
    ],
    seasonal: Array.from({ length: 4 }, (_, i) => ({
      season: ['Spring', 'Summer', 'Fall', 'Winter'][i],
      wheat: 70 + Math.random() * 30,
      corn: 65 + Math.random() * 30,
      soybeans: 75 + Math.random() * 25,
    })),
  },
  competition: {
    local: [
      { name: 'Farm A', marketShare: 25, growth: '+3%' },
      { name: 'Farm B', marketShare: 20, growth: '-1%' },
      { name: 'Farm C', marketShare: 15, growth: '+2%' },
      { name: 'Others', marketShare: 40, growth: '-4%' },
    ],
    regional: {
      marketSize: 1200000,
      growth: '+5%',
      topCompetitors: [
        { name: 'Region A', share: 30, trend: 'Increasing' },
        { name: 'Region B', share: 25, trend: 'Stable' },
        { name: 'Region C', share: 20, trend: 'Decreasing' },
      ],
    },
  },
};

// ML Models Performance
export const mlModels = {
  yieldPrediction: {
    accuracy: 92,
    features: ['Weather', 'Soil', 'Historical'],
    lastUpdated: '2024-12-18',
    performance: dates.map((date) => ({
      date,
      accuracy: 85 + Math.random() * 10,
      confidence: 80 + Math.random() * 15,
    })),
  },
  diseaseDetection: {
    accuracy: 88,
    features: ['Visual', 'Environmental'],
    lastUpdated: '2024-12-18',
    detections: dates.map((date) => ({
      date,
      alerts: Math.floor(Math.random() * 5),
      falsePositives: Math.floor(Math.random() * 2),
    })),
  },
  weatherPrediction: {
    accuracy: 85,
    features: ['Historical', 'Satellite'],
    lastUpdated: '2024-12-18',
    performance: dates.map((date) => ({
      date,
      accuracy: 80 + Math.random() * 15,
      events: Math.floor(Math.random() * 3),
    })),
  },
  soilAnalysis: {
    accuracy: 90,
    features: ['Chemical', 'Physical', 'Biological'],
    lastUpdated: '2024-12-18',
    insights: dates.map((date) => ({
      date,
      predictions: Math.floor(3 + Math.random() * 5),
      accuracy: 85 + Math.random() * 10,
    })),
  },
};
