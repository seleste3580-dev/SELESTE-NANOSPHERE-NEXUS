#!/bin/bash
# Complete Android Development Workflow Script
# Handles APK compilation, installation, and live reload setup

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MODE=${1:-dev}

echo "════════════════════════════════════════════════"
echo "  Seleste NanoSphere - Android Development"
echo "════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function: Build APK
build_apk() {
  local BUILD_TYPE=$1
  
  echo -e "${BLUE}Building $BUILD_TYPE APK...${NC}"
  
  # Step 1: Build web
  npm run build
  
  # Step 2: Sync to Android
  npx cap sync android
  
  # Step 3: Build APK
  cd "$SCRIPT_DIR/android"
  
  if [ "$BUILD_TYPE" == "debug" ]; then
    echo "Compiling debug APK..."
    bash gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
  else
    echo "Compiling release APK..."
    bash gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
  fi
  
  if [ -f "$APK_PATH" ]; then
    echo -e "${GREEN}✓ APK built: $APK_PATH${NC}"
    echo ""
    
    # Get file size
    SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
    echo "📦 File size: $SIZE"
    echo "📁 Location: $SCRIPT_DIR/android/$APK_PATH"
  else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
  fi
  
  cd "$SCRIPT_DIR"
}

# Function: Install APK
install_apk() {
  echo -e "${BLUE}Installing APK on device/emulator...${NC}"
  
  # Check for devices
  DEVICES=$(adb devices | grep -v "^List" | grep device | wc -l)
  
  if [ "$DEVICES" -eq 0 ]; then
    echo -e "${RED}✗ No devices found${NC}"
    echo "Connect an Android device or start an emulator"
    exit 1
  fi
  
  adb install "$SCRIPT_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
  
  # Launch app
  adb shell am start -n com.seleste.nanosphere/.MainActivity
  
  echo -e "${GREEN}✓ App installed and launched${NC}"
}

# Function: Setup live reload
setup_live_reload() {
  echo -e "${BLUE}Setting up live reload development...${NC}"
  
  LOCAL_IP=$(hostname -I | awk '{print $1}')
  
  if [ -z "$LOCAL_IP" ]; then
    echo -e "${YELLOW}⚠️  Could not detect IP. Enter your machine's IP:${NC}"
    read -p "IP Address: " LOCAL_IP
  fi
  
  echo "Configuring for IP: $LOCAL_IP"
  
  # Update capacitor config
  cat > "$SCRIPT_DIR/capacitor.config.ts" << EOF
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.seleste.nanosphere',
  appName: 'Seleste NanoSphere',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'http://$LOCAL_IP:5173',
    cleartext: true,
  },
};

export default config;
EOF
  
  npx cap sync android
  
  echo -e "${GREEN}✓ Live reload configured${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Terminal 1: npm run dev"
  echo "2. Terminal 2: cd android && ./gradlew installDebug"
  echo "3. Device/emulator will connect to http://$LOCAL_IP:5173"
  echo "4. Edit React code and watch changes appear!"
}

# Function: Full dev setup
full_dev_setup() {
  echo -e "${BLUE}Full development setup...${NC}"
  
  setup_live_reload
  build_apk "debug"
  
  echo ""
  echo "Ready to start developing!"
  echo "Run: npm run dev"
}

# Main command handling
case "$MODE" in
  build-debug)
    build_apk "debug"
    ;;
  build-release)
    build_apk "release"
    ;;
  install)
    install_apk
    ;;
  hotreload|setup)
    setup_live_reload
    ;;
  full|dev)
    full_dev_setup
    ;;
  *)
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build-debug      - Build debug APK"
    echo "  build-release    - Build release APK"
    echo "  install          - Install APK and launch"
    echo "  hotreload/setup  - Setup live reload only"
    echo "  full/dev         - Full setup + build"
    echo ""
    echo "Examples:"
    echo "  ./android-dev.sh build-debug"
    echo "  ./android-dev.sh install"
    echo "  ./android-dev.sh setup"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
