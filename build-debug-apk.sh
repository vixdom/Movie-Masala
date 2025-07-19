#!/bin/bash

echo "🎬 Movie Masala - Debug APK Builder 🎬"
echo "-------------------------------------"

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

# Step 3: Build debug APK
echo "🤖 Building debug APK..."
cd android
if ! ./gradlew assembleDebug; then
  echo "❌ Debug APK build failed."
  exit 1
fi

# Check for output file
APK_DEBUG_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_DEBUG_PATH" ]; then
  echo "✅ Debug APK created: $APK_DEBUG_PATH"
  echo "   Size: $(du -h "$APK_DEBUG_PATH" | cut -f1)"
  
  # Create a copy in the project root for easy access
  cp "$APK_DEBUG_PATH" "../movie-masala-debug.apk"
  echo "✅ Copied to ../movie-masala-debug.apk for easy access"
else
  echo "❌ Debug APK not found"
  exit 1
fi

echo ""
echo "📱 Sideloading Instructions:"
echo "1. Enable 'Unknown sources' in your Android settings"
echo "2. Transfer movie-masala-debug.apk to your device"
echo "3. Tap the APK file to install"
echo "4. Enjoy Movie Masala!"