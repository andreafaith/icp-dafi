import { NextApiRequest, NextApiResponse } from 'next';
import { createApiRouter, requireRoles, cache } from '../../../../lib/api/middleware';
import { AssetModel } from '../../../../models/Asset';
import { AssetTrackingModel } from '../../../../models/AssetTracking';
import db from '../../../../lib/db/mongodb';
import { z } from 'zod';
import Redis from 'ioredis';
import { WebSocketServer } from 'ws';

const redis = new Redis(process.env.REDIS_URL!);
const wss = new WebSocketServer({ noServer: true });

// Keep track of connected clients
const clients = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws, req) => {
  const assetId = req.url?.split('/').pop();
  if (assetId) {
    if (!clients.has(assetId)) {
      clients.set(assetId, new Set());
    }
    clients.get(assetId)?.add(ws);

    ws.on('close', () => {
      clients.get(assetId)?.delete(ws);
      if (clients.get(assetId)?.size === 0) {
        clients.delete(assetId);
      }
    });
  }
});

const trackingSchema = z.object({
  eventType: z.enum(['location', 'status', 'metrics', 'maintenance', 'transfer']),
  data: z.object({
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
      altitude: z.number().optional(),
      accuracy: z.number().optional(),
    }).optional(),
    metrics: z.object({
      temperature: z.number().optional(),
      humidity: z.number().optional(),
      soilMoisture: z.number().optional(),
      ph: z.number().optional(),
      nutrients: z.object({
        nitrogen: z.number().optional(),
        phosphorus: z.number().optional(),
        potassium: z.number().optional(),
      }).optional(),
    }).optional(),
    status: z.object({
      condition: z.string(),
      health: z.number(),
      alerts: z.array(z.string()),
    }).optional(),
  }),
  source: z.enum(['iot', 'blockchain', 'manual', 'system']),
});

const router = createApiRouter();

router
  .get(cache(60), async (req, res) => {
    try {
      const { id } = req.query;
      const { start, end, limit = '100' } = req.query;

      const cacheKey = `tracking:${id}:${start}:${end}:${limit}`;
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      await db.connect();

      const query: any = { assetId: id };
      if (start || end) {
        query.timestamp = {};
        if (start) query.timestamp.$gte = new Date(start as string);
        if (end) query.timestamp.$lte = new Date(end as string);
      }

      const tracking = await AssetTrackingModel.find(query)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit as string))
        .lean();

      // Cache the result
      await redis.setex(cacheKey, 60, JSON.stringify(tracking));

      res.json(tracking);
    } catch (error) {
      throw error;
    }
  })
  .use(requireRoles(['farmer', 'admin']))
  .post(async (req, res) => {
    try {
      const { id } = req.query;
      const data = trackingSchema.parse(req.body);

      await db.connect();

      // Verify asset exists
      const asset = await AssetModel.findById(id);
      if (!asset) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Asset not found',
        });
      }

      // Create tracking record
      const tracking = await AssetTrackingModel.create({
        assetId: id,
        ...data,
        timestamp: new Date(),
      });

      // Update asset with latest tracking data
      await AssetModel.findByIdAndUpdate(id, {
        $set: {
          'tracking.lastUpdate': new Date(),
          ...(data.data.metrics && { 'tracking.metrics': data.data.metrics }),
          ...(data.data.status && { status: data.data.status.condition }),
        },
      });

      // Invalidate cache
      const cacheKeys = await redis.keys(`tracking:${id}:*`);
      if (cacheKeys.length) {
        await redis.del(cacheKeys);
      }

      // Notify connected WebSocket clients
      const connectedClients = clients.get(id as string);
      if (connectedClients) {
        const message = JSON.stringify({
          type: 'tracking_update',
          data: tracking,
        });
        connectedClients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }

      // Check for alerts
      if (tracking.shouldTriggerAlert()) {
        // Implement alert notification logic here
        console.log('Alert triggered for asset:', id);
      }

      res.status(201).json(tracking);
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default router.handler({
  onError: (err, req, res) => {
    console.error('Asset Tracking API Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
  },
});
