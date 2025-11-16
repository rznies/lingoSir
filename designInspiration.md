import React, { useState, useEffect } from 'react';
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
  Check,
  Smile,
  Download
} from 'lucide-react';

// --- Design System & UI Components (Simulating Shadcn with Neo-Brutalist Theme) ---

const THEME = {
  colors: {
    red: 'bg-[#E60023]',
    blue: 'bg-[#004B8D]',
    yellow: 'bg-[#F8D300]',
    black: 'bg-[#111111]',
    white: 'bg-white',
    offWhite: 'bg-[#f8f8f8]',
  },
  border: 'border-4 border-black',
  shadow: 'shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]',
  shadowHover: 'hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all',
  text: 'font-sans text-[#111]',
};

const Button = ({ children, variant = 'primary', className = '', icon: Icon, ...props }) => {
  const baseStyles = `inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold uppercase tracking-wider ${THEME.border} ${THEME.shadow} ${THEME.shadowHover} active:translate-x-[6px] active:translate-y-[6px]`;
  
  const variants = {
    primary: 'bg-[#111] text-white hover:bg-gray-900',
    secondary: 'bg-white text-[#111] hover:bg-gray-50',
    red: 'bg-[#E60023] text-white hover:bg-red-700',
    yellow: 'bg-[#F8D300] text-black hover:bg-yellow-400',
    blue: 'bg-[#004B8D] text-white hover:bg-blue-800',
    outline: 'bg-transparent text-[#111]',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
      {Icon && <Icon size={20} strokeWidth={3} />}
    </button>
  );
};

