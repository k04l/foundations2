// Create a new file: ErrorBoundary.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../hooks/useNavigation';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-100 mb-4">
              Something went wrong
            </h2>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/dashboard';
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default ErrorBoundary;