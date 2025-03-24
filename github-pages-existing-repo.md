# Deploying to Your Existing GitHub Pages Repository

## 1. Prepare Your Project for Static Hosting

1. **Move server data to static JSON files**:
   - The project already has static JSON files in `client/src/data/`
   - Ensure any components using React Query are updated to use these static files

2. **Update Vite configuration**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Modify vite.config.ts**:
   ```typescript
   export default defineConfig({
     plugins: [
       react(),
       runtimeErrorOverlay(),
       themePlugin(),
     ],
     base: '/', // Use '/' for custom domain
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "client", "src"),
         "@shared": path.resolve(__dirname, "shared"),
       },
     },
     root: path.resolve(__dirname, "client"),
     build: {
       outDir: path.resolve(__dirname, "dist"), // Changed from dist/public
       emptyOutDir: true,
     },
   });
   ```

## 2. Clone Your Existing Repository

```bash
git clone https://github.com/alejochang/alejandro-chang.com.git
cd alejandro-chang.com
```

## 3. Replace Content with Your New Project

1. **Remove existing files** (keep the .git directory):
   ```bash
   rm -rf * .github/
   ```

2. **Copy your project files**:
   ```bash
   cp -r /Users/alejochang/workspace/alejandro-chang-professional-profile/* .
   ```

## 4. Build and Deploy

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the static site**:
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

## 5. Configure Custom Domain

1. **In GitHub repository settings**:
   - Go to "Pages"
   - Under "Custom domain" enter: `alejandro-chang.com`
   - Enforce HTTPS

2. **Verify DNS settings in Route 53**:
   - Ensure CNAME record for `www` points to `alejochang.github.io.`
   - For root domain (@), verify A records point to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. **Test your site** at `alejandro-chang.com`

This approach preserves your existing GitHub repository while updating it with your current project.