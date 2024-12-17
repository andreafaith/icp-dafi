import { NextApiRequest, NextApiResponse } from 'next';
import { createApiRouter, requireRoles, cache } from '../../../lib/api/middleware';
import { AssetModel } from '../../../models/Asset';
import { AssetTrackingModel } from '../../../models/AssetTracking';
import db from '../../../lib/db/mongodb';
import { z } from 'zod';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

const createAssetSchema = z.object({
  tokenId: z.string(),
  name: z.string().min(1),
  type: z.enum(['farm', 'crop', 'equipment']),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    altitude: z.number().optional(),
  }),
  financials: z.object({
    purchasePrice: z.number(),
    currentValue: z.number(),
  }),
  metadata: z.record(z.unknown()).optional(),
});

const querySchema = z.object({
  type: z.enum(['farm', 'crop', 'equipment']).optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  owner: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  sortBy: z.enum(['createdAt', 'currentValue', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

const router = createApiRouter();

router
  .get(cache(300), async (req, res) => {
    try {
      const query = querySchema.parse(req.query);
      const cacheKey = `assets:${JSON.stringify(query)}`;
      
      // Try to get from cache
      const cachedResult = await redis.get(cacheKey);
      if (cachedResult) {
        return res.json(JSON.parse(cachedResult));
      }

      await db.connect();

      // Build MongoDB query
      const filter: any = {};
      if (query.type) filter.type = query.type;
      if (query.status) filter.status = query.status;
      if (query.owner) filter.owner = query.owner;
      if (query.minValue) filter['financials.currentValue'] = { $gte: query.minValue };
      if (query.maxValue) filter['financials.currentValue'] = { $lte: query.maxValue };

      // Pagination
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;

      // Sorting
      const sort: any = {};
      if (query.sortBy) {
        sort[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
      }

      // Execute query with pagination
      const [assets, total] = await Promise.all([
        AssetModel.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .populate('owner', 'name address')
          .lean(),
        AssetModel.countDocuments(filter),
      ]);

      const result = {
        assets,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      };

      // Cache the result
      await redis.setex(cacheKey, 300, JSON.stringify(result));

      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors,
        });
      }
      throw error;
    }
  })
  .use(requireRoles(['farmer', 'admin']))
  .post(async (req, res) => {
    try {
      const data = createAssetSchema.parse(req.body);
      await db.connect();

      // Create asset
      const asset = await AssetModel.create({
        ...data,
        owner: req.user!.id,
      });

      // Create initial tracking record
      await AssetTrackingModel.create({
        assetId: asset._id,
        eventType: 'status',
        data: {
          status: {
            condition: 'new',
            health: 100,
            alerts: [],
          },
        },
        source: 'system',
      });

      // Invalidate cache
      const cacheKeys = await redis.keys('assets:*');
      if (cacheKeys.length) {
        await redis.del(cacheKeys);
      }

      res.status(201).json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors,
        });
      }
      throw error;
    }
  });

export default router.handler({
  onError: (err, req, res) => {
    console.error('Asset API Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
  },
});
