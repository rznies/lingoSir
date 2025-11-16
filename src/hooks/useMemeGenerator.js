import { useCallback, useEffect, useMemo, useState } from "react"

import { translateToMultipleLanguages } from "@/services/translation"

export const LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "ru", name: "Russian" },
  { code: "tr", name: "Turkish" },
]

export function useMemeGenerator({ onSuccess } = {}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [caption, setCaption] = useState("")
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState("")

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const reset = useCallback(() => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setCaption("")
    setSelectedLanguages([])
    setError(null)
    setProgress(0)
    setLoadingMessage("")
  }, [])

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous)
      }
      return url
    })
    setError(null)
  }, [])

  const handleLanguageToggle = useCallback((code) => {
    setSelectedLanguages((previous) =>
      previous.includes(code)
        ? previous.filter((languageCode) => languageCode !== code)
        : [...previous, code],
    )
  }, [])

  const selectAll = useCallback(() => {
    setSelectedLanguages(LANGUAGES.map((language) => language.code))
  }, [])

  const clearAll = useCallback(() => {
    setSelectedLanguages([])
  }, [])

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      setError(null)
      setProgress(0)

      try {
        setIsLoading(true)
        setLoadingMessage(`Translating to ${selectedLanguages.length} languages...`)
        setProgress(10)

        const startTime = Date.now()

        const translations = await translateToMultipleLanguages(caption, selectedLanguages)

        const duration = Date.now() - startTime
        setProgress(90)
        setLoadingMessage("Preparing results...")

        // Convert the file to base64 data URL for persistence in sessionStorage
        let fileDataUrl = previewUrl // Fallback to blob URL if conversion fails
        try {
          const reader = new FileReader()
          fileDataUrl = await new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result)
            reader.onerror = reject
            reader.readAsDataURL(selectedFile)
          })
        } catch (fileError) {
          console.warn("Failed to convert file to data URL, using blob URL as fallback:", fileError)
        }

        sessionStorage.setItem(
          "memeData",
          JSON.stringify({
            file: fileDataUrl,
            caption,
            translations,
            metadata: {
              duration,
              timestamp: new Date().toISOString(),
              languageCount: translations.length,
            },
          }),
        )

        setProgress(100)

        setTimeout(() => {
          onSuccess?.()
          reset()
        }, 300)
      } catch (err) {
        console.error("Translation failed:", err)
        let message = "Failed to translate captions. "

        if (err.message?.includes("Cannot connect")) {
          message += "Backend server not running. Start it with: npm run server"
        } else if (err.message?.includes("Authentication failed")) {
          message += "Configure LINGODOTDEV_API_KEY in .env file"
        } else if (err.message?.includes("Rate limit")) {
          message += "Too many requests. Wait a moment and try again."
        } else if (err.message?.includes("timeout")) {
          message += "Translation took too long. Try fewer languages or use SDK mode."
        } else {
          message += err.message || "Please try again."
        }

        setError(message)
        setProgress(0)
        setLoadingMessage("")
      } finally {
        setIsLoading(false)
      }
    },
    [caption, onSuccess, previewUrl, selectedFile, reset, selectedLanguages],
  )

  const isFormValid = useMemo(() => {
    return Boolean(selectedFile && caption.trim() && selectedLanguages.length > 0)
  }, [caption, selectedFile, selectedLanguages.length])

  return {
    caption,
    setCaption,
    selectedFile,
    previewUrl,
    selectedLanguages,
    isLoading,
    error,
    progress,
    loadingMessage,
    isFormValid,
    handleFileChange,
    handleLanguageToggle,
    selectAll,
    clearAll,
    handleSubmit,
  }
}
