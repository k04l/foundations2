// src/features/auth/providers/AuthProvider.jsx

import React, { createContext, useState, useEffect } from 'react';
import { useNavigation } from '../hooks/useNavigation';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext';

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Check auth status on mount
    useEffect(() => {
        const loadUserData = () => {
            try {
              const token = localStorage.getItem('token');
              const storedUser = localStorage.getItem('user');
              
              console.log('Initial auth state:', {
                hasToken: !!token,
                hasStoredUser: !!storedUser
              });
      
              if (token && storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                console.log('Loaded user data:', userData);
              } else {
                console.log('No stored authentication data found');
                setUser(null);
              }
            } catch (error) {
              console.error('Error loading auth state:', error);
              setUser(null);
            } finally {
              setLoading(false);
            }
          };
      
          loadUserData();
        }, []);

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
        console.log('AuthContext login response:', { status: response.status, data });
    
        if (!response.ok) {
            // Handle eror response
            throw new Error(data.message || 'An error occurred during login');
            // throw new Error(errorMessage);
        }
    
        if (!data.token) {
            return { 
            success: false,
            error: 'No token received from server'
            };
        }

        // Extract user ID from JWT token
        const decodedToken = decodeJWT(data.token);
        console.log('Decoded JWT token:', decodedToken);

        // Create a structured user object
        const userData = {
            id: decodedToken?.id,
            email: email,
            // Add any other user fields from the response
            // ...data.user
        };

        console.log('Structured user data:', userData);

        // Make sure we have a valid user ID
        if (!userData.id) {
            console.error ('No user ID in response data:', decodedToken);
            throw new Error('Invalid user data received');
        }
    
        // Store tokens in localStorage
        localStorage.setItem('token', data.token);
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(userData));
    
        // Update authentication state
        setUser(userData);
        setIsAuthenticated(true);
        console.log('Login successful, user data stored:', userData);

        return { success: true, user: userData };
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

    // Add this function to help debug auth state
    const checkAuthState = () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        console.log('Current auth state:', {
            token: token ? 'present' : 'missing',
            storedUser: storedUser ? JSON.parse(storedUser) : 'missing',
            contextUser: user
        });
    };

    useEffect(() => {
        checkAuthState();
    }, [user]);
    
    //     // Handle successful login
    //     // Store tokens
    //     if (data.token) {
    //         localStorage.setItem('token', data.token);
    //         if (data.refreshToken) {
    //           localStorage.setItem('refreshToken', data.refreshToken);
    //         }          
    //         setIsAuthenticated(true);
    //         return { success: true };
    //       } else {
    //         return { 
    //           success: false,
    //           error: 'No token received from server'
    //         };
    //       }
    //       } catch (error) {
    //         console.error('AuthContext login error:', error);
    //         return { 
    //           success: false,
    //           error: 'An error occurred during login'
    //         };
    //       }
    // };
    
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