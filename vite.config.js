import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import { peerDependencies } from "./package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig((props) => ({
  plugins: [
    react(),
    tsconfigPaths({
      configNames: ["tsconfig.json"],
    }),
    dts({ rollupTypes: true, tsconfigPath: "./tsconfig.build.json" }),
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
    rollupOptions: {
      external: (path) => {
        const nodeModules = path.includes("node_modules");
        const isPeer = Object.keys(peerDependencies).some((dep) => path.startsWith(dep));
        const isExternal = nodeModules || isPeer;
        return isExternal;
      },
      output: {
        globals: (path) => path,
      },
    },
    copyPublicDir: false,
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"],
  },
}));
