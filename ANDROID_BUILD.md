# Android Build Guide for Seleste NanoSphere

This document explains how to build and deploy your Seleste NanoSphere application as an Android application.

## Project Structure

Your app has been configured with **Capacitor**, which allows you to run your React web application as a native Android app. The setup includes:

```
SELESTE-NANOSPHERE-NEXUS/
├── capacitor.config.ts          # Capacitor configuration
├── package.json                 # Dependencies (includes Capacitor)
├── dist/                        # Built web assets
├── android/                     # Native Android project
│   ├── app/                     # Main Android app module
│   ├── gradle/                  # Gradle configuration
│   ├── gradlew                  # Gradle wrapper script
│   └── build.gradle             # Build configuration
└── components/                  # React components
```

## Prerequisites

To build the Android app, you need:

1. **Java Development Kit (JDK)** - Version 11 or higher
   - Check: `java -version`
   - Installed: ✅ OpenJDK 21.0.10

2. **Android SDK** - To be configured via Android Studio or SDKManager
   - Minimum API Level: 24
   - Target API Level: 34

3. **Android Studio** (Optional but recommended)
   - Download: https://developer.android.com/studio

4. **Node.js & npm** - Already installed
   - Check: `node -v && npm -v`

## Build Steps

### 1. Ensure Web Assets Are Built

```bash
npm run build
```

This creates optimized web assets in the `dist/` directory.

### 2. Sync Web Assets to Android

```bash
npx cap sync
```

This copies your web assets to the Android project.

### 3. Build Debug APK (for testing)

```bash
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### 4. Build Release APK (for distribution)

You'll need a signing key first. To create one:

```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

Then build:

```bash
cd android
./gradlew assembleRelease \
  -Pandroid.injected.signing.store.file=../my-release-key.jks \
  -Pandroid.injected.signing.store.password=YOUR_PASSWORD \
  -Pandroid.injected.signing.key.alias=my-key-alias \
  -Pandroid.injected.signing.key.password=YOUR_PASSWORD
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### 5. Build App Bundle (for Google Play Store)

```bash
cd android
./gradlew bundleRelease \
  -Pandroid.injected.signing.store.file=../my-release-key.jks \
  -Pandroid.injected.signing.store.password=YOUR_PASSWORD \
  -Pandroid.injected.signing.key.alias=my-key-alias \
  -Pandroid.injected.signing.key.password=YOUR_PASSWORD
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Testing on Emulator/Device

### Using Android Studio

1. Open the `android/` folder as a project in Android Studio
2. Click "Run" or press `Shift+F10`
3. Select your emulator or connected device

### Using ADB (Command Line)

```bash
# List connected devices/emulators
adb devices

# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Start the app
adb shell am start -n com.seleste.nanosphere/.MainActivity

# View logs
adb logcat
```

## Configuration

### App Metadata

Edit `capacitor.config.ts` to customize:

- `appId`: `com.seleste.nanosphere` (Java package name)
- `appName`: `Seleste NanoSphere` (Display name)
- `webDir`: `dist` (Built web assets directory)

### Android-Specific Settings

Edit `android/app/build.gradle`:

- `compileSdkVersion`: Target Android SDK version
- `targetSdkVersion`: Minimum API level for Play Store
- `minSdkVersion`: Minimum API level to run on devices

Edit `android/app/src/main/AndroidManifest.xml`:

- App name, permissions, activities, etc.

## Common Issues & Solutions

### 1. Gradle Download Timeout

The first build downloads Gradle (~500MB) which can timeout on slow networks.

**Solution:**
- Use a stable internet connection
- Increase timeout: Set environment variable `org.gradle.jvmargs=-Xmx4096m`
- Pre-download: Run `./gradlew --version` to download Gradle ahead of time

### 2. Java Version Mismatch

Ensure Java 11+ is installed:

```bash
java -version
```

### 3. Android SDK Not Found

Set `ANDROID_HOME` environment variable:

```bash
export ANDROID_HOME=~/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### 4. Emulator Issues

Create an emulator in Android Studio:

```bash
sdkmanager "system-images;android-34;google_apis;arm64-v8a"
avdmanager create avd -n Pixel5 -k "system-images;android-34;google_apis;arm64-v8a" -d pixel_5
emulator -avd Pixel5
```

## Development Workflow

For faster development iterations:

1. **Make changes** to your React code
2. **Build web assets**: `npm run build`
3. **Sync to Android**: `npx cap sync`
4. **Reload in emulator**: Press `R` in Android Studio or use `adb shell input keyevent 82` to open the dev menu
5. **Rebuild when needed**: `./gradlew assembleDebug` for a new APK

## Distribution

### Google Play Store

1. Create a signing key (see step 4 above)
2. Build an App Bundle: `./gradlew bundleRelease`
3. Create a Google Play Console account
4. Upload the `.aab` file to Google Play

### Direct Distribution

1. Build a signed release APK
2. Upload to your website or app distribution platform
3. Users can install via `adb install app-release.apk` or directly from the file

## Release Notes

**Version 1.0.0** - Initial Android Release
- React 19.2.3 with TypeScript
- Google Gemini AI integration
- Full responsive design for mobile
- Capacitor integration for native features

## Resources

- [Capacitor Documentation](https://capacitorjs.com/)
- [Android Developer Guide](https://developer.android.com/)
- [Gradle Documentation](https://gradle.org/docs/)
- [Google Play Store](https://play.google.com/console)

## Next Steps

1. **Set up Android SDK** - Download Android Studio
2. **Test on emulator** - Create and test on an Android virtual device
3. **Create signing key** - For release builds
4. **Upload to Play Store** - For public distribution (optional)
5. **Monitor analytics** - Track app usage and crashes

---

**Build Status**: ✅ Android project initialized and configured
**Last Updated**: February 4, 2026
