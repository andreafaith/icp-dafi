import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { rateLimitMiddleware } from './rateLimit';
import { UserModel } from '../models/User';

export interface AuthenticatedRequest extends NextApiRequest {
    user?: any;
    principal?: string;
}

interface DecodedToken {
    userId: string;
    principal: string;
    roles: string[];
    iat: number;
    exp: number;
}

export async function authMiddleware(
    req: AuthenticatedRequest,
    res: NextApiResponse,
    next: () => void
) {
    try {
        // Apply rate limiting
        await rateLimitMiddleware(req, res);

        // Get and verify JWT token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        let decoded: DecodedToken;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        // Get user from database
        const user = await UserModel.findOne({ 
            _id: decoded.userId,
            principal: decoded.principal,
            status: 'active'
        });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found or inactive' });
        }

        // Attach user to request
        req.user = user;
        req.principal = user.principal;

        // Continue to next middleware
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export function roleGuard(...allowedRoles: string[]) {
    return async (req: AuthenticatedRequest, res: NextApiResponse, next: () => void) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized: No user found' });
            }

            const hasAllowedRole = req.user.roles.some((role: string) => 
                allowedRoles.includes(role)
            );

            if (!hasAllowedRole) {
                return res.status(403).json({ 
                    error: 'Forbidden: Insufficient permissions',
                    requiredRoles: allowedRoles,
                    userRoles: req.user.roles
                });
            }

            next();
        } catch (error) {
            console.error('Role guard error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}

export function kycGuard(req: AuthenticatedRequest, res: NextApiResponse, next: () => void) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized: No user found' });
        }

        if (!req.user.isKYCVerified) {
            return res.status(403).json({ 
                error: 'Forbidden: KYC verification required',
                kycStatus: req.user.kycData?.verificationStatus || 'pending'
            });
        }

        next();
    } catch (error) {
        console.error('KYC guard error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
