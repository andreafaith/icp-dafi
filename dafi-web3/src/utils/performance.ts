import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
}

export function reportWebVitals(metrics: PerformanceMetrics) {
  // Send to analytics service
  console.log('Web Vitals:', metrics);
}

export function usePerformanceMonitoring() {
  const measureCLS = useCallback((metric: any) => {
    if (metric.name === 'CLS') {
      reportWebVitals({ ...getInitialMetrics(), cls: metric.value });
    }
  }, []);

  const measureFID = useCallback((metric: any) => {
    if (metric.name === 'FID') {
      reportWebVitals({ ...getInitialMetrics(), fid: metric.value });
    }
  }, []);

  const measureLCP = useCallback((metric: any) => {
    if (metric.name === 'LCP') {
      reportWebVitals({ ...getInitialMetrics(), lcp: metric.value });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Register performance observers
      if ('PerformanceObserver' in window) {
        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            measureCLS(entry);
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            measureFID(entry);
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            measureLCP(entry);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        return () => {
          clsObserver.disconnect();
          fidObserver.disconnect();
          lcpObserver.disconnect();
        };
      }
    }
  }, [measureCLS, measureFID, measureLCP]);
}

function getInitialMetrics(): PerformanceMetrics {
  return {
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
  };
}

export const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return function WithPerformanceTracking(props: P) {
    useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log component lifecycle duration
        console.log(`${componentName} mounted for ${duration}ms`);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
};
