import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Globe,
  Upload,
  Languages,
  Share2,
  Zap,
  MessageSquare,
  ArrowRight,
  Github,
  Twitter,
  Menu,
  X,
  Smile,
  Download,
} from "lucide-react"

import { Badge } from "@/components/design/Badge"
import { Button } from "@/components/design/Button"
import { Card } from "@/components/design/Card"

const DEMO_MEMES = {
  English: { text: "Waiting for Gemini 3.0? Join the hype queue.", sub: "Original" },
  Spanish: { text: "¿Esperando Gemini 3.0? Únete a la cola del hype.", sub: "Spanish translation" },
  Japanese: { text: "Gemini 3.0を待っていますか？ハイプの列に参加してください。", sub: "Japanese translation" },
  French: { text: "Vous attendez Gemini 3.0 ? Rejoignez la file d'attente du hype.", sub: "French translation" },
  German: { text: "Warten Sie auf Gemini 3.0? Reihen Sie sich in die Hype-Warteschlange ein.", sub: "German translation" },
}

const LIVE_PREVIEW_MEMES = {
  French: { top: "QUAND TU OUBLIES", bottom: "DE SAUVEGARDER" },
  German: { top: "WENN DU VERGISST", bottom: "ZU SPEICHERN" },
  Japanese: { top: "保存するのを", bottom: "忘れたとき" },
  Hindi: { top: "जब आप भूल जाते हैं", bottom: "सहेजना" },
  Spanish: { top: "CUANDO OLVIDAS", bottom: "GUARDAR" },
  Italian: { top: "QUANDO DIMENTICHI", bottom: "DI SALVARE" },
}

const JOURNEY_STEPS = [
  {
    color: "bg-[#E60023]",
    icon: Upload,
    title: "Upload Meme",
    copy: "Drop your image. We handle JPG, PNG, and GIF. The messier, the better.",
  },
  {
    color: "bg-[#F8D300]",
    icon: MessageSquare,
    title: "Add Caption",
    copy: "Type your punchline in English. Select your target languages (up to 12!).",
  },
  {
    color: "bg-[#004B8D]",
    icon: Share2,
    title: "Go Global",
    copy: "Our AI translates culture, not just words. Download and dominate the feed.",
  },
]

const BENEFITS = [
  {
    icon: Globe,
    badge: { text: "Reach", color: "bg-[#004B8D]" },
    title: "World Domination",
    copy: "Don&apos;t just trend in New York. Trend in Tokyo, Berlin, and São Paulo simultaneously.",
    tone: "bg-white",
  },
  {
    icon: Zap,
    badge: { text: "Speed", color: "bg-black" },
    title: "Faster Than Trends",
    copy: "Trends die in hours. Our Lingo engine translates in milliseconds.",
    tone: "bg-[#F8D300]",
  },
  {
    icon: Smile,
    badge: { text: "Humor", color: "bg-[#E60023]" },
    title: "Cultural Nuance",
    copy: "We don&apos;t translate word-for-word. We translate the vibe so the joke lands.",
    tone: "bg-white",
  },
]