const Card = ({ children, className = '', color = 'white' }) => (
  <div className={`${THEME.border} ${color === 'white' ? 'bg-white' : color} p-6 ${THEME.shadow} ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'bg-black', textColor = 'text-white' }) => (
  <span className={`inline-block px-3 py-1 text-xs font-black uppercase tracking-widest ${color} ${textColor} border-2 border-black mb-2`}>
    {children}
  </span>
);

// --- Main Application Component ---

const GlobalMemeTranslator = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [demoLanguage, setDemoLanguage] = useState('Spanish');
  
  const demoMemes = {
    Spanish: { text: "Cuando el código compila a la primera", sub: "When code compiles on first try" },
    Japanese: { text: "コードが一回でコンパイルされた時", sub: "When code compiles on first try" },
    French: { text: "Quand le code compile du premier coup", sub: "When code compiles on first try" },
    German: { text: "Wenn der Code beim ersten Versuch kompiliert", sub: "When code compiles on first try" },
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#111] font-sans selection:bg-[#F8D300] selection:text-black">
      
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 bg-white ${THEME.border} border-t-0 border-x-0`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#F8D300] border-4 border-black flex items-center justify-center">
              <Globe size={24} strokeWidth={3} />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">
              Global<span className="text-[#E60023]">Meme</span>
            </span>
          </div>
          
          <div className="hidden md:flex gap-6 items-center">
            <a href="#how-it-works" className="font-bold hover:text-[#004B8D] transition-colors">How it Works</a>
            <a href="#features" className="font-bold hover:text-[#004B8D] transition-colors">Features</a>
            <a href="#demo" className="font-bold hover:text-[#004B8D] transition-colors">Live Demo</a>
            <Button variant="primary" className="px-4 py-2 text-sm">Get Started</Button>
          </div>

          <button className="md:hidden p-2 border-4 border-black bg-[#F8D300]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X strokeWidth={3} /> : <Menu strokeWidth={3} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b-4 border-black p-4 flex flex-col gap-4">
            <a href="#how-it-works" className="font-bold text-lg" onClick={() => setIsMenuOpen(false)}>How it Works</a>
            <a href="#features" className="font-bold text-lg" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#demo" className="font-bold text-lg" onClick={() => setIsMenuOpen(false)}>Live Demo</a>
            <Button variant="primary" className="w-full">Get Started</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge color="bg-[#F8D300]" textColor="text-black">New: Lingo CLI 3.0 Integration</Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
              MAKE VIRAL MEMES. <br />
              <span className="bg-[#E60023] text-white px-2">IN EVERY</span> <br />
              LANGUAGE.
            </h1>
            <p className="text-xl font-medium text-gray-800 max-w-md leading-relaxed border-l-4 border-[#004B8D] pl-4">
              Stop limiting your humor to English. Upload one meme, get 12 perfectly translated versions instantly. The world is waiting for your jokes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" icon={Zap} className="w-full sm:w-auto">
                Try It Now
              </Button>
              <Button variant="secondary" icon={ArrowRight} className="w-full sm:w-auto">
                View Examples
              </Button>
            </div>
            <div className="flex gap-4 text-sm font-bold items-center pt-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-black flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p>Trusted by 10,000+ memelords</p>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            {/* Abstract De Stijl Background Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#F8D300] border-4 border-black z-0"></div>
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#004B8D] border-4 border-black z-0"></div>
            
            {/* Main Visual Container */}
            <Card className="relative z-10 bg-white rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-gray-100 border-2 border-black h-48 flex items-center justify-center overflow-hidden relative">
                   <img src="https://images.unsplash.com/photo-1531259683007-016a7b622ced?auto=format&fit=crop&w=800&q=80" className="opacity-50 w-full h-full object-cover grayscale" alt="Coding meme background" />
                   <span className="absolute inset-0 flex items-center justify-center text-2xl font-black uppercase text-center px-4 drop-shadow-[2px_2px_0_#fff]">
                     {demoMemes[demoLanguage].text}
                   </span>
                </div>
                <div className="col-span-2 flex justify-between items-center bg-black text-white p-2 px-4 border-2 border-black">
                  <span className="font-bold text-sm uppercase">Translation: {demoLanguage}</span>
                  <Languages size={16} />
                </div>
              </div>
              
              {/* Language Toggles for Visual */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {Object.keys(demoMemes).map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setDemoLanguage(lang)}
                    className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black transition-all ${demoLanguage === lang ? 'bg-[#E60023] text-white' : 'bg-white hover:bg-gray-100'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-y-4 border-black bg-white">
        <div className="grid md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
          {/* Step 1 */}
          <div className="p-12 flex flex-col items-center text-center hover:bg-[#f0f0f0] transition-colors group">
            <div className="w-20 h-20 bg-[#E60023] border-4 border-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload className="text-white" size={40} strokeWidth={3} />
            </div>
            <Badge color="bg-black">Step 01</Badge>
            <h3 className="text-2xl font-black uppercase mb-2">Upload Meme</h3>
            <p className="font-medium text-gray-600">Drop your image. We handle JPG, PNG, and GIF. The messier, the better.</p>
          </div>

          {/* Step 2 */}
          <div className="p-12 flex flex-col items-center text-center hover:bg-[#f0f0f0] transition-colors group">
            <div className="w-20 h-20 bg-[#F8D300] border-4 border-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="text-black" size={40} strokeWidth={3} />
            </div>
            <Badge color="bg-black">Step 02</Badge>
            <h3 className="text-2xl font-black uppercase mb-2">Add Caption</h3>
            <p className="font-medium text-gray-600">Type your punchline in English. Select your target languages (up to 12!).</p>
          </div>

          {/* Step 3 */}
          <div className="p-12 flex flex-col items-center text-center hover:bg-[#f0f0f0] transition-colors group">
            <div className="w-20 h-20 bg-[#004B8D] border-4 border-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Share2 className="text-white" size={40} strokeWidth={3} />
            </div>
            <Badge color="bg-black">Step 03</Badge>
            <h3 className="text-2xl font-black uppercase mb-2">Go Global</h3>
            <p className="font-medium text-gray-600">Our AI translates culture, not just words. Download and dominate the feed.</p>
          </div>
        </div>
      </section>

      {/* Why Global / Benefits Grid */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
            <span className="border-b-8 border-[#F8D300]">Why Limit</span> Your Laughter?
          </h2>
          <p className="text-xl font-bold max-w-2xl mx-auto text-gray-600">
            Memes are the universal language. We just provide the dictionary.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Benefit 1 */}
          <Card className="hover:-translate-y-2 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <Globe size={32} strokeWidth={2.5} className="text-[#004B8D]" />
              <Badge color="bg-[#004B8D]">Reach</Badge>
            </div>
            <h3 className="text-2xl font-black uppercase mb-2">World Domination</h3>
            <p className="font-medium">Don't just trend in New York. Trend in Tokyo, Berlin, and São Paulo simultaneously.</p>
          </Card>

          {/* Benefit 2 */}
          <Card className="bg-[#F8D300]">
            <div className="flex justify-between items-start mb-4">
              <Zap size={32} strokeWidth={2.5} className="text-black" />
              <Badge color="bg-black">Speed</Badge>
            </div>
            <h3 className="text-2xl font-black uppercase mb-2">Faster Than Trends</h3>
            <p className="font-medium">Trends die in hours. Our Lingo CLI engine translates in milliseconds.</p>
          </Card>

          {/* Benefit 3 */}
          <Card className="hover:-translate-y-2 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <Smile size={32} strokeWidth={2.5} className="text-[#E60023]" />
              <Badge color="bg-[#E60023]">Humor</Badge>
            </div>
            <h3 className="text-2xl font-black uppercase mb-2">Cultural Nuance</h3>
            <p className="font-medium">We don't translate word-for-word. We translate the <i>vibe</i> so the joke lands.</p>
          </Card>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="bg-black text-white py-24 border-y-4 border-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge color="bg-[#E60023]">Live Preview</Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
                See It In Action
              </h2>
              <p className="text-xl text-gray-400 mb-8 font-medium">
                Select a target language to see how our engine adapts the context.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {['French', 'German', 'Japanese', 'Hindi', 'Spanish', 'Italian'].map((lang) => (
                   <button 
                     key={lang} 
                     className="p-4 border-2 border-white hover:bg-white hover:text-black transition-colors font-bold text-left flex items-center justify-between group"
                   >
                     {lang}
                     <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                ))}
              </div>
            </div>

            {/* Mockup Interface */}
            <div className="bg-white text-black border-4 border-white p-2 md:p-4 shadow-[12px_12px_0px_0px_#333]">
              <div className="border-b-4 border-black pb-4 mb-4 flex justify-between items-center">
                <span className="font-black uppercase">Result_Preview.png</span>
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#E60023] border-2 border-black"></div>
                  <div className="w-4 h-4 rounded-full bg-[#F8D300] border-2 border-black"></div>
                </div>
              </div>
              <div className="aspect-video bg-gray-200 border-4 border-black mb-4 flex items-center justify-center overflow-hidden relative">
                 <img src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover grayscale contrast-125" alt="Meme" />
                 <div className="absolute top-4 w-full text-center">
                   <span className="bg-black text-white text-2xl md:text-3xl font-black px-4 py-1 uppercase inline-block transform -rotate-2">
                     WENN DU VERGISST
                   </span>
                 </div>
                 <div className="absolute bottom-4 w-full text-center">
                   <span className="bg-black text-white text-2xl md:text-3xl font-black px-4 py-1 uppercase inline-block transform rotate-1">
                     ZU SPEICHERN
                   </span>
                 </div>
              </div>
              <div className="flex gap-4">
                <Button variant="primary" className="flex-1 py-2 text-sm" icon={Download}>Download</Button>
                <Button variant="outline" className="aspect-square p-2 border-2"><Share2 size={20} /></Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto bg-[#F8D300] p-8 md:p-16 border-4 border-black shadow-[12px_12px_0px_0px_#111]">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 leading-none">
            Stop Being <br/>Monolingual.
          </h2>
          <p className="text-xl font-bold mb-8 text-gray-900">
            Join 50,000+ creators breaking the internet in 12 different languages. It's free to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" icon={Globe} className="text-xl px-8 py-4">
              Translate My Meme
            </Button>
            <Button variant="secondary" className="text-xl px-8 py-4">
              See Pricing
            </Button>
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-wide opacity-75">
            No credit card required • Instant Generation
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] text-white border-t-4 border-black pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <h4 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                <Globe className="text-[#F8D300]" /> GlobalMeme
              </h4>
              <p className="text-gray-400 font-medium max-w-sm">
                We are a team of linguists and shitposters dedicated to making humor universal. Built with Lingo CLI and excessive caffeine.
              </p>
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-widest text-[#F8D300] mb-6">Product</h5>
              <ul className="space-y-3 font-bold text-gray-300">
                <li><a href="#" className="hover:text-white hover:underline decoration-2 underline-offset-4">Features</a></li>
                <li><a href="#" className="hover:text-white hover:underline decoration-2 underline-offset-4">Pricing</a></li>
                <li><a href="#" className="hover:text-white hover:underline decoration-2 underline-offset-4">API Access</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-widest text-[#004B8D] mb-6">Connect</h5>
              <ul className="space-y-3 font-bold text-gray-300">
                <li><a href="#" className="hover:text-white flex items-center gap-2"><Twitter size={18} /> Twitter</a></li>
                <li><a href="#" className="hover:text-white flex items-center gap-2"><Github size={18} /> GitHub</a></li>
                <li><a href="#" className="hover:text-white flex items-center gap-2"><MessageSquare size={18} /> Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-gray-800 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-bold text-gray-500">© 2025 Global Meme Translator Inc.</p>
            <p className="font-bold text-gray-500 text-sm">
              Built for the <span className="text-white">Global AI Hackathon</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GlobalMemeTranslator;