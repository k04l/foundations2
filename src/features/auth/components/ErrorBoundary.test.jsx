import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from './ErrorBoundary';

function ProblemChild() {
  throw new Error('Test error');
}

describe('ErrorBoundary', () => {
  it('renders fallback UI when error is thrown', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(getByText(/something went wrong/i)).toBeInTheDocument();
    expect(getByText(/return to dashboard/i)).toBeInTheDocument();
  });

  it('renders children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Safe Child</div>
      </ErrorBoundary>
    );
    expect(getByText('Safe Child')).toBeInTheDocument();
  });
});
