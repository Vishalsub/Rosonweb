import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js
export default {
  // ... other configurations

  optimizeDeps: {
    include: [
      'roslib',
    ],
  },

  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
};
