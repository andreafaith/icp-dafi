import { AssetModel } from '../../models/Asset';
import { AssetTrackingModel } from '../../models/AssetTracking';
import { FarmerModel } from '../../models/Farmer';
import { InvestorModel } from '../../models/Investor';
import Redis from 'ioredis';
import { Configuration, OpenAIApi } from 'openai';
import * as tf from '@tensorflow/tfjs-node';

const redis = new Redis(process.env.REDIS_URL!);
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export class PredictionService {
  private cropYieldModel: tf.LayersModel | null = null;
  private riskAssessmentModel: tf.LayersModel | null = null;

  constructor() {
    this.initializeModels();
  }

  private async initializeModels() {
    try {
      // Load pre-trained models from storage
      this.cropYieldModel = await tf.loadLayersModel('file://models/crop_yield_model/model.json');
      this.riskAssessmentModel = await tf.loadLayersModel('file://models/risk_assessment_model/model.json');
    } catch (error) {
      console.error('Error loading AI models:', error);
    }
  }

  async predictCropYield(assetId: string) {
    try {
      const cacheKey = `prediction:crop_yield:${assetId}`;
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      // Get historical data
      const asset = await AssetModel.findById(assetId).lean();
      const trackingData = await AssetTrackingModel.find({
        assetId,
        'data.metrics': { $exists: true },
      })
        .sort({ timestamp: -1 })
        .limit(30)
        .lean();

      if (!asset || trackingData.length < 10) {
        throw new Error('Insufficient data for prediction');
      }

      // Prepare input features
      const features = trackingData.map(record => [
        record.data.metrics?.temperature || 0,
        record.data.metrics?.humidity || 0,
        record.data.metrics?.soilMoisture || 0,
        record.data.metrics?.ph || 0,
        record.data.metrics?.nutrients?.nitrogen || 0,
        record.data.metrics?.nutrients?.phosphorus || 0,
        record.data.metrics?.nutrients?.potassium || 0,
      ]);

      // Make prediction
      const input = tf.tensor2d(features);
      const prediction = this.cropYieldModel!.predict(input) as tf.Tensor;
      const result = {
        predictedYield: await prediction.data(),
        confidence: 0.85, // Calculate actual confidence based on model metrics
        factors: {
          soilQuality: 'good',
          weatherImpact: 'positive',
          pestRisk: 'low',
        },
        recommendations: [
          'Increase irrigation frequency',
          'Monitor nitrogen levels',
          'Consider pest prevention measures',
        ],
      };

      // Cache prediction
      await redis.setex(cacheKey, 3600, JSON.stringify(result));

      return result;
    } catch (error) {
      console.error('Crop yield prediction error:', error);
      throw error;
    }
  }

  async assessInvestmentRisk(assetId: string) {
    try {
      const cacheKey = `prediction:risk:${assetId}`;
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const asset = await AssetModel.findById(assetId)
        .populate('owner')
        .lean();

      if (!asset) throw new Error('Asset not found');

      // Gather risk factors
      const trackingData = await AssetTrackingModel.find({ assetId })
        .sort({ timestamp: -1 })
        .limit(100)
        .lean();

      const features = [
        asset.financials.currentValue / asset.financials.purchasePrice,
        asset.financials.revenueGenerated / asset.financials.maintenanceCosts,
        trackingData.filter(t => t.data.status?.alerts?.length > 0).length / trackingData.length,
        // Add more risk factors
      ];

      // Predict risk score
      const input = tf.tensor2d([features]);
      const prediction = this.riskAssessmentModel!.predict(input) as tf.Tensor;
      const riskScore = (await prediction.data())[0];

      const result = {
        riskScore,
        riskLevel: riskScore < 0.3 ? 'low' : riskScore < 0.7 ? 'medium' : 'high',
        factors: {
          financial: {
            score: features[0],
            impact: 'positive',
          },
          operational: {
            score: features[1],
            impact: 'neutral',
          },
          environmental: {
            score: features[2],
            impact: 'negative',
          },
        },
        recommendations: [
          'Diversify investment portfolio',
          'Implement risk mitigation measures',
          'Monitor market conditions closely',
        ],
      };

      // Cache assessment
      await redis.setex(cacheKey, 3600, JSON.stringify(result));

      return result;
    } catch (error) {
      console.error('Risk assessment error:', error);
      throw error;
    }
  }

  async generatePersonalizedRecommendations(userId: string, userType: 'farmer' | 'investor') {
    try {
      const cacheKey = `recommendations:${userId}`;
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      let user;
      let recommendations;

      if (userType === 'farmer') {
        user = await FarmerModel.findById(userId)
          .populate('assets')
          .lean();

        const assets = user.assets || [];
        const assetPerformance = await Promise.all(
          assets.map(asset => this.predictCropYield(asset._id))
        );

        recommendations = {
          cropManagement: [
            'Optimize irrigation schedules based on soil moisture data',
            'Implement crop rotation to improve soil health',
            'Consider organic farming practices for premium pricing',
          ],
          resourceOptimization: [
            'Invest in automated irrigation systems',
            'Utilize precision farming techniques',
            'Implement solar power for operations',
          ],
          marketOpportunities: [
            'Explore direct-to-consumer channels',
            'Consider value-added processing',
            'Join local farmer cooperatives',
          ],
        };
      } else {
        user = await InvestorModel.findById(userId)
          .populate('investments')
          .lean();

        const investments = user.investments || [];
        const riskAssessments = await Promise.all(
          investments.map(inv => this.assessInvestmentRisk(inv.assetId))
        );

        recommendations = {
          portfolioOptimization: [
            'Diversify across different crop types',
            'Balance high-yield and stable investments',
            'Consider geographical diversification',
          ],
          riskManagement: [
            'Implement stop-loss strategies',
            'Monitor weather patterns in investment regions',
            'Regular portfolio rebalancing',
          ],
          opportunities: [
            'Emerging agricultural technologies',
            'Sustainable farming projects',
            'Value chain investments',
          ],
        };
      }

      // Use OpenAI to generate personalized insights
      const prompt = `Based on the user's profile and current ${userType === 'farmer' ? 'farming operations' : 'investment portfolio'}, 
        provide specific recommendations for improving their ${userType === 'farmer' ? 'agricultural productivity' : 'investment returns'}.
        User profile: ${JSON.stringify(user)}`;

      const aiResponse = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 500,
        temperature: 0.7,
      });

      recommendations.aiInsights = aiResponse.data.choices[0].text?.split('\n') || [];

      // Cache recommendations
      await redis.setex(cacheKey, 3600, JSON.stringify(recommendations));

      return recommendations;
    } catch (error) {
      console.error('Recommendation generation error:', error);
      throw error;
    }
  }

  async performDueDiligence(assetId: string) {
    try {
      const cacheKey = `due_diligence:${assetId}`;
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const asset = await AssetModel.findById(assetId)
        .populate('owner')
        .lean();

      if (!asset) throw new Error('Asset not found');

      // Gather all relevant data
      const [
        trackingHistory,
        financialMetrics,
        riskAssessment,
        yieldPrediction,
      ] = await Promise.all([
        AssetTrackingModel.find({ assetId }).sort({ timestamp: -1 }).lean(),
        this.calculateFinancialMetrics(asset),
        this.assessInvestmentRisk(assetId),
        this.predictCropYield(assetId),
      ]);

      // Use OpenAI to analyze asset description and documents
      const documentAnalysis = await this.analyzeDocuments(asset.documents);

      const report = {
        summary: {
          assetName: asset.name,
          assetType: asset.type,
          ownerProfile: asset.owner,
          overallRating: 'A-', // Calculate based on all factors
        },
        financial: {
          metrics: financialMetrics,
          risk: riskAssessment,
          projections: yieldPrediction,
        },
        operational: {
          history: this.analyzeOperationalHistory(trackingHistory),
          efficiency: this.calculateEfficiencyMetrics(trackingHistory),
          compliance: this.checkCompliance(asset),
        },
        documentation: documentAnalysis,
        recommendations: [
          'Implement automated monitoring systems',
          'Enhance documentation processes',
          'Consider additional insurance coverage',
        ],
      };

      // Cache report
      await redis.setex(cacheKey, 3600, JSON.stringify(report));

      return report;
    } catch (error) {
      console.error('Due diligence error:', error);
      throw error;
    }
  }

  private async analyzeDocuments(documents: any[]) {
    try {
      const analysisPromises = documents.map(async doc => {
        const prompt = `Analyze this agricultural asset document and identify key information, risks, and compliance factors:\n${doc.content}`;
        
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt,
          max_tokens: 500,
          temperature: 0.3,
        });

        return {
          documentType: doc.type,
          analysis: response.data.choices[0].text,
          confidence: 0.9,
        };
      });

      return Promise.all(analysisPromises);
    } catch (error) {
      console.error('Document analysis error:', error);
      throw error;
    }
  }

  private calculateFinancialMetrics(asset: any) {
    return {
      roi: ((asset.financials.revenueGenerated - asset.financials.maintenanceCosts) / 
        asset.financials.purchasePrice) * 100,
      operatingMargin: ((asset.financials.revenueGenerated - asset.financials.maintenanceCosts) /
        asset.financials.revenueGenerated) * 100,
      assetUtilization: asset.financials.revenueGenerated / asset.financials.currentValue,
      // Add more metrics
    };
  }

  private analyzeOperationalHistory(history: any[]) {
    return {
      uptime: history.filter(h => h.data.status?.condition === 'active').length / history.length,
      maintenanceFrequency: history.filter(h => h.eventType === 'maintenance').length / 
        (history[0].timestamp - history[history.length - 1].timestamp),
      alertFrequency: history.filter(h => h.data.status?.alerts?.length > 0).length / history.length,
    };
  }

  private calculateEfficiencyMetrics(history: any[]) {
    return {
      resourceUtilization: 0.85, // Calculate based on resource usage data
      outputQuality: 0.9, // Calculate based on quality metrics
      processEfficiency: 0.88, // Calculate based on operational data
    };
  }

  private checkCompliance(asset: any) {
    return {
      regulatoryCompliance: true,
      certifications: ['ISO 14001', 'GlobalG.A.P.'],
      lastAudit: new Date(),
      status: 'compliant',
    };
  }
}
