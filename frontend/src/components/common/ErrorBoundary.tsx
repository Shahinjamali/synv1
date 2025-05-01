'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[ErrorBoundary] Error in ${this.props.sectionName ?? 'a section'}`,
        error
      );
      console.error(errorInfo);
    } else {
      // 🔐 Replace with your real logger (e.g., Sentry)
      // logErrorToService(error, errorInfo);
    }
  }

  render() {
    const { hasError } = this.state;
    const { fallback, children, sectionName } = this.props;

    if (hasError) {
      return (
        fallback ?? (
          <div
            className="text-center py-16 text-red-600 font-semibold"
            role="alert"
          >
            Failed to load {sectionName ?? 'this section'}. Please try again
            later.
          </div>
        )
      );
    }

    return children;
  }
}
