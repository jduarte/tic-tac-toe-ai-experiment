# Deployment Guide

This document provides comprehensive instructions for deploying the Vue.js Tic Tac Toe game.

## 🚀 GitHub Pages Deployment (Recommended)

### Automatic Deployment

The project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. **Enable GitHub Pages** in your repository settings:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Select: `gh-pages` branch

2. **Push to main branch**:
   ```bash
   git push origin main
   ```

3. **View deployment**: Check the Actions tab for deployment status

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy to GitHub Pages using gh-pages package
npm install -g gh-pages
gh-pages -d dist
```

## 🌐 Other Deployment Options

### Netlify

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `cd tic-tac-toe-vue && npm run build`
   - Publish directory: `tic-tac-toe-vue/dist`
3. **Deploy**: Automatic on every push

### Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd tic-tac-toe-vue
   vercel --prod
   ```

### Traditional Web Hosting

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload the `dist/` folder** to your web server

## ⚙️ Configuration

### Base Path Configuration

For GitHub Pages deployment, the base path is configured in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/workflows/', // Change to your repository name
  // ... other config
})
```

### Environment Variables

Create `.env.production` for production-specific settings:

```bash
VITE_APP_TITLE=Vue Tic Tac Toe
VITE_API_BASE_URL=https://your-api.com
```

## 🔧 Build Optimization

The project includes several optimizations:

- **Tree shaking**: Removes unused code
- **Code splitting**: Reduces initial bundle size
- **Asset optimization**: Compresses images and fonts
- **Minification**: Reduces file sizes

### Build Analysis

Analyze bundle size:

```bash
npm run build -- --analyzer
```

## 📊 Performance Monitoring

After deployment, monitor performance using:

- **Lighthouse**: Built into Chrome DevTools
- **Web Vitals**: Core performance metrics
- **Bundle Analyzer**: Analyze what's in your bundle

## 🔒 Security Considerations

- **HTTPS**: Always use HTTPS in production
- **CSP Headers**: Configure Content Security Policy
- **Environment Variables**: Never expose secrets in client code

## 🚨 Troubleshooting

### Common Issues

1. **404 errors on refresh**:
   - Configure your server for SPA routing
   - Add `_redirects` file for Netlify

2. **Assets not loading**:
   - Check base path configuration
   - Verify asset paths in build

3. **Build failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Debug Commands

```bash
# Check build output
npm run preview

# Verify build structure
ls -la dist/

# Test production build locally
npx serve dist
```