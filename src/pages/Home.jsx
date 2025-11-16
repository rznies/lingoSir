import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MemeUploadModal } from "@/components/MemeUploadModal";

export function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Global Meme Translator
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Break language barriers with memes. Upload your meme, add an English caption,
              and instantly get translated versions in multiple languages.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-500">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                <span>Multiple Languages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span>Instant Translation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                <span>Beautiful Overlays</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => setIsModalOpen(true)}
            >
              Get Started
            </Button>
          </div>

          <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-3xl mb-3">📤</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-50">Upload Meme</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload your favorite meme image and add an English caption
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-50">Select Languages</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose from multiple languages to translate your caption
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-3xl mb-3">💾</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-50">Download & Share</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get your translated memes ready to share worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      <MemeUploadModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
