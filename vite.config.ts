
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import crypto from 'crypto';

// Generate a build hash
const buildHash = crypto.randomBytes(8).toString('hex');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Make build hash available in the app
    'import.meta.env.VITE_APP_BUILD_HASH': JSON.stringify(buildHash),
  },
  // Replace placeholders in HTML
  processHtmlTemplateString: {
    pattern: /%VITE_APP_BUILD_HASH%/g,
    replacement: buildHash
  }
}));
