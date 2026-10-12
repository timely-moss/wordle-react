import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    strictPort: true,
    watch: {
      // Replit stages workspace state inside the project directory, and Vite
      // watches the project root. fs.watch() on those paths returns EINVAL on
      // Replit's filesystem, which crashes the dev server, and stray
      // tsconfig.json files under them trigger spurious full reloads.
      // Added to Vite's own defaults (.git, node_modules, …), not replacing them.
      ignored: [
        '**/.local/**',
        '**/.cache/**',
        '**/.config/**',
        '**/.upm/**',
        '**/.pythonlibs/**',
      ],
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
