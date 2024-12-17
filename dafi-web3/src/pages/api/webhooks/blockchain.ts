import { NextApiRequest, NextApiResponse } from 'next';
import { createApiRouter } from '../../../lib/api/middleware';
import { AssetModel } from '../../../models/Asset';
import { AssetTrackingModel } from '../../../models/AssetTracking';
import db from '../../../lib/db/mongodb';
import { ethers } from 'ethers';
import Redis from 'ioredis';
import crypto from 'crypto';

const redis = new Redis(process.env.REDIS_URL!);

// Verify webhook signature
function verifySignature(req: NextApiRequest): boolean {
  const signature = req.headers['x-signature'] as string;
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET!);
  const computedSignature = hmac
    .update(JSON.stringify(req.body))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}

const router = createApiRouter();

router.post(async (req, res) => {
  try {
    // Verify webhook signature
    if (!verifySignature(req)) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid signature',
      });
    }

    const { event, data } = req.body;

    await db.connect();

    switch (event) {
      case 'AssetTokenized': {
        const {
          tokenId,
          owner,
          metadata,
          timestamp,
        } = data;

        // Create or update asset
        const asset = await AssetModel.findOneAndUpdate(
          { tokenId },
          {
            $set: {
              tokenId,
              owner: ethers.utils.getAddress(owner),
              metadata,
              status: 'active',
            },
          },
          { upsert: true, new: true }
        );

        // Create tracking record
        await AssetTrackingModel.create({
          assetId: asset._id,
          eventType: 'status',
          data: {
            status: {
              condition: 'tokenized',
              health: 100,
              alerts: [],
            },
          },
          source: 'blockchain',
          timestamp: new Date(timestamp * 1000),
        });

        // Invalidate cache
        await redis.del(`asset:${tokenId}`);
        break;
      }

      case 'AssetTransferred': {
        const {
          tokenId,
          from,
          to,
          transactionHash,
          timestamp,
        } = data;

        // Update asset owner
        const asset = await AssetModel.findOneAndUpdate(
          { tokenId },
          {
            $set: {
              owner: ethers.utils.getAddress(to),
            },
          }
        );

        if (!asset) {
          return res.status(404).json({
            error: 'Not Found',
            message: 'Asset not found',
          });
        }

        // Create tracking record
        await AssetTrackingModel.create({
          assetId: asset._id,
          eventType: 'transfer',
          data: {
            transfer: {
              from: ethers.utils.getAddress(from),
              to: ethers.utils.getAddress(to),
              transactionHash,
            },
          },
          source: 'blockchain',
          timestamp: new Date(timestamp * 1000),
        });

        // Invalidate cache
        await redis.del(`asset:${tokenId}`);
        break;
      }

      case 'AssetMetadataUpdated': {
        const {
          tokenId,
          metadata,
          timestamp,
        } = data;

        // Update asset metadata
        const asset = await AssetModel.findOneAndUpdate(
          { tokenId },
          {
            $set: {
              metadata,
            },
          }
        );

        if (!asset) {
          return res.status(404).json({
            error: 'Not Found',
            message: 'Asset not found',
          });
        }

        // Create tracking record
        await AssetTrackingModel.create({
          assetId: asset._id,
          eventType: 'status',
          data: {
            status: {
              condition: 'updated',
              health: 100,
              alerts: [],
            },
          },
          source: 'blockchain',
          timestamp: new Date(timestamp * 1000),
        });

        // Invalidate cache
        await redis.del(`asset:${tokenId}`);
        break;
      }

      case 'AssetStatusChanged': {
        const {
          tokenId,
          status,
          timestamp,
        } = data;

        // Update asset status
        const asset = await AssetModel.findOneAndUpdate(
          { tokenId },
          {
            $set: {
              status,
            },
          }
        );

        if (!asset) {
          return res.status(404).json({
            error: 'Not Found',
            message: 'Asset not found',
          });
        }

        // Create tracking record
        await AssetTrackingModel.create({
          assetId: asset._id,
          eventType: 'status',
          data: {
            status: {
              condition: status,
              health: status === 'active' ? 100 : 50,
              alerts: [],
            },
          },
          source: 'blockchain',
          timestamp: new Date(timestamp * 1000),
        });

        // Invalidate cache
        await redis.del(`asset:${tokenId}`);
        break;
      }

      default:
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Unknown event type',
        });
    }

    res.json({ success: true });
  } catch (error) {
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
    console.error('Blockchain Webhook Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
  },
});
