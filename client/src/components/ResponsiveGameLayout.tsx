import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGameLayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface ViewportInfo {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  aspectRatio: number;
  isTouch: boolean;
}

export const ResponsiveGameLayout: React.FC<ResponsiveGameLayoutProps> = ({
  children,
  className
}) => {
  const [viewportInfo, setViewportInfo] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    orientation: 'portrait',
    deviceType: 'mobile',
    aspectRatio: 1,
    isTouch: false
  });

  const [isResizing, setIsResizing] = useState(false);

  // Debounced resize handler for performance
  const handleResize = useCallback(() => {
    setIsResizing(true);
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const orientation = width > height ? 'landscape' : 'portrait';
    
    // Device type detection based on screen size and touch capability
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'mobile';
    if (width >= 1024) {
      deviceType = 'desktop';
    } else if (width >= 768) {
      deviceType = 'tablet';
    }
    
    // Touch capability detection
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    setViewportInfo({
      width,
      height,
      orientation,
      deviceType,
      aspectRatio,
      isTouch
    });

    // Clear resizing state after a short delay
    setTimeout(() => setIsResizing(false), 150);
  }, []);

  // Throttled resize listener
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    // Initial call
    handleResize();

    // Add event listeners
    window.addEventListener('resize', throttledResize);
    window.addEventListener('orientationchange', () => {
      // Delay to allow orientation change to complete
      setTimeout(handleResize, 300);
    });

    return () => {
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  // Dynamic CSS custom properties based on viewport
  useEffect(() => {
    const root = document.documentElement;
    
    // Set dynamic viewport units
    root.style.setProperty('--vh', `${viewportInfo.height * 0.01}px`);
    root.style.setProperty('--vw', `${viewportInfo.width * 0.01}px`);
    root.style.setProperty('--vmin', `${Math.min(viewportInfo.width, viewportInfo.height) * 0.01}px`);
    root.style.setProperty('--vmax', `${Math.max(viewportInfo.width, viewportInfo.height) * 0.01}px`);
    
    // Set device-specific properties
    root.style.setProperty('--device-type', viewportInfo.deviceType);
    root.style.setProperty('--orientation', viewportInfo.orientation);
    root.style.setProperty('--aspect-ratio', viewportInfo.aspectRatio.toString());
    
    // Responsive scaling factors
    const scaleFactor = Math.min(viewportInfo.width / 375, viewportInfo.height / 667); // Based on iPhone 6/7/8
    root.style.setProperty('--scale-factor', Math.max(0.8, Math.min(1.5, scaleFactor)).toString());
    
    // Touch-specific adjustments
    if (viewportInfo.isTouch) {
      root.style.setProperty('--touch-target-min', '44px');
      root.style.setProperty('--touch-spacing', '8px');
    } else {
      root.style.setProperty('--touch-target-min', '32px');
      root.style.setProperty('--touch-spacing', '4px');
    }
    
    // Orientation-specific grid sizing
    if (viewportInfo.orientation === 'landscape' && viewportInfo.height < 600) {
      root.style.setProperty('--grid-size', '60vh');
    } else {
      root.style.setProperty('--grid-size', 'min(90vw, 90vh)');
    }
  }, [viewportInfo]);

  // Performance optimization: prevent layout thrashing during resize
  const layoutClasses = cn(
    'responsive-game-layout',
    'h-full w-full flex flex-col',
    {
      'layout-mobile': viewportInfo.deviceType === 'mobile',
      'layout-tablet': viewportInfo.deviceType === 'tablet',
      'layout-desktop': viewportInfo.deviceType === 'desktop',
      'layout-portrait': viewportInfo.orientation === 'portrait',
      'layout-landscape': viewportInfo.orientation === 'landscape',
      'layout-touch': viewportInfo.isTouch,
      'layout-resizing': isResizing,
      'layout-narrow': viewportInfo.aspectRatio < 0.75,
      'layout-wide': viewportInfo.aspectRatio > 1.5,
    },
    className
  );

  return (
    <div 
      className={layoutClasses}
      data-viewport-width={viewportInfo.width}
      data-viewport-height={viewportInfo.height}
      data-device-type={viewportInfo.deviceType}
      data-orientation={viewportInfo.orientation}
      style={{
        '--current-vw': `${viewportInfo.width}px`,
        '--current-vh': `${viewportInfo.height}px`,
        '--current-aspect-ratio': viewportInfo.aspectRatio,
      } as React.CSSProperties}
    >
      {children}
      

    </div>
  );
};

// Hook for accessing viewport information in components
export const useViewport = () => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    deviceType: window.innerWidth >= 1024 ? 'desktop' : window.innerWidth >= 768 ? 'tablet' : 'mobile',
    aspectRatio: window.innerWidth / window.innerHeight,
    isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'mobile';
      if (width >= 1024) {
        deviceType = 'desktop';
      } else if (width >= 768) {
        deviceType = 'tablet';
      }
      
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setViewport({
        width,
        height,
        orientation,
        deviceType,
        aspectRatio,
        isTouch
      });
    };

    let timeoutId: NodeJS.Timeout;
    const throttledUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateViewport, 100);
    };

    window.addEventListener('resize', throttledUpdate);
    window.addEventListener('orientationchange', throttledUpdate);

    return () => {
      window.removeEventListener('resize', throttledUpdate);
      window.removeEventListener('orientationchange', throttledUpdate);
      clearTimeout(timeoutId);
    };
  }, []);

  return viewport;
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Memory usage (if available)
        const memoryUsage = (performance as any).memory 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) 
          : 0;
        
        setPerformanceMetrics({
          fps,
          memoryUsage,
          renderTime: currentTime - lastTime
        });
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return performanceMetrics;
};