# ⚡ Real-Time Android Development - Quick Start

## Two Scripts You Now Have

### 1. `android-dev.sh` - Complete Workflow
```bash
./android-dev.sh full      # Full setup + build
./android-dev.sh build-debug   # Just build APK
./android-dev.sh install   # Install & launch
./android-dev.sh hotreload # Setup live reload
```

### 2. `setup-dev.sh` - Quick Setup
```bash
./setup-dev.sh  # Auto-configures and syncs everything
```

---

## 🚀 Start Developing in 3 Steps

### Step 1: Setup Live Reload (One Time)
```bash
./android-dev.sh hotreload
```
This detects your IP and configures the app to connect to your dev server.

### Step 2: Start Development Server
```bash
npm run dev
```
Keep this terminal open. Vite will serve your app from `http://YOUR_IP:5173`

### Step 3: Build & Run on Device
```bash
./android-dev.sh build-debug
```
Then install on device/emulator:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Now when you edit React code and save, the app automatically reloads!**

---

## Typical Workflow

### Terminal 1: Dev Server
```bash
npm run dev
```

**Output:**
```
  VITE v6.4.1  ready in 234 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
```

### Terminal 2: Build APK & Install
```bash
./android-dev.sh build-debug
adb install android/app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.seleste.nanosphere/.MainActivity
```

### Then: Edit & Watch Changes

```
📝 Edit: src/components/AIChat.tsx
💾 Save: File saves
⚡ Reload: App reloads in ~1 second
✅ See changes on device
```

---

## What Happens

1. **You save a file** in VS Code
2. **Vite recompiles** React (instant)
3. **Browser refresh** on Android device
4. **State preserved** - user input stays
5. **New code runs** - you see changes immediately

**No APK rebuild needed!**

---

## File Structure

```
Your Project/
├── npm run dev              ← Dev server (Terminal 1)
├── ./android-dev.sh build   ← Build APK (Terminal 2)
├── ANDROID_HOTRELOAD.md    ← Full hot reload guide
├── android-dev.sh          ← Main development script
├── setup-dev.sh            ← Quick setup script
└── android/                ← Native project (auto-synced)
```

---

## Troubleshooting Hot Reload

### Problem: App connects but doesn't reload
**Solution:** Check IP in `capacitor.config.ts`
```bash
# Update if needed, then:
npx cap sync android
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Problem: Can't connect to dev server
**Solution 1:** Wrong IP
```bash
hostname -I  # Check your actual IP
./android-dev.sh hotreload  # Reconfigure
```

**Solution 2:** Firewall blocking port 5173
- Allow port 5173 in firewall
- Or test on emulator with: `adb reverse tcp:5173 tcp:5173`

### Problem: Emulator can't reach dev server
**Solution:** Use special emulator IP
```bash
adb reverse tcp:5173 tcp:5173

# Then use in capacitor.config.ts:
url: 'http://localhost:5173'
```

---

## Full Command Reference

```bash
# Setup & Build
./android-dev.sh full           # Complete one-time setup
./android-dev.sh setup          # Just setup (no build)
./android-dev.sh build-debug    # Build debug APK
./android-dev.sh build-release  # Build release APK

# Install & Test
./android-dev.sh install        # Install + launch app

# Development
npm run dev                     # Start dev server
npm run build                   # Build web assets only
npx cap sync android            # Sync config to Android

# Gradle commands (in android/)
./gradlew installDebug          # Build & install debug
./gradlew assembleRelease       # Build release APK
./gradlew bundleRelease         # Build Play Store bundle
```

---

## Performance Tips

**Fast reloads:**
- Keep Vite running in background
- Use physical device (faster than emulator)
- Close other apps on device
- Use debug APK (smaller, faster)

**Debugging:**
- View logs: `adb logcat | grep Seleste`
- Chrome DevTools: chrome://inspect
- React DevTools: Install Chrome extension

---

## One More Thing: Before First Build

Make sure you have:

✅ Node.js installed (`node -v`)  
✅ npm installed (`npm -v`)  
✅ Java 11+ installed (`java -version`)  
✅ Android SDK (via Android Studio)  
✅ Emulator running or device connected  

---

## Common Commands Cheatsheet

```bash
# Check devices
adb devices

# View logs
adb logcat

# Restart app
adb shell am start -n com.seleste.nanosphere/.MainActivity

# Uninstall app
adb uninstall com.seleste.nanosphere

# Clear app data
adb shell pm clear com.seleste.nanosphere

# Check network
adb shell ping 192.168.1.100
```

---

## Real Example

### Scenario: Add a button to AIChat component

**Step 1:** Terminal 1 (keep running)
```bash
npm run dev
```

**Step 2:** Terminal 2 (one time)
```bash
./android-dev.sh build-debug
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Step 3:** Edit code
```typescript
// src/components/AIChat.tsx
<button onClick={() => alert('Hello from Android!')}>
  Tap Me
</button>
```

**Step 4:** Save
- Changes appear on device in ~1 second
- No rebuild needed!
- Click button to test

**That's it!** You're developing for Android as fast as web.

---

## Next Steps

1. `./android-dev.sh full` - One-time setup
2. `npm run dev` - Start dev server
3. Edit React code
4. Watch changes appear on Android instantly!

---

**Read more:** [ANDROID_HOTRELOAD.md](ANDROID_HOTRELOAD.md) for advanced topics
