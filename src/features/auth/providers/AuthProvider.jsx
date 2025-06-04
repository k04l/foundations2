// src/features/auth/providers/AuthProvider.jsx

import React, { createContext, useState, useEffect } from 'react';
import { useNavigation } from '../hooks/useNavigation';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext.tsx';

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { navigate } = useNavigation();
    
    const retryOperation = async (operation, retries = 3, delay = 1000) => {
        try {
            return await operation();
        } catch (error) {
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                return retryOperation(operation, retries - 1, delay * 2);
            }
            throw error;
        }
    };

    // Check auth status on mount
    const initializeAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            console.log('Init auth check:', { hasToken: !!token, hasStoredUser: !!storedUser });

            if (!token || !storedUser) {
                setLoading(false);
                setIsAuthenticated(false);
                setUser(null);
                return;
            }

                // Use the retryOperation for token verification
                await retryOperation(async () => {
                    const response = await fetch('/api/v1/auth/verify-token', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Token validation failed');
                    }

                    const data = await response.json();
                    setUser(data.user);
                    setIsAuthenticated(true);
                });
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    // Clear invalid auth state
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsAuthenticated(false);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            };

        useEffect(() => {
          initializeAuth();
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // const loadUserData = () => {
        //     try {
        //       const token = localStorage.getItem('token');
        //       const storedUser = localStorage.getItem('user');
              
        //       console.log('Initial auth state:', {
        //         hasToken: !!token,
        //         hasStoredUser: !!storedUser
        //       });
      
        //       if (token && storedUser) {
        //         const userData = JSON.parse(storedUser);
        //         setUser(userData);
        //         console.log('Loaded user data:', userData);
        //       } else {
        //         console.log('No stored authentication data found');
        //         setUser(null);
        //       }
        //     } catch (error) {
        //       console.error('Error loading auth state:', error);
        //       setUser(null);
        //     } finally {
        //       setLoading(false);
        //     }
        //   };
      
        //   loadUserData();
        // }, []);

    const checkAuth = () => {
        try {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            // You could also verify the token here
        } else {
            setIsAuthenticated(false);
        }
        } catch (error) {
        console.error('AuthContext checkAuth error:', error);
        setIsAuthenticated
        } finally {
        setLoading(false);
        }
    };

    const decodeJWT = (token) => {
        try {
            // JWT tokens are in the format: header.payload.signature
            const base64Payload = token.split('.')[1];
            // Convert base64 to a JSON string
            const jsonPayload = atob(base64Payload);
            // Parse the JSON string into an object
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    };
    
    // // Check if user is logged in on initial load
    // useEffect(() => {
    //   const token = localStorage.getItem('token');
    //   if (token) {
    //     setIsAuthenticated(true);
    //     // You could also verify the token here
    //   }
    //   setLoading(false);
    // }, []);
    
    const login = async (email, password) => {
        try {
        console.log('AuthContext login attempt:', { email, passwordLength: password.length });
    
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
    
        const data = await response.json();
        if (data.success) {
        // Extract user ID from JWT token
        const decodedToken = decodeJWT(data.token);
        console.log('Decoded JWT token:', decodedToken);

        // Create a structured user object
        const userData = {
            id: decodedToken?.id,
            email: email,
            // Add any other user fields from the response
             ...data.user
        };

        console.log('Structured user data:', userData);

        // Validate the user data
        if (!userData.id) {
            console.error ('No user ID in response data:', decodedToken);
            throw new Error('Invalid user data received');
        }
    
        // Store tokens in localStorage
        localStorage.setItem('token', data.token);
        console.log('Token stored:', data.token); // for debugging
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(userData));
    
        // Update authentication state
        setUser(userData);
        setIsAuthenticated(true);
        console.log('Login successful, user data stored:', userData);

            return { success: true, user: userData };
        } 

        return { success: false, error: data.message || 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            // Clear any partial data
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
            return { 
                success: false,
                error: error.message
            };
        }   
    };   

    // Add loginWithToken for Google OAuth
    const loginWithToken = (token) => {
        try {
            const decodedToken = decodeJWT(token);
            if (!decodedToken?.id) {
                throw new Error('Invalid token: no user ID');
            }
            const userData = {
                id: decodedToken.id,
                email: decodedToken.email,
                name: decodedToken.name,
                // Add any other fields from the token if needed
            };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('loginWithToken error:', error);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const logout = () => {
        try {
        // Clear tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    
        // Reset state
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    
        return { success: true };
        } catch (error) {
        console.error('AuthContext logout error:', error);
        return { 
            success: false,
            error: 'An error occurred during logout'
        };
        }
    };

    const authContextValue = {
        isAuthenticated,
        user,
        loading,
        login,
        loginWithToken,
        logout,
        checkAuth
    };
    
    return (
        <AuthContext.Provider value={authContextValue}>
        {children}
        </AuthContext.Provider>
    );

};  

// Define PropTypes directly here
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
