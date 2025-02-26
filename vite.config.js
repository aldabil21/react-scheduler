import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
  plugins: [
    react(),
    tsconfigPaths({
      configNames: ["tsconfig.json"],
    }),
    dts({ tsconfigPath: "./tsconfig.build.json" }),
    peerDepsExternal(),
  ],
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/lib/index.tsx"),
      },
      name: "Scheduler",
      formats: ["es"],
    },
    copyPublicDir: false,
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"],
  },
}));
