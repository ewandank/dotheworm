// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "ESNext",
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
