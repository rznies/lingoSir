import express from "express";
import cors from "cors";
import { LingoDotDevEngine } from "lingo.dev/sdk";
import dotenv from "dotenv";
import { createCliTranslator } from "./src/cli-translator.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Translation mode configuration
const USE_CLI = process.env.TRANSLATION_MODE === "cli" || process.env.TRANSLATION_MODE === "hybrid";
const USE_SDK_FALLBACK = process.env.TRANSLATION_MODE !== "cli";

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Lingo.dev SDK (fallback)
let lingoDotDevSdk = null;
if (USE_SDK_FALLBACK) {
  lingoDotDevSdk = new LingoDotDevEngine({
    apiKey: process.env.LINGODOTDEV_API_KEY,
  });
  console.log("[INIT] SDK fallback enabled");
}

// Initialize CLI translator
let cliTranslator = null;
if (USE_CLI) {
  cliTranslator = createCliTranslator(process.env.LINGODOTDEV_API_KEY);
  console.log("[INIT] CLI translator enabled");
}

// Language code mapping (ISO 639-1)
const SUPPORTED_LANGUAGES = [
  "es", "fr", "de", "it", "pt", "ja", "ko", "zh", "ar", "hi", "ru", "tr"
];

/**
 * Translate using CLI with SDK fallback
 */
async function translateWithStrategy(caption, languages) {
  const startTime = Date.now();
  let method = "unknown";
  let results = null;

  // Try CLI first if enabled
  if (cliTranslator) {
    try {
      console.log(`[STRATEGY] Attempting CLI translation...`);
      method = "cli";

      results = await cliTranslator.translateToMultipleLanguages(
        caption,
        languages,
        {
          batchSize: parseInt(process.env.CLI_BATCH_SIZE || "3"),
          useConcurrent: process.env.CLI_CONCURRENT !== "false"
        }
      );

      const duration = Date.now() - startTime;
      console.log(`[STRATEGY] CLI translation succeeded in ${duration}ms`);
      return { results, method, duration };
    } catch (cliError) {
      console.warn(`[STRATEGY] CLI translation failed:`, cliError.message);

      if (!USE_SDK_FALLBACK) {
        throw cliError;
      }

      console.log(`[STRATEGY] Falling back to SDK...`);
    }
  }

  // Fallback to SDK
  if (lingoDotDevSdk) {
    try {
      console.log(`[STRATEGY] Attempting SDK translation...`);
      method = "sdk";

      const sdkResults = await lingoDotDevSdk.batchLocalizeText(caption, {
        sourceLocale: "en",
        targetLocales: languages,
      });

      results = sdkResults.map((text, index) => ({
        lang: languages[index],
        text: text,
      }));

      const duration = Date.now() - startTime;
      console.log(`[STRATEGY] SDK translation succeeded in ${duration}ms`);
      return { results, method, duration };
    } catch (sdkError) {
      console.error(`[STRATEGY] SDK translation failed:`, sdkError.message);
      throw sdkError;
    }
  }

  throw new Error("No translation method available");
}

/**
 * Health check endpoint
 */
app.get("/api/health", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    translationMode: process.env.TRANSLATION_MODE || "sdk",
    cliAvailable: !!cliTranslator,
    sdkAvailable: !!lingoDotDevSdk,
    apiKeyConfigured: !!process.env.LINGODOTDEV_API_KEY,
  };

  // Check CLI availability
  if (cliTranslator) {
    try {
      health.cliReady = await cliTranslator.checkCliAvailability();
    } catch (error) {
      health.cliReady = false;
      health.cliError = error.message;
    }
  }

  res.json(health);
});

/**
 * Translate text to multiple languages
 * POST /api/translate
 * Body: { caption: string, languages: string[] }
 */
app.post("/api/translate", async (req, res) => {
  const requestId = Date.now().toString(36);
  console.log(`\n[${requestId}] === NEW TRANSLATION REQUEST ===`);

  try {
    const { caption, languages } = req.body;

    // Validation
    if (!caption || typeof caption !== "string") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Caption is required and must be a string",
      });
    }

    if (!languages || !Array.isArray(languages) || languages.length === 0) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Languages must be a non-empty array",
      });
    }

    // Validate language codes
    const invalidLanguages = languages.filter(
      (lang) => !SUPPORTED_LANGUAGES.includes(lang)
    );
    if (invalidLanguages.length > 0) {
      return res.status(400).json({
        error: "Invalid language codes",
        message: `Unsupported languages: ${invalidLanguages.join(", ")}`,
        supported: SUPPORTED_LANGUAGES,
      });
    }

    console.log(`[${requestId}] Caption: "${caption}"`);
    console.log(`[${requestId}] Languages: ${languages.join(", ")}`);

    // Translate using strategy (CLI with SDK fallback)
    const { results: translations, method, duration } = await translateWithStrategy(
      caption,
      languages
    );

    console.log(`[${requestId}] Success: ${translations.length} translation(s) via ${method.toUpperCase()} in ${duration}ms`);

    res.json({
      success: true,
      originalCaption: caption,
      translations,
      metadata: {
        method,
        duration,
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(`[${requestId}] Error:`, error);

    // Handle specific error types
    if (error.message?.includes("API key")) {
      return res.status(401).json({
        error: "Authentication failed",
        message:
          "Invalid or missing LINGODOTDEV_API_KEY. Please check your environment variables.",
      });
    }

    if (error.message?.includes("rate limit")) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
      });
    }

    if (error.code === "ETIMEDOUT" || error.message?.includes("timeout")) {
      return res.status(504).json({
        error: "Translation timeout",
        message: "Translation took too long. Try fewer languages or try again.",
      });
    }

    // Generic error response
    res.status(500).json({
      error: "Translation failed",
      message: error.message || "An unexpected error occurred",
      requestId,
    });
  }
});

/**
 * Get supported languages
 * GET /api/languages
 */
app.get("/api/languages", (req, res) => {
  res.json({
    supported: SUPPORTED_LANGUAGES,
    count: SUPPORTED_LANGUAGES.length,
  });
});

/**
 * Get translation mode info
 * GET /api/mode
 */
app.get("/api/mode", (req, res) => {
  res.json({
    mode: process.env.TRANSLATION_MODE || "sdk",
    cliEnabled: USE_CLI,
    sdkFallbackEnabled: USE_SDK_FALLBACK,
    batchSize: parseInt(process.env.CLI_BATCH_SIZE || "3"),
    concurrent: process.env.CLI_CONCURRENT !== "false",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  Global Meme Translator - Translation API Server`);
  console.log(`${"=".repeat(60)}`);
  console.log(`\n  Server URL: http://localhost:${PORT}`);
  console.log(`  Translation Mode: ${process.env.TRANSLATION_MODE || "sdk (default)"}`);
  console.log(`  CLI Enabled: ${USE_CLI ? "YES" : "NO"}`);
  console.log(`  SDK Fallback: ${USE_SDK_FALLBACK ? "YES" : "NO"}`);
  console.log(`  API Key Configured: ${!!process.env.LINGODOTDEV_API_KEY ? "YES" : "NO"}`);
  console.log(`  Supported Languages: ${SUPPORTED_LANGUAGES.length}`);
  console.log(`  ${SUPPORTED_LANGUAGES.join(", ")}`);

  if (USE_CLI && cliTranslator) {
    console.log(`\n  Checking CLI availability...`);
    const cliAvailable = await cliTranslator.checkCliAvailability();
    console.log(`  CLI Status: ${cliAvailable ? "READY ✓" : "NOT AVAILABLE ✗"}`);
  }

  console.log(`\n${"=".repeat(60)}\n`);
});
