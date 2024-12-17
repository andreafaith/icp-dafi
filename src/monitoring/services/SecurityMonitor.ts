import { Principal } from '@dfinity/principal';
import { Logger } from '../utils/Logger';
import { RedisClient } from '../utils/RedisClient';
import { EventEmitter } from './EventEmitter';
import { SecurityIncident, AlertLevel, UserAction } from '../types';

export class SecurityMonitor {
    private redis: RedisClient;
    private eventEmitter: EventEmitter;
    private logger: Logger;

    constructor() {
        this.redis = new RedisClient();
        this.eventEmitter = new EventEmitter();
        this.logger = new Logger();
    }

    // Handle security incidents
    public async handleIncident(incident: SecurityIncident): Promise<void> {
        try {
            // Record incident
            await this.recordIncident(incident);

            // Analyze severity
            const severity = await this.analyzeSeverity(incident);

            // Take immediate action if necessary
            if (severity === AlertLevel.HIGH) {
                await this.takeImmediateAction(incident);
            }

            // Notify relevant parties
            await this.notifyIncident(incident, severity);

            this.logger.warn('Security incident handled', { incident, severity });
        } catch (error) {
            this.logger.error('Failed to handle security incident', { error, incident });
            throw error;
        }
    }

    // Record security incident
    private async recordIncident(incident: SecurityIncident): Promise<void> {
        try {
            const key = `security:incident:${Date.now()}`;
            await this.redis.set(key, JSON.stringify(incident));

            // Update incident counters
            await this.redis.incr(`security:incidents:${incident.type}`);
            await this.redis.incr('security:incidents:total');

            // Record in time series for analysis
            await this.redis.zadd(
                'security:incidents:timeline',
                Date.now(),
                JSON.stringify(incident)
            );
        } catch (error) {
            this.logger.error('Failed to record incident', { error, incident });
            throw error;
        }
    }

    // Analyze incident severity
    private async analyzeSeverity(incident: SecurityIncident): Promise<AlertLevel> {
        try {
            // Check incident frequency
            const frequency = await this.getIncidentFrequency(incident);
            
            // Check impact scope
            const impactScope = await this.analyzeImpactScope(incident);

            // Check data sensitivity
            const dataSensitivity = await this.analyzeDataSensitivity(incident);

            // Calculate overall severity
            return this.calculateSeverity(frequency, impactScope, dataSensitivity);
        } catch (error) {
            this.logger.error('Failed to analyze severity', { error, incident });
            return AlertLevel.HIGH; // Default to high severity on error
        }
    }

    // Get incident frequency
    private async getIncidentFrequency(incident: SecurityIncident): Promise<number> {
        try {
            const count = await this.redis.get(
                `security:incidents:${incident.type}`
            );
            return Number(count) || 0;
        } catch (error) {
            this.logger.error('Failed to get incident frequency', { error, incident });
            return 0;
        }
    }

    // Analyze impact scope
    private async analyzeImpactScope(incident: SecurityIncident): Promise<number> {
        try {
            // Check affected users
            const affectedUsers = await this.getAffectedUsers(incident);

            // Check affected assets
            const affectedAssets = await this.getAffectedAssets(incident);

            // Calculate impact score
            return this.calculateImpactScore(affectedUsers, affectedAssets);
        } catch (error) {
            this.logger.error('Failed to analyze impact scope', { error, incident });
            return 1; // Default to high impact on error
        }
    }

    // Get affected users
    private async getAffectedUsers(incident: SecurityIncident): Promise<number> {
        try {
            if (incident.affectedUsers) {
                return incident.affectedUsers.length;
            }
            return 0;
        } catch (error) {
            this.logger.error('Failed to get affected users', { error, incident });
            return 0;
        }
    }

    // Get affected assets
    private async getAffectedAssets(incident: SecurityIncident): Promise<number> {
        try {
            if (incident.affectedAssets) {
                return incident.affectedAssets.length;
            }
            return 0;
        } catch (error) {
            this.logger.error('Failed to get affected assets', { error, incident });
            return 0;
        }
    }

    // Calculate impact score
    private calculateImpactScore(users: number, assets: number): number {
        return Math.min((users * 0.6 + assets * 0.4) / 100, 1);
    }

    // Analyze data sensitivity
    private async analyzeDataSensitivity(incident: SecurityIncident): Promise<number> {
        try {
            // Get data classification
            const classification = await this.getDataClassification(incident);

            // Calculate sensitivity score
            return this.calculateSensitivityScore(classification);
        } catch (error) {
            this.logger.error('Failed to analyze data sensitivity', { error, incident });
            return 1; // Default to high sensitivity on error
        }
    }

    // Get data classification
    private async getDataClassification(incident: SecurityIncident): Promise<string> {
        try {
            if (incident.dataClassification) {
                return incident.dataClassification;
            }
            return 'UNKNOWN';
        } catch (error) {
            this.logger.error('Failed to get data classification', { error, incident });
            return 'UNKNOWN';
        }
    }

    // Calculate sensitivity score
    private calculateSensitivityScore(classification: string): number {
        const scores: Record<string, number> = {
            'PUBLIC': 0.2,
            'INTERNAL': 0.4,
            'CONFIDENTIAL': 0.6,
            'RESTRICTED': 0.8,
            'SECRET': 1.0,
            'UNKNOWN': 0.8
        };
        return scores[classification] || 0.8;
    }

