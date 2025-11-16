import { exec } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { promisify } from "util";
import { tmpdir } from "os";

const execPromise = promisify(exec);

const SUPPORTED_LANGUAGES = [
  "es", "fr", "de", "it", "pt", "ja", "ko", "zh", "ar", "hi", "ru", "tr"
];

/**
 * Translate text using Lingo CLI
 */
export class LingoCliTranslator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.useSDKFallback = !process.env.USE_CLI_ONLY;
  }

  /**
   * Create temporary workspace for CLI operations
   */
  async createWorkspace() {
    const workspaceId = uuidv4();
    const workspacePath = join(tmpdir(), `lingo-cli-${workspaceId}`);
    await fs.mkdir(workspacePath, { recursive: true });
    return workspacePath;
  }

  /**
   * Clean up workspace
   */
  async cleanupWorkspace(workspacePath) {
    try {
      await fs.rm(workspacePath, { recursive: true, force: true });
    } catch (error) {
      console.warn(`Failed to cleanup workspace ${workspacePath}:`, error.message);
    }
  }

  /**
   * Create source JSON file with caption
   */
  async createSourceFile(workspacePath, caption) {
    const sourceFile = join(workspacePath, "source.en.json");
    const content = { caption };
    await fs.writeFile(sourceFile, JSON.stringify(content, null, 2));
    return sourceFile;
  }

  /**
   * Create i18n.json config file
   */
  async createConfig(workspacePath, targetLocale) {
    const configFile = join(workspacePath, "i18n.json");
    const config = {
      $schema: "https://cdn.lingo.dev/schema/v1/i18n.json",
      locale: {
        source: "en",
        targets: [targetLocale]
      },
      files: {
        "*.json": {}
      }
    };

    // Add provider config if using Lingo.dev engine
    if (this.apiKey) {
      config.provider = {
        id: "lingo.dev",
        apiKey: this.apiKey
      };
    }

    await fs.writeFile(configFile, JSON.stringify(config, null, 2));
    return configFile;
  }

  /**
   * Execute Lingo CLI command
   */
  async executeCli(workspacePath, locale) {
    const startTime = Date.now();

    console.log(`[CLI] Executing translation for locale: ${locale}`);
    console.log(`[CLI] Workspace: ${workspacePath}`);

    const env = {
      ...process.env,
      LINGODOTDEV_API_KEY: this.apiKey
    };

    try {
      const { stdout, stderr } = await execPromise(
        `npx lingo.dev@latest i18n --locale ${locale}`,
        {
          cwd: workspacePath,
          env,
          timeout: 30000 // 30 second timeout
        }
      );

      const duration = Date.now() - startTime;
      console.log(`[CLI] Translation completed in ${duration}ms`);

      if (stdout) console.log(`[CLI] stdout:`, stdout.trim());
      if (stderr) console.warn(`[CLI] stderr:`, stderr.trim());

      return { stdout, stderr, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[CLI] Execution failed after ${duration}ms:`, error.message);
      throw error;
    }
  }

  /**
   * Read translated file
   */
  async readTranslation(workspacePath, locale) {
    const translatedFile = join(workspacePath, `source.${locale}.json`);

    try {
      const content = await fs.readFile(translatedFile, "utf-8");
      const data = JSON.parse(content);
      return data.caption || null;
    } catch (error) {
      console.error(`[CLI] Failed to read translation for ${locale}:`, error.message);
      return null;
    }
  }

  /**
   * Translate caption to a single language using CLI
   */
  async translateToLanguage(caption, targetLocale) {
    let workspacePath = null;

    try {
      // Create workspace
      workspacePath = await this.createWorkspace();

      // Create source file
      await this.createSourceFile(workspacePath, caption);

      // Create config
      await this.createConfig(workspacePath, targetLocale);

      // Execute CLI
      await this.executeCli(workspacePath, targetLocale);

      // Read result
      const translatedText = await this.readTranslation(workspacePath, targetLocale);

      if (!translatedText) {
        throw new Error(`No translation output for ${targetLocale}`);
      }

      return {
        lang: targetLocale,
        text: translatedText
      };
    } finally {
      // Cleanup
      if (workspacePath) {
        await this.cleanupWorkspace(workspacePath);
      }
    }
  }

  /**
   * Translate caption to multiple languages
   * Processes languages in batches to avoid overwhelming the system
   */
  async translateToMultipleLanguages(caption, targetLocales, options = {}) {
    const { batchSize = 3, useConcurrent = true } = options;

    console.log(`[CLI] Translating to ${targetLocales.length} language(s): ${targetLocales.join(", ")}`);
    console.log(`[CLI] Batch size: ${batchSize}, Concurrent: ${useConcurrent}`);

    const results = [];
    const errors = [];

    if (useConcurrent) {
      // Process in batches concurrently
      for (let i = 0; i < targetLocales.length; i += batchSize) {
        const batch = targetLocales.slice(i, i + batchSize);
        console.log(`[CLI] Processing batch ${Math.floor(i / batchSize) + 1}: ${batch.join(", ")}`);

        const batchPromises = batch.map(locale =>
          this.translateToLanguage(caption, locale)
            .catch(error => {
              errors.push({ locale, error: error.message });
              return null;
            })
        );

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter(r => r !== null));
      }
    } else {
      // Process sequentially
      for (const locale of targetLocales) {
        try {
          const result = await this.translateToLanguage(caption, locale);
          results.push(result);
        } catch (error) {
          errors.push({ locale, error: error.message });
        }
      }
    }

    if (errors.length > 0) {
      console.warn(`[CLI] ${errors.length} translation(s) failed:`, errors);
    }

    if (results.length === 0) {
      throw new Error("All translations failed");
    }

    console.log(`[CLI] Successfully translated to ${results.length}/${targetLocales.length} language(s)`);
    return results;
  }

  /**
   * Check if CLI is available
   */
  async checkCliAvailability() {
    try {
      const { stdout } = await execPromise("npx lingo.dev@latest --version", {
        timeout: 10000
      });
      console.log(`[CLI] Lingo CLI available:`, stdout.trim());
      return true;
    } catch (error) {
      console.warn(`[CLI] Lingo CLI not available:`, error.message);
      return false;
    }
  }
}

/**
 * Create translator instance
 */
export function createCliTranslator(apiKey) {
  return new LingoCliTranslator(apiKey);
}
