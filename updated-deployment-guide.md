# Setting Up GitHub Pages with Route 53 for Your Profile Site

## 1. Create a GitHub Repository
1. Go to https://github.com/alejochang
2. Click "New"
3. Name: `alejochang.github.io` (this special name enables GitHub Pages)
4. Description: "Professional profile and skills showcase"
5. Choose "Public" (required for GitHub Pages)
6. Add README and Node.js .gitignore
7. Click "Create repository"

## 2. Adapt Your Project for Static Hosting
1. Create a static version by modifying your project:
   * Convert API data to static JSON files in the public directory
   * Update client code to fetch from local JSON files instead of API endpoints

2. Update package.json to include GitHub Pages deployment scripts:
```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "tsx server/index.ts",
    "build:client": "vite build",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push",
    "predeploy": "npm run build:client",
    "deploy": "gh-pages -d dist"
  }
  // Dependencies remain the same
}
```

3. Install gh-pages package:
```
npm install --save-dev gh-pages
```

## 3. Configure Vite for GitHub Pages
1. Update vite.config.ts to include the base path and adjust for static deployment:
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    // Cartographer plugin only used in development environment
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  base: '/', // Set to '/' for custom domain or '/repo-name' for project pages
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"), // Changed from dist/public for GitHub Pages
    emptyOutDir: true,
  },
});
```

## 4. Create a Static Site Version
1. Create a static build process by adding a new `build:client` script that only builds the frontend
2. Move client-side rendering logic to fetch from static JSON files
3. For components that use server data:
   * Create static JSON files in the client/public folder
   * Update fetch paths to relative URLs (e.g., '/data/profile.json')
4. Update your `index.html` to properly load static resources from the base path

**Important:** Given your project structure with client files in a subdirectory, ensure that any API calls in your code use relative paths or are replaced with static data for the GitHub Pages version.

## 5. Push Code to GitHub
```
git clone https://github.com/alejochang/alejochang.github.io.git
cd alejochang.github.io
git add .
git commit -m "Initial commit for GitHub Pages"
git push -u origin main
```

## 6. Deploy to GitHub Pages
```
npm run deploy
```

**Note:** The deploy script will publish the `dist` directory. Make sure you've updated the build configuration to output directly to `dist` instead of `dist/public` for GitHub Pages compatibility.

Or set up GitHub Actions for automatic deployment:

1. Create a `.github/workflows/deploy.yml` file:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build:client
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. Go to repository settings
3. Select "Pages" from sidebar
4. Set "Source" to "GitHub Actions"

## 7. Set Up Domain with Route 53
1. In GitHub repository settings:
   * Go to "Pages"
   * Under "Custom domain" enter: `alejandro-chang.com`
   * Save (GitHub will create a CNAME file in your repo)

2. In AWS Route 53:
   * Open Route 53 console
   * Select hosted zone for `alejandro-chang.com`
   * Create a CNAME record:
      * Name: `www` (or @ for root domain)
      * Type: CNAME
      * Value: `alejochang.github.io.`
      * TTL: 300
   * For root domain (@), create four A records pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. Wait for DNS propagation (can take up to 24h)

## 8. Verify HTTPS
1. In GitHub Pages settings, check "Enforce HTTPS"
2. Wait for GitHub to provision certificate

## 9. Test Your Site
1. Visit `alejandro-chang.com` to confirm it's working
2. Test in incognito mode and on mobile

This setup eliminates the need for AWS Amplify by using GitHub Pages for hosting and Route 53 for domain management.
