import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Upload source maps to Sentry at build time — skipped if SENTRY_AUTH_TOKEN is not set
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.SENTRY_AUTH_TOKEN, // suppress warnings in local dev
    }),
  ],
  build: {
    sourcemap: true, // needed for readable stack traces in Sentry
    target: "es2020", // modern browsers only — smaller output, no legacy polyfills
    cssCodeSplit: false, // bundle all CSS into one file (avoids extra per-chunk HTTP requests)
    rollupOptions: {
      output: {
        // Split vendor libraries into separate cached chunks
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@supabase")) {
            return "vendor-supabase";
          }
          if (id.includes("node_modules/@sentry")) {
            return "vendor-sentry";
          }
        },
      },
    },
  },
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
})
