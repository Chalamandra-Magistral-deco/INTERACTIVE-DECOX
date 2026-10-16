/// <reference types="vitest" />
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    minify: "esbuild",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler")) {
              return "react";
            }
            if (id.includes("motion") || id.includes("framer-motion")) {
              return "motion";
            }
            if (id.includes("tone")) {
              return "tone";
            }
            if (id.includes("@supabase") || id.includes("@google/genai")) {
              return "backend";
            }
            if (id.includes("sonner") || id.includes("lucide")) {
              return "ui";
            }
            return "vendor";
          }
          // Separar features pesadas por carpeta (bajo riesgo, sin lazy)
          if (id.includes("/src/components/ArchetypeQuiz")) return "feat-quiz";
          if (id.includes("/src/components/ArchitectDashboard")) return "feat-dashboard";
          if (id.includes("/src/components/OraculoChalamandra")) return "feat-oraculo";
          if (id.includes("/src/components/PowerLensGenerator")) return "feat-powerlens";
          if (id.includes("/src/components/GrimorioTacticoSection")) return "feat-grimorio";
          if (id.includes("/src/components/TheCodex")) return "feat-codex";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
    legalComments: "none",
  },
  define: {
    "import.meta.env.VITE_STRIPE_DISCOVERY_URL": JSON.stringify(env.VITE_STRIPE_DISCOVERY_URL || ""),
    "import.meta.env.VITE_WHATSAPP_NUMBER": JSON.stringify(env.VITE_WHATSAPP_NUMBER || ""),
    "import.meta.env.VITE_WHATSAPP_MESSAGE": JSON.stringify(env.VITE_WHATSAPP_MESSAGE || ""),
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL || ""),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(env.VITE_SUPABASE_PUBLISHABLE_KEY || ""),
  },
  };
});