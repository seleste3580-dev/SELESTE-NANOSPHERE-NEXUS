#!/bin/bash
# Android Build Script for Seleste NanoSphere
# This script automates the Android build process

set -e

echo "==================================="
echo "Seleste NanoSphere Android Build"
echo "==================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${BLUE}Step 1: Building web assets...${NC}"
cd "$SCRIPT_DIR"
npm run build
echo -e "${GREEN}✓ Web assets built${NC}\n"

echo -e "${BLUE}Step 2: Syncing assets to Android project...${NC}"
npx cap sync
echo -e "${GREEN}✓ Assets synced${NC}\n"

# Check if build type is specified
BUILD_TYPE=${1:-debug}

if [ "$BUILD_TYPE" == "debug" ]; then
    echo -e "${BLUE}Step 3: Building debug APK...${NC}"
    cd "$SCRIPT_DIR/android"
    ./gradlew assembleDebug
    echo -e "${GREEN}✓ Debug APK built${NC}"
    echo -e "${YELLOW}Output: android/app/build/outputs/apk/debug/app-debug.apk${NC}\n"
    
elif [ "$BUILD_TYPE" == "release" ]; then
    echo -e "${BLUE}Step 3: Building release APK...${NC}"
    
    # Check for signing key
    if [ ! -f "$SCRIPT_DIR/my-release-key.jks" ]; then
        echo -e "${YELLOW}No signing key found. Creating one...${NC}"
        keytool -genkey -v -keystore "$SCRIPT_DIR/my-release-key.jks" \
            -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
    fi
    
    read -sp "Enter keystore password: " KEYSTORE_PASSWORD
    echo ""
    read -sp "Enter key password: " KEY_PASSWORD
    echo ""
    
    cd "$SCRIPT_DIR/android"
    ./gradlew assembleRelease \
        -Pandroid.injected.signing.store.file="../my-release-key.jks" \
        -Pandroid.injected.signing.store.password="$KEYSTORE_PASSWORD" \
        -Pandroid.injected.signing.key.alias="my-key-alias" \
        -Pandroid.injected.signing.key.password="$KEY_PASSWORD"
    
    echo -e "${GREEN}✓ Release APK built${NC}"
    echo -e "${YELLOW}Output: android/app/build/outputs/apk/release/app-release.apk${NC}\n"
    
elif [ "$BUILD_TYPE" == "bundle" ]; then
    echo -e "${BLUE}Step 3: Building release App Bundle for Play Store...${NC}"
    
    # Check for signing key
    if [ ! -f "$SCRIPT_DIR/my-release-key.jks" ]; then
        echo -e "${YELLOW}No signing key found. Creating one...${NC}"
        keytool -genkey -v -keystore "$SCRIPT_DIR/my-release-key.jks" \
            -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
    fi
    
    read -sp "Enter keystore password: " KEYSTORE_PASSWORD
    echo ""
    read -sp "Enter key password: " KEY_PASSWORD
    echo ""
    
    cd "$SCRIPT_DIR/android"
    ./gradlew bundleRelease \
        -Pandroid.injected.signing.store.file="../my-release-key.jks" \
        -Pandroid.injected.signing.store.password="$KEYSTORE_PASSWORD" \
        -Pandroid.injected.signing.key.alias="my-key-alias" \
        -Pandroid.injected.signing.key.password="$KEY_PASSWORD"
    
    echo -e "${GREEN}✓ App Bundle built${NC}"
    echo -e "${YELLOW}Output: android/app/build/outputs/bundle/release/app-release.aab${NC}\n"
    
else
    echo -e "${YELLOW}Invalid build type. Use: debug, release, or bundle${NC}"
    exit 1
fi

echo -e "${GREEN}==================================="
echo "Build completed successfully!"
echo "===================================${NC}"
