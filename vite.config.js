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

  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:3000')
  },

  // Path aliases make imports cleaner and more maintainable
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 'src': path.resolve(__dirname, './src')
    }
  },

  // Development server configuration
  server: {
    // port: 5173, // Explicitly set frontend port
    // Increase timeout for large file uploads
    timeout: 120000,

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
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
              console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Proxying request:', {
                  method: req.method,
                  url: req.url,
                  headers: proxyReq.getHeaders()
              });
          });
        },


        
        // Rewrite function to help with debugging
        rewrite: (path) => {
          console.log(`Proxying request: ${path}`);
          return path;
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