import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { checker } from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    react(),
    svgrPlugin(),
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"],
  },
});
