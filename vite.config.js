// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  // React plugin provides fast refresh and JSX support
  plugins: [react()],

  // CSS configuration
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },

  // Path aliases make imports cleaner and more maintainable
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src')
    }
  },

  // Development server configuration
  server: {
    port: 5173, // Explicitly set frontend port
    proxy: {
      // Proxy all /api requests to your backend server
      '/api': {
        // Your backend server address
        target: 'http://localhost:3000',
        
        // Required for proxying to different domains
        changeOrigin: true,
        
        // Don't validate SSL certificates
        secure: false,
        
        // Enable WebSocket proxy
        ws: true,
        
        // Rewrite function to help with debugging
        rewrite: (path) => {
          console.log(`Proxying request: ${path}`);
          return path;
        },

        // Configure proxy to handle all HTTP methods
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxy request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
          });
        },

      }
    },
    //Add middleware to handle client-side routing
    middlewares: [
      (req, res, next) => {
        // Redirect all non-asset requests to index.html
        if (!req.url.includes('.')) {
          req.url = '/index.html';
        }
        next();
      }
    ]
  }
});