export const mockAnalyticsData = {
  yieldPredictions: {
    overview: {
      currentYield: '2,500 tons',
      predictedYield: '2,850 tons',
      confidence: '92',
      lastUpdated: '2024-12-18',
      changeFromLastSeason: '+14%',
    },
    crops: [
      {
        name: 'Organic Corn',
        currentYield: '1,200 tons',
        predictedYield: '1,400 tons',
        confidence: '94',
        factors: {
          weather: 'Optimal',
          soil: 'Excellent',
          pests: 'Low Risk',
          diseases: 'Minimal Risk'
        },
        recommendations: [
          'Maintain current irrigation schedule',
          'Consider increasing organic fertilizer application',
          'Monitor for early signs of corn borer'
        ]
      },
      {
        name: 'Soybeans',
        currentYield: '800 tons',
        predictedYield: '900 tons',
        confidence: '91',
        factors: {
          weather: 'Good',
          soil: 'Very Good',
          pests: 'Moderate Risk',
          diseases: 'Low Risk'
        },
        recommendations: [
          'Implement pest control measures',
          'Optimize irrigation timing',
          'Consider soil amendments'
        ]
      },
      {
        name: 'Wheat',
        currentYield: '500 tons',
        predictedYield: '550 tons',
        confidence: '89',
        factors: {
          weather: 'Fair',
          soil: 'Good',
          pests: 'Low Risk',
          diseases: 'Low Risk'
        },
        recommendations: [
          'Monitor soil moisture levels',
          'Plan for potential weather variations',
          'Review disease prevention strategy'
        ]
      }
    ],
    mlModels: {
      models: [
        {
          name: 'Weather Impact Model',
          accuracy: '95',
          lastTrained: '2024-12-15',
          predictions: [
            {
              factor: 'Rainfall',
              impact: 'Positive',
              confidence: '93',
              details: 'Expected rainfall aligns well with crop needs'
            },
            {
              factor: 'Temperature',
              impact: 'Neutral',
              confidence: '91',
              details: 'Temperature ranges within optimal growth parameters'
            },
            {
              factor: 'Humidity',
              impact: 'Positive',
              confidence: '89',
              details: 'Humidity levels support healthy growth'
            }
          ]
        },
        {
          name: 'Soil Health Model',
          accuracy: '92',
          lastTrained: '2024-12-16',
          predictions: [
            {
              factor: 'Nutrient Levels',
              impact: 'Positive',
              confidence: '94',
              details: 'Optimal nutrient balance for crop growth'
            },
            {
              factor: 'pH Levels',
              impact: 'Neutral',
              confidence: '90',
              details: 'pH levels within acceptable range'
            },
            {
              factor: 'Organic Matter',
              impact: 'Positive',
              confidence: '91',
              details: 'High organic matter content supporting soil health'
            }
          ]
        },
        {
          name: 'Pest Risk Model',
          accuracy: '88',
          lastTrained: '2024-12-17',
          predictions: [
            {
              factor: 'Pest Pressure',
              impact: 'Neutral',
              confidence: '87',
              details: 'Moderate pest pressure expected'
            },
            {
              factor: 'Disease Risk',
              impact: 'Positive',
              confidence: '89',
              details: 'Low disease risk predicted'
            },
            {
              factor: 'Weed Pressure',
              impact: 'Neutral',
              confidence: '86',
              details: 'Manageable weed pressure expected'
            }
          ]
        }
      ]
    },
    historicalPatterns: {
      seasonalTrends: [
        {
          season: 'Spring 2024',
          yield: '2,400 tons',
          performance: '+5%',
          factors: {
            weather: 'Optimal',
            pests: 'Low',
            diseases: 'Minimal'
          }
        },
        {
          season: 'Winter 2023',
          yield: '2,300 tons',
          performance: '+3%',
          factors: {
            weather: 'Good',
            pests: 'Low',
            diseases: 'Low'
          }
        },
        {
          season: 'Fall 2023',
          yield: '2,200 tons',
          performance: '+4%',
          factors: {
            weather: 'Fair',
            pests: 'Moderate',
            diseases: 'Low'
          }
        }
      ],
      patterns: [
        {
          type: 'Weather Pattern',
          trend: 'Stable',
          impact: 'Positive',
          details: 'Consistent favorable weather conditions'
        },
        {
          type: 'Yield Pattern',
          trend: 'Increasing',
          impact: 'Positive',
          details: 'Steady yield improvements over past seasons'
        },
        {
          type: 'Pest Pattern',
          trend: 'Stable',
          impact: 'Neutral',
          details: 'Consistent low pest pressure'
        }
      ]
    },
    realTimeAdjustments: {
      currentConditions: {
        weather: {
          temperature: '22°C',
          humidity: '65%',
          rainfall: '25mm/week',
          forecast: 'Favorable'
        },
        soil: {
          moisture: '38%',
          temperature: '18°C',
          ph: '6.8',
          status: 'Optimal'
        },
        crops: {
          health: '92%',
          stress: 'Low',
          growth: 'On Track'
        }
      },
      recentAdjustments: [
        {
          timestamp: '2024-12-18T08:00:00',
          type: 'Irrigation',
          adjustment: 'Reduced by 10%',
          reason: 'Recent rainfall'
        },
        {
          timestamp: '2024-12-18T06:00:00',
          type: 'Fertilization',
          adjustment: 'Scheduled',
          reason: 'Nutrient levels optimal'
        },
        {
          timestamp: '2024-12-17T16:00:00',
          type: 'Pest Control',
          adjustment: 'Monitoring increased',
          reason: 'Seasonal pest risk'
        }
      ],
      recommendations: [
        {
          category: 'Irrigation',
          action: 'Maintain current schedule',
          priority: 'Medium',
          impact: 'Optimal water usage'
        },
        {
          category: 'Fertilization',
          action: 'Plan next application',
          priority: 'High',
          impact: 'Maintain nutrient levels'
        },
        {
          category: 'Pest Management',
          action: 'Continue monitoring',
          priority: 'Medium',
          impact: 'Early detection'
        }
      ]
    }
  },
  environmentalImpact: {
    weather: {
      current: {
        temperature: 25,
        humidity: 65,
        rainfall: 2.5,
        windSpeed: 12,
        condition: 'Partly Cloudy',
      },
      forecast: [
        { date: '2024-12-19', temperature: 24, rainfall: 0, condition: 'Sunny' },
        { date: '2024-12-20', temperature: 23, rainfall: 15, condition: 'Rain' },
        { date: '2024-12-21', temperature: 22, rainfall: 20, condition: 'Rain' },
        { date: '2024-12-22', temperature: 25, rainfall: 0, condition: 'Sunny' },
        { date: '2024-12-23', temperature: 26, rainfall: 0, condition: 'Sunny' },
      ],
    },
    risks: [
      {
        type: 'Drought',
        probability: 15,
        impact: 'Medium',
        mitigation: 'Increase irrigation frequency',
      },
      {
        type: 'Heavy Rain',
        probability: 45,
        impact: 'High',
        mitigation: 'Prepare drainage systems',
      },
      {
        type: 'Frost',
        probability: 5,
        impact: 'Low',
        mitigation: 'No action needed',
      },
    ],
    climateImpact: {
      carbonFootprint: 125,
      sustainabilityScore: 85,
      improvements: [
        'Optimize irrigation system',
        'Implement solar power',
        'Reduce fertilizer usage',
      ],
    },
  },
  resourceOptimization: {
    water: {
      currentUsage: 2500,
      optimal: 2300,
      savings: 200,
      schedule: [
        { time: 'Morning', duration: 30, amount: 800 },
        { time: 'Evening', duration: 25, amount: 700 },
      ],
    },
    fertilizer: {
      currentUsage: 150,
      optimal: 140,
      savings: 10,
      recommendations: [
        'Reduce nitrogen application by 5%',
        'Increase organic matter content',
        'Implement precision application',
      ],
    },
    energy: {
      consumption: [
        { month: 'Jul', amount: 2800, optimal: 2600 },
        { month: 'Aug', amount: 2900, optimal: 2700 },
        { month: 'Sep', amount: 2700, optimal: 2600 },
        { month: 'Oct', amount: 2600, optimal: 2500 },
        { month: 'Nov', amount: 2500, optimal: 2400 },
        { month: 'Dec', amount: 2400, optimal: 2300 },
      ],
      recommendations: [
        'Switch to LED lighting',
        'Maintain equipment regularly',
        'Install solar panels',
      ],
    },
  },
  financialAnalytics: {
    costs: {
      breakdown: [
        { category: 'Labor', amount: 25000, trend: '+2%' },
        { category: 'Equipment', amount: 35000, trend: '-5%' },
        { category: 'Seeds', amount: 15000, trend: '+1%' },
        { category: 'Fertilizer', amount: 12000, trend: '+3%' },
        { category: 'Water', amount: 8000, trend: '-2%' },
      ],
      monthly: [
        { month: 'Jul', operational: 8000, maintenance: 2000 },
        { month: 'Aug', operational: 8200, maintenance: 1800 },
        { month: 'Sep', operational: 7800, maintenance: 2200 },
        { month: 'Oct', operational: 7600, maintenance: 2100 },
        { month: 'Nov', operational: 7400, maintenance: 1900 },
        { month: 'Dec', operational: 7200, maintenance: 1800 },
      ],
    },
    revenue: {
      forecast: [
        { month: 'Jan', amount: 45000, confidence: 85 },
        { month: 'Feb', amount: 48000, confidence: 82 },
        { month: 'Mar', amount: 52000, confidence: 80 },
      ],
      historical: [
        { month: 'Jul', amount: 42000 },
        { month: 'Aug', amount: 44000 },
        { month: 'Sep', amount: 46000 },
        { month: 'Oct', amount: 45000 },
        { month: 'Nov', amount: 43000 },
        { month: 'Dec', amount: 44000 },
      ],
    },
    roi: {
      current: 15.5,
      trend: '+2.3%',
      breakdown: [
        { investment: 'Equipment', roi: 12.5 },
        { investment: 'Technology', roi: 18.2 },
        { investment: 'Infrastructure', roi: 15.8 },
      ],
    },
  },
  soilHealth: {
    current: {
      health: 85,
      lastTested: '2024-12-15',
      recommendations: [
        'Add organic matter',
        'Adjust pH levels',
        'Improve drainage',
      ],
    },
    nutrients: {
      nitrogen: { value: 82, status: 'Optimal', trend: '+2%' },
      phosphorus: { value: 75, status: 'Good', trend: '-1%' },
      potassium: { value: 88, status: 'Optimal', trend: '+1%' },
      organic: { value: 70, status: 'Good', trend: '+3%' },
    },
    ph: {
      current: 6.8,
      optimal: 7.0,
      history: [
        { date: '2024-07-01', value: 6.5 },
        { date: '2024-08-01', value: 6.6 },
        { date: '2024-09-01', value: 6.7 },
        { date: '2024-10-01', value: 6.7 },
        { date: '2024-11-01', value: 6.8 },
        { date: '2024-12-01', value: 6.8 },
      ],
    },
    microbial: {
      activity: 75,
      diversity: 82,
      trends: [
        { type: 'Bacteria', level: 'High', trend: 'Stable' },
        { type: 'Fungi', level: 'Medium', trend: 'Increasing' },
        { type: 'Protozoa', level: 'Medium', trend: 'Stable' },
      ],
    },
  },
  marketIntelligence: {
    prices: {
      current: [
        { crop: 'Corn', price: 175.50, change: '+2.3%' },
        { crop: 'Wheat', price: 220.80, change: '-1.2%' },
        { crop: 'Soybeans', price: 390.25, change: '+3.5%' },
      ],
      historical: [
        { month: 'Jul', corn: 170, wheat: 215, soybeans: 380 },
        { month: 'Aug', corn: 172, wheat: 218, soybeans: 385 },
        { month: 'Sep', corn: 173, wheat: 221, soybeans: 382 },
        { month: 'Oct', corn: 171, wheat: 219, soybeans: 388 },
        { month: 'Nov', corn: 174, wheat: 222, soybeans: 385 },
        { month: 'Dec', corn: 175, wheat: 220, soybeans: 390 },
      ],
    },
    demand: {
      forecast: [
        { crop: 'Corn', trend: 'Increasing', confidence: 85 },
        { crop: 'Wheat', trend: 'Stable', confidence: 80 },
        { crop: 'Soybeans', trend: 'Increasing', confidence: 88 },
      ],
      seasonal: [
        { season: 'Spring', demand: 'High', crops: ['Corn', 'Soybeans'] },
        { season: 'Summer', demand: 'Medium', crops: ['Wheat'] },
        { season: 'Fall', demand: 'High', crops: ['Corn', 'Soybeans'] },
        { season: 'Winter', demand: 'Medium', crops: ['Wheat'] },
      ],
    },
    competition: {
      local: [
        { name: 'Farm A', distance: '15km', crops: ['Corn', 'Soybeans'] },
        { name: 'Farm B', distance: '25km', crops: ['Wheat'] },
        { name: 'Farm C', distance: '30km', crops: ['Corn'] },
      ],
      market_share: [
        { region: 'Local', share: 25 },
        { region: 'State', share: 8 },
        { region: 'National', share: 2 },
      ],
    },
  },
};
