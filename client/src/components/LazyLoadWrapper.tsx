import React, { Suspense, lazy } from 'react';

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
  </div>
);

// Lazy load heavy components to improve initial bundle size
export const LazyWordList = lazy(() => 
  import('./WordList').then(module => ({ default: module.WordList }))
);

export const LazyWordFoundAnimation = lazy(() => 
  import('./WordFoundAnimation').then(module => ({ default: module.WordFoundAnimation }))
);

// Wrapper with Suspense
export const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);