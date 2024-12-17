import { NextApiRequest, NextApiResponse } from 'next';
import { createApiRouter, requireRoles, cache } from '../../../lib/api/middleware';
import { NLPService } from '../../../lib/ai/nlpService';
import { z } from 'zod';

const nlpService = new NLPService();

const router = createApiRouter();

router
  .use(requireRoles(['farmer', 'investor', 'admin']))
  .get('/description/:assetId', cache(3600), async (req, res) => {
    try {
      const { assetId } = req.query;
      const description = await nlpService.generateAssetDescription(assetId as string);
      res.json(description);
    } catch (error) {
      throw error;
    }
  })
  .get('/analyze-documents/:assetId', cache(3600), async (req, res) => {
    try {
      const { assetId } = req.query;
      const analysis = await nlpService.analyzeAssetDocuments(assetId as string);
      res.json(analysis);
    } catch (error) {
      throw error;
    }
  })
  .get('/marketing/:assetId', cache(3600), async (req, res) => {
    try {
      const { assetId } = req.query;
      const content = await nlpService.generateMarketingContent(assetId as string);
      res.json(content);
    } catch (error) {
      throw error;
    }
  });

export default router.handler({
  onError: (err, req, res) => {
    console.error('NLP API Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
  },
});
