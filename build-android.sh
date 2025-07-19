#!/bin/bash

echo "🎬 Movie Masala - Android Build Script 🎬"
echo "----------------------------------------"

# Step 1: Build web assets
echo "📦 Building web assets..."
if ! npm run build; then
  echo "❌ Web build failed. Exiting."
  exit 1
fi
echo "✅ Web build complete!"

# Step 2: Sync with Android
echo "🔄 Syncing with Android..."
if ! npx @capacitor/cli sync android; then
  echo "❌ Capacitor sync failed. Exiting."
  exit 1
fi
echo "✅ Android sync complete!"

# Step 3: Build Android packages
echo "🤖 Building Android packages..."
cd android

# Check if keystore exists, create if not
if [ ! -f "movie-masala-release.keystore" ]; then
  echo "🔑 Creating signing keystore..."
  keytool -genkey -v -keystore movie-masala-release.keystore \
    -alias movie-masala \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass moviemasala123 \
    -keypass moviemasala123 \
    -dname "CN=Movie Masala, OU=Game Development, O=Movie Masala Games, L=Mumbai, S=Maharashtra, C=IN"
fi

# Create gradle.properties if needed
if [ ! -f "gradle.properties" ]; then
  echo "⚙️ Creating gradle.properties..."
  cat > gradle.properties << EOF
MYAPP_RELEASE_STORE_FILE=movie-masala-release.keystore
MYAPP_RELEASE_KEY_ALIAS=movie-masala
MYAPP_RELEASE_STORE_PASSWORD=moviemasala123
MYAPP_RELEASE_KEY_PASSWORD=moviemasala123
EOF
fi

# Build App Bundle (AAB) for Play Store
echo "🏗️ Building Android App Bundle (AAB) for Play Store..."
if ! ./gradlew bundleRelease; then
  echo "❌ AAB build failed. Trying debug build..."
  ./gradlew bundleDebug
fi

# Build APK for direct testing
echo "🏗️ Building APK for testing..."
if ! ./gradlew assembleRelease; then
  echo "❌ Release APK build failed. Building debug APK instead..."
  ./gradlew assembleDebug
fi

# Check for output files
echo ""
echo "🔍 Checking for output files..."

AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
APK_RELEASE_PATH="app/build/outputs/apk/release/app-release.apk"
APK_DEBUG_PATH="app/build/outputs/apk/debug/app-debug.apk"

if [ -f "$AAB_PATH" ]; then
  echo "✅ App Bundle (AAB) created: $AAB_PATH"
  echo "   Size: $(du -h "$AAB_PATH" | cut -f1)"
else
  echo "❌ App Bundle (AAB) not found"
fi

if [ -f "$APK_RELEASE_PATH" ]; then
  echo "✅ Release APK created: $APK_RELEASE_PATH"
  echo "   Size: $(du -h "$APK_RELEASE_PATH" | cut -f1)"
else
  echo "❌ Release APK not found"
fi

if [ -f "$APK_DEBUG_PATH" ]; then
  echo "✅ Debug APK created: $APK_DEBUG_PATH"
  echo "   Size: $(du -h "$APK_DEBUG_PATH" | cut -f1)"
fi

echo ""
echo "🎬 Movie Masala build process complete! 🎬"
echo ""
echo "📱 Next steps:"
echo "1. Upload the AAB file to Google Play Console"
echo "2. Use the APK for direct testing on devices"
echo "3. Follow the submission guide in GOOGLE_PLAY_SUBMISSION_COMPLETE.md"