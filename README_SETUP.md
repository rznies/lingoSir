# Global Meme Translator - Setup Guide

A hackathon MVP that translates meme captions to multiple languages using **Lingo CLI** and Lingo.dev SDK.

## Features

- Upload meme images
- Add English captions
- Translate to 12 languages simultaneously using **Lingo CLI**
- SDK fallback for development/testing
- Download translated memes
- Share functionality
- Real-time text overlay using Canvas API
- Concurrent batch processing

## Supported Languages

1. Spanish (es)
2. French (fr)
3. German (de)
4. Italian (it)
5. Portuguese (pt)
6. Japanese (ja)
7. Korean (ko)
8. Chinese (zh)
9. Arabic (ar)
10. Hindi (hi)
11. Russian (ru)
12. Turkish (tr)

## Prerequisites

- Node.js 18+ installed
- Lingo.dev API key ([Get one here](https://lingo.dev/dashboard))
- Lingo CLI (installed automatically via npx)

## Installation

### 1. Clone and Setup Project

```bash
cd React.shadcn.JS-Template
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and configure:
```

**Required:**
```env
LINGODOTDEV_API_KEY=your_api_key_here
```

**Optional (CLI Configuration):**
```env
# Translation mode: "sdk", "cli", or "hybrid" (default)
TRANSLATION_MODE=hybrid

# CLI batch size (concurrent language translations)
CLI_BATCH_SIZE=3

# Enable concurrent CLI processes
CLI_CONCURRENT=true

# Server port
PORT=3001
```

### 3. Verify Lingo CLI Installation

```bash
# Check CLI is available
npx lingo.dev@latest --version

# Authenticate (if needed)
npx lingo.dev@latest auth
```

## Translation Modes

The application supports three translation modes:

### 1. **SDK Mode** (Default)
Uses Lingo.dev JavaScript SDK for translations.

```env
TRANSLATION_MODE=sdk
```

**Pros:**
- Fast and reliable
- No CLI dependencies
- Best for development

**Cons:**
- Requires SDK dependency

### 2. **CLI Mode**
Uses Lingo CLI commands exclusively.

```env
TRANSLATION_MODE=cli
```

**Pros:**
- Official Lingo CLI integration
- File-based translation workflow
- Detailed logging

**Cons:**
- Slower (spawns processes)
- Requires CLI availability

### 3. **Hybrid Mode** (Recommended)
Tries CLI first, falls back to SDK if CLI fails.

```env
TRANSLATION_MODE=hybrid
```

**Pros:**
- Best of both worlds
- Production-ready with development fallback
- Automatic failover

**Cons:**
- Slightly more complex error handling

## Running the Application

### Option 1: Run Both Servers Concurrently (Recommended)

```bash
npm run dev:all
```

This starts:
- Frontend dev server on `http://localhost:5173`
- Backend API server on `http://localhost:3001`

### Option 2: Run Servers Separately

**Terminal 1 - Backend API:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## CLI Translation Workflow

When using CLI mode, the backend performs these steps for each translation:

### 1. Create Temporary Workspace
```bash
/tmp/lingo-cli-{uuid}/
├── source.en.json        # Source caption
├── i18n.json            # Lingo CLI config
└── source.{locale}.json # Generated translations
```

### 2. Generate Source File
```json
{
  "caption": "When you finally understand the codebase"
}
```

### 3. Create i18n.json Config
```json
{
  "$schema": "https://cdn.lingo.dev/schema/v1/i18n.json",
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "files": {
    "*.json": {}
  },
  "provider": {
    "id": "lingo.dev",
    "apiKey": "your_key"
  }
}
```

### 4. Execute CLI Command
```bash
npx lingo.dev@latest i18n --locale es
```

### 5. Parse Output
Reads `source.es.json`:
```json
{
  "caption": "Cuando finalmente entiendes el código base"
}
```

### 6. Cleanup
Removes temporary workspace.

## Architecture

### Frontend (React + Vite)
- **Home Page** (`src/pages/Home.jsx`) - Landing page
- **Upload Modal** (`src/components/MemeUploadModal.jsx`) - File upload + caption input
- **Results Page** (`src/pages/Results.jsx`) - Display translated memes
- **MemeCanvas** (`src/components/MemeCanvas.jsx`) - Canvas text overlay
- **Translation Service** (`src/services/translation.js`) - API client

### Backend (Express + Lingo CLI/SDK)
- **Server** (`server.js`) - Express API with translation strategy
- **CLI Translator** (`src/cli-translator.js`) - Lingo CLI integration

### Endpoints

#### POST /api/translate
Translate caption to multiple languages.

**Request:**
```json
{
  "caption": "When you finally understand the codebase",
  "languages": ["es", "fr", "de"]
}
```

**Response:**
```json
{
  "success": true,
  "originalCaption": "When you finally understand the codebase",
  "translations": [
    { "lang": "es", "text": "Cuando finalmente entiendes el código base" },
    { "lang": "fr", "text": "Quand vous comprenez enfin la base de code" },
    { "lang": "de", "text": "Wenn du endlich die Codebasis verstehst" }
  ],
  "metadata": {
    "method": "cli",
    "duration": 4523,
    "requestId": "abc123",
    "timestamp": "2025-11-16T10:00:00Z"
  }
}
```

#### GET /api/health
Health check with translation mode info.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-16T10:00:00Z",
  "translationMode": "hybrid",
  "cliAvailable": true,
  "sdkAvailable": true,
  "apiKeyConfigured": true,
  "cliReady": true
}
```

#### GET /api/languages
Get supported languages.

**Response:**
```json
{
  "supported": ["es", "fr", "de", "it", "pt", "ja", "ko", "zh", "ar", "hi", "ru", "tr"],
  "count": 12
}
```

#### GET /api/mode
Get current translation mode configuration.

**Response:**
```json
{
  "mode": "hybrid",
  "cliEnabled": true,
  "sdkFallbackEnabled": true,
  "batchSize": 3,
  "concurrent": true
}
```

## CLI Features

### Batch Processing
Translates multiple languages concurrently in batches:

```env
CLI_BATCH_SIZE=3  # Process 3 languages at once
```

Example: For 9 languages, creates 3 batches of 3 concurrent processes.

### Concurrent Execution
```env
CLI_CONCURRENT=true  # Parallel execution
CLI_CONCURRENT=false # Sequential execution
```

### Automatic Cleanup
Temporary workspaces are automatically cleaned up after translation.

### Error Handling

**CLI Errors:**
- Process spawn failures
- Timeout errors (30s limit)
- File I/O errors
- JSON parsing errors

**Fallback Strategy:**
- CLI fails → SDK takes over (in hybrid mode)
- Partial failures → Returns successful translations

### Logging

Server logs show detailed CLI execution:

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

## Development

### Scripts

- `npm run dev` - Start frontend dev server
- `npm run server` - Start backend API server
- `npm run dev:all` - Start both servers concurrently
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Testing CLI Directly

```bash
# Test CLI availability
npx lingo.dev@latest --version

# Create test workspace
mkdir test-translation && cd test-translation

# Create source file
echo '{"caption":"Hello world"}' > source.en.json

# Create config
cat > i18n.json << 'EOF'
{
  "$schema": "https://cdn.lingo.dev/schema/v1/i18n.json",
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "files": {
    "*.json": {}
  }
}
EOF

# Translate
LINGODOTDEV_API_KEY=your_key npx lingo.dev@latest i18n --locale es

# Check output
cat source.es.json
```

## Troubleshooting

### "CLI translation failed"

**Check CLI availability:**
```bash
npx lingo.dev@latest --version
```

**Solution:** CLI will auto-install via npx. If issues persist, use SDK mode:
```env
TRANSLATION_MODE=sdk
```

### "Cannot connect to translation service"

**Solution:** Make sure the backend server is running:
```bash
npm run server
```

### "Authentication failed"

**Solution:** Check your `.env` file has a valid `LINGODOTDEV_API_KEY`.

### "Translation timeout"

**Solutions:**
1. Reduce batch size: `CLI_BATCH_SIZE=2`
2. Disable concurrency: `CLI_CONCURRENT=false`
3. Use SDK mode: `TRANSLATION_MODE=sdk`
4. Translate fewer languages at once

### CLI Not Creating Output Files

**Check:**
1. Write permissions in temp directory
2. API key is valid
3. Source locale in config matches source file
4. Check server logs for detailed errors

## Performance Comparison

### SDK Mode
- **Speed:** Fast (~500-1000ms for 3 languages)
- **Reliability:** High
- **Overhead:** Low

### CLI Mode
- **Speed:** Moderate (~3000-5000ms for 3 languages)
- **Reliability:** High (with fallback)
- **Overhead:** Medium (process spawning, file I/O)

### Hybrid Mode (Recommended)
- **Speed:** CLI speed with SDK fallback
- **Reliability:** Highest
- **Overhead:** Medium

## Production Deployment

### Recommended Configuration

```env
TRANSLATION_MODE=hybrid
CLI_BATCH_SIZE=3
CLI_CONCURRENT=true
LINGODOTDEV_API_KEY=your_production_key
```

### Environment Requirements

- Node.js 18+
- Write access to temp directory
- Network access for npx (or pre-install lingo.dev globally)

## Tech Stack

- **Frontend:** React 18, Vite 5, React Router 7, Shadcn UI, Tailwind CSS
- **Backend:** Express 5, Lingo CLI, Lingo.dev SDK
- **Translation:** Lingo CLI (primary), Lingo.dev SDK (fallback)
- **Image Processing:** Canvas API

## License

MIT

## Support

For issues or questions:
- Check the [Lingo.dev CLI Documentation](https://lingo.dev/en/cli)
- Check the [Lingo.dev SDK Documentation](https://docs.lingo.dev/)
- Review server logs for detailed error messages
- Open an issue on GitHub
