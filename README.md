# Global Meme Translator

> Translate meme captions to 12 languages using Lingo CLI and AI-powered translation.

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Lingo.dev](https://img.shields.io/badge/Lingo.dev-CLI-green)](https://lingo.dev)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey)](https://expressjs.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)](https://tailwindcss.com/)

## ✨ Features

- 🌍 **12 Languages**: Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese, Arabic, Hindi, Russian, Turkish
- ⚡ **Lingo CLI**: Official CLI integration with SDK fallback
- 🎨 **Canvas Overlay**: Dynamic text rendering with auto-sizing
- 📊 **Performance Metrics**: Track translation speed and efficiency
- 💾 **Download/Share**: Individual or batch downloads, native share support
- 🎯 **Error Handling**: Comprehensive error handling with user-friendly messages
- 🚀 **3 Modes**: SDK (fast), CLI (official), Hybrid (best)

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure API key
cp .env.example .env
# Edit .env and add: LINGODOTDEV_API_KEY=your_key_here

# 3. Start application
npm run dev:all

# 4. Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 3 steps
- **[README_SETUP.md](./README_SETUP.md)** - Complete setup guide
- **[CLI_INTEGRATION.md](./CLI_INTEGRATION.md)** - CLI integration details
- **[DEMO.md](./DEMO.md)** - Demo script and talking points
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical summary

## 🎮 Usage

### 1. Upload Meme
- Click "Get Started"
- Upload image (max 10MB)
- Enter English caption (max 200 chars)

### 2. Select Languages
- Choose from 12 languages
- Use "Select All" for batch
- Click "Generate Memes"

### 3. Download Results
- View translated memes in grid
- Download individual memes
- Or "Download All" for batch
- Share via native share API

## ⚙️ Configuration

### Translation Modes

**SDK Mode** (Fast, Development)
```env
TRANSLATION_MODE=sdk
```

**CLI Mode** (Official, Demos)
```env
TRANSLATION_MODE=cli
```

**Hybrid Mode** (Recommended, Production)
```env
TRANSLATION_MODE=hybrid
CLI_BATCH_SIZE=3
CLI_CONCURRENT=true
```

## 🧪 Testing

```bash
# Test CLI translation
npm run test:cli

# Test with custom caption
npm run test:cli "Hello world" es fr ja

# Test batch translation (5 captions, 12 languages)
npm run test:batch

# Test backend API
curl http://localhost:3001/api/health
```

## 📊 Performance

| Mode | 3 Languages | 12 Languages |
|------|-------------|--------------|
| SDK | ~500-1000ms | ~2000-3000ms |
| CLI | ~3000-5000ms | ~10000-15000ms |
| Hybrid | CLI + SDK fallback | Best reliability |

## 🏗️ Architecture

```
Frontend (React) → Backend (Express) → Translation Strategy
                                          ↓
                                   ┌──────┴──────┐
                                   ↓             ↓
                              Lingo CLI    Lingo SDK
                                   ↓             ↓
                              (Official)   (Fallback)
```

## 📦 Tech Stack

**Frontend:**
- React 18 + Vite 5
- React Router 7
- Shadcn UI + Tailwind CSS
- Canvas API

**Backend:**
- Express 5
- Lingo CLI (child_process)
- Lingo.dev SDK
- UUID, CORS, Dotenv

**Translation:**
- Lingo CLI (primary)
- Lingo.dev SDK (fallback)

## 🔧 API Endpoints

### POST /api/translate
Translate caption to multiple languages.

### GET /api/health
Check system health and configuration.

### GET /api/languages
Get list of supported languages.

### GET /api/mode
Get current translation mode info.

## 🌍 Supported Languages

🇪🇸 Spanish | 🇫🇷 French | 🇩🇪 German | 🇮🇹 Italian | 🇵🇹 Portuguese | 🇯🇵 Japanese | 🇰🇷 Korean | 🇨🇳 Chinese | 🇸🇦 Arabic | 🇮🇳 Hindi | 🇷🇺 Russian | 🇹🇷 Turkish

## 🎯 Use Cases

- **Content Creators**: Translate memes for global audiences
- **Social Media**: Create multilingual content
- **Marketing**: Localize viral content
- **Education**: Learn language through memes
- **Entertainment**: Share memes worldwide

## 🐛 Troubleshooting

**Backend not starting?**
```bash
# Run separately
npm run server  # Terminal 1
npm run dev     # Terminal 2
```

**Translation fails?**
```bash
# Use SDK mode
TRANSLATION_MODE=sdk npm run server

# Check API key
echo $LINGODOTDEV_API_KEY
```

**CLI not working?**
```bash
# Verify CLI
npx lingo.dev@latest --version

# Use SDK fallback
TRANSLATION_MODE=sdk
```

## 📝 Scripts

```bash
npm run dev           # Start frontend
npm run server        # Start backend
npm run dev:all       # Start both (recommended)
npm run test:cli      # Test CLI translation
npm run test:batch    # Test batch translation
npm run build         # Build for production
npm run lint          # Run ESLint
npm run format        # Format with Prettier
```

## 🚢 Production Deployment

1. Set environment variables
2. Configure API key
3. Use hybrid mode for reliability
4. Enable error monitoring
5. Set appropriate batch size
6. Configure CORS for your domain

```env
LINGODOTDEV_API_KEY=your_production_key
TRANSLATION_MODE=hybrid
CLI_BATCH_SIZE=3
CLI_CONCURRENT=true
PORT=3001
```

## 🤝 Contributing

This is a hackathon MVP. Contributions welcome!

## 📄 License

MIT

## 🙏 Acknowledgments

- [Lingo.dev](https://lingo.dev) for AI translation
- [Shadcn UI](https://ui.shadcn.com/) for components
- [Vite](https://vitejs.dev/) for build tooling
- [React](https://reactjs.org/) for framework

## 📞 Support

- **Documentation**: See docs folder
- **Issues**: Check server logs
- **CLI Docs**: https://lingo.dev/en/cli
- **SDK Docs**: https://docs.lingo.dev/

---

**Built with ❤️ for global meme translation**

🚀 **Status: Production Ready**
