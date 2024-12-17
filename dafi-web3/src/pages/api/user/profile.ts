import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db/mongodb';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth';
import { UserModel } from '../../../models/User';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await db.connect();

        if (req.method === 'GET') {
            const user = await UserModel.findOne(
                { principal: req.principal },
                { 
                    name: 1,
                    email: 1,
                    principal: 1,
                    walletType: 1,
                    walletAddress: 1,
                    avatar: 1,
                    bio: 1,
                    roles: 1,
                    isKYCVerified: 1,
                    kycData: 1,
                    settings: 1,
                }
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({ user });
        }

        if (req.method === 'PUT') {
            const { name, email, bio, settings } = req.body;

            const updates: any = {};
            if (name) updates.name = name;
            if (email) updates.email = email;
            if (bio) updates.bio = bio;
            if (settings) updates.settings = settings;

            const user = await UserModel.findOneAndUpdate(
                { principal: req.principal },
                { $set: updates },
                { new: true, select: '-password -apiKeys' }
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({ user });
        }
    } catch (error) {
        console.error('Profile API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Wrap the handler with the auth middleware
export default function profileApi(req: NextApiRequest, res: NextApiResponse) {
    return new Promise((resolve, reject) => {
        authMiddleware(req as AuthenticatedRequest, res, () => {
            handler(req as AuthenticatedRequest, res)
                .then(resolve)
                .catch(reject);
        });
    });
}
