import { NextApiRequest, NextApiResponse } from 'next';
import { verifyEmailToken } from '../../../services/emailService';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const { email, isValid } = await verifyEmailToken(token);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
