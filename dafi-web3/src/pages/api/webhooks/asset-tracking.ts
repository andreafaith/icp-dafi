import { NextApiRequest, NextApiResponse } from 'next';
import { createApiRouter } from '../../../lib/api/middleware';
import { AssetModel } from '../../../models/Asset';
import { AssetTrackingModel } from '../../../models/AssetTracking';
import db from '../../../lib/db/mongodb';
import { ethers } from 'ethers';
import { WebSocketServer } from 'ws';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);
const wss = new WebSocketServer({ noServer: true });

// Maintain active WebSocket connections
const clients = new Map<string, WebSocket>();

wss.on('connection', (ws, req) => {
  const assetId = req.url?.split('=')[1];
  if (assetId) {
    clients.set(assetId, ws);
  }

  ws.on('close', () => {
    if (assetId) {
      clients.delete(assetId);
    }
  });
});

const router = createApiRouter();

router.post(async (req, res) => {
  await db.connect();

  const { assetId, eventType, data } = req.body;

  // Verify webhook signature
  const signature = req.headers['x-signature'];
  if (!verifyWebhookSignature(req.body, signature as string)) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid webhook signature',
    });
  }

  try {
    // Create tracking record
    const tracking = await AssetTrackingModel.create({
      assetId,
      eventType,
      data,
      timestamp: new Date(),
    });

    // Update asset status
    await AssetModel.findByIdAndUpdate(assetId, {
      $set: {
        lastTracked: new Date(),
        currentStatus: data.status,
      },
    });

    // Cache the latest tracking data
    await redis.setex(
      `asset:${assetId}:tracking`,
      3600, // 1 hour
      JSON.stringify(tracking)
    );

    // Notify connected clients
    const ws = clients.get(assetId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(tracking));
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Asset tracking webhook error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process asset tracking update',
    });
  }
});

function verifyWebhookSignature(payload: any, signature: string): boolean {
  try {
    const message = JSON.stringify(payload);
    const expectedSignature = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(message + process.env.WEBHOOK_SECRET)
    );
    return signature === expectedSignature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default router.handler({
  onError: (err, req, res) => {
    console.error('Webhook error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process webhook',
    });
  },
});
