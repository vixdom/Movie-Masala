import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Suppress cross-origin errors from fonts and external resources
    if (error.message.includes('cross-origin') || error.message === 'Script error.') {
      console.warn('Cross-origin error suppressed:', error.message);
      this.setState({ hasError: false });
      return;
    }
    
    // Log other errors for debugging
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && !this.state.error?.message.includes('cross-origin')) {
      // Fallback UI for genuine errors
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-6">The application encountered an error.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Reload Game
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;