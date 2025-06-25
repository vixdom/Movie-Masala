#!/bin/bash

echo "🎬 Quick Build for Movie Masala..."

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

# Create gradle.properties
cat > gradle.properties << EOF
MYAPP_RELEASE_STORE_FILE=movie-masala-release.keystore
MYAPP_RELEASE_KEY_ALIAS=movie-masala
MYAPP_RELEASE_STORE_PASSWORD=moviemasala123
MYAPP_RELEASE_KEY_PASSWORD=moviemasala123
EOF

echo "✅ Setup complete! Now run:"
echo "   ./gradlew bundleRelease    # For Play Store upload (.aab)"
echo "   ./gradlew assembleRelease  # For direct APK install"