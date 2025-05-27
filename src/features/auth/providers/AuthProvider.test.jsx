import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider } from './AuthProvider';
import { AuthContext } from '../context/AuthContext.tsx';

// Helper to consume context
const Consumer = () => (
  <AuthContext.Consumer>
    {({ isAuthenticated, user, loading, login, logout, checkAuth }) => (
      <div>
        <span data-testid="is-authenticated">{isAuthenticated ? 'true' : 'false'}</span>
        <span data-testid="user">{user ? user.email : 'none'}</span>
        <span data-testid="loading">{loading ? 'true' : 'false'}</span>
        <button onClick={() => login('test@example.com', 'password')}>Login</button>
        <button onClick={logout}>Logout</button>
        <button onClick={checkAuth}>CheckAuth</button>
      </div>
    )}
  </AuthContext.Consumer>
);

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('provides default context values', () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('login sets user and isAuthenticated', async () => {
    // Mock fetch for login
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        token: 'header.eyJpZCI6InVzZXIxIn0.signature',
        user: { name: 'Test User' }
      })
    });
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    await act(async () => {
      screen.getByText('Login').click();
    });
    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });

  it('logout clears user and isAuthenticated', async () => {
    // Set up localStorage to simulate logged in
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', JSON.stringify({ id: 'user1', email: 'test@example.com' }));
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    await act(async () => {
      screen.getByText('Logout').click();
    });
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });

  it('checkAuth sets isAuthenticated based on token', async () => {
    localStorage.setItem('token', 'token');
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    await act(async () => {
      screen.getByText('CheckAuth').click();
    });
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
  });
});
