import { createClient } from 'redis';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { getClientIp } from 'request-ip';
import { NextApiRequest } from 'next';

export class SecurityMonitor {
    private redisClient;

    constructor() {
        this.redisClient = createClient({
            url: process.env.REDIS_URL,
        });

        this.redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });
    }

    async monitorUserActivity(userId: string, activity: any) {
        try {
            // Track user activity patterns
            const key = `user:${userId}:activity`;
            await this.redisClient.rPush(key, JSON.stringify(activity));
            await this.redisClient.expire(key, 24 * 60 * 60); // 24 hours

            // Check for suspicious patterns
            const activities = await this.redisClient.lRange(key, 0, -1);
            const suspiciousActivity = this.analyzeSuspiciousActivity(activities);

            if (suspiciousActivity) {
                await this.flagSuspiciousActivity(userId, suspiciousActivity);
            }
        } catch (error) {
            console.error('Error monitoring user activity:', error);
            throw error;
        }
    }

    async monitorTransactions(transaction: any) {
        try {
            // Check for unusual transaction patterns
            const userTransactions = await Transaction.find({
                from: transaction.from,
                timestamp: {
                    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            });

            // Check transaction volume
            const totalVolume = userTransactions.reduce(
                (sum, tx) => sum + tx.asset.amount,
                0
            );

            // Get user's typical transaction pattern
            const user = await User.findOne({ principal: transaction.from });
            if (!user) throw new Error('User not found');

            const threshold = user.settings?.transactionThreshold || 1000;

            if (totalVolume > threshold) {
                await this.flagHighVolumeActivity(user._id, totalVolume);
            }

            // Check for rapid successive transactions
            if (userTransactions.length > 10) {
                const timeDiffs = [];
                for (let i = 1; i < userTransactions.length; i++) {
                    timeDiffs.push(
                        userTransactions[i].timestamp.getTime() -
                            userTransactions[i - 1].timestamp.getTime()
                    );
                }

                const avgTimeDiff =
                    timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
                if (avgTimeDiff < 60000) {
                    // Less than 1 minute average
                    await this.flagRapidTransactions(user._id);
                }
            }
        } catch (error) {
            console.error('Error monitoring transactions:', error);
            throw error;
        }
    }

    async monitorLoginAttempts(req: NextApiRequest, userId: string, success: boolean) {
        try {
            const clientIP = getClientIp(req);
            const userAgent = req.headers['user-agent'];
            const key = `login:${userId}`;

            const attempt = {
                timestamp: Date.now(),
                ip: clientIP,
                userAgent,
                success,
            };

            await this.redisClient.rPush(key, JSON.stringify(attempt));
            await this.redisClient.expire(key, 24 * 60 * 60); // 24 hours

            // Check for suspicious login patterns
            const attempts = await this.redisClient.lRange(key, 0, -1);
            const parsedAttempts = attempts.map(a => JSON.parse(a));

            // Check for multiple IPs
            const uniqueIPs = new Set(parsedAttempts.map(a => a.ip));
            if (uniqueIPs.size > 3) {
                await this.flagMultipleIPLogins(userId, Array.from(uniqueIPs));
            }

            // Check for failed attempts
            const recentFailures = parsedAttempts.filter(
                a => !a.success && a.timestamp > Date.now() - 30 * 60 * 1000
            );
            if (recentFailures.length >= 5) {
                await this.flagFailedLoginAttempts(userId, recentFailures);
            }
        } catch (error) {
            console.error('Error monitoring login attempts:', error);
            throw error;
        }
    }

    private analyzeSuspiciousActivity(activities: string[]) {
        const parsedActivities = activities.map(a => JSON.parse(a));
        
        // Implement your suspicious activity detection logic here
        // This is a simple example - you should expand based on your needs
        const suspiciousPatterns = {
            highFrequency: false,
            unusualTiming: false,
            locationJumps: false,
        };

        // Check activity frequency
        if (parsedActivities.length > 100) {
            suspiciousPatterns.highFrequency = true;
        }

        // Check for unusual timing
        const nightTimeActivities = parsedActivities.filter(a => {
            const hour = new Date(a.timestamp).getHours();
            return hour >= 0 && hour <= 5;
        });

        if (nightTimeActivities.length > 10) {
            suspiciousPatterns.unusualTiming = true;
        }

        // Check for location jumps
        if (parsedActivities.length >= 2) {
            for (let i = 1; i < parsedActivities.length; i++) {
                const timeDiff = parsedActivities[i].timestamp - parsedActivities[i - 1].timestamp;
                if (
                    timeDiff < 60000 && // Less than 1 minute
                    parsedActivities[i].location !== parsedActivities[i - 1].location
                ) {
                    suspiciousPatterns.locationJumps = true;
                    break;
                }
            }
        }

        return Object.values(suspiciousPatterns).some(v => v)
            ? suspiciousPatterns
            : null;
    }

    private async flagSuspiciousActivity(userId: string, activity: any) {
        await User.findByIdAndUpdate(userId, {
            $push: {
                'security.flags': {
                    type: 'suspicious_activity',
                    details: activity,
                    timestamp: new Date(),
                },
            },
        });
    }

    private async flagHighVolumeActivity(userId: string, volume: number) {
        await User.findByIdAndUpdate(userId, {
            $push: {
                'security.flags': {
                    type: 'high_volume',
                    details: { volume },
                    timestamp: new Date(),
                },
            },
        });
    }

    private async flagRapidTransactions(userId: string) {
        await User.findByIdAndUpdate(userId, {
            $push: {
                'security.flags': {
                    type: 'rapid_transactions',
                    timestamp: new Date(),
                },
            },
        });
    }

    private async flagMultipleIPLogins(userId: string, ips: string[]) {
        await User.findByIdAndUpdate(userId, {
            $push: {
                'security.flags': {
                    type: 'multiple_ip_logins',
                    details: { ips },
                    timestamp: new Date(),
                },
            },
        });
    }

    private async flagFailedLoginAttempts(userId: string, attempts: any[]) {
        await User.findByIdAndUpdate(userId, {
            $push: {
                'security.flags': {
                    type: 'failed_login_attempts',
                    details: { attempts },
                    timestamp: new Date(),
                },
            },
        });
    }
}
