// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    target: "ESNext",
    outDir: "../dist",
    emptyOutDir: true,
    // minify: false,
    lib: {
      entry: "main.ts",
      name: "dotheworm",
      fileName: "dotheworm",
      formats: ["iife"],
    },
  },
});
