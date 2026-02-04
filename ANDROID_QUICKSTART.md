# Android Quick Start Guide

## What's Been Done

✅ **Capacitor Installed** - React to Android bridge framework  
✅ **Android Project Created** - Native Android project structure  
✅ **Web Assets Configured** - Web app linked to Android  
✅ **Build Scripts Ready** - Automated build process  

## Quick Build Commands

### Build for Testing (Debug APK)

```bash
./build-android.sh debug
```

Or manually:

```bash
npm run build && npx cap sync
cd android && ./gradlew assembleDebug
```

**Output**: `android/app/build/outputs/apk/debug/app-debug.apk`

### Build for Distribution (Release APK)

```bash
./build-android.sh release
```

You'll be prompted to create a signing key if you don't have one.

**Output**: `android/app/build/outputs/apk/release/app-release.apk`

### Build for Play Store (App Bundle)

```bash
./build-android.sh bundle
```

**Output**: `android/app/build/outputs/bundle/release/app-release.aab`

## Testing the App

### Using Android Emulator

1. **Open in Android Studio**
   ```bash
   open -a "Android Studio" android/
   ```

2. **Create emulator** (if needed)
   - Tools → Device Manager → Create Device
   - Select Pixel 5 API 34 or similar
   - Click Play to start

3. **Run app**
   - Select emulator from device dropdown
   - Click Run (▶)

### Using Physical Android Device

1. **Enable USB Debugging** on phone
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → USB Debugging → On

2. **Connect device**
   ```bash
   adb devices
   ```

3. **Install and run**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   adb shell am start -n com.seleste.nanosphere/.MainActivity
   ```

## Installation Prerequisites

### macOS / Linux

```bash
# Install Android SDK (via Android Studio recommended)
# Or use sdkmanager from command line

# Set up environment
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Windows

```cmd
set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

## Troubleshooting

### "Gradle download timeout"

The first build downloads ~500MB of Gradle. If it times out:

```bash
cd android
./gradlew --version  # Downloads Gradle
./gradlew assembleDebug
```

### "Java version mismatch"

Check Java version:

```bash
java -version
```

Requires Java 11 or higher. Install from https://www.oracle.com/java/technologies/

### "Android SDK not found"

1. Install [Android Studio](https://developer.android.com/studio)
2. Run Android Studio at least once to set up SDK
3. Set `ANDROID_HOME` environment variable (see above)

## Project Structure

```
├── capacitor.config.ts           # Capacitor config
├── build-android.sh              # Build automation script
├── ANDROID_BUILD.md              # Detailed guide
├── package.json                  # npm dependencies
├── dist/                         # Web assets (built)
├── android/                      # Native Android project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml      # App configuration
│   │   │   ├── assets/public/           # Web assets (synced)
│   │   │   └── java/                    # Android code
│   │   └── build.gradle                 # Build settings
│   ├── gradle/                   # Gradle wrapper
│   └── gradlew                   # Gradle script
└── src/                          # React source code
```

## App Package Details

- **App ID**: `com.seleste.nanosphere`
- **App Name**: Seleste NanoSphere
- **Min API**: 24 (Android 7.0)
- **Target API**: 34 (Android 14)
- **Version**: 1.0.0

## Next Steps

1. **Install Android Studio** - Recommended for testing
2. **Create emulator or connect device**
3. **Run `./build-android.sh debug`**
4. **Test on emulator/device**
5. **When ready: `./build-android.sh release`**
6. **For Play Store: `./build-android.sh bundle`**

## Release Checklist

- [ ] Update app version in `package.json`
- [ ] Update app icon in `android/app/src/main/res/`
- [ ] Build release APK or bundle
- [ ] Test thoroughly on real device
- [ ] Create GitHub release tag
- [ ] Upload to Play Store or distribute APK

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/docs)
- [Google Play Console](https://play.google.com/console)
- [Android Studio Downloads](https://developer.android.com/studio)

---

**Status**: ✅ Ready for Android development  
**Last Updated**: February 4, 2026
