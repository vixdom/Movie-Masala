// Mobile performance optimizations
export const mobileOptimizations = {
  // Debounce function for touch events
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    }) as T;
  },

  // Throttle function for scroll/resize events
  throttle: <T extends (...args: any[]) => any>(func: T, limit: number): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },

  // Reduce motion for performance on low-end devices
  shouldReduceMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
           navigator.hardwareConcurrency <= 2;
  },

  // Check if device is low-end
  isLowEndDevice: (): boolean => {
    return navigator.hardwareConcurrency <= 2 || 
           (navigator as any).deviceMemory <= 4;
  },

  // Optimize touch events for mobile
  optimizeTouchEvents: (element: HTMLElement) => {
    element.style.touchAction = 'manipulation';
    element.style.userSelect = 'none';
    (element.style as any).webkitUserSelect = 'none';
    (element.style as any).webkitTouchCallout = 'none';
  },

  // Preload critical resources
  preloadCriticalResources: () => {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/inter.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
  },

  // Optimize grid rendering for mobile
  getOptimalGridSize: (screenWidth: number): number => {
    if (screenWidth < 360) return 10; // Very small phones
    if (screenWidth < 400) return 12; // Small phones
    return 15; // Default size for larger screens
  },

  // Memory cleanup
  cleanupResources: () => {
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
  }
};