import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Replace 'india-ppc-collection' with your actual GitHub repository name
// For example, if your repo is at github.com/username/my-repo, use '/my-repo/'
// For local dev, set VITE_BASE_PATH=/ in .env.local
const base = process.env.VITE_BASE_PATH ?? '/india-ppc-collection/'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base,
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
