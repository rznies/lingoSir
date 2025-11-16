#!/usr/bin/env node

/**
 * CLI Translation Test Script
 *
 * Tests Lingo CLI integration by translating a sample caption
 * to multiple languages and displaying results.
 */

import { createCliTranslator } from "./src/cli-translator.js";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.LINGODOTDEV_API_KEY;
const SAMPLE_CAPTION = process.argv[2] || "When you finally understand the codebase";
const LANGUAGES = process.argv.slice(3);

const DEFAULT_LANGUAGES = ["es", "fr", "ja"];

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("  Lingo CLI Translation Test");
  console.log("=".repeat(60));

  // Check API key
  if (!API_KEY) {
    console.error("\n❌ ERROR: LINGODOTDEV_API_KEY not set in .env file");
    console.log("\nPlease configure your API key:");
    console.log("  1. Copy .env.example to .env");
    console.log("  2. Add your API key from https://lingo.dev/dashboard");
    process.exit(1);
  }

  console.log(`\n✓ API Key: ${API_KEY.substring(0, 10)}...`);

  // Create translator
  const translator = createCliTranslator(API_KEY);

  // Check CLI availability
  console.log("\n📋 Checking CLI availability...");
  const isAvailable = await translator.checkCliAvailability();

  if (!isAvailable) {
    console.log("\n⚠️  WARNING: Lingo CLI not found or not working");
    console.log("The CLI will be auto-installed via npx on first use.");
    console.log("Proceeding with translation test...\n");
  } else {
    console.log("✓ Lingo CLI is available\n");
  }

  // Prepare translation
  const targetLanguages = LANGUAGES.length > 0 ? LANGUAGES : DEFAULT_LANGUAGES;

  console.log(`📝 Caption: "${SAMPLE_CAPTION}"`);
  console.log(`🌍 Target languages: ${targetLanguages.join(", ")}`);
  console.log(`⚙️  Batch size: 3`);
  console.log(`⚙️  Concurrent: true`);
  console.log("\n" + "=".repeat(60));
  console.log("  Starting Translation...");
  console.log("=".repeat(60) + "\n");

  try {
    const startTime = Date.now();

    // Translate
    const results = await translator.translateToMultipleLanguages(
      SAMPLE_CAPTION,
      targetLanguages,
      {
        batchSize: 3,
        useConcurrent: true
      }
    );

    const duration = Date.now() - startTime;

    // Display results
    console.log("\n" + "=".repeat(60));
    console.log("  Translation Results");
    console.log("=".repeat(60) + "\n");

    results.forEach((result, index) => {
      const langName = LANGUAGE_NAMES[result.lang] || result.lang.toUpperCase();
      console.log(`${index + 1}. ${langName} (${result.lang}):`);
      console.log(`   "${result.text}"\n`);
    });

    console.log("=".repeat(60));
    console.log(`✓ Successfully translated to ${results.length}/${targetLanguages.length} language(s)`);
    console.log(`✓ Total time: ${duration}ms (~${Math.round(duration / results.length)}ms per language)`);
    console.log("=".repeat(60) + "\n");

  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("  ❌ Translation Failed");
    console.error("=".repeat(60));
    console.error(`\nError: ${error.message}`);
    console.error("\nStack trace:");
    console.error(error.stack);
    console.error("\n" + "=".repeat(60) + "\n");
    process.exit(1);
  }
}

const LANGUAGE_NAMES = {
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
  ru: "Russian",
  tr: "Turkish",
};

// Run
main().catch(error => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
