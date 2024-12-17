import { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { getClientIp } from 'request-ip';

// Create Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Configure rate limiter
const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// IP blocking configuration
const IP_BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_FAILED_ATTEMPTS = 5;

export async function rateLimit(req: NextApiRequest, res: NextApiResponse) {
    return new Promise((resolve, reject) => {
        limiter(req, res, (err: Error) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}

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
        await redisClient.expire(`blocked:${clientIP}`, IP_BLOCK_DURATION / 1000);
    } else {
        await redisClient.expire(`failed:${clientIP}`, 60 * 60); // Reset after 1 hour
    }
}

export async function resetFailedAttempts(req: NextApiRequest) {
    const clientIP = getClientIp(req);
    
    if (!clientIP) return;

    await redisClient.del(`failed:${clientIP}`);
}

// Security headers middleware
export function securityHeaders(
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
) {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );
    res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.setHeader('X-DNS-Prefetch-Control', 'off');

    next();
}
