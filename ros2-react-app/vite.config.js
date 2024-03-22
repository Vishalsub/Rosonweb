import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
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

  plugins: [react()],
  base: '/Rosonweb/'
});
