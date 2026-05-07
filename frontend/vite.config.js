import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tailwindcss(),
      react(),
    ],
    // Expose VITE_API_URL into the inline runtime config script in index.html.
    // The placeholder string '__VITE_API_URL__' is replaced at build time so
    // the runtime script can detect whether a build-time URL was provided.
    define: {
      __VITE_API_URL__: JSON.stringify(env.VITE_API_URL || ''),
    },
  }
})
