#!/bin/bash

echo "🎬 Creating debug APK for sideloading..."

# Simple debug build without signing requirements
./gradlew assembleDebug --no-daemon --offline 2>/dev/null || {
    echo "Building debug APK (this may take a few minutes)..."
    ./gradlew assembleDebug --no-daemon
}

if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ Debug APK created: app/build/outputs/apk/debug/app-debug.apk"
    ls -lh app/build/outputs/apk/debug/app-debug.apk
    echo ""
    echo "📱 To sideload:"
    echo "1. Enable 'Developer Options' on your Android device"
    echo "2. Turn on 'USB Debugging' and 'Install unknown apps'"
    echo "3. Transfer app-debug.apk to your device"
    echo "4. Open the APK file and install"
else
    echo "❌ Build failed - checking for existing APKs..."
    find . -name "*.apk" -type f 2>/dev/null || echo "No APK files found"
fi