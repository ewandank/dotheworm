// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    target: "ESNext",
    outDir: "../dist",
    emptyOutDir: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: "main.ts",
      name: "dotheworm",
      // the proper extensions will be added
      fileName: "dotheworm",
      formats: ["iife"],
    },
  },
});
