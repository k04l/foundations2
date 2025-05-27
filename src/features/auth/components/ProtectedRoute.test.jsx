import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';

let mockIsAuthenticated = false;
let mockLoading = false;

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    loading: mockLoading,
  })
}));

vi.mock('../hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigate: vi.fn()
  })
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockIsAuthenticated = false;
    mockLoading = false;
  });

  it('redirects to login if not authenticated', () => {
    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders loader when loading', () => {
    mockLoading = true;
    const { getByRole } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(getByRole('status')).toBeInTheDocument();
  });

  it('renders children if authenticated', () => {
    mockIsAuthenticated = true;
    const { getByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(getByText('Protected Content')).toBeInTheDocument();
  });
});
