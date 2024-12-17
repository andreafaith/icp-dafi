import { NextApiRequest, NextApiResponse } from 'next';
import { createApiRouter, requireRoles, cache } from '../../../lib/api/middleware';
import { PredictionService } from '../../../lib/ai/predictionService';
import { z } from 'zod';

const predictionService = new PredictionService();

const router = createApiRouter();

router
  .use(requireRoles(['farmer', 'investor', 'admin']))
  .get('/crop-yield/:assetId', cache(1800), async (req, res) => {
    try {
      const { assetId } = req.query;
      const prediction = await predictionService.predictCropYield(assetId as string);
      res.json(prediction);
    } catch (error) {
      throw error;
    }
  })
  .get('/risk-assessment/:assetId', cache(1800), async (req, res) => {
    try {
      const { assetId } = req.query;
      const assessment = await predictionService.assessInvestmentRisk(assetId as string);
      res.json(assessment);
    } catch (error) {
      throw error;
    }
  })
  .get('/recommendations', cache(3600), async (req, res) => {
    try {
      const { userId, userType } = req.query;
      if (!userId || !userType) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'userId and userType are required',
        });
      }

      const recommendations = await predictionService.generatePersonalizedRecommendations(
        userId as string,
        userType as 'farmer' | 'investor'
      );
      res.json(recommendations);
    } catch (error) {
      throw error;
    }
  })
  .get('/due-diligence/:assetId', cache(3600), async (req, res) => {
    try {
      const { assetId } = req.query;
      const report = await predictionService.performDueDiligence(assetId as string);
      res.json(report);
    } catch (error) {
      throw error;
    }
  });

export default router.handler({
  onError: (err, req, res) => {
    console.error('AI Prediction API Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
  },
});
