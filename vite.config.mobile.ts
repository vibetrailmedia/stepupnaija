import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Detect the correct project structure
const hasClientFolder = fs.existsSync(path.resolve(__dirname, "client"));
const hasRootSrc = fs.existsSync(path.resolve(__dirname, "src"));

let rootPath, srcPath, assetsPath;

if (hasClientFolder) {
  // Standard structure: client/src/
  rootPath = path.resolve(__dirname, "client");
  srcPath = path.resolve(__dirname, "client", "src");
  assetsPath = path.resolve(__dirname, "attached_assets");
} else if (hasRootSrc) {
  // Flattened structure: src/ in root
  rootPath = __dirname;
  srcPath = path.resolve(__dirname, "src");
  assetsPath = path.resolve(__dirname, "attached_assets");
} else {
  // Fallback: assume current directory
  rootPath = __dirname;
  srcPath = path.resolve(__dirname, "src");
  assetsPath = path.resolve(__dirname, "attached_assets");
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": srcPath,
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": assetsPath,
    },
  },
  root: rootPath,
  build: {
    rollupOptions: {
      input: hasClientFolder 
        ? path.resolve(__dirname, "client/index.html")
        : path.resolve(__dirname, "index.html")
    },
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
