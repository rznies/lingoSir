import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { translateToMultipleLanguages } from "@/services/translation";

const LANGUAGES = [
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
];

export function MemeUploadModal({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError(null);
    }
  };

  const handleLanguageToggle = (languageCode) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageCode)
        ? prev.filter((code) => code !== languageCode)
        : [...prev, languageCode]
    );
  };

  const selectAll = () => {
    setSelectedLanguages(LANGUAGES.map(lang => lang.code));
  };

  const clearAll = () => {
    setSelectedLanguages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setProgress(0);

    try {
      setIsLoading(true);
      setLoadingMessage(`Translating to ${selectedLanguages.length} languages...`);
      setProgress(10);

      const startTime = Date.now();

      const translations = await translateToMultipleLanguages(
        caption,
        selectedLanguages
      );

      const duration = Date.now() - startTime;
      setProgress(90);

      setLoadingMessage("Preparing results...");

      sessionStorage.setItem(
        "memeData",
        JSON.stringify({
          file: previewUrl,
          caption,
          translations,
          metadata: {
            duration,
            timestamp: new Date().toISOString(),
            languageCount: translations.length,
          },
        })
      );

      setProgress(100);

      setTimeout(() => {
        navigate("/results");
        onOpenChange(false);

        setSelectedFile(null);
        setCaption("");
        setSelectedLanguages([]);
        setPreviewUrl(null);
        setError(null);
        setProgress(0);
        setLoadingMessage("");
      }, 300);

    } catch (err) {
      console.error("Translation failed:", err);

      let errorMessage = "Failed to translate captions. ";

      if (err.message.includes("Cannot connect")) {
        errorMessage += "Backend server not running. Start it with: npm run server";
      } else if (err.message.includes("Authentication failed")) {
        errorMessage += "Configure LINGODOTDEV_API_KEY in .env file";
      } else if (err.message.includes("Rate limit")) {
        errorMessage += "Too many requests. Wait a moment and try again.";
      } else if (err.message.includes("timeout")) {
        errorMessage += "Translation took too long. Try fewer languages or use SDK mode.";
      } else {
        errorMessage += err.message || "Please try again.";
      }

      setError(errorMessage);
      setProgress(0);
      setLoadingMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = selectedFile && caption.trim() && selectedLanguages.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Translated Memes</DialogTitle>
          <DialogDescription>
            Upload a meme image, add your English caption, and select target languages.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="meme-file">Meme Image</Label>
            <Input
              id="meme-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
              disabled={isLoading}
            />
            {previewUrl && (
              <div className="mt-4 border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                <img
                  src={previewUrl}
                  alt="Meme preview"
                  className="max-h-64 mx-auto rounded"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">English Caption</Label>
            <Input
              id="caption"
              type="text"
              placeholder="Enter your meme caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={isLoading}
              maxLength={200}
            />
            <p className="text-xs text-slate-500">
              {caption.length}/200 characters
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Languages ({selectedLanguages.length} selected)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectAll}
                  disabled={isLoading}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  disabled={isLoading}
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 max-h-64 overflow-y-auto">
              {LANGUAGES.map((language) => (
                <div key={language.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={language.code}
                    checked={selectedLanguages.includes(language.code)}
                    onCheckedChange={() => handleLanguageToggle(language.code)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor={language.code}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {language.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  {loadingMessage}
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              {isLoading ? "Translating..." : "Generate Memes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
