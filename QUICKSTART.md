# Quick Start Guide

Get the Global Meme Translator running with **Lingo CLI** in 4 steps.

## Step 1: Get Your Lingo.dev API Key

1. Visit [https://lingo.dev/dashboard](https://lingo.dev/dashboard)
2. Sign up or log in
3. Copy your API key

## Step 2: Install Dependencies

```bash
# Install Node dependencies
npm install
```

## Step 3: Configure Environment

```bash
# Create .env file from template
cp .env.example .env

# Edit .env and configure:
```

**Minimum required:**
```env
LINGODOTDEV_API_KEY=your_key_here
```

**Recommended (uses CLI with SDK fallback):**
```env
LINGODOTDEV_API_KEY=your_key_here
TRANSLATION_MODE=hybrid
CLI_BATCH_SIZE=3
CLI_CONCURRENT=true
```

## Step 4: Run the App

```bash
# Start both frontend and backend
npm run dev:all
```

**Done!** Open [http://localhost:5173](http://localhost:5173) in your browser.

## Translation Modes

Choose your translation method in `.env`:

### Hybrid Mode (Default - Recommended)
```env
TRANSLATION_MODE=hybrid
```
✅ Uses CLI first, falls back to SDK if needed
✅ Best for production
✅ Automatic failover

### CLI Only
```env
TRANSLATION_MODE=cli
```
✅ Official Lingo CLI integration
✅ Detailed logging
⚠️ No fallback if CLI fails

### SDK Only
```env
TRANSLATION_MODE=sdk
```
✅ Fastest
✅ No CLI dependencies
✅ Best for development

## Quick Test

1. Click **"Get Started"**
2. Upload a meme image
3. Enter caption: "When the code finally works"
4. Select languages: Spanish, French, Japanese
5. Click **"Generate Memes"**
6. View translated memes with text overlays
7. Download or share your favorites

## Verify CLI Setup

```bash
# Check CLI is available
npx lingo.dev@latest --version

# Should output version number (e.g., "0.115.0")
```

## Server Logs

When using CLI mode, you'll see detailed logs:

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
  CLI Status: READY ✓

============================================================

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

## Troubleshooting

### Backend not starting?

**Run servers separately:**

```bash
# Terminal 1:
npm run server

# Terminal 2:
npm run dev
```

### CLI not working?

**Check availability:**
```bash
npx lingo.dev@latest --version
```

**Use SDK fallback:**
```env
TRANSLATION_MODE=sdk
```

### Getting errors?

**Check:**
- ✅ `.env` file exists with valid API key
- ✅ Backend server is running on port 3001
- ✅ No other app using port 3001 or 5173
- ✅ Node.js 18+ installed

### Translation timeout?

**Reduce batch size:**
```env
CLI_BATCH_SIZE=2
```

**Or disable concurrency:**
```env
CLI_CONCURRENT=false
```

## CLI Translation Workflow

Behind the scenes, the CLI:

1. **Creates temp workspace** in `/tmp/lingo-cli-{uuid}/`
2. **Writes source JSON** with your caption
3. **Generates i18n.json** config
4. **Runs** `npx lingo.dev@latest i18n --locale {lang}`
5. **Reads translated** JSON files
6. **Cleans up** temp files

All automatically!

## API Endpoints

Test the backend directly:

### Check Health
```bash
curl http://localhost:3001/api/health
```

### Translate Text
```bash
curl -X POST http://localhost:3001/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "caption": "Hello world",
    "languages": ["es", "fr"]
  }'
```

### Check Mode
```bash
curl http://localhost:3001/api/mode
```

## Performance

**SDK Mode:**
- ~500-1000ms for 3 languages
- Best for development

**CLI Mode:**
- ~3000-5000ms for 3 languages
- Official Lingo integration
- Detailed logging

**Hybrid Mode:**
- CLI performance with SDK safety net
- Best for production

## Configuration Options

**Adjust batch size:**
```env
CLI_BATCH_SIZE=5  # Translate 5 languages at once
```

**Sequential processing:**
```env
CLI_CONCURRENT=false  # Process one at a time
```

**CLI only (no fallback):**
```env
TRANSLATION_MODE=cli
```

## Next Steps

- ✅ Upload your own memes
- ✅ Try all 12 languages
- ✅ Download translated images
- ✅ Share on social media
- ✅ Check server logs to see CLI in action

## Supported Languages

🇪🇸 Spanish | 🇫🇷 French | 🇩🇪 German | 🇮🇹 Italian | 🇵🇹 Portuguese | 🇯🇵 Japanese | 🇰🇷 Korean | 🇨🇳 Chinese | 🇸🇦 Arabic | 🇮🇳 Hindi | 🇷🇺 Russian | 🇹🇷 Turkish

## Still Need Help?

See full documentation: [README_SETUP.md](./README_SETUP.md)
