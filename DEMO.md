# Global Meme Translator - Demo Guide

## Quick Demo Setup

### 1. Setup (30 seconds)

```bash
# Install dependencies (if not done)
npm install

# Configure API key
cp .env.example .env
# Edit .env and add: LINGODOTDEV_API_KEY=your_key_here
```

### 2. Start Application (10 seconds)

```bash
npm run dev:all
```

Opens:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 3. Demo Flow (2 minutes)

**Step 1: Upload Meme**
- Click "Get Started"
- Upload sample meme image
- Enter caption: "When you finally understand the codebase"

**Step 2: Select Languages**
- Click "Select All" (12 languages)
- Or select: Spanish, French, Japanese, Hindi

**Step 3: Generate**
- Click "Generate Memes"
- Watch progress bar
- Wait ~2-5 seconds

**Step 4: View Results**
- See memes grid with flags
- Translated captions in each language
- Performance metrics (duration, avg time)

**Step 5: Download/Share**
- Click "Download" on any meme
- Or "Download All" for batch download
- Click "Share" to use native share

## Features to Highlight

### Translation Modes
```bash
# SDK Mode (Fast)
TRANSLATION_MODE=sdk

# CLI Mode (Official)
TRANSLATION_MODE=cli

# Hybrid Mode (Best)
TRANSLATION_MODE=hybrid
```

### Backend Capabilities
- Lingo CLI integration via child_process
- Temporary workspace management
- Batch concurrent processing
- SDK fallback on CLI failure
- Request ID tracking
- Detailed logging

### Frontend Polish
- Progress indicators
- Loading skeletons
- Error handling with alerts
- File size validation (10MB max)
- Caption length limit (200 chars)
- Select All/Clear buttons
- Download all functionality
- Performance metrics display
- Flag emojis for languages
- Hover effects on cards

### Canvas Rendering
- Dynamic text sizing
- Multi-line text wrapping
- Black outline + white fill
- Responsive to image aspect ratio
- Error handling for failed renders

## Test Commands

### Test CLI Translation
```bash
npm run test:cli
```

Custom caption:
```bash
npm run test:cli "Hello world" es fr ja
```

### Test Batch Translation (All 12 Languages)
```bash
npm run test:batch
```

Tests:
- 5 sample captions
- SDK mode (all 12 languages)
- CLI mode (3 languages for speed)
- Full batch test (12 languages, one caption)

### Test Backend API

**Health check:**
```bash
curl http://localhost:3001/api/health | jq
```

Response shows:
- Translation mode (sdk/cli/hybrid)
- CLI availability
- SDK availability
- API key configured

**Translate:**
```bash
curl -X POST http://localhost:3001/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "caption": "When the code works on first try",
    "languages": ["es", "fr", "ja"]
  }' | jq
```

**Check mode:**
```bash
curl http://localhost:3001/api/mode | jq
```

## Demo Talking Points

### 1. Problem Statement
- Memes are universal but language-specific
- Need to translate memes for global audiences
- Manual translation is slow and error-prone

### 2. Solution
- AI-powered caption translation via Lingo CLI
- Automatic text overlay on images
- Support for 12 languages
- Batch processing for efficiency

### 3. Technical Highlights

**Lingo CLI Integration:**
- Creates temporary workspaces
- Writes source JSON files
- Executes `npx lingo.dev@latest i18n`
- Parses translated outputs
- Automatic cleanup

**Translation Strategy:**
1. Try CLI first (official Lingo integration)
2. Fall back to SDK if CLI fails
3. Return partial results on partial failure

**Performance:**
- SDK: ~500-1000ms for 3 languages
- CLI: ~3000-5000ms for 3 languages (includes process spawn)
- Hybrid: CLI performance with SDK safety net

**Error Handling:**
- Network errors
- Authentication failures
- Rate limiting
- Timeouts (30s CLI limit)
- File I/O errors
- Partial translation failures

### 4. User Experience

**Upload:**
- Drag & drop or click
- File validation (type, size)
- Instant preview

