import { useNavigate } from "react-router-dom"
import { ArrowLeft, Globe, Languages, Sparkles, Upload } from "lucide-react"

import { Badge } from "@/components/design/Badge"
import { Button } from "@/components/design/Button"
import { Card } from "@/components/design/Card"
import { LANGUAGES, useMemeGenerator } from "@/hooks/useMemeGenerator"

export function Create() {
  const navigate = useNavigate()
  const {
    caption,
    setCaption,
    previewUrl,
    selectedFile,
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
  } = useMemeGenerator({
    onSuccess: () => navigate("/results"),
  })

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#111]">
      <header className="border-b-4 border-black bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border-4 border-black bg-[#F8D300]">
              <Globe size={24} strokeWidth={3} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Studio</p>
              <p className="text-2xl font-black uppercase tracking-tight">
                Global<span className="text-[#E60023]">Meme</span>
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="gap-2 px-5 py-2 text-sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={18} strokeWidth={3} />
            Back home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 max-w-3xl space-y-4">
          <Badge color="bg-[#E60023]">Creation Studio</Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
            Launch a meme in every language.
          </h1>
          <p className="text-base sm:text-lg font-semibold text-gray-600">
            Upload once, write once, and watch LingoMeme deliver culturally fluent variations for every market.
          </p>
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-gray-600">
            <span className="flex items-center gap-2">
              <Upload size={16} strokeWidth={3} className="text-[#E60023]" />
              High-res uploads
            </span>
            <span className="flex items-center gap-2">
              <Languages size={16} strokeWidth={3} className="text-[#004B8D]" />
              12 language outputs
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={16} strokeWidth={3} className="text-[#F8D300]" />
              Tone-aware overlays
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="space-y-3">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">
                  Step 01
                </p>
                <h2 className="text-2xl font-black uppercase">Upload your meme</h2>
                <p className="text-sm font-semibold text-gray-600">
                  We support JPG, PNG, and GIF up to 10MB. Transparent overlays stay crisp across languages.
                </p>
                <label
                  htmlFor="meme-file"
                  className="flex flex-col items-center gap-4 border-4 border-dashed border-black bg-[#fefefe] px-6 py-8 text-center font-semibold uppercase tracking-wide shadow-[6px_6px_0px_0px_#111] transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Selected meme" className="max-h-64 border-4 border-black object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Upload size={36} strokeWidth={3} />
                      <span>Drop image or click to upload</span>
                    </div>
                  )}
                  <input
                    id="meme-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
                {selectedFile ? (
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Selected: {selectedFile.name}
                  </p>
                ) : null}
              </section>

              <section className="space-y-3">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">
                  Step 02
                </p>
                <h2 className="text-2xl font-black uppercase">Write the caption</h2>
                <p className="text-sm font-semibold text-gray-600">
                  Keep it sharp and under 200 characters so our overlays stay pixel-perfect.
                </p>
                <input
                  type="text"
                  placeholder="Enter your meme caption..."
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  maxLength={200}
                  disabled={isLoading}
                  className="w-full border-4 border-black bg-white px-5 py-3 font-semibold uppercase tracking-wide text-[#111] shadow-[4px_4px_0px_0px_#111] focus:outline-none"
                />
                <p className="text-xs font-semibold uppercase text-gray-500">
                  {caption.length}/200 characters
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">
                      Step 03
                    </p>
                    <h2 className="text-2xl font-black uppercase">Choose target languages</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-3 py-2 text-xs"
                      onClick={selectAll}
                      disabled={isLoading}
                    >
                      Select all
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-3 py-2 text-xs"
                      onClick={clearAll}
                      disabled={isLoading}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="grid max-h-56 grid-cols-2 gap-3 overflow-y-auto border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_#111] md:grid-cols-3">
                  {LANGUAGES.map((language) => {
                    const isSelected = selectedLanguages.includes(language.code)
                    return (
                      <button
                        key={language.code}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleLanguageToggle(language.code)}
                        className={`rounded-full border-4 border-black px-4 py-2 text-xs font-black uppercase tracking-wide transition ${
                          isSelected ? "bg-[#E60023] text-white" : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {language.name}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  {selectedLanguages.length} selected
                </p>
              </section>

              {isLoading ? (
                <Card className="border-4 border-black bg-white p-4 text-sm font-semibold shadow-[6px_6px_0px_0px_#111]">
                  <div className="flex items-center justify-between">
                    <span>{loadingMessage}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="mt-4 h-3 w-full border-2 border-black bg-gray-200">
                    <div className="h-full bg-[#E60023]" style={{ width: `${progress}%` }} />
                  </div>
                </Card>
              ) : (
                <Card className="border-4 border-black bg-white p-4 text-sm font-semibold shadow-[6px_6px_0px_0px_#111]">
                  <p className="uppercase text-gray-600">Pro tips</p>
                  <ul className="mt-3 space-y-2">
                    <li>• Use high contrast images for bold text overlays.</li>
                    <li>• Pick at least one language to unlock downloads.</li>
                    <li>• Keep emojis — we localise tone without flattening humor.</li>
                  </ul>
                </Card>
              )}

              {error ? (
                <Card className="border-4 border-black bg-[#E60023] p-4 text-sm font-bold uppercase text-white shadow-[6px_6px_0px_0px_#111]">
                  {error}
                </Card>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 px-4 py-3 text-sm"
                  onClick={() => navigate("/")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 px-4 py-3 text-sm" disabled={!isFormValid || isLoading}>
                  {isLoading ? "Translating..." : "Generate memes"}
                </Button>
              </div>
            </form>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="bg-white">
              <Badge color="bg-[#004B8D]">Live preview</Badge>
              <h2 className="mt-3 text-2xl font-black uppercase">Visual check</h2>
              <p className="text-sm font-semibold text-gray-600">
                Ensure your source image has space for translated overlays. We mirror typography on export.
              </p>
              <div className="mt-6 border-4 border-black bg-[#f3f3f3] p-2">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview meme" className="w-full border-2 border-black" />
                ) : (
                  <div className="flex aspect-video items-center justify-center border-2 border-dashed border-black bg-white text-center text-sm font-semibold uppercase text-gray-500">
                    Meme preview appears here once you upload
                  </div>
                )}
              </div>
            </Card>

            <Card className="bg-white">
              <h3 className="text-xl font-black uppercase">Launch checklist</h3>
              <ul className="mt-4 space-y-3 text-sm font-semibold text-gray-600">
                <li>• Confirm caption tone before hitting generate.</li>
                <li>• Preview translations on the results page and download per locale.</li>
                <li>• Use “Download all” in results for campaign drops.</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
