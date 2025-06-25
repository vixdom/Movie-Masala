#!/bin/bash

# Movie Masala - Google Play Store Release Build Script
echo "🎬 Building Movie Masala for Google Play Store..."

# Step 1: Generate signing keystore (if it doesn't exist)
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
    echo "✅ Keystore created: movie-masala-release.keystore"
fi

# Step 2: Create gradle.properties for signing
echo "🔧 Configuring signing..."
cat > gradle.properties << EOF
MYAPP_RELEASE_STORE_FILE=movie-masala-release.keystore
MYAPP_RELEASE_KEY_ALIAS=movie-masala
MYAPP_RELEASE_STORE_PASSWORD=moviemasala123
MYAPP_RELEASE_KEY_PASSWORD=moviemasala123
EOF

# Step 3: Build the Android App Bundle (recommended for Play Store)
echo "📦 Building Android App Bundle..."
./gradlew bundleRelease

# Step 4: Also build APK for testing
echo "📱 Building Release APK..."
./gradlew assembleRelease

echo ""
echo "🎉 BUILD COMPLETE!"
echo "📍 Files created:"
echo "   • AAB: app/build/outputs/bundle/release/app-release.aab (Upload this to Play Store)"
echo "   • APK: app/build/outputs/apk/release/app-release.apk (For testing)"
echo ""
echo "🚀 Next steps:"
echo "1. Go to https://play.google.com/console"
echo "2. Create new app"
echo "3. Upload app-release.aab"
echo "4. Add store listing details"
echo "5. Submit for review"