import {
  yieldPredictionData,
  weatherData,
  resourceMetrics,
  financialMetrics,
  soilMetrics,
  marketData,
  mlModels,
} from '../mock/farmerAnalyticsData';

export class FarmerAnalyticsService {
  // Yield Predictions
  static async getYieldPredictions() {
    return yieldPredictionData;
  }

  // Weather Analysis
  static async getWeatherData() {
    return weatherData;
  }

  // Resource Metrics
  static async getResourceMetrics() {
    return resourceMetrics;
  }

  // Financial Analytics
  static async getFinancialMetrics() {
    return financialMetrics;
  }

  // Soil Health
  static async getSoilMetrics() {
    return soilMetrics;
  }

  // Market Intelligence
  static async getMarketData() {
    return marketData;
  }

  // ML Models
  static async getMLModels() {
    return mlModels;
  }

  // Aggregated Dashboard Data
  static async getDashboardData() {
    return {
      yield: await this.getYieldPredictions(),
      weather: await this.getWeatherData(),
      resources: await this.getResourceMetrics(),
      financial: await this.getFinancialMetrics(),
      soil: await this.getSoilMetrics(),
      market: await this.getMarketData(),
      ml: await this.getMLModels(),
    };
  }
}
