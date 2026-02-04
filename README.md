
# Seleste NanoSphere Nexus

The Academic Nexus - An AI-powered educational platform with Studio, Chat, Media Lab, and more.

## 🌐 View Online

[AI Studio](https://ai.studio/apps/drive/1h0BwEz9zyIgRHMxevBH7NpQyYfDcXspP)

## 🚀 Quick Start

### Web Development

**Prerequisites:** Node.js

```bash
# 1. Install dependencies
npm install

# 2. Set Gemini API Key
# Edit .env.local and add:
# GEMINI_API_KEY=your_api_key_here

# 3. Run development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

### Android App

See [ANDROID_QUICKSTART.md](ANDROID_QUICKSTART.md) for mobile development.

**Quick commands:**
```bash
# Build debug APK
./build-android.sh debug

# Build release APK
./build-android.sh release

# Build for Play Store
./build-android.sh bundle
```

## 📁 Project Structure

```
├── src/                          # React source code
│   ├── components/               # React components
│   ├── services/                 # API services (Gemini)
│   ├── App.tsx                   # Main app
│   └── index.tsx                 # Entry point
├── android/                      # Native Android project (Capacitor)
├── dist/                         # Production build output
├── package.json                  # Dependencies & scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── ANDROID_BUILD.md             # Detailed Android guide
└── ANDROID_QUICKSTART.md        # Android quick start
```

## 🛠️ Tech Stack

- **Frontend**: React 19.2.3
- **Language**: TypeScript
- **Build Tool**: Vite
- **Mobile**: Capacitor
- **AI**: Google Gemini API
- **Mobile Build**: Gradle + Android SDK

## 📱 Features

- **AI Studio** - Interactive AI workspace
- **AI Chat** - Real-time conversations with Gemini
- **Course Detail** - Educational content management
- **Lab Report Generator** - Science report creation
- **Media Lab** - Media processing tools
- **Live Lounge** - Interactive live sessions
- **Thesis Architect** - Academic writing assistance

## 📊 Builds & Releases

### Version 1.0.0

- ✅ Web app stable
- ✅ Android support (Capacitor)
- ✅ Production builds ready

**Releases**: [GitHub Releases](https://github.com/seleste3580-dev/SELESTE-NANOSPHERE-NEXUS/releases)

## 🔧 Development

### Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

### Git Workflow

```bash
# Build and prepare for release
npm run build
npx cap sync      # Sync to Android

# Commit changes
git add .
git commit -m "message"

# Push to GitHub
git push origin main
```

## 📖 Documentation

- [Android Build Guide](ANDROID_BUILD.md) - Detailed Android setup
- [Android Quick Start](ANDROID_QUICKSTART.md) - Fast getting started
- [API Services](services/) - Gemini integration

## 🔐 Environment Variables

Create `.env.local`:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 📦 Distribution

### Web
1. Build: `npm run build`
2. Deploy `dist/` folder to hosting (Vercel, Netlify, etc.)

### Android
1. Build: `./build-android.sh release` or `bundle`
2. Sign with release key
3. Upload to [Google Play Console](https://play.google.com/console)

## 🐛 Troubleshooting

**Gemini API not working?**
- Check `.env.local` has valid API key
- Check network connectivity

**Android build fails?**
- Ensure Java 11+ is installed: `java -version`
- Set `ANDROID_HOME` environment variable
- See [ANDROID_BUILD.md](ANDROID_BUILD.md)

## 📝 License

[Your License Here]

## 👥 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and create a Pull Request

## 📞 Support

- GitHub Issues: [Report bugs](https://github.com/seleste3580-dev/SELESTE-NANOSPHERE-NEXUS/issues)
- Discussions: [Ask questions](https://github.com/seleste3580-dev/SELESTE-NANOSPHERE-NEXUS/discussions)

---

**Status**: ✅ Active Development  
**Latest Release**: [v1.0.0](https://github.com/seleste3580-dev/SELESTE-NANOSPHERE-NEXUS/releases/tag/v1.0.0)  
**Platform**: Web & Android
