import { MetricType, Metric, SystemMetrics } from '../types';
import { Principal } from '@dfinity/principal';
import { Logger } from '../utils/Logger';
import { RedisClient } from '../utils/RedisClient';
import { PrometheusClient } from '../utils/PrometheusClient';

export class MetricsCollector {
    private redis: RedisClient;
    private prometheus: PrometheusClient;
    private logger: Logger;

    constructor() {
        this.redis = new RedisClient();
        this.prometheus = new PrometheusClient();
        this.logger = new Logger();
    }

    // Record individual metrics
    public async recordMetric(metric: {
        type: MetricType;
        value?: number;
        timestamp: number;
        metadata?: Record<string, any>;
    }): Promise<void> {
        try {
            // Store in Redis for real-time access
            const key = `metric:${metric.type}:${metric.timestamp}`;
            await this.redis.set(key, JSON.stringify(metric));

            // Push to Prometheus for long-term storage and querying
            await this.prometheus.pushMetric({
                name: metric.type,
                value: metric.value || 0,
                labels: {
                    ...metric.metadata,
                    timestamp: metric.timestamp.toString()
                }
            });

            this.logger.info('Metric recorded successfully', { type: metric.type });
        } catch (error) {
            this.logger.error('Failed to record metric', { error, metric });
            throw error;
        }
    }

    // Collect system-wide metrics
    public async collectSystemMetrics(): Promise<SystemMetrics> {
        try {
            const metrics: SystemMetrics = {
                timestamp: Date.now(),
                cpuUsage: await this.getCPUUsage(),
                memoryUsage: await this.getMemoryUsage(),
                networkLatency: await this.getNetworkLatency(),
                activeUsers: await this.getActiveUsers(),
                transactionCount: await this.getTransactionCount(),
                errorRate: await this.getErrorRate(),
                canisterCycles: await this.getCanisterCycles()
            };

            // Record system metrics
            await this.recordMetric({
                type: MetricType.SYSTEM,
                timestamp: metrics.timestamp,
                metadata: metrics
            });

            return metrics;
        } catch (error) {
            this.logger.error('Failed to collect system metrics', { error });
            throw error;
        }
    }

    // Get CPU usage across canisters
    private async getCPUUsage(): Promise<number> {
        try {
            const usage = await this.prometheus.query('process_cpu_usage');
            return Number(usage) * 100;
        } catch (error) {
            this.logger.error('Failed to get CPU usage', { error });
            return 0;
        }
    }

    // Get memory usage
    private async getMemoryUsage(): Promise<number> {
        try {
            const usage = await this.prometheus.query('process_memory_usage');
            return Number(usage);
        } catch (error) {
            this.logger.error('Failed to get memory usage', { error });
            return 0;
        }
    }

    // Get network latency
    private async getNetworkLatency(): Promise<number> {
        try {
            const latency = await this.prometheus.query('network_latency_milliseconds');
            return Number(latency);
        } catch (error) {
            this.logger.error('Failed to get network latency', { error });
            return 0;
        }
    }

    // Get number of active users
    private async getActiveUsers(): Promise<number> {
        try {
            const count = await this.redis.get('active_users');
            return Number(count) || 0;
        } catch (error) {
            this.logger.error('Failed to get active users', { error });
            return 0;
        }
    }

    // Get transaction count
    private async getTransactionCount(): Promise<number> {
        try {
            const count = await this.prometheus.query('transaction_total');
            return Number(count);
        } catch (error) {
            this.logger.error('Failed to get transaction count', { error });
            return 0;
        }
    }

    // Get error rate
    private async getErrorRate(): Promise<number> {
        try {
            const errors = await this.prometheus.query('error_total');
            const total = await this.prometheus.query('request_total');
            return (Number(errors) / Number(total)) * 100;
        } catch (error) {
            this.logger.error('Failed to get error rate', { error });
            return 0;
        }
    }

    // Get canister cycles
    private async getCanisterCycles(): Promise<number> {
        try {
            const cycles = await this.prometheus.query('canister_cycles');
            return Number(cycles);
        } catch (error) {
            this.logger.error('Failed to get canister cycles', { error });
            return 0;
        }
    }

    // Get metrics summary for dashboard
    public async getMetricsSummary(): Promise<{
        performance: any[];
        transactions: any[];
        errors: any[];
        resources: any[];
    }> {
        try {
            const [performance, transactions, errors, resources] = await Promise.all([
                this.getPerformanceMetrics(),
                this.getTransactionMetrics(),
                this.getErrorMetrics(),
                this.getResourceMetrics()
            ]);

            return {
                performance,
                transactions,
                errors,
                resources
            };
        } catch (error) {
            this.logger.error('Failed to get metrics summary', { error });
            throw error;
        }
    }

    // Get performance metrics
    private async getPerformanceMetrics(): Promise<any[]> {
        try {
            const range = await this.prometheus.queryRange('process_cpu_usage', {
                start: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
                end: Date.now(),
                step: '1h'
            });

            return range.map(point => ({
                timestamp: point.timestamp,
                value: Number(point.value) * 100
            }));
        } catch (error) {
            this.logger.error('Failed to get performance metrics', { error });
            return [];
        }
    }

    // Get transaction metrics
    private async getTransactionMetrics(): Promise<any[]> {
        try {
            const range = await this.prometheus.queryRange('transaction_total', {
                start: Date.now() - 24 * 60 * 60 * 1000,
                end: Date.now(),
                step: '1h'
            });

            return range.map(point => ({
                timestamp: point.timestamp,
                value: Number(point.value)
            }));
        } catch (error) {
            this.logger.error('Failed to get transaction metrics', { error });
            return [];
        }
    }

    // Get error metrics
    private async getErrorMetrics(): Promise<any[]> {
        try {
            const range = await this.prometheus.queryRange('error_rate', {
                start: Date.now() - 24 * 60 * 60 * 1000,
                end: Date.now(),
                step: '1h'
            });

            return range.map(point => ({
                timestamp: point.timestamp,
                value: Number(point.value)
            }));
        } catch (error) {
            this.logger.error('Failed to get error metrics', { error });
            return [];
        }
    }

    // Get resource metrics
    private async getResourceMetrics(): Promise<any[]> {
        try {
            const range = await this.prometheus.queryRange('resource_usage', {
                start: Date.now() - 24 * 60 * 60 * 1000,
                end: Date.now(),
                step: '1h'
            });

            return range.map(point => ({
                timestamp: point.timestamp,
                value: Number(point.value)
            }));
        } catch (error) {
            this.logger.error('Failed to get resource metrics', { error });
            return [];
        }
    }
}
