import { NextApiRequest, NextApiResponse } from 'next';
import { AuthClient } from '@dfinity/auth-client';
import { verifyJwtToken } from '../utils/jwt';
import { getSession } from '../lib/session';
import { rateLimit } from './rateLimit';
import { User } from '../models/User';

export interface AuthenticatedRequest extends NextApiRequest {
    user?: any;
    principal?: string;
}

export async function authMiddleware(
    req: AuthenticatedRequest,
    res: NextApiResponse,
    next: () => void
) {
    try {
        // Apply rate limiting
        await rateLimit(req, res);

        // Get session
        const session = await getSession(req, res);
        if (!session) {
            return res.status(401).json({ error: 'Unauthorized: No session found' });
        }

        // Verify JWT token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decoded = await verifyJwtToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        // Verify Internet Identity authentication
        const authClient = await AuthClient.create();
        const isAuthenticated = await authClient.isAuthenticated();
        if (!isAuthenticated) {
            return res.status(401).json({ error: 'Unauthorized: Not authenticated with Internet Identity' });
        }

        // Get user from database
        const user = await User.findOne({ principal: decoded.principal });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({ error: 'Forbidden: User account is not active' });
        }

        // Attach user and principal to request
        req.user = user;
        req.principal = decoded.principal;

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

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error('Role guard error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}

export async function validateApiKey(
    req: AuthenticatedRequest,
    res: NextApiResponse,
    next: () => void
) {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.status(401).json({ error: 'Unauthorized: No API key provided' });
        }

        // Verify API key
        const user = await User.findOne({ 'apiKeys.key': apiKey });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
        }

        // Check if API key is active
        const apiKeyObj = user.apiKeys.find(key => key.key === apiKey);
        if (!apiKeyObj || !apiKeyObj.active) {
            return res.status(401).json({ error: 'Unauthorized: API key is inactive' });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('API key validation error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
