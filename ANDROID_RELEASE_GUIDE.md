# Movie Masala - Android Release Build Guide

## 📱 Creating the Release Package

This guide walks you through building the final release package for Google Play Store submission.

## ✅ Prerequisites

Your project is already set up with:
- ✅ Capacitor configured with proper app ID
- ✅ Android platform added and synced
- ✅ Signing keystore created
- ✅ Gradle properties configured

## 🚀 Build Process

### Step 1: Build Web Assets

First, create an optimized production build of your web app:

```bash
npm run build
```

This creates optimized files in `dist/public/` including:
- Minified JavaScript and CSS
- Compressed assets
- Service worker for offline functionality

### Step 2: Sync with Android

Update the Android project with the latest web build:

```bash
npx cap sync android
```

This copies your web assets to the Android project and updates native configurations.

### Step 3: Build Android App Bundle (AAB)

The App Bundle is the preferred format for Google Play Store:

```bash
cd android
./gradlew bundleRelease
```

This creates: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 4: Build APK for Testing (Optional)

For direct testing on devices:

```bash
cd android
./gradlew assembleRelease
```

This creates: `android/app/build/outputs/apk/release/app-release.apk`

## 🔑 Signing Information

Your app is configured with these signing details:

- **Keystore file**: `movie-masala-release.keystore`
- **Keystore password**: `moviemasala123`
- **Key alias**: `movie-masala`
- **Key password**: `moviemasala123`

⚠️ **IMPORTANT**: Keep these credentials secure! If lost, you won't be able to update your app.

## 📋 Build Configuration

Your app is configured with:

- **Package name**: `com.moviemasala.wordsearch`
- **Version code**: 1 (increment for each update)
- **Version name**: "1.0.0"
- **Min SDK**: 23 (Android 6.0)
- **Target SDK**: 35 (Android 15)

## 🧪 Testing Before Submission

Before uploading to Google Play:

1. **Install the APK** on your device:
   ```bash
   adb install app/build/outputs/apk/release/app-release.apk
   ```

2. **Test thoroughly**:
   - Verify all game features work
   - Check touch controls on different screen sizes
   - Test orientation changes
   - Ensure proper performance

## 🚀 Automated Build Script

For convenience, use the included build script:

```bash
cd android
./release-build.sh
```

This script:
1. Creates the keystore if needed
2. Sets up signing configuration
3. Builds both AAB and APK files
4. Outputs file locations

## 🔍 Troubleshooting

If you encounter build issues:

- **Gradle sync failed**: Run `./gradlew clean` and try again
- **Signing errors**: Verify keystore path and credentials in `gradle.properties`
- **Build errors**: Check Android Studio for specific error messages
- **Missing dependencies**: Run `npx cap sync android` again

## 📱 Testing on Device

To install the APK directly:

1. Enable "Unknown sources" in Android settings
2. Transfer the APK to your device
3. Tap to install
4. Or use ADB: `adb install app-release.apk`

## 🚀 Next Steps

After successful build:

1. Upload the AAB file to Google Play Console
2. Complete store listing information
3. Submit for review

Your Movie Masala app is now ready for submission to the Google Play Store!