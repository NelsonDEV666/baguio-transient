"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-[200px] w-full flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 p-6 text-center">
            <span className="text-2xl">⚠️</span>
            <h3 className="mt-2 text-sm font-bold text-red-950">Something went wrong</h3>
            <p className="mt-1 text-xs text-red-700 max-w-xs">
              An unexpected user interface error occurred in this section. Try refreshing the page.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-3 rounded-lg bg-white border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-900 shadow-xs hover:bg-red-100"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}