import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.js",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "main.js",
      },
    },
  },
});
