import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { generateTempPassword, sendPasswordResetEmail } from '../../../services/emailService';
import { encrypt } from '../../../utils/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      return res.status(200).json({ message: 'If an account exists, a password reset email will be sent' });
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();
    const hashedPassword = await encrypt(tempPassword);

    // Update user's password and set reset timestamp
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        passwordResetAt: new Date(),
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(email, tempPassword);

    return res.status(200).json({
      message: 'If an account exists, a password reset email will be sent',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
