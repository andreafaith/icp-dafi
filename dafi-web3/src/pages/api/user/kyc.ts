import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db/mongodb';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth';
import { UserModel } from '../../../models/User';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await db.connect();

        const { documentType, documentNumber } = req.body;

        if (!documentType || !documentNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Update user's KYC data
        const user = await UserModel.findOneAndUpdate(
            { principal: req.principal },
            {
                $set: {
                    'kycData.documentType': documentType,
                    'kycData.documentNumber': documentNumber,
                    'kycData.verificationStatus': 'pending',
                    'kycData.submissionDate': new Date(),
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // TODO: Integrate with actual KYC verification service
        // For now, we'll just return the updated user data

        return res.status(200).json({
            message: 'KYC submission successful',
            kycData: user.kycData
        });
    } catch (error) {
        console.error('KYC submission error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Wrap the handler with the auth middleware
export default function kycApi(req: NextApiRequest, res: NextApiResponse) {
    return new Promise((resolve, reject) => {
        authMiddleware(req as AuthenticatedRequest, res, () => {
            handler(req as AuthenticatedRequest, res)
                .then(resolve)
                .catch(reject);
        });
    });
}
