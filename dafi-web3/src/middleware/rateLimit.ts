import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';
import { NextApiRequest, NextApiResponse } from 'next';
import { getClientIp } from 'request-ip';

// Create Redis client
const redisClient = process.env.NODE_ENV === 'test' 
    ? {
        connect: async () => {},
        on: () => {},
        get: async () => null,
        set: async () => {},
        del: async () => {},
        incr: async () => 1,
        expire: async () => {},
    }
    : createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

if (process.env.NODE_ENV !== 'test') {
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    redisClient.connect().catch(console.error);
}

// Create rate limiter
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        const clientIp = getClientIp(req);
        return clientIp || 'unknown';
    },
});

// Middleware to handle rate limiting
export const rateLimitMiddleware = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    return new Promise<void>((resolve, reject) => {
        try {
            // @ts-ignore
            rateLimiter(req, res, (error: Error | null) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Function to get remaining requests for an IP
export const getRemainingRequests = async (ip: string): Promise<number> => {
    const key = `rate-limit:${ip}`;
    try {
        const count = await redisClient.get(key);
        return count ? parseInt(count) : 100;
    } catch (error) {
        console.error('Error getting remaining requests:', error);
        return 100; // Default to max requests if there's an error
    }
};

// IP blocking configuration
const IP_BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_FAILED_ATTEMPTS = 5;

export async function checkBlockedIP(req: NextApiRequest, res: NextApiResponse) {
    const clientIP = getClientIp(req);
    
    if (!clientIP) {
        return res.status(400).json({ error: 'Could not determine client IP' });
    }

    const blockedUntil = await redisClient.get(`blocked:${clientIP}`);
    
    if (blockedUntil) {
        const blockExpiration = parseInt(blockedUntil);
        if (Date.now() < blockExpiration) {
            return res.status(403).json({
                error: 'IP is blocked',
                blockedUntil: new Date(blockExpiration).toISOString(),
            });
        } else {
            await redisClient.del(`blocked:${clientIP}`);
            await redisClient.del(`failed:${clientIP}`);
        }
    }
}

export async function trackFailedAttempt(req: NextApiRequest) {
    const clientIP = getClientIp(req);
    
    if (!clientIP) return;

    const failedAttempts = await redisClient.incr(`failed:${clientIP}`);
    
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        const blockUntil = Date.now() + IP_BLOCK_DURATION;
        await redisClient.set(`blocked:${clientIP}`, blockUntil.toString());
        await redisClient.expire(`blocked:${clientIP}`, String(IP_BLOCK_DURATION / 1000));
    } else {
        await redisClient.expire(`failed:${clientIP}`, String(60 * 60)); // Reset after 1 hour
    }
}

export async function resetFailedAttempts(req: NextApiRequest) {
    const clientIP = getClientIp(req);
    
    if (!clientIP) return;

    await redisClient.del(`failed:${clientIP}`);
}

// Security headers middleware
export const securityHeaders = (
    _req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    next();
};
