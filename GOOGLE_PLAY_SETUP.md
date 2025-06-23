# Google Play Store Setup Guide for Movie Masala

## Overview
Your Bollywood word search game "Movie Masala" is now ready for Android deployment via Capacitor. This guide covers the complete process for Google Play Store submission.

## Current Setup Status ✅
- ✅ Capacitor configured with proper app ID: `com.moviemasala.wordsearch`
- ✅ Android platform added and synced
- ✅ Production build optimized for mobile
- ✅ Android manifest configured for games
- ✅ Build configuration optimized for Google Play Store
- ✅ App bundle format enabled for smaller downloads

## Next Steps for Google Play Store

### 1. Build Release Version
```bash
# Build production version
npm run build

# Sync with Android
npx cap sync android

# Build Android App Bundle (AAB) for Google Play
cd android
./gradlew bundleRelease
```

### 2. App Signing (Required for Google Play)
You'll need to create a signing key:
```bash
# Generate keystore (do this once)
keytool -genkey -v -keystore movie-masala-release.keystore -alias movie-masala -keyalg RSA -keysize 2048 -validity 10000

# Add to android/app/build.gradle:
android {
    signingConfigs {
        release {
            storeFile file('movie-masala-release.keystore')
            storePassword 'your-store-password'
            keyAlias 'movie-masala'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 3. Google Play Console Setup
1. Create Google Play Developer account ($25 one-time fee)
2. Create new app in Play Console
3. Upload signed AAB file
4. Configure store listing:
   - App name: "Movie Masala - Bollywood Word Search"
   - Short description: "Find hidden Bollywood actor names in this addictive word search puzzle game"
   - Full description: Include keywords like "Bollywood", "Hindi cinema", "word puzzle", "brain game"
   - Screenshots: Capture gameplay on different device sizes
   - App icon: High-resolution version needed (512x512)

### 4. Required Store Assets
- **App Icon**: 512x512 PNG (high-res for store)
- **Feature Graphic**: 1024x500 PNG (store banner)
- **Screenshots**: 
  - Phone: 16:9 or 9:16 aspect ratio
  - Tablet: 16:10 or 10:16 aspect ratio
  - Minimum 2 screenshots, maximum 8
- **Privacy Policy**: Required for apps that handle user data

### 5. App Categories and Content Rating
- **Category**: Games > Puzzle
- **Content Rating**: Complete questionnaire (likely E for Everyone)
- **Target Audience**: 13+ (typical for word games)

### 6. Release Configuration
- **Release Type**: Production
- **Countries**: Start with India, expand globally
- **Pricing**: Free (with potential for ads/in-app purchases later)

## Technical Specifications Met
- **Minimum SDK**: API 22 (Android 5.1)
- **Target SDK**: API 34 (Android 14)
- **App Size**: Optimized with resource shrinking
- **Performance**: Hardware accelerated, touch optimized
- **Compatibility**: Portrait mode, thumb-friendly design

## App Store Optimization (ASO)
- **Keywords**: "Bollywood", "Hindi movies", "word search", "puzzle", "brain training"
- **Localization**: Consider Hindi language support for Indian market
- **Ratings**: Encourage positive reviews through in-app prompts

## Monetization Options (Future)
- AdMob integration for banner/interstitial ads
- In-app purchases for hint packs or premium word lists
- Remove ads premium version

## Testing Before Submission
1. Test on multiple Android devices/screen sizes
2. Verify audio/haptic feedback works correctly
3. Test long press functionality
4. Ensure smooth performance on lower-end devices
5. Test in airplane mode (offline functionality)

Your app is technically ready for Google Play Store. The main remaining steps are creating the signing key, building the signed AAB, and setting up the Google Play Console listing.