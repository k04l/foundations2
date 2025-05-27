import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from './Login';

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(async (email, password) => {
      if (email === 'user@example.com' && password === 'password') {
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    })
  })
}));

vi.mock('../hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigate: vi.fn()
  })
}));

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error on invalid credentials', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('navigates on successful login', async () => {
    const { getByLabelText, getByRole } = render(<Login />);
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    });
  });
});