export function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [demoLanguage, setDemoLanguage] = useState("English")
  const [livePreviewLanguage, setLivePreviewLanguage] = useState("German")
  const navigate = useNavigate()

  const handleCta = () => {
    setIsMenuOpen(false)
    navigate("/create")
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans text-[#111]">
      <nav className="sticky top-0 z-50 bg-white border-b-4 border-black">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center bg-[#F8D300] border-4 border-black">
              <Globe size={24} strokeWidth={3} />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter md:text-2xl">
              Global<span className="text-[#E60023]">Meme</span>
            </span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a href="#how-it-works" className="font-bold transition-colors hover:text-[#004B8D]">
              How it Works
            </a>
            <a href="#features" className="font-bold transition-colors hover:text-[#004B8D]">
              Features
            </a>
            <a href="#demo" className="font-bold transition-colors hover:text-[#004B8D]">
              Live Demo
            </a>
            <Button variant="primary" className="px-4 py-2 text-sm" onClick={handleCta}>
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden border-4 border-black bg-[#F8D300] p-2"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X strokeWidth={3} /> : <Menu strokeWidth={3} />}
          </button>
        </div>

        {isMenuOpen ? (
          <div className="md:hidden border-b-4 border-black bg-white p-4">
            <div className="flex flex-col gap-4">
              <a href="#how-it-works" className="text-lg font-bold" onClick={() => setIsMenuOpen(false)}>
                How it Works
              </a>
              <a href="#features" className="text-lg font-bold" onClick={() => setIsMenuOpen(false)}>
                Features
              </a>
              <a href="#demo" className="text-lg font-bold" onClick={() => setIsMenuOpen(false)}>
                Live Demo
              </a>
              <Button variant="primary" className="w-full" onClick={handleCta}>
                Get Started
              </Button>
            </div>
          </div>
        ) : null}
      </nav>

      <header className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <Badge color="bg-[#F8D300]" textColor="text-black">
              New: Lingo CLI 3.0 Integration
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              MAKE VIRAL MEMES.
              <br />
              <span className="inline-block bg-[#E60023] px-4 py-1 text-white">IN EVERY</span>
              <br />
              LANGUAGE.
            </h1>
            <p className="max-w-md border-l-4 border-[#004B8D] pl-4 text-base sm:text-lg md:text-xl font-medium text-gray-800">
              Stop limiting your humor to English. Upload one meme, get 12 perfectly translated versions instantly. The world is waiting for your jokes.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" icon={Zap} className="w-full sm:w-auto" onClick={handleCta}>
                Try It Now
              </Button>
              <Button variant="secondary" icon={ArrowRight} className="w-full sm:w-auto" onClick={() => {
                const demo = document.getElementById("demo")
                demo?.scrollIntoView({ behavior: "smooth" })
              }}>
                View Examples
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-4 text-xs sm:text-sm font-bold">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-gray-200"
                  >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm sm:text-base">Trusted by 10,000+ memelords</p>
            </div>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute -right-4 -top-4 h-32 w-32 border-4 border-black bg-[#F8D300]" />
            <div className="hidden lg:block absolute -bottom-8 -left-8 h-48 w-48 border-4 border-black bg-[#004B8D]" />
            <Card className="relative z-10 rotate-0 lg:rotate-2 bg-white transition-transform duration-500 hover:rotate-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative col-span-2 flex h-64 items-center justify-center overflow-hidden border-2 border-black bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
                    className="h-full w-full object-cover opacity-40"
                    alt="AI and stars representing Gemini"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <span className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 text-center text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase leading-tight" style={{
                    textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 3px 3px 8px rgba(0,0,0,0.9)',
                    color: '#fff'
                  }}>
                    {DEMO_MEMES[demoLanguage].text}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-between border-2 border-black bg-black px-4 py-2 text-white">
                  <span className="text-sm font-bold uppercase">Translation: {demoLanguage}</span>
                  <Languages size={16} />
                </div>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {Object.keys(DEMO_MEMES).map((language) => (
                  <button
                    key={language}
                    onClick={() => setDemoLanguage(language)}
                    className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black transition-all ${
                      demoLanguage === language ? "bg-[#E60023] text-white" : "bg-white hover:bg-gray-100"
                    }`}
                    type="button"
                  >
                    {language}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </header>

      <section id="how-it-works" className="border-y-4 border-black bg-white">
        <div className="grid divide-black md:grid-cols-3 md:divide-x-4 divide-y-4 md:divide-y-0">
          {JOURNEY_STEPS.map((step) => (
            <div
              key={step.title}
              className="group flex flex-col items-center p-12 text-center transition-colors hover:bg-[#f0f0f0]"
            >
              <div
                className={`mb-6 flex h-20 w-20 items-center justify-center border-4 border-black ${step.color} transition-transform group-hover:scale-110`}
              >
                <step.icon size={40} strokeWidth={3} className={step.color === "bg-[#F8D300]" ? "text-black" : "text-white"} />
              </div>
              <Badge color="bg-black">Step 0{JOURNEY_STEPS.indexOf(step) + 1}</Badge>
              <h3 className="mb-2 text-xl sm:text-2xl font-black uppercase">{step.title}</h3>
              <p className="text-sm sm:text-base font-medium text-gray-600">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter">
            <span className="border-b-4 sm:border-b-8 border-[#F8D300]">Why Limit</span> Your Laughter?
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl font-bold text-gray-600">
            Memes are the universal language. We just provide the dictionary.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <Card key={benefit.title} className={`hover:-translate-y-2 transition-transform ${benefit.tone}`}>
              <div className="mb-4 flex items-start justify-between">
                <benefit.icon size={32} strokeWidth={2.5} className="text-[#004B8D]" />
                <Badge color={benefit.badge.color}>{benefit.badge.text}</Badge>
              </div>
              <h3 className="mb-2 text-xl sm:text-2xl font-black uppercase">{benefit.title}</h3>
              <p className="text-sm sm:text-base font-medium">{benefit.copy}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="demo" className="border-y-4 border-white bg-black py-24 text-white">
        <div className="container mx-auto grid items-center gap-16 px-4 lg:grid-cols-2">
          <div>
            <Badge color="bg-[#E60023]">Live Preview</Badge>
            <h2 className="mt-6 mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter">
              See It In Action
            </h2>
            <p className="mb-8 text-base sm:text-lg md:text-xl font-medium text-gray-400">
              Select a target language to see how our engine adapts the context.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {["French", "German", "Japanese", "Hindi", "Spanish", "Italian"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLivePreviewLanguage(lang)}
                  className={`group flex items-center justify-between border-2 border-white p-4 text-left font-bold transition-colors hover:bg-white hover:text-black ${
                    livePreviewLanguage === lang ? "bg-white text-black" : ""
                  }`}
                  type="button"
                >
                  {lang}
                  <ArrowRight size={16} className={`transition-opacity ${livePreviewLanguage === lang ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="border-4 border-white bg-white p-2 text-black shadow-[12px_12px_0px_0px_#333] md:p-4">
            <div className="mb-4 flex items-center justify-between border-b-4 border-black pb-4">
              <span className="font-black uppercase">Result_Preview.png</span>
              <div className="flex gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-black bg-[#E60023]" />
                <div className="h-4 w-4 rounded-full border-2 border-black bg-[#F8D300]" />
              </div>
            </div>
            <div className="relative mb-4 flex aspect-video items-center justify-center overflow-hidden border-4 border-black bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=800&q=80"
                className="h-full w-full object-cover grayscale"
                alt="Meme"
              />
              <div className="absolute top-4 w-full text-center">
                <span className="inline-block transform -rotate-2 bg-black px-4 py-1 text-xl sm:text-2xl md:text-3xl font-black uppercase text-white">
                  {LIVE_PREVIEW_MEMES[livePreviewLanguage].top}
                </span>
              </div>
              <div className="absolute bottom-4 w-full text-center">
                <span className="inline-block transform rotate-1 bg-black px-4 py-1 text-xl sm:text-2xl md:text-3xl font-black uppercase text-white">
                  {LIVE_PREVIEW_MEMES[livePreviewLanguage].bottom}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="primary" icon={Download} className="flex-1 py-2 text-sm" onClick={handleCta}>
                Download
              </Button>
              <Button variant="outline" className="aspect-square border-4 border-black bg-white" onClick={handleCta}>
                <Share2 size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl border-4 border-black bg-[#F8D300] p-8 shadow-[12px_12px_0px_0px_#111] md:p-16">
          <h2 className="mb-6 text-4xl font-black uppercase tracking-tighter leading-none md:text-5xl">
            Stop Being <br />Monolingual.
          </h2>
          <p className="text-xl font-bold text-gray-900">
            Join 50,000+ creators breaking the internet in 12 different languages. It&apos;s free to start.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" icon={Globe} className="px-8 py-4 text-xl" onClick={handleCta}>
              Translate My Meme
            </Button>
            <Button variant="secondary" className="px-8 py-4 text-xl" onClick={handleCta}>
              See Pricing
            </Button>
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-wide opacity-75">
            No credit card required • Instant Generation
          </p>
        </div>
      </section>

      <footer className="bg-[#111] text-white border-t-4 border-black pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-12 grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <h4 className="mb-4 flex items-center gap-2 text-2xl font-black uppercase">
                <Globe className="text-[#F8D300]" /> GlobalMeme
              </h4>
              <p className="max-w-sm font-medium text-gray-400">
                We are a team of linguists and shitposters dedicated to making humor universal. Built with Lingo CLI and excessive caffeine.
              </p>
            </div>
            <div>
              <h5 className="mb-6 font-bold uppercase tracking-widest text-[#F8D300]">Product</h5>
              <ul className="space-y-3 font-bold text-gray-300">
                <li><button className="hover:text-white hover:underline decoration-2 underline-offset-4" onClick={handleCta}>Features</button></li>
                <li><button className="hover:text-white hover:underline decoration-2 underline-offset-4" onClick={handleCta}>Pricing</button></li>
                <li><button className="hover:text-white hover:underline decoration-2 underline-offset-4" onClick={handleCta}>API Access</button></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-6 font-bold uppercase tracking-widest text-[#004B8D]">Connect</h5>
              <ul className="space-y-3 font-bold text-gray-300">
                <li>
                  <a href="https://twitter.com" className="flex items-center gap-2 hover:text-white" target="_blank" rel="noreferrer">
                    <Twitter size={18} /> Twitter
                  </a>
                </li>
                <li>
                  <a href="https://github.com" className="flex items-center gap-2 hover:text-white" target="_blank" rel="noreferrer">
                    <Github size={18} /> GitHub
                  </a>
                </li>
                <li>
                  <button className="flex items-center gap-2 hover:text-white" onClick={handleCta}>
                    <MessageSquare size={18} /> Discord
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t-2 border-gray-800 pt-8 text-center font-bold text-gray-500 md:flex-row md:text-left">
            <p>© 2025 Global Meme Translator Inc.</p>
            <p className="text-sm">
              Built for the <span className="text-white">Global AI Hackathon</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
