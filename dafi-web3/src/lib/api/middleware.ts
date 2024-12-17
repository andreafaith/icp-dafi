import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { createRouter } from 'next-connect';
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import { ZodError } from 'zod';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    address: string;
    roles: string[];
  };
}

const redis = new Redis(process.env.REDIS_URL!);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

// Error handler
export function errorHandler(err: Error, req: NextApiRequest, res: NextApiResponse) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token',
    });
  }

  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
}

// Authentication middleware
export async function authenticate(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) {
  try {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing authentication token',
      });
    }

    req.user = {
      id: token.sub!,
      address: token.address as string,
      roles: token.roles as string[],
    };

    next();
  } catch (error) {
    next();
  }
}

// Role-based access control middleware
export function requireRoles(roles: string[]) {
  return async (
    req: AuthenticatedRequest,
    res: NextApiResponse,
    next: () => void
  ) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const hasRequiredRole = req.user.roles.some(role => roles.includes(role));
    if (!hasRequiredRole) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
    }

    next();
  };
}

// Cache middleware
export function cache(duration: number) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.url}`;
    const cachedResponse = await redis.get(key);

    if (cachedResponse) {
      return res.status(200).json(JSON.parse(cachedResponse));
    }

    const originalJson = res.json;
    res.json = function (body) {
      redis.setex(key, duration, JSON.stringify(body));
      return originalJson.call(this, body);
    };

    next();
  };
}

// Create API router with default middleware
export function createApiRouter() {
  return createRouter<NextApiRequest, NextApiResponse>()
    .use(limiter)
    .use(authenticate)
    .onError(errorHandler);
