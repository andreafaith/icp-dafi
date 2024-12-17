import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db/mongodb';
import { UserModel } from '../../../models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await db.connect();

    const { principal, walletType } = req.body;

    if (!principal || !walletType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find or create user
    let user = await UserModel.findOne({ principal });

    if (!user) {
      user = await UserModel.create({
        principal,
        walletType,
        roles: ['user'],
        createdAt: new Date(),
        lastLogin: new Date(),
      });
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        principal: user.principal,
        roles: user.roles,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        principal: user.principal,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error('Wallet connect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
