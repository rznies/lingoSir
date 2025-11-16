import { useEffect, useRef, useState, createRef } from "react"
import { useNavigate } from "react-router-dom"

import { Badge } from "@/components/design/Badge"
import { Button } from "@/components/design/Button"
import { Card } from "@/components/design/Card"
import { MemeCanvas } from "@/components/MemeCanvas"

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

const LANGUAGE_FLAGS = {
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  it: "🇮🇹",
  pt: "🇵🇹",
  ja: "🇯🇵",
  ko: "🇰🇷",
  zh: "🇨🇳",
  ar: "🇸🇦",
  hi: "🇮🇳",
  ru: "🇷🇺",
  tr: "🇹🇷",
};

export function Results() {
  const navigate = useNavigate()
  const [memeData, setMemeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [downloadingLang, setDownloadingLang] = useState(null)
  const canvasRefs = useRef({})

  useEffect(() => {
    const storedData = sessionStorage.getItem("memeData")
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setMemeData(data)

        if (data.translations) {
          data.translations.forEach((translation) => {
            if (!canvasRefs.current[translation.lang]) {
              canvasRefs.current[translation.lang] = createRef()
            }
          })
        }
      } catch (error) {
        console.error("Failed to parse meme data:", error)
        navigate("/create")
      } finally {
        setTimeout(() => setIsLoading(false), 500)
      }
    } else {
      navigate("/create")
    }
  }, [navigate])

  const handleDownload = async (langCode) => {
    const canvasRef = canvasRefs.current[langCode]
    if (!canvasRef || !canvasRef.current) return

    setDownloadingLang(langCode)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const filename = `meme-${langCode}-${Date.now()}.png`
      canvasRef.current.download(filename)
    } finally {
      setDownloadingLang(null)
    }
  }

  const handleShare = async (langCode) => {
    const canvasRef = canvasRefs.current[langCode]
    if (!canvasRef || !canvasRef.current) return

    try {
      const dataUrl = canvasRef.current.getDataUrl()
      if (!dataUrl) return

      const response = await fetch(dataUrl)
      const blob = await response.blob()

      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `meme-${langCode}.png`, {
          type: "image/png",
        })

        const shareData = {
          title: "Translated Meme",
          text: `Check out this meme in ${LANGUAGE_NAMES[langCode]}!`,
          files: [file],
        }

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData)
          return
        }
      }

      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ])
        alert("Meme copied to clipboard!")
      } else {
        alert("Sharing not supported on this browser. Use the Download button instead.")
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share failed:", error)
        alert("Failed to share. Try downloading instead.")
      }
    }
  }

  const handleDownloadAll = async () => {
    if (!memeData?.translations) return

    for (const translation of memeData.translations) {
      await handleDownload(translation.lang)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  const handleCreateNew = () => {
    sessionStorage.removeItem("memeData")
    navigate("/create")
  }

  if (!memeData && !isLoading) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8] p-10">
        <div className="flex max-w-4xl flex-col gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 animate-pulse border-4 border-black bg-white shadow-[8px_8px_0px_0px_#111]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#111]">
      <div className="border-b-4 border-black bg-white">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge color="bg-[#F8D300]" textColor="text-black">
              Results Overview
            </Badge>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
              Your translated memes are ready
            </h1>
            <p className="mt-2 max-w-2xl text-base sm:text-lg font-semibold">
              Generated {memeData.translations?.length || 0} translation
              {memeData.translations?.length !== 1 ? "s" : ""} for “{memeData.caption}”.
            </p>
            {memeData.metadata ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <Badge color="bg-[#E60023]">{Math.round(memeData.metadata.duration / 1000)}s total</Badge>
                <Badge color="bg-[#004B8D]">
                  ~{Math.round(memeData.metadata.duration / memeData.metadata.languageCount)}ms per language
                </Badge>
                <Badge color="bg-black">{memeData.metadata.languageCount} variations</Badge>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" className="px-6 py-3" onClick={handleDownloadAll}>
              Download All
            </Button>
            <Button className="px-6 py-3" onClick={handleCreateNew}>
              Create New Meme
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="mb-6 text-xl sm:text-2xl font-black uppercase tracking-tight">International lineup</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {memeData.translations?.map((translation) => (
                <Card key={translation.lang} className="bg-white">
                  <div className="flex items-center justify-between border-b-4 border-black pb-4">
                    <div className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-black uppercase">
                      <span className="text-xl sm:text-2xl">{LANGUAGE_FLAGS[translation.lang]}</span>
                      <span className="truncate">{LANGUAGE_NAMES[translation.lang]}</span>
                    </div>
                    <Badge color="bg-[#F8D300]" textColor="text-black">
                      Ready
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold uppercase text-gray-600">Caption</p>
                  <p className="mt-1 line-clamp-2 text-base font-semibold">{translation.text}</p>
                  <div className="mt-4 border-4 border-black bg-[#f3f3f3] p-2">
                    <MemeCanvas
                      ref={canvasRefs.current[translation.lang]}
                      imageUrl={memeData.file}
                      caption={translation.text}
                      width={500}
                      height={500}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex-1 px-4 py-2 text-sm"
                      onClick={() => handleDownload(translation.lang)}
                      disabled={downloadingLang === translation.lang}
                    >
                      {downloadingLang === translation.lang ? "Downloading..." : "Download"}
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1 px-4 py-2 text-sm"
                      onClick={() => handleShare(translation.lang)}
                    >
                      Share
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="bg-white">
              <h2 className="text-xl sm:text-2xl font-black uppercase">Original meme</h2>
              <p className="mt-2 text-sm font-semibold text-gray-600">English (source)</p>
              <p className="mt-2 text-sm sm:text-base font-semibold">{memeData.caption}</p>
              <div className="mt-4 border-4 border-black bg-[#f3f3f3] p-2">
                <img src={memeData.file} alt="Original meme" className="w-full" />
              </div>
            </Card>

            <Card className="bg-white">
              <h3 className="text-lg sm:text-xl font-black uppercase">Team highlights</h3>
              <ul className="mt-4 space-y-3 text-sm font-semibold">
                <li>• Share download links directly with regional partners.</li>
                <li>• Use “Share” to copy assets into social schedulers instantly.</li>
                <li>• Track translation speed to showcase production wins.</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
