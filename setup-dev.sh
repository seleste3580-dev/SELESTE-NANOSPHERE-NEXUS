#!/bin/bash
# Real-time Development Setup for Android
# This script sets up live reload for Capacitor Android development

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ANDROID_DIR="$SCRIPT_DIR/android"

echo "🔧 Setting up Real-time Development Environment..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Get local IP for live reload
LOCAL_IP=$(hostname -I | awk '{print $1}')
if [ -z "$LOCAL_IP" ]; then
  LOCAL_IP="192.168.x.x"
  echo -e "${YELLOW}⚠️  Could not auto-detect IP. Please set your machine's local IP.${NC}"
fi

echo -e "${BLUE}Step 1: Configuring Live Reload${NC}"
echo "Your machine IP: $LOCAL_IP"

# Create or update capacitor.config.ts for development
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
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
    },
  },
};

export default config;
EOF

echo -e "${GREEN}✓ Live reload configured for $LOCAL_IP:5173${NC}"
echo ""

# Step 2: Sync to Android
echo -e "${BLUE}Step 2: Syncing Configuration to Android${NC}"
npx cap sync android
echo -e "${GREEN}✓ Synced${NC}"
echo ""

# Step 3: Instructions
echo -e "${BLUE}Step 3: Start Development Server${NC}"
echo -e "${YELLOW}Open a new terminal and run:${NC}"
echo -e "${GREEN}npm run dev${NC}"
echo ""

echo -e "${BLUE}Step 4: Build and Run on Emulator/Device${NC}"
echo "Run in Android Studio or via:"
echo -e "${GREEN}cd android && ./gradlew installDebug${NC}"
echo ""

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}Real-time Development Ready!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo "How it works:"
echo "1. Run: npm run dev"
echo "2. App connects to http://$LOCAL_IP:5173"
echo "3. Edit React code"
echo "4. App hot-reloads automatically"
echo ""
echo -e "${YELLOW}⚠️  Your phone/emulator must be on same network as $LOCAL_IP${NC}"
