#!/usr/bin/env node

import { LingoDotDevEngine } from "lingo.dev/sdk";
import { createCliTranslator } from "./src/cli-translator.js";
import dotenv from "dotenv";

dotenv.config();

const SAMPLE_CAPTIONS = [
  "When you finally understand the codebase",
  "Me debugging at 3 AM",
  "That feeling when the code works on first try",
  "When the documentation is outdated",
  "Stackoverflow saving my project again"
];

const ALL_LANGUAGES = ["es", "fr", "de", "it", "pt", "ja", "ko", "zh", "ar", "hi", "ru", "tr"];

async function testSDK() {
  console.log("\n" + "=".repeat(80));
  console.log("  SDK TRANSLATION TEST");
  console.log("=".repeat(80));

  const sdk = new LingoDotDevEngine({ apiKey: process.env.LINGODOTDEV_API_KEY });

  for (const [index, caption] of SAMPLE_CAPTIONS.entries()) {
    console.log(`\n[${index + 1}/${SAMPLE_CAPTIONS.length}] Testing: "${caption}"`);
    console.log(`Languages: ${ALL_LANGUAGES.join(", ")}`);

    const startTime = Date.now();

    try {
      const results = await sdk.batchLocalizeText(caption, {
        sourceLocale: "en",
        targetLocales: ALL_LANGUAGES,
      });

      const duration = Date.now() - startTime;

      console.log(`✓ Success: ${results.length}/${ALL_LANGUAGES.length} translations in ${duration}ms`);
      console.log(`  Average: ${Math.round(duration / results.length)}ms per language`);

      results.slice(0, 3).forEach((text, i) => {
        console.log(`  ${ALL_LANGUAGES[i]}: "${text.substring(0, 60)}${text.length > 60 ? '...' : ''}"`);
      });

    } catch (error) {
      console.error(`✗ Failed: ${error.message}`);
    }
  }
}

async function testCLI() {
  console.log("\n" + "=".repeat(80));
  console.log("  CLI TRANSLATION TEST");
  console.log("=".repeat(80));

  const cli = createCliTranslator(process.env.LINGODOTDEV_API_KEY);

  const isAvailable = await cli.checkCliAvailability();
  console.log(`CLI Available: ${isAvailable ? "YES" : "NO"}`);

  if (!isAvailable) {
    console.log("Skipping CLI tests - CLI not available");
    return;
  }

  for (const [index, caption] of SAMPLE_CAPTIONS.entries()) {
    console.log(`\n[${index + 1}/${SAMPLE_CAPTIONS.length}] Testing: "${caption}"`);
    console.log(`Languages: ${ALL_LANGUAGES.slice(0, 3).join(", ")} (testing 3 for speed)`);

    const startTime = Date.now();

    try {
      const results = await cli.translateToMultipleLanguages(
        caption,
        ALL_LANGUAGES.slice(0, 3),
        { batchSize: 3, useConcurrent: true }
      );

      const duration = Date.now() - startTime;

      console.log(`✓ Success: ${results.length}/3 translations in ${duration}ms`);
      console.log(`  Average: ${Math.round(duration / results.length)}ms per language`);

      results.forEach(({ lang, text }) => {
        console.log(`  ${lang}: "${text.substring(0, 60)}${text.length > 60 ? '...' : ''}"`);
      });

    } catch (error) {
      console.error(`✗ Failed: ${error.message}`);
    }
  }
}

async function testFullBatch() {
  console.log("\n" + "=".repeat(80));
  console.log("  FULL BATCH TEST (12 Languages, SDK Mode)");
  console.log("=".repeat(80));

  const sdk = new LingoDotDevEngine({ apiKey: process.env.LINGODOTDEV_API_KEY });
  const caption = SAMPLE_CAPTIONS[0];

  console.log(`\nCaption: "${caption}"`);
  console.log(`Languages: ALL (${ALL_LANGUAGES.length})`);

  const startTime = Date.now();

  try {
    const results = await sdk.batchLocalizeText(caption, {
      sourceLocale: "en",
      targetLocales: ALL_LANGUAGES,
    });

    const duration = Date.now() - startTime;

    console.log(`\n✓ Success: ${results.length}/${ALL_LANGUAGES.length} translations`);
    console.log(`  Total time: ${duration}ms`);
    console.log(`  Average: ${Math.round(duration / results.length)}ms per language`);

    console.log("\nAll Translations:");
    results.forEach((text, i) => {
      console.log(`  ${ALL_LANGUAGES[i].toUpperCase().padEnd(4)} | ${text}`);
    });

  } catch (error) {
    console.error(`✗ Failed: ${error.message}`);
  }
}

async function main() {
  if (!process.env.LINGODOTDEV_API_KEY) {
    console.error("ERROR: LINGODOTDEV_API_KEY not set");
    process.exit(1);
  }

  console.log("\n" + "=".repeat(80));
  console.log("  GLOBAL MEME TRANSLATOR - BATCH TRANSLATION TEST");
  console.log("=".repeat(80));
  console.log(`  API Key: ${process.env.LINGODOTDEV_API_KEY.substring(0, 10)}...`);
  console.log(`  Sample Captions: ${SAMPLE_CAPTIONS.length}`);
  console.log(`  Target Languages: ${ALL_LANGUAGES.length}`);
  console.log("=".repeat(80));

  try {
    await testSDK();
    await testCLI();
    await testFullBatch();

    console.log("\n" + "=".repeat(80));
    console.log("  ALL TESTS COMPLETED");
    console.log("=".repeat(80) + "\n");

  } catch (error) {
    console.error("\n" + "=".repeat(80));
    console.error("  TEST FAILED");
    console.error("=".repeat(80));
    console.error(error);
    process.exit(1);
  }
}

main();