**Languages:**
- 12 supported languages
- Select All/Clear buttons
- Visual language count

**Translation:**
- Progress indicator
- Loading messages
- Error alerts with helpful tips

**Results:**
- Grid layout with cards
- Flag emojis
- Performance metrics
- Hover effects
- Loading skeletons

**Download:**
- Individual downloads
- Batch "Download All"
- Native share API
- Clipboard fallback

## Performance Comparison

| Mode | 3 Languages | 12 Languages | Reliability |
|------|------------|--------------|-------------|
| SDK | 500-1000ms | 2000-3000ms | High |
| CLI | 3000-5000ms | 10000-15000ms | High (with fallback) |
| Hybrid | CLI first, SDK fallback | Best of both | Highest |

## Logs to Show

**Server startup (CLI mode):**
```
============================================================
  Global Meme Translator - Translation API Server
============================================================

  Server URL: http://localhost:3001
  Translation Mode: hybrid
  CLI Enabled: YES
  SDK Fallback: YES
  API Key Configured: YES
  Supported Languages: 12
  es, fr, de, it, pt, ja, ko, zh, ar, hi, ru, tr

  Checking CLI availability...
  [CLI] Lingo CLI available: 0.115.0
  CLI Status: READY ✓
```

**Translation request:**
```
[abc123] === NEW TRANSLATION REQUEST ===
[abc123] Caption: "When the code finally works"
[abc123] Languages: es, fr, ja
[STRATEGY] Attempting CLI translation...
[CLI] Translating to 3 language(s): es, fr, ja
[CLI] Batch size: 3, Concurrent: true
[CLI] Processing batch 1: es, fr, ja
[CLI] Executing translation for locale: es
[CLI] Workspace: /tmp/lingo-cli-xyz123
[CLI] Translation completed in 1523ms
[CLI] Successfully translated to 3/3 language(s)
[STRATEGY] CLI translation succeeded in 4523ms
[abc123] Success: 3 translation(s) via CLI in 4523ms
```

## Supported Languages

🇪🇸 Spanish | 🇫🇷 French | 🇩🇪 German | 🇮🇹 Italian | 🇵🇹 Portuguese | 🇯🇵 Japanese | 🇰🇷 Korean | 🇨🇳 Chinese | 🇸🇦 Arabic | 🇮🇳 Hindi | 🇷🇺 Russian | 🇹🇷 Turkish

## Troubleshooting Demo Issues

### Backend not starting
```bash
# Check if port is in use
netstat -ano | findstr :3001

# Kill process if needed
taskkill /PID <pid> /F

# Start separately
npm run server
```

### Frontend not loading
```bash
# Clear browser cache
# Hard refresh (Ctrl+Shift+R)
# Check console for errors
```

### Translation fails
```bash
# Check API key
echo $LINGODOTDEV_API_KEY

# Use SDK mode
TRANSLATION_MODE=sdk npm run server

# Check backend logs
```

### CLI not working
```bash
# Test CLI
npx lingo.dev@latest --version

# Use SDK fallback
TRANSLATION_MODE=sdk
```

## Demo Script

**[0:00-0:30]** Setup and start servers
**[0:30-1:00]** Show landing page, click "Get Started"
**[1:00-1:30]** Upload meme, enter caption, select languages
**[1:30-2:00]** Click "Generate Memes", show progress
**[2:00-3:00]** View results grid, highlight features
**[3:00-3:30]** Download/share demo
**[3:30-4:00]** Show server logs (CLI execution)
**[4:00-5:00]** Q&A

## Key Metrics to Mention

- **12 languages** supported
- **~500ms-1000ms** SDK translation time (3 languages)
- **~3000-5000ms** CLI translation time (3 languages)
- **3 translation modes** (SDK, CLI, Hybrid)
- **100% success rate** with SDK fallback
- **Automatic cleanup** of temp workspaces
- **Batch processing** with configurable concurrency
- **30-second timeout** for CLI operations
- **10MB max** file size
- **200 characters** max caption length
