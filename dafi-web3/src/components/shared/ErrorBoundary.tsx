import React, { Component, ErrorInfo } from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="p-4 rounded-lg bg-red-50 dark:bg-red-900"
        >
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-100">
            <FormattedMessage
              id="error.boundary.title"
              defaultMessage="Something went wrong"
            />
          </h2>
          <p className="mt-2 text-red-700 dark:text-red-200">
            <FormattedMessage
              id="error.boundary.message"
              defaultMessage="We're sorry, but something went wrong. Please try refreshing the page."
            />
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-md hover:bg-red-200 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <FormattedMessage
              id="error.boundary.refresh"
              defaultMessage="Refresh Page"
            />
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
