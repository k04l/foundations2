import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext';


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Check auth status on mount
    useEffect(() => {
        checkAuth();
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
        console.log('AuthContext login attempt:', { email, passwordLemgth: password.length });
    
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
            const errorMessage = data.message || 'Invalid credentials';
            return { success: false, error: errorMessage };
            // throw new Error(errorMessage);
        }
    
        if (!data.token) {
            return { 
            success: false,
            error: 'No token received from server'
            };
        }
    
        // Store tokens in localStorage
        localStorage.setItem('token', data.token);
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
    
        // Update authentication state
        setIsAuthenticated(true);
        return { success: true };
    
        } catch (error) {
        console.error('AuthContext login error:', error);
        return { 
            success: false,
            error: 'An error occurred during login'
        };
        }
    };
    
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
    
        // Reset state
        setIsAuthenticated(false);
        setUser(null);
    
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