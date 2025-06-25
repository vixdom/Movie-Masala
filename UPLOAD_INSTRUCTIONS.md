# Movie Masala - Google Play Store Upload Instructions

## Current Status
✅ Signing keystore created: `movie-masala-release.keystore`
✅ Gradle signing configuration complete
⏳ Building release files (in progress)

## What You'll Get
After the build completes, you'll have:
- `app/build/outputs/bundle/release/app-release.aab` - Upload this to Play Store
- `app/build/outputs/apk/release/app-release.apk` - For testing

## Google Play Console Steps

### 1. Access Play Console
- Go to https://play.google.com/console
- Sign in with your developer account
- Pay $25 registration fee if first time

### 2. Create New App
- Click "Create app"
- App name: "Movie Masala"
- Language: English (US)
- Type: Game
- Free or paid: Free

### 3. Upload App Bundle
- Go to Release → Production
- Click "Create new release"
- Upload the `app-release.aab` file
- Add release notes: "Initial release of Movie Masala - Bollywood Word Search game"

### 4. Store Listing
**Required fields:**
- Short description: "Find hidden Bollywood star names in this addictive Hindi cinema puzzle game!"
- Full description: Use the comprehensive description from PLAY_STORE_CHECKLIST.md
- App icon: 512x512 PNG (your existing icon)
- Screenshots: Take 2-8 screenshots of gameplay
- Category: Games → Puzzle
- Content rating: Complete questionnaire (family-friendly)

### 5. Privacy Policy
Simple privacy policy text:
```
Movie Masala Privacy Policy

This app does not collect, store, or share any personal information.
All game data is stored locally on your device.
No internet connection is required to play.
No advertisements or tracking are included.

Contact: [your-email@example.com]
```

### 6. Submit
- Review all sections
- Click "Start rollout to production"
- Wait 1-7 days for Google review

## Build Commands Reference
If you need to rebuild:
```bash
cd android
./gradlew bundleRelease    # For Play Store (.aab)
./gradlew assembleRelease  # For testing (.apk)
```

Your app is ready for the world!