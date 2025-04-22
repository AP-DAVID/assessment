// Performance monitoring utility

/**
 * Measures and reports performance metrics
 */
export function measurePerformance() {
  // Only run on client
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }

  // Get performance metrics
  const navigationTiming = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming;

  if (!navigationTiming) return;

  // Calculate key metrics
  const metrics = {
    // Time to first byte (TTFB)
    ttfb: navigationTiming.responseStart - navigationTiming.requestStart,

    // DOM Content Loaded
    domContentLoaded:
      navigationTiming.domContentLoadedEventEnd -
      navigationTiming.domContentLoadedEventStart,

    // Load time
    loadTime: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,

    // First paint (if available)
    firstPaint: getFirstPaint(),

    // First contentful paint (if available)
    firstContentfulPaint: getFirstContentfulPaint(),
  };

  // Log metrics
  console.log('Performance metrics:', metrics);

  return metrics;
}

/**
 * Get first paint time
 */
function getFirstPaint() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const paintMetrics = performance.getEntriesByType('paint');
  const firstPaint = paintMetrics.find((entry) => entry.name === 'first-paint');

  return firstPaint ? firstPaint.startTime : null;
}

/**
 * Get first contentful paint time
 */
function getFirstContentfulPaint() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const paintMetrics = performance.getEntriesByType('paint');
  const firstContentfulPaint = paintMetrics.find(
    (entry) => entry.name === 'first-contentful-paint'
  );

  return firstContentfulPaint ? firstContentfulPaint.startTime : null;
}

/**
 * Track component render time
 * @param componentName Name of the component
 * @returns Object with start and end functions
 */
export function trackComponentRender(componentName: string) {
  // Only run on client
  if (typeof window === 'undefined' || !window.performance) {
    return {
      start: () => {},
      end: () => {},
    };
  }

  const markStart = `${componentName}-render-start`;
  const markEnd = `${componentName}-render-end`;

  return {
    start: () => {
      performance.mark(markStart);
    },
    end: () => {
      performance.mark(markEnd);
      performance.measure(`${componentName} render time`, markStart, markEnd);

      const measures = performance.getEntriesByName(
        `${componentName} render time`
      );
      if (measures.length > 0) {
        console.log(
          `${componentName} render time:`,
          measures[0].duration.toFixed(2),
          'ms'
        );
      }
    },
  };
}