    // Calculate overall severity
    private calculateSeverity(
        frequency: number,
        impact: number,
        sensitivity: number
    ): AlertLevel {
        const score = (frequency * 0.3 + impact * 0.4 + sensitivity * 0.3);
        
        if (score >= 0.8) return AlertLevel.HIGH;
        if (score >= 0.5) return AlertLevel.MEDIUM;
        return AlertLevel.LOW;
    }

    // Take immediate action for high-severity incidents
    private async takeImmediateAction(incident: SecurityIncident): Promise<void> {
        try {
            switch (incident.type) {
                case 'UNAUTHORIZED_ACCESS':
                    await this.blockAccess(incident);
                    break;
                case 'SUSPICIOUS_TRANSACTION':
                    await this.freezeTransactions(incident);
                    break;
                case 'DATA_BREACH':
                    await this.isolateAffectedSystems(incident);
                    break;
                default:
                    await this.applyDefaultProtection(incident);
            }
        } catch (error) {
            this.logger.error('Failed to take immediate action', { error, incident });
            throw error;
        }
    }

    // Block unauthorized access
    private async blockAccess(incident: SecurityIncident): Promise<void> {
        try {
            if (incident.userId) {
                await this.redis.set(
                    `blocked:user:${incident.userId}`,
                    JSON.stringify(incident)
                );
            }
            if (incident.ipAddress) {
                await this.redis.set(
                    `blocked:ip:${incident.ipAddress}`,
                    JSON.stringify(incident)
                );
            }
        } catch (error) {
            this.logger.error('Failed to block access', { error, incident });
            throw error;
        }
    }

    // Freeze suspicious transactions
    private async freezeTransactions(incident: SecurityIncident): Promise<void> {
        try {
            if (incident.transactionId) {
                await this.redis.set(
                    `frozen:transaction:${incident.transactionId}`,
                    JSON.stringify(incident)
                );
            }
            if (incident.userId) {
                await this.redis.set(
                    `frozen:user:${incident.userId}`,
                    JSON.stringify(incident)
                );
            }
        } catch (error) {
            this.logger.error('Failed to freeze transactions', { error, incident });
            throw error;
        }
    }

    // Isolate affected systems
    private async isolateAffectedSystems(incident: SecurityIncident): Promise<void> {
        try {
            if (incident.affectedSystems) {
                for (const system of incident.affectedSystems) {
                    await this.redis.set(
                        `isolated:system:${system}`,
                        JSON.stringify(incident)
                    );
                }
            }
        } catch (error) {
            this.logger.error('Failed to isolate systems', { error, incident });
            throw error;
        }
    }

    // Apply default protection measures
    private async applyDefaultProtection(incident: SecurityIncident): Promise<void> {
        try {
            // Record incident for analysis
            await this.redis.set(
                `protection:incident:${Date.now()}`,
                JSON.stringify(incident)
            );

            // Increase monitoring
            await this.redis.set(
                `enhanced:monitoring:${incident.type}`,
                'true',
                'EX',
                3600 // 1 hour
            );
        } catch (error) {
            this.logger.error('Failed to apply default protection', { error, incident });
            throw error;
        }
    }

    // Notify relevant parties about incident
    private async notifyIncident(
        incident: SecurityIncident,
        severity: AlertLevel
    ): Promise<void> {
        try {
            // Emit event for real-time monitoring
            this.eventEmitter.emit('security_alert', {
                incident,
                severity,
                timestamp: Date.now()
            });

            // Store notification
            await this.redis.set(
                `security:notification:${Date.now()}`,
                JSON.stringify({ incident, severity })
            );

            // Log notification
            this.logger.info('Security notification sent', { incident, severity });
        } catch (error) {
            this.logger.error('Failed to notify incident', { error, incident });
            throw error;
        }
    }

    // Get security summary
    public async getSecuritySummary(): Promise<{
        incidents: any[];
        alerts: any[];
        blockedEntities: any[];
    }> {
        try {
            const [incidents, alerts, blockedEntities] = await Promise.all([
                this.getRecentIncidents(),
                this.getActiveAlerts(),
                this.getBlockedEntities()
            ]);

            return {
                incidents,
                alerts,
                blockedEntities
            };
        } catch (error) {
            this.logger.error('Failed to get security summary', { error });
            throw error;
        }
    }

    // Get recent incidents
    private async getRecentIncidents(): Promise<any[]> {
        try {
            const incidents = await this.redis.zrevrange(
                'security:incidents:timeline',
                0,
                9
            );
            return incidents.map(incident => JSON.parse(incident));
        } catch (error) {
            this.logger.error('Failed to get recent incidents', { error });
            return [];
        }
    }

    // Get active alerts
    private async getActiveAlerts(): Promise<any[]> {
        try {
            const alerts = await this.redis.keys('security:alert:*');
            const alertData = await Promise.all(
                alerts.map(key => this.redis.get(key))
            );
            return alertData.map(alert => JSON.parse(alert));
        } catch (error) {
            this.logger.error('Failed to get active alerts', { error });
            return [];
        }
    }

    // Get blocked entities
    private async getBlockedEntities(): Promise<any[]> {
        try {
            const blockedUsers = await this.redis.keys('blocked:user:*');
            const blockedIps = await this.redis.keys('blocked:ip:*');
            
            const entities = await Promise.all([
                ...blockedUsers.map(key => this.redis.get(key)),
                ...blockedIps.map(key => this.redis.get(key))
            ]);

            return entities.map(entity => JSON.parse(entity));
        } catch (error) {
            this.logger.error('Failed to get blocked entities', { error });
            return [];
        }
    }
}
