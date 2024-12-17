import { Principal } from '@dfinity/principal';
import { MetricsCollector } from './MetricsCollector';
import { EventEmitter } from './EventEmitter';
import { SecurityMonitor } from './SecurityMonitor';
import { ComplianceReporter } from './ComplianceReporter';
import { AnalyticsTracker } from './AnalyticsTracker';
import { BlockchainMonitor } from './BlockchainMonitor';
import { Logger } from '../utils/Logger';
import { MetricType, EventType, SecurityIncident, ComplianceReport } from '../types';

export class MonitoringService {
    private metricsCollector: MetricsCollector;
    private eventEmitter: EventEmitter;
    private securityMonitor: SecurityMonitor;
    private complianceReporter: ComplianceReporter;
    private analyticsTracker: AnalyticsTracker;
    private blockchainMonitor: BlockchainMonitor;
    private logger: Logger;

    constructor() {
        this.metricsCollector = new MetricsCollector();
        this.eventEmitter = new EventEmitter();
        this.securityMonitor = new SecurityMonitor();
        this.complianceReporter = new ComplianceReporter();
        this.analyticsTracker = new AnalyticsTracker();
        this.blockchainMonitor = new BlockchainMonitor();
        this.logger = new Logger();

        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        // Transaction monitoring
        this.eventEmitter.on('transaction', async (data) => {
            await this.trackTransaction(data);
        });

        // Security incidents
        this.eventEmitter.on('security', async (incident) => {
            await this.handleSecurityIncident(incident);
        });

        // User behavior
        this.eventEmitter.on('user_action', async (action) => {
            await this.trackUserBehavior(action);
        });

        // Blockchain events
        this.eventEmitter.on('blockchain', async (event) => {
            await this.monitorBlockchainEvent(event);
        });
    }

    // Real-time transaction tracking
    public async trackTransaction(data: {
        transactionId: string;
        from: Principal;
        to: Principal;
        amount: bigint;
        timestamp: number;
        type: string;
    }): Promise<void> {
        try {
            // Record transaction metrics
            await this.metricsCollector.recordMetric({
                type: MetricType.TRANSACTION,
                value: Number(data.amount),
                timestamp: data.timestamp,
                metadata: {
                    transactionId: data.transactionId,
                    type: data.type,
                }
            });

            // Track for analytics
            await this.analyticsTracker.trackEvent({
                type: EventType.TRANSACTION,
                data: data
            });

            // Monitor for suspicious activity
            await this.securityMonitor.analyzeTx(data);

            this.logger.info('Transaction tracked successfully', { transactionId: data.transactionId });
        } catch (error) {
            this.logger.error('Failed to track transaction', { error, transactionId: data.transactionId });
            throw error;
        }
    }

    // Performance metrics collection
    public async collectPerformanceMetrics(): Promise<void> {
        try {
            const metrics = await this.metricsCollector.collectSystemMetrics();
            await this.analyticsTracker.trackMetrics(metrics);
            
            // Alert if metrics exceed thresholds
            if (metrics.cpuUsage > 80 || metrics.memoryUsage > 90) {
                await this.securityMonitor.raiseAlert({
                    type: 'PERFORMANCE',
                    severity: 'HIGH',
                    details: metrics
                });
            }

            this.logger.info('Performance metrics collected', { metrics });
        } catch (error) {
            this.logger.error('Failed to collect performance metrics', { error });
            throw error;
        }
    }

    // User behavior analytics
    public async trackUserBehavior(action: {
        userId: Principal;
        action: string;
        timestamp: number;
        metadata: Record<string, any>;
    }): Promise<void> {
        try {
            await this.analyticsTracker.trackUserAction(action);
            
            // Analyze for suspicious behavior
            const isSuspicious = await this.securityMonitor.analyzeUserBehavior(action);
            if (isSuspicious) {
                await this.handleSecurityIncident({
                    type: 'SUSPICIOUS_BEHAVIOR',
                    userId: action.userId,
                    details: action
                });
            }

            this.logger.info('User behavior tracked', { userId: action.userId, action: action.action });
        } catch (error) {
            this.logger.error('Failed to track user behavior', { error, userId: action.userId });
            throw error;
        }
    }

    // Blockchain event monitoring
    public async monitorBlockchainEvent(event: {
        canisterId: Principal;
        eventType: string;
        data: any;
        timestamp: number;
    }): Promise<void> {
        try {
            await this.blockchainMonitor.processEvent(event);
            
            // Record event metrics
            await this.metricsCollector.recordMetric({
                type: MetricType.BLOCKCHAIN_EVENT,
                timestamp: event.timestamp,
                metadata: event
            });

            // Check for compliance implications
            await this.complianceReporter.processEvent(event);

            this.logger.info('Blockchain event monitored', { 
                canisterId: event.canisterId,
                eventType: event.eventType 
            });
        } catch (error) {
            this.logger.error('Failed to monitor blockchain event', { error, event });
            throw error;
        }
    }

    // Security incident handling
    public async handleSecurityIncident(incident: SecurityIncident): Promise<void> {
        try {
            await this.securityMonitor.handleIncident(incident);
            
            // Generate compliance report if needed
            if (incident.severity === 'HIGH') {
                await this.generateComplianceReport({
                    type: 'SECURITY_INCIDENT',
                    details: incident
                });
            }

            this.logger.warn('Security incident detected', { incident });
        } catch (error) {
            this.logger.error('Failed to handle security incident', { error, incident });
            throw error;
        }
    }

    // Compliance reporting
    public async generateComplianceReport(data: ComplianceReport): Promise<void> {
        try {
            await this.complianceReporter.generateReport(data);
            this.logger.info('Compliance report generated', { reportType: data.type });
        } catch (error) {
            this.logger.error('Failed to generate compliance report', { error, reportType: data.type });
            throw error;
        }
    }

    // Analytics dashboard data
    public async getDashboardData(): Promise<{
        transactions: any[];
        metrics: any[];
        security: any[];
        compliance: any[];
    }> {
        try {
            const [transactions, metrics, security, compliance] = await Promise.all([
                this.analyticsTracker.getTransactionAnalytics(),
                this.metricsCollector.getMetricsSummary(),
                this.securityMonitor.getSecuritySummary(),
                this.complianceReporter.getComplianceSummary()
            ]);

            return {
                transactions,
                metrics,
                security,
                compliance
            };
        } catch (error) {
            this.logger.error('Failed to get dashboard data', { error });
            throw error;
        }
    }
}
