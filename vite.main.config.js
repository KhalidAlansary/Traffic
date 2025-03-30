import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["src/main.js"],
      fileName: (_, entryName) => `${entryName}.js`,
      formats: ["es"],
    },
  },
});
