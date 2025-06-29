# Movie Masala - Complete Deployment Guide

## 🌐 PWA Deployment (Progressive Web App)

### Step 1: Build the Production Version
```bash
npm run build
```

### Step 2: Deploy to Web Hosting
Choose one of these hosting platforms:

#### Option A: Netlify (Recommended - Free)
1. Go to [Netlify](https://netlify.com)
2. Drag & drop your `dist/public` folder
3. Your PWA will be live instantly at `https://[random-name].netlify.app`

#### Option B: Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow prompts to deploy

#### Option C: GitHub Pages
1. Push your project to GitHub
2. Go to repository Settings → Pages
3. Set source to GitHub Actions
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy PWA
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

### Step 3: PWA Installation Instructions for Users

**On Android Chrome:**
1. Visit your PWA URL
2. Tap menu (3 dots) → "Add to Home screen"
3. App installs like a native app

**On iPhone Safari:**
1. Visit your PWA URL in Safari
2. Tap Share button → "Add to Home Screen"
3. App installs with proper icon

---

## 📱 APK Deployment (Android Native App)

### Step 1: Build Web Assets
```bash
npm run build
```

### Step 2: Sync with Capacitor
```bash
npx cap sync android
```

### Step 3: Build APK

#### For Testing (Debug APK):
```bash
cd android
./gradlew assembleDebug
```
**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

#### For Release (Signed APK):
```bash
cd android
./gradlew assembleRelease
```
**Output:** `android/app/build/outputs/apk/release/app-release.apk`

### Step 4: Install APK on Android Device

#### Via USB (ADB):
1. Enable Developer Options on Android
2. Enable USB Debugging
3. Connect device to computer
4. Run: `adb install app-debug.apk`

#### Via File Transfer:
1. Transfer APK to device
2. Enable "Install from Unknown Sources"
3. Tap APK file and install

---

## 🏪 Google Play Store Deployment

### Step 1: Build App Bundle (AAB)
```bash
cd android
./gradlew bundleRelease
```
**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

### Step 2: Google Play Console
1. Create developer account at [Google Play Console](https://play.google.com/console) ($25 fee)
2. Create new app: "Movie Masala"
3. Upload the `.aab` file
4. Complete store listing:
   - **Category:** Games > Puzzle
   - **Description:** "Find hidden Bollywood star names in this addictive Hindi cinema puzzle game!"
   - **Screenshots:** Take 2-8 gameplay screenshots
   - **App icon:** 512x512 PNG version of your icon

### Step 3: Store Listing Requirements
- **Privacy Policy** (required)
- **Content Rating** (complete questionnaire)
- **App screenshots** (different device sizes)
- **Feature graphic** (1024x500 banner)

---

## 🍎 iOS App Store (Future)

### Requirements:
- Apple Developer Account ($99/year)
- macOS with Xcode
- iOS platform setup: `npx cap add ios`

### Build Process:
```bash
npx cap build ios
npx cap open ios
```
Then build and distribute through Xcode.

---

## 🚀 Quick Start Commands

### For PWA Testing:
```bash
npm run build
npx serve dist/public  # Test locally
```

### For APK Testing:
```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

### For Production Deployment:
```bash
npm run build
npx cap sync android
cd android && ./gradlew bundleRelease
```

---

## 📊 Deployment Checklist

### PWA Deployment ✅
- [x] Service Worker configured
- [x] Manifest.json setup
- [x] Icons ready (all sizes)
- [x] Offline functionality
- [x] Responsive design

### Android APK ✅
- [x] Capacitor configured
- [x] Android platform added
- [x] Signing keystore created
- [x] Build scripts ready
- [x] Touch optimization complete

### Ready for Production! 🎉

Your Movie Masala app is fully configured for both PWA and APK deployment. The PWA will work on all devices with a browser, while the APK provides a native Android experience.

**Recommended Deployment Order:**
1. **Deploy PWA first** (immediate availability on all devices)
2. **Build APK for testing** (share with friends for feedback)
3. **Submit to Google Play** (for wide distribution)

Both versions will provide the same great Bollywood word search experience with touch-optimized controls!