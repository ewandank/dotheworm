// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: true,
    target: ["chrome89", "edge89", "firefox89", "safari15"],
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry:"main.ts",
      name: "dotheworm",
      // the proper extensions will be added
      fileName: "dotheworm",
      formats: ["es"]
    },
  },
});
