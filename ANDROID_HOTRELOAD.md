# 🔥 Real-Time Android Development Guide

## Live Reload for Capacitor Android

This guide explains how to set up hot-reloading for rapid Android development.

---

## What is Live Reload?

Instead of rebuilding the entire APK after each code change, your app:
1. Loads your React code from a dev server
2. **Hot reloads** when you save files
3. Runs on Android emulator or device
4. Instant feedback loop

**Time to see changes:**
- Traditional: 1-2 minutes per rebuild
- Live Reload: 0.5-2 seconds

---

## Setup (Choose One Method)

### Method 1: Quick Setup (Recommended)
```bash
./setup-dev.sh
```

This automatically:
- Detects your machine's IP
- Configures Capacitor for live reload
- Syncs to Android project

### Method 2: Manual Setup

1. **Find your machine IP:**
   ```bash
   hostname -I  # Linux/Mac
   ipconfig     # Windows
   ```

2. **Update capacitor.config.ts:**
   ```typescript
   import type { CapacitorConfig } from '@capacitor/cli';
   
   const config: CapacitorConfig = {
     appId: 'com.seleste.nanosphere',
     appName: 'Seleste NanoSphere',
     webDir: 'dist',
     server: {
       androidScheme: 'https',
       url: 'http://192.168.1.100:5173',  // Your IP here
       cleartext: true,
     },
   };
   
   export default config;
   ```

3. **Sync to Android:**
   ```bash
   npx cap sync android
   ```

---

## Development Workflow

### Terminal 1: Development Server
```bash
npm run dev
```

This starts Vite dev server on `localhost:5173`

**Output:**
```
  VITE v6.4.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
```

### Terminal 2: Android Build & Run
```bash
# Option A: Using Android Studio
open -a "Android Studio" android/

# Option B: Command line
cd android
./gradlew installDebug
./gradlew installDebugAndroidTest
```

### Terminal 3: Monitor Live Reload
```bash
# View Android logs while developing
adb logcat | grep "Seleste"
```

---

## What Happens When You Save Code

1. **You edit:** `src/components/AIChat.tsx`
2. **You save:** File auto-saves in VS Code
3. **Vite recompiles:** React code compiles instantly
4. **Android app reloads:** Page refreshes automatically
5. **You see changes:** Less than 2 seconds total

---

## Live Reload Features

✅ Works on emulator and real devices  
✅ Preserves app state during reload  
✅ Live console logs in terminal  
✅ CSS changes instant  
✅ Component updates live  
✅ Debugging tools available  

---

## Typical Development Session

```bash
# Terminal 1: Start dev server
npm run dev
# Runs on http://192.168.1.100:5173

# Terminal 2: Install and run on device
cd android
./gradlew installDebug

# Terminal 3: Optional - monitor logs
adb logcat -s "Seleste"

# Then: Edit your React code!
# Changes appear in app automatically
```

---

## Debugging with Live Reload

### View Console Logs
```bash
adb logcat | grep "Seleste\|React\|Error"
```

### Open Chrome DevTools
1. Android app running
2. On desktop: chrome://inspect
3. Find your app in list
4. Click "Inspect"
5. Use full DevTools

### React DevTools
Install in Chrome: [React Developer Tools extension](https://chrome.google.com/webstore/detail/react-developer-tools/)

---

## Troubleshooting

### Problem: App can't connect to dev server

**Cause:** Device/emulator not on same network

**Solution:**
1. Check your IP: `hostname -I`
2. Update `capacitor.config.ts`
3. Run: `npx cap sync android`
4. Rebuild APK: `./gradlew installDebug`

### Problem: "Connection refused" error

**Cause:** Dev server not running

**Solution:**
```bash
# Terminal 1:
npm run dev

# Then in Terminal 2:
cd android
./gradlew installDebug
```

### Problem: Changes not appearing

**Cause:** Using wrong IP or cleartext not enabled

**Solution:**
- Verify IP in `capacitor.config.ts`
- Ensure `cleartext: true` is set
- Check: `adb logcat | grep "192.168"`

### Problem: Emulator can't reach dev server

**Cause:** Emulator networking issue

**Solution (Android Emulator):**
```bash
# Use special IP for emulator
adb reverse tcp:5173 tcp:5173

# Then use localhost in config
url: 'http://localhost:5173'
```

---

## Network Configurations

### For Real Android Device

Use your machine's local IP:
```
url: 'http://192.168.1.100:5173'
```

Requirements:
- Phone and computer on same WiFi
- Firewall allows port 5173
- Port 5173 not blocked by ISP

### For Android Emulator

Option 1: Use special IP
```
url: 'http://10.0.2.2:5173'
```

Option 2: Use port forwarding
```bash
adb reverse tcp:5173 tcp:5173
url: 'http://localhost:5173'
```

---

## Performance Tips

1. **Close unused apps** on device for faster reloads
2. **Use debug APK** (faster builds than release)
3. **Monitor battery** - active dev uses more power
4. **Test on real device** - emulator slower than actual phone

---

## Switching Between Modes

### Live Reload → Production Build
```bash
# Update config back to web/dist
capacitor.config.ts: {
  webDir: 'dist',
  // Remove server config
}

# Rebuild
npm run build
npx cap sync android
./gradlew assembleRelease
```

### Production → Live Reload
```bash
# Add server config back
capacitor.config.ts: {
  server: {
    url: 'http://192.168.1.100:5173',
    cleartext: true,
  }
}

npx cap sync android
npm run dev
./gradlew installDebug
```

---

## Advanced: Capacitor Live Reload Plugin

For even faster development without rebuilding APK:

```bash
npm install @capacitor/live-reload
npx cap sync
```

Then in your app startup:
```typescript
import { LiveReload } from '@capacitor/live-reload';

const startLiveReload = () => {
  LiveReload.restart();
};
```

---

## Example Workflow

### Scenario: Fix a typo in AIChat component

```bash
# Terminal 1: Dev server running
npm run dev

# Terminal 2: App running on device
cd android
./gradlew installDebug

# Step 1: Open file
code src/components/AIChat.tsx

# Step 2: Fix typo (e.g., "Chatt" → "Chat")
# Ctrl+S to save

# Step 3: Look at device
# App auto-reloads in ~1 second
# Typo fixed!

# Step 4: Continue developing
# No rebuilds needed
```

---

## Keyboard Shortcuts (On Device)

While app is running with live reload:

- **Tap status bar multiple times** → Open dev menu
- **Shake device** → Developer menu (on some devices)
- **Long press reload button** → Force reload

---

## CI/CD Integration

For automated testing with live reload:

```bash
#!/bin/bash
npm run build
npx cap sync android
cd android
./gradlew connectedAndroidTest  # Run tests on device
```

---

## Next Steps

1. Run: `./setup-dev.sh`
2. Start dev server: `npm run dev`
3. Install on device: `./gradlew installDebug`
4. Edit code and watch changes appear!

---

## Resources

- [Capacitor Live Reload Docs](https://capacitorjs.com/docs/guides/live-reload)
- [Vite Dev Server](https://vitejs.dev/guide/)
- [Android Studio Emulator](https://developer.android.com/studio/run/emulator)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

**Pro Tip:** Hot reloading makes mobile development as fast as web development!
