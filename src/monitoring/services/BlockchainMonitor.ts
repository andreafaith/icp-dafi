import { Principal } from '@dfinity/principal';
import { Logger } from '../utils/Logger';
import { RedisClient } from '../utils/RedisClient';
import { EventEmitter } from './EventEmitter';
import { BlockchainEvent, EventType } from '../types';

export class BlockchainMonitor {
    private redis: RedisClient;
    private eventEmitter: EventEmitter;
    private logger: Logger;

    constructor() {
        this.redis = new RedisClient();
        this.eventEmitter = new EventEmitter();
        this.logger = new Logger();
    }

    // Process blockchain events
    public async processEvent(event: {
        canisterId: Principal;
        eventType: string;
        data: any;
        timestamp: number;
    }): Promise<void> {
        try {
            // Store event in Redis for real-time access
            await this.storeEvent(event);

            // Analyze event for patterns
            await this.analyzeEvent(event);

            // Emit event for other services
            this.eventEmitter.emit('blockchain_event', event);

            this.logger.info('Blockchain event processed', {
                canisterId: event.canisterId,
                eventType: event.eventType
            });
        } catch (error) {
            this.logger.error('Failed to process blockchain event', { error, event });
            throw error;
        }
    }

    // Store blockchain event
    private async storeEvent(event: BlockchainEvent): Promise<void> {
        try {
            const key = `blockchain:event:${event.timestamp}:${event.canisterId}`;
            await this.redis.set(key, JSON.stringify(event));

            // Update event counters
            await this.redis.incr(`blockchain:events:${event.eventType}`);
            await this.redis.incr(`blockchain:events:total`);
        } catch (error) {
            this.logger.error('Failed to store blockchain event', { error, event });
            throw error;
        }
    }

    // Analyze blockchain event for patterns
    private async analyzeEvent(event: BlockchainEvent): Promise<void> {
        try {
            // Check for suspicious patterns
            if (await this.isSuspiciousEvent(event)) {
                await this.eventEmitter.emit('security_alert', {
                    type: 'SUSPICIOUS_BLOCKCHAIN_EVENT',
                    details: event,
                    timestamp: Date.now()
                });
            }

            // Check for performance implications
            if (await this.hasPerformanceImpact(event)) {
                await this.eventEmitter.emit('performance_alert', {
                    type: 'HIGH_LOAD',
                    details: event,
                    timestamp: Date.now()
                });
            }

            // Check for compliance implications
            if (await this.hasComplianceImplications(event)) {
                await this.eventEmitter.emit('compliance_alert', {
                    type: 'COMPLIANCE_EVENT',
                    details: event,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            this.logger.error('Failed to analyze blockchain event', { error, event });
            throw error;
        }
    }

    // Check if event is suspicious
    private async isSuspiciousEvent(event: BlockchainEvent): Promise<boolean> {
        try {
            // Check event frequency
            const eventCount = await this.redis.get(
                `blockchain:events:${event.eventType}:${event.canisterId}`
            );
            
            if (Number(eventCount) > 100) { // Threshold for suspicious activity
                return true;
            }

            // Check for known malicious patterns
            if (await this.matchesMaliciousPattern(event)) {
                return true;
            }

            return false;
        } catch (error) {
            this.logger.error('Failed to check suspicious event', { error, event });
            return false;
        }
    }

    // Check if event matches known malicious patterns
    private async matchesMaliciousPattern(event: BlockchainEvent): Promise<boolean> {
        try {
            // Get malicious patterns from Redis
            const patterns = await this.redis.get('malicious:patterns');
            if (!patterns) return false;

            const maliciousPatterns = JSON.parse(patterns);
            return maliciousPatterns.some((pattern: any) => 
                this.matchPattern(event, pattern)
            );
        } catch (error) {
            this.logger.error('Failed to match malicious pattern', { error, event });
            return false;
        }
    }

    // Check if event has performance impact
    private async hasPerformanceImpact(event: BlockchainEvent): Promise<boolean> {
        try {
            // Check event type
            if (event.eventType === 'HEAVY_COMPUTATION') {
                return true;
            }

            // Check system load
            const systemLoad = await this.redis.get('system:load');
            if (Number(systemLoad) > 80) { // High load threshold
                return true;
            }

            return false;
        } catch (error) {
            this.logger.error('Failed to check performance impact', { error, event });
            return false;
        }
    }

    // Check if event has compliance implications
    private async hasComplianceImplications(event: BlockchainEvent): Promise<boolean> {
        try {
            // Check event type
            if (event.eventType === 'FINANCIAL_TRANSACTION') {
                return true;
            }

            // Check for regulated activities
            if (await this.isRegulatedActivity(event)) {
                return true;
            }

            return false;
        } catch (error) {
            this.logger.error('Failed to check compliance implications', { error, event });
            return false;
        }
    }

    // Check if activity is regulated
    private async isRegulatedActivity(event: BlockchainEvent): Promise<boolean> {
        try {
            // Get regulated activities from Redis
            const activities = await this.redis.get('regulated:activities');
            if (!activities) return false;

            const regulatedActivities = JSON.parse(activities);
            return regulatedActivities.includes(event.eventType);
        } catch (error) {
            this.logger.error('Failed to check regulated activity', { error, event });
            return false;
        }
    }

    // Pattern matching utility
    private matchPattern(event: BlockchainEvent, pattern: any): boolean {
        // Match event properties against pattern
        return Object.entries(pattern).every(([key, value]) => {
            if (typeof value === 'function') {
                return value(event[key as keyof BlockchainEvent]);
            }
            return event[key as keyof BlockchainEvent] === value;
        });
    }

    // Get blockchain events summary
    public async getEventsSummary(): Promise<{
        events: any[];
        patterns: any[];
        alerts: any[];
    }> {
        try {
            const [events, patterns, alerts] = await Promise.all([
                this.getRecentEvents(),
                this.getDetectedPatterns(),
                this.getActiveAlerts()
            ]);

            return {
                events,
                patterns,
                alerts
            };
        } catch (error) {
            this.logger.error('Failed to get events summary', { error });
            throw error;
        }
    }

    // Get recent blockchain events
    private async getRecentEvents(): Promise<any[]> {
        try {
            const events = await this.redis.keys('blockchain:event:*');
            const eventData = await Promise.all(
                events.map(key => this.redis.get(key))
            );

            return eventData
                .map(data => JSON.parse(data))
                .sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            this.logger.error('Failed to get recent events', { error });
            return [];
        }
    }

    // Get detected patterns
    private async getDetectedPatterns(): Promise<any[]> {
        try {
            const patterns = await this.redis.get('detected:patterns');
            return patterns ? JSON.parse(patterns) : [];
        } catch (error) {
            this.logger.error('Failed to get detected patterns', { error });
            return [];
        }
    }

    // Get active alerts
    private async getActiveAlerts(): Promise<any[]> {
        try {
            const alerts = await this.redis.get('active:alerts');
            return alerts ? JSON.parse(alerts) : [];
        } catch (error) {
            this.logger.error('Failed to get active alerts', { error });
            return [];
        }
    }
}
