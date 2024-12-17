import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import Redis from 'ioredis';
import { z } from 'zod';
import { verifyToken } from '../auth/jwt';

const redis = new Redis(process.env.REDIS_URL!);
const pubsub = new Redis(process.env.REDIS_URL!);

const assetUpdateSchema = z.object({
  assetId: z.string(),
  type: z.enum(['location', 'status', 'metrics']),
  data: z.record(z.unknown()),
  timestamp: z.date(),
});

export class AssetUpdateService {
  private io: SocketServer;
  private rooms: Map<string, Set<string>> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketServer(server, {
      path: '/api/realtime',
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL,
        methods: ['GET', 'POST'],
      },
    });

    this.setupSocketAuth();
    this.setupEventHandlers();
    this.subscribeToRedis();
  }

  private setupSocketAuth() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication required'));
        }

        const decoded = await verifyToken(token);
        socket.data.user = decoded;
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('subscribe', async (assetId: string) => {
        try {
          // Check if user has access to this asset
          const hasAccess = await this.checkAssetAccess(
            socket.data.user.id,
            assetId
          );

          if (!hasAccess) {
            socket.emit('error', {
              message: 'Access denied to this asset',
            });
            return;
          }

          // Join room for this asset
          socket.join(`asset:${assetId}`);
          
          // Track room membership
          if (!this.rooms.has(assetId)) {
            this.rooms.set(assetId, new Set());
          }
          this.rooms.get(assetId)!.add(socket.id);

          // Send latest asset data
          const cachedData = await redis.get(`asset:${assetId}:latest`);
          if (cachedData) {
            socket.emit('asset:update', JSON.parse(cachedData));
          }
        } catch (error) {
          console.error('Subscription error:', error);
          socket.emit('error', {
            message: 'Failed to subscribe to asset updates',
          });
        }
      });

      socket.on('unsubscribe', (assetId: string) => {
        socket.leave(`asset:${assetId}`);
        this.rooms.get(assetId)?.delete(socket.id);
      });

      socket.on('disconnect', () => {
        // Clean up room memberships
        for (const [assetId, members] of this.rooms.entries()) {
          members.delete(socket.id);
          if (members.size === 0) {
            this.rooms.delete(assetId);
          }
        }
      });
    });
  }

  private async checkAssetAccess(userId: string, assetId: string): Promise<boolean> {
    try {
      const cachedAccess = await redis.get(`access:${userId}:${assetId}`);
      if (cachedAccess !== null) {
        return cachedAccess === 'true';
      }

      // Check database for access
      // const access = await AssetAccessModel.findOne({ userId, assetId });
      const hasAccess = true; // Replace with actual access check

      // Cache the result
      await redis.setex(
        `access:${userId}:${assetId}`,
        300, // 5 minutes
        hasAccess.toString()
      );

      return hasAccess;
    } catch (error) {
      console.error('Access check error:', error);
      return false;
    }
  }

  private subscribeToRedis() {
    pubsub.subscribe('asset:updates', (err) => {
      if (err) {
        console.error('Redis subscription error:', err);
        return;
      }
    });

    pubsub.on('message', async (channel, message) => {
      if (channel === 'asset:updates') {
        try {
          const update = assetUpdateSchema.parse(JSON.parse(message));
          
          // Cache the latest update
          await redis.setex(
            `asset:${update.assetId}:latest`,
            3600, // 1 hour
            message
          );

          // Broadcast to all clients subscribed to this asset
          this.io.to(`asset:${update.assetId}`).emit('asset:update', update);
        } catch (error) {
          console.error('Error processing asset update:', error);
        }
      }
    });
  }

  async publishUpdate(update: z.infer<typeof assetUpdateSchema>) {
    try {
      const validatedUpdate = assetUpdateSchema.parse(update);
      await redis.publish('asset:updates', JSON.stringify(validatedUpdate));
    } catch (error) {
      console.error('Error publishing update:', error);
      throw error;
    }
  }

  async getConnectedClients(assetId: string): Promise<number> {
    return this.rooms.get(assetId)?.size || 0;
  }

  async shutdown() {
    this.io.close();
    await redis.quit();
    await pubsub.quit();
  }
}
