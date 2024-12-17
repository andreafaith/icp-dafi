import { check, sleep } from 'k6';
import http from 'k6/http';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 20 },  // Ramp up to 20 users
    { duration: '3m', target: 20 },  // Stay at 20 users
    { duration: '1m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
    errors: ['rate<0.1'],             // Error rate must be less than 10%
  },
};

// Test scenarios
export default function () {
  // Asset listing performance
  {
    const response = http.get('http://localhost:8000/api/assets');
    check(response, {
      'assets_status_200': (r) => r.status === 200,
      'assets_load_time': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);
    sleep(1);
  }

  // Asset creation performance
  {
    const payload = JSON.stringify({
      name: 'Performance Test Asset',
      type: 'farm',
      location: { latitude: 0, longitude: 0 },
      value: 100000,
    });

    const response = http.post('http://localhost:8000/api/assets', payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(response, {
      'create_asset_200': (r) => r.status === 200,
      'create_asset_time': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);
    sleep(1);
  }

  // Investment transaction performance
  {
    const payload = JSON.stringify({
      assetId: 'test-asset-1',
      amount: 1000,
    });

    const response = http.post('http://localhost:8000/api/invest', payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(response, {
      'invest_200': (r) => r.status === 200,
      'invest_time': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);
    sleep(1);
  }

  // Asset metrics update performance
  {
    const payload = JSON.stringify({
      temperature: 25.5,
      humidity: 60,
      soilMoisture: 40,
      ph: 6.8,
    });

    const response = http.post('http://localhost:8000/api/metrics/test-asset-1', payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(response, {
      'metrics_200': (r) => r.status === 200,
      'metrics_time': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);
    sleep(1);
  }
}
