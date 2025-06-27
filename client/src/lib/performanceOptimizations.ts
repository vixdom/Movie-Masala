// Mobile performance optimizations for word search game

// Debounce function to limit excessive function calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for touch events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if device has limited performance
export const isLowEndDevice = (): boolean => {
  return (navigator.hardwareConcurrency || 2) <= 2;
};

// Optimize touch events for mobile
export const optimizeTouchEvents = (element: HTMLElement): void => {
  element.style.touchAction = 'none';
  element.style.userSelect = 'none';
};