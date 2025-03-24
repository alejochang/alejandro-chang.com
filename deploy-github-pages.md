# Setting Up GitHub Pages with Route 53 for Your Profile Site

## 1. Create a GitHub Repository

1. Go to https://github.com/alejochang
2. Click "New"
3. Name: `alejochang.github.io` (this special name enables GitHub Pages)
4. Description: "Professional profile and skills showcase"
5. Choose "Public" (required for GitHub Pages)
6. Add README and Node.js .gitignore
7. Click "Create repository"

## 2. Simplify Your Project for Static Hosting

1. Create a static version by modifying your project:
   - Convert API data to static JSON files in public directory
   - Update client code to fetch from local JSON files instead of API endpoints

2. Create a simplified build script in package.json:
   ```json
   "scripts": {
     "build": "vite build",
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Install gh-pages package:
   ```
   npm install --save-dev gh-pages
   ```

## 3. Configure Vite for GitHub Pages

1. Update vite.config.ts:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/',
     build: {
       outDir: 'dist'
     }
   })
   ```

## 4. Push Code to GitHub

```
git clone https://github.com/alejochang/alejochang.github.io.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

## 5. Deploy to GitHub Pages

```
npm run deploy
```

Or set up automatic deployment in repository settings:
1. Go to repository settings
2. Select "Pages" from sidebar
3. Set "Source" to "GitHub Actions"
4. Choose the "Static HTML" workflow

## 6. Set Up Domain with Route 53

1. In GitHub repository settings:
   - Go to "Pages"
   - Under "Custom domain" enter: `alejandro-chang.com`
   - Save (GitHub will create a CNAME file in your repo)

2. In AWS Route 53:
   - Open Route 53 console
   - Select hosted zone for `alejandro-chang.com`
   - Create a CNAME record:
     - Name: `www` (or @ for root domain)
     - Type: CNAME
     - Value: `alejochang.github.io.`
     - TTL: 300
   - For root domain (@), create four A records pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. Wait for DNS propagation (can take up to 24h)

## 7. Verify HTTPS

1. In GitHub Pages settings, check "Enforce HTTPS"
2. Wait for GitHub to provision certificate

## 8. Test Your Site

1. Visit `alejandro-chang.com` to confirm it's working
2. Test in incognito mode and on mobile

This setup eliminates the need for AWS Amplify by using GitHub Pages for hosting and Route 53 for domain management.