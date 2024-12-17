import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createApiRouter, requireRoles, cache } from '../../../lib/api/middleware';
import { AssetModel } from '../../../models/Asset';
import db from '../../../lib/db/mongodb';

const assetSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['farm', 'crop', 'equipment']),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  status: z.enum(['active', 'inactive', 'maintenance']),
  metadata: z.record(z.unknown()),
});

const router = createApiRouter();

router
  .get(async (req, res) => {
    await db.connect();
    
    const asset = await AssetModel.findById(req.query.id)
      .populate('owner')
      .lean();

    if (!asset) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Asset not found',
      });
    }

    res.json(asset);
  })
  .use(requireRoles(['farmer', 'admin']))
  .put(async (req, res) => {
    await db.connect();
    
    const validatedData = assetSchema.parse(req.body);
    
    const asset = await AssetModel.findByIdAndUpdate(
      req.query.id,
      { ...validatedData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!asset) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Asset not found',
      });
    }

    res.json(asset);
  })
  .delete(async (req, res) => {
    await db.connect();
    
    const asset = await AssetModel.findByIdAndDelete(req.query.id);

    if (!asset) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Asset not found',
      });
    }

    res.status(204).end();
  });

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
  },
});
