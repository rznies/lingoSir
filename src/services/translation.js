/**
 * Translation service using Lingo.dev API
 *
 * This service communicates with the backend API (server.js) which uses
 * the Lingo.dev SDK to translate captions to multiple languages.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Translate caption to multiple languages using Lingo.dev
 * @param {string} caption - English caption to translate
 * @param {string[]} languages - Array of target language codes (ISO 639-1)
 * @returns {Promise<Array<{lang: string, text: string}>>} Array of translations
 * @throws {Error} If translation fails
 */
export async function translateToMultipleLanguages(caption, languages) {
  if (!caption || typeof caption !== "string") {
    throw new Error("Caption must be a non-empty string");
  }

  if (!languages || !Array.isArray(languages) || languages.length === 0) {
    throw new Error("Languages must be a non-empty array");
  }

  try {
    console.log(`Translating to ${languages.length} language(s):`, languages);

    const response = await fetch(`${API_BASE_URL}/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caption,
        languages,
      }),
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Specific error handling based on status code
      switch (response.status) {
        case 400:
          throw new Error(
            errorData.message || "Invalid request: Check caption and language codes"
          );
        case 401:
          throw new Error(
            "Authentication failed: Please configure LINGODOTDEV_API_KEY in .env file"
          );
        case 429:
          throw new Error(
            "Rate limit exceeded: Please wait a moment and try again"
          );
        case 500:
          throw new Error(
            errorData.message || "Translation service error: Please try again later"
          );
        case 503:
          throw new Error(
            "Translation service unavailable: The backend server may not be running"
          );
        default:
          throw new Error(
            errorData.message || `HTTP error ${response.status}: Translation failed`
          );
      }
    }

    const data = await response.json();

    // Validate response structure
    if (!data.success || !Array.isArray(data.translations)) {
      throw new Error("Invalid response format from translation service");
    }

    console.log(`Translation successful: ${data.translations.length} translations received`);
    return data.translations;

  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to translation service. Make sure the backend server is running on " +
        API_BASE_URL
      );
    }

    // Re-throw other errors with additional context
    if (error.message) {
      throw error;
    }

    throw new Error("An unexpected error occurred during translation");
  }
}

/**
 * Check if the translation service is available
 * @returns {Promise<boolean>} True if service is available
 */
export async function checkTranslationServiceHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Translation service health check failed:", error);
    return false;
  }
}

/**
 * Get list of supported languages
 * @returns {Promise<string[]>} Array of supported language codes
 */
export async function getSupportedLanguages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/languages`);

    if (!response.ok) {
      throw new Error("Failed to fetch supported languages");
    }

    const data = await response.json();
    return data.supported || [];
  } catch (error) {
    console.error("Failed to get supported languages:", error);

    // Fallback to hardcoded list
    return [
      "es", // Spanish
      "fr", // French
      "de", // German
      "it", // Italian
      "pt", // Portuguese
      "ja", // Japanese
      "ko", // Korean
      "zh", // Chinese
      "ar", // Arabic
      "hi", // Hindi
      "ru", // Russian
      "tr", // Turkish
    ];
  }
}

/**
 * Retry translation with exponential backoff
 * @param {string} caption - Caption to translate
 * @param {string[]} languages - Target languages
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @returns {Promise<Array<{lang: string, text: string}>>}
 */
export async function translateWithRetry(caption, languages, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await translateToMultipleLanguages(caption, languages);
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.message.includes("400") || error.message.includes("401")) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}
