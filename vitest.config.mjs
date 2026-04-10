import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { transformWithEsbuild } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    {
      name: "treat-src-js-as-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!/src[\\/].*\.js$/.test(id) || id.includes("node_modules")) {
          return null;
        }

        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react({
      include: /\.[jt]sx?$/,
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
  environment: "jsdom",
  setupFiles: ["./src/test/setupTests.js"],
  globals: true,
  css: true,
  restoreMocks: true,
  sequence: {
    hooks: "list",
  },
},
});
