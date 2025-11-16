import { useState, useEffect, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MemeCanvas } from "@/components/MemeCanvas";

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
  const navigate = useNavigate();
  const [memeData, setMemeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingLang, setDownloadingLang] = useState(null);
  const canvasRefs = useRef({});

  useEffect(() => {
    const storedData = sessionStorage.getItem("memeData");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setMemeData(data);

        if (data.translations) {
          data.translations.forEach((translation) => {
            if (!canvasRefs.current[translation.lang]) {
              canvasRefs.current[translation.lang] = createRef();
            }
          });
        }
      } catch (error) {
        console.error("Failed to parse meme data:", error);
        navigate("/");
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleDownload = async (langCode) => {
    const canvasRef = canvasRefs.current[langCode];
    if (!canvasRef || !canvasRef.current) return;

    setDownloadingLang(langCode);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const languageName = LANGUAGE_NAMES[langCode] || langCode;
      const filename = `meme-${langCode}-${Date.now()}.png`;
      canvasRef.current.download(filename);
    } finally {
      setDownloadingLang(null);
    }
  };

  const handleShare = async (langCode) => {
    const canvasRef = canvasRefs.current[langCode];
    if (!canvasRef || !canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.getDataUrl();
      if (!dataUrl) return;

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `meme-${langCode}.png`, {
          type: "image/png",
        });

        const shareData = {
          title: "Translated Meme",
          text: `Check out this meme in ${LANGUAGE_NAMES[langCode]}!`,
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        alert("Meme copied to clipboard!");
      } else {
        alert(
          "Sharing not supported on this browser. Use the Download button instead."
        );
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Share failed:", error);
        alert("Failed to share. Try downloading instead.");
      }
    }
  };

  const handleDownloadAll = async () => {
    if (!memeData?.translations) return;

    for (const translation of memeData.translations) {
      await handleDownload(translation.lang);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleCreateNew = () => {
    sessionStorage.removeItem("memeData");
    navigate("/");
  };

  if (!memeData && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-6 w-96" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="aspect-square w-full rounded-lg" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                Your Translated Memes
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Generated {memeData.translations?.length || 0} translation
                {memeData.translations?.length !== 1 ? "s" : ""} for: "
                {memeData.caption}"
              </p>
              {memeData.metadata && (
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">
                    {Math.round(memeData.metadata.duration / 1000)}s total
                  </Badge>
                  <Badge variant="secondary">
                    ~{Math.round(memeData.metadata.duration / memeData.metadata.languageCount)}ms per language
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadAll}>
                Download All
              </Button>
              <Button onClick={handleCreateNew}>Create New Meme</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memeData.translations?.map((translation) => (
              <Card key={translation.lang} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{LANGUAGE_FLAGS[translation.lang]}</span>
                    {LANGUAGE_NAMES[translation.lang]}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {translation.text}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                    <MemeCanvas
                      ref={canvasRefs.current[translation.lang]}
                      imageUrl={memeData.file}
                      caption={translation.text}
                      width={500}
                      height={500}
                      className="rounded-lg"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDownload(translation.lang)}
                    disabled={downloadingLang === translation.lang}
                  >
                    {downloadingLang === translation.lang ? "Downloading..." : "Download"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleShare(translation.lang)}
                  >
                    Share
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Original Meme
            </h2>
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🇬🇧</span>
                  English (Original)
                </CardTitle>
                <CardDescription>{memeData.caption}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={memeData.file}
                  alt="Original meme"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
