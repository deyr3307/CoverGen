import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, Sun, Download, Image as ImageIcon, ChevronRight, 
  GraduationCap, Sparkles, LayoutTemplate, PenTool, Eye, 
  FileText, ChevronDown, Type, Wand2, Settings, X,
  Italic, Underline, Strikethrough, Undo, Redo, Check, Bold, Loader2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toSvg, toPng, toJpeg } from 'html-to-image';

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const letters = "CoverGen".split("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.3, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-50">
      <motion.img
        src="/icon-512.png"
        alt="CoverGen Logo"
        className="w-28 h-28 mb-6"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex text-4xl font-extrabold text-white tracking-wider"
      >
        {letters.map((letter, index) => (
          <motion.span key={index} variants={letterVariants}>
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

// --- Types ---
type PageMode = 'landing' | 'editor';
type TabMode = 'info' | 'logo' | 'watermark' | 'styling' | 'templates';
type FontOption = 'Arial' | 'Times New Roman' | 'Courier New' | 'Playfair Display' | 'Inter' | 'Cinzel' | 'EB Garamond' | 'Montserrat' | 'Merriweather' | 'Roboto' | 'Open Sans' | 'Oswald' | 'Lora' | 'PT Serif' | 'Nunito' | 'Poppins' | 'Noto Sans Bengali' | 'Hind Siliguri' | 'Kalpurush' | 'Galada' | string;

interface FieldStyle {
  fontFamily: FontOption;
  color: string;
  fontSize: number;
  fontWeight: '300' | '400' | '500' | '600' | '700' | 'bold' | 'normal' | '800';
  isBold?: boolean; // legacy
  isItalic?: boolean;
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

interface CoverData {
  assignmentType: string;
  topic: string;
  courseCodeHeading: string;
  courseCode: string;
  courseTitleHeading: string;
  courseTitle: string;
  submittedToHeading: string;
  submittedTo: string;
  submittedByHeading: string;
  submittedBy: string;
  dateHeading: string;
  date: string;
}

interface CoverStyles {
  assignmentType: FieldStyle;
  topic: FieldStyle;
  courseCodeHeading: FieldStyle;
  courseCode: FieldStyle;
  courseTitleHeading: FieldStyle;
  courseTitle: FieldStyle;
  submittedToHeading: FieldStyle;
  submittedTo: FieldStyle;
  submittedByHeading: FieldStyle;
  submittedBy: FieldStyle;
  dateHeading: FieldStyle;
  date: FieldStyle;
}

interface WatermarkConfig {
  url: string;
  processedUrl: string;
  size: number;
  opacity: number;
  tolerance: number;
  mode: 'single' | 'tiled' | 'pattern';
  hAlign: 'left' | 'center' | 'right' | 'custom';
  vAlign: 'top' | 'center' | 'bottom' | 'custom';
  offsetX: number;
  offsetY: number;
  offsetUnit: 'px' | '%';
  tileSpacing: number;
  rotation: number;
}

const defaultFieldStyle: FieldStyle = {
  fontFamily: '"Times New Roman", Times, serif',
  color: '#000000',
  fontSize: 16,
  isBold: false, // legacy
  fontWeight: 'normal',
  isItalic: false,
  textDecoration: 'none',
  textTransform: 'none',
};

type TemplateConfig = {
  id: string;
  name: string;
  description: string;
  styles: CoverStyles;
};

const coverTemplates: TemplateConfig[] = [
  {
    id: 'classic-academic',
    name: 'Classic Academic',
    description: 'Traditional academic style using Times New Roman',
    styles: {
      assignmentType: { ...defaultFieldStyle, color: '#1a3688', fontSize: 20, fontWeight: 'bold' },
      topic: { ...defaultFieldStyle, fontSize: 32, fontWeight: 'bold' },
      courseCode: { ...defaultFieldStyle, fontSize: 16, fontWeight: 'normal' },
      courseTitle: { ...defaultFieldStyle, fontSize: 16, fontWeight: 'normal' },
      submittedToHeading: { ...defaultFieldStyle, color: '#1a3688', fontSize: 22, fontWeight: 'bold' },
      submittedTo: { ...defaultFieldStyle, fontSize: 18, fontWeight: 'normal' },
      submittedByHeading: { ...defaultFieldStyle, color: '#1a3688', fontSize: 22, fontWeight: 'bold' },
      submittedBy: { ...defaultFieldStyle, fontSize: 18, fontWeight: 'normal' },
      date: { ...defaultFieldStyle, color: '#000000', fontSize: 18, fontWeight: 'bold' },
    }
  },
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    description: 'Clean sans-serif typography with high contrast',
    styles: {
      assignmentType: { ...defaultFieldStyle, fontFamily: 'Inter, sans-serif', color: '#4b5563', fontSize: 18, fontWeight: '500', isItalic: true },
      topic: { ...defaultFieldStyle, fontFamily: 'Inter, sans-serif', color: '#111827', fontSize: 36, fontWeight: '800' },
      courseCode: { ...defaultFieldStyle, fontFamily: 'Inter, sans-serif', color: '#374151', fontSize: 16, fontWeight: 'bold' },
      courseTitle: { ...defaultFieldStyle, fontFamily: 'Inter, sans-serif', color: '#6b7280', fontSize: 16, fontWeight: 'normal' },
      submittedToHeading: { ...defaultFieldStyle, fontFamily: 'Inter, sans-serif', color: '#111827', fontSize: 18, fontWeight: 'bold' },
      submittedTo: { ...defaultFieldStyle, fontFamily: 'Inter, sans-serif', color: '#4b5563', fontSize: 16, fontWeight: 'normal' },
      submittedByHeading: { ...defaultFieldStyle, fontFamily: 'Inter, sans-serif', color: '#111827', fontSize: 18, fontWeight: 'bold' },
      submittedBy: { ...defaultFieldStyle, fontFamily: 'Inter, sans-serif', color: '#4b5563', fontSize: 16, fontWeight: 'normal' },
      date: { ...defaultFieldStyle, fontFamily: 'Inter, sans-serif', color: '#111827', fontSize: 16, fontWeight: '600' },
    }
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    description: 'Sophisticated typography using Playfair Display',
    styles: {
      assignmentType: { ...defaultFieldStyle, fontFamily: '"Playfair Display", serif', color: '#800020', fontSize: 22, fontWeight: 'normal', isItalic: true },
      topic: { ...defaultFieldStyle, fontFamily: '"Playfair Display", serif', color: '#800020', fontSize: 40, fontWeight: 'bold' },
      courseCode: { ...defaultFieldStyle, fontFamily: '"Playfair Display", serif', color: '#4a5568', fontSize: 16, fontWeight: '500' },
      courseTitle: { ...defaultFieldStyle, fontFamily: '"Playfair Display", serif', color: '#4a5568', fontSize: 16, fontWeight: 'normal', isItalic: true },
      submittedToHeading: { ...defaultFieldStyle, fontFamily: '"Playfair Display", serif', color: '#2d3748', fontSize: 24, fontWeight: 'bold' },
      submittedTo: { ...defaultFieldStyle, fontFamily: '"Playfair Display", serif', color: '#4a5568', fontSize: 18, fontWeight: 'normal' },
      submittedByHeading: { ...defaultFieldStyle, fontFamily: '"Playfair Display", serif', color: '#2d3748', fontSize: 24, fontWeight: 'bold' },
      submittedBy: { ...defaultFieldStyle, fontFamily: '"Playfair Display", serif', color: '#4a5568', fontSize: 18, fontWeight: 'normal' },
      date: { ...defaultFieldStyle, fontFamily: '"Playfair Display", serif', color: '#800020', fontSize: 18, fontWeight: 'bold' },
    }
  },
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    description: 'Strong layout with Montserrat and thick typography',
    styles: {
      assignmentType: { ...defaultFieldStyle, fontFamily: 'Montserrat, sans-serif', color: '#000000', fontSize: 16, fontWeight: '800', isItalic: false },
      topic: { ...defaultFieldStyle, fontFamily: 'Montserrat, sans-serif', color: '#000000', fontSize: 48, fontWeight: '800' },
      courseCode: { ...defaultFieldStyle, fontFamily: 'Montserrat, sans-serif', color: '#1a3688', fontSize: 18, fontWeight: 'bold' },
      courseTitle: { ...defaultFieldStyle, fontFamily: 'Montserrat, sans-serif', color: '#4a5568', fontSize: 16, fontWeight: '600' },
      submittedToHeading: { ...defaultFieldStyle, fontFamily: 'Montserrat, sans-serif', color: '#000000', fontSize: 20, fontWeight: '800' },
      submittedTo: { ...defaultFieldStyle, fontFamily: 'Montserrat, sans-serif', color: '#4a5568', fontSize: 16, fontWeight: '500' },
      submittedByHeading: { ...defaultFieldStyle, fontFamily: 'Montserrat, sans-serif', color: '#000000', fontSize: 20, fontWeight: '800' },
      submittedBy: { ...defaultFieldStyle, fontFamily: 'Montserrat, sans-serif', color: '#4a5568', fontSize: 16, fontWeight: '500' },
      date: { ...defaultFieldStyle, fontFamily: 'Montserrat, sans-serif', color: '#1a3688', fontSize: 18, fontWeight: '800' },
    }
  },
  {
    id: 'technical-mono',
    name: 'Technical / Science',
    description: 'Precision layout utilizing monospaced accents',
    styles: {
      assignmentType: { ...defaultFieldStyle, fontFamily: '"Courier New", Courier, monospace', color: '#2E4053', fontSize: 18, fontWeight: 'bold' },
      topic: { ...defaultFieldStyle, fontFamily: 'Roboto, sans-serif', color: '#154360', fontSize: 32, fontWeight: '800' },
      courseCode: { ...defaultFieldStyle, fontFamily: '"Courier New", Courier, monospace', color: '#2E4053', fontSize: 16, fontWeight: 'bold' },
      courseTitle: { ...defaultFieldStyle, fontFamily: 'Roboto, sans-serif', color: '#4D5656', fontSize: 16, fontWeight: '500' },
      submittedToHeading: { ...defaultFieldStyle, fontFamily: 'Roboto, sans-serif', color: '#154360', fontSize: 20, fontWeight: 'bold' },
      submittedTo: { ...defaultFieldStyle, fontFamily: '"Courier New", Courier, monospace', color: '#2E4053', fontSize: 14, fontWeight: 'normal' },
      submittedByHeading: { ...defaultFieldStyle, fontFamily: 'Roboto, sans-serif', color: '#154360', fontSize: 20, fontWeight: 'bold' },
      submittedBy: { ...defaultFieldStyle, fontFamily: '"Courier New", Courier, monospace', color: '#2E4053', fontSize: 14, fontWeight: 'normal' },
      date: { ...defaultFieldStyle, fontFamily: '"Courier New", Courier, monospace', color: '#C0392B', fontSize: 16, fontWeight: 'bold' },
    }
  }
];

const getFieldCss = (style: FieldStyle): React.CSSProperties => {
  return {
    fontFamily: style.fontFamily,
    fontSize: `${style.fontSize}px`,
    color: style.color,
    fontWeight: style.fontWeight || (style.isBold ? 'bold' : 'normal'),
    fontStyle: style.isItalic ? 'italic' : 'normal',
    textDecoration: style.textDecoration || 'none',
    textTransform: style.textTransform || 'none',
  };
};

interface LogoConfig {
  url: string;
  size: number;
  offsetX: number;
  offsetY: number;
  offsetUnit: 'px' | '%';
}

const CoverGenLogo = ({ onClick }: { onClick?: () => void }) => (
  <div onClick={onClick} className="flex items-center gap-3 cursor-pointer select-none group">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
      <GraduationCap className="text-white w-6 h-6" />
    </div>
    <span className="text-3xl text-text-primary drop-shadow-md" style={{ fontFamily: '"Lobster", cursive' }}>Cover<span className="text-blue-500">Gen</span></span>
  </div>
);

const applyMagicRemover = (srcUrl: string, tolerance: number): Promise<string> => {
  return new Promise((resolve) => {
    if (!srcUrl) return resolve('');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(srcUrl);
      
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const brightness = (r + g + b) / 3;
        
        if (brightness > tolerance) {
            data[i+3] = 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = srcUrl;
  });
};

const ACADEMIC_COLORS = [
  '#000000', '#1a3688', '#800000', '#2E4053', '#0E6655', 
  '#34495E', '#17202A', '#4A235A', '#154360', '#7B241C',
  '#0B5345', '#1B4F72', '#641E16', '#4D5656', '#212F3D',
  '#5B2C6F', '#2C3E50', '#78281F', '#186A3B', '#1F618D'
];

// --- App Component ---
export default function App() {
    const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }
  
  const [currentPage, setCurrentPage] = useState<PageMode>('landing');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
      } else {
        setCurrentPage('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    // Initial state setup so back button always has a state to pop to
    if (!window.history.state) {
      window.history.replaceState({ page: 'landing' }, '', '');
    }
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: PageMode) => {
    setCurrentPage(page);
    window.history.pushState({ page }, '', page === 'landing' ? '/' : '#' + page);
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-primary font-sans relative overflow-x-hidden selection:bg-blue-500/30 transition-colors duration-300">
      <AnimatePresence mode="wait">
        {currentPage === 'landing' ? (
          <LandingPage key="landing" onStart={() => navigateTo('editor')} theme={theme} toggleTheme={toggleTheme} />
        ) : (
          <EditorPage key="editor" onLogoClick={() => navigateTo('landing')} theme={theme} toggleTheme={toggleTheme} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Landing Page ---
function LandingPage({ onStart, theme, toggleTheme }: { onStart: () => void, theme: string, toggleTheme: () => void, key?: React.Key }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 w-full min-h-screen flex flex-col"
    >
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 bg-bg-main bg-[linear-gradient(to_right,rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.15)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none transition-colors duration-300"></div>

      {/* Header */}
      <header className="relative z-50 border-b border-border-subtle bg-bg-panel shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <CoverGenLogo />
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={toggleTheme} className="text-text-secondary hover:text-text-primary transition-colors p-2 rounded-full hover:bg-bg-hover">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={onStart}
              className="px-6 py-2 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-medium transition-all shadow-lg shadow-blue-500/30 active:scale-95 text-sm tracking-wide"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center pt-24 pb-16 px-6 text-center relative z-10 w-full max-w-5xl mx-auto animated-grid-bg">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-strong bg-bg-hover text-sm mb-10 shadow-lg backdrop-blur-md transition-colors duration-300">
          <Sparkles className="text-orange-400 w-4 h-4" />
          <span className="text-orange-400/90 font-medium tracking-wide uppercase text-[11px] md:text-sm">Cover Page Generator 2.0</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-[110px] leading-[1.1] mb-8 text-text-primary transition-colors duration-300 drop-shadow-sm" style={{ fontFamily: '"Kaushan Script", cursive' }}>
            <div style={{ opacity: 0, animation: 'fadeUp 0.8s ease-out 0.1s forwards' }}>Craft</div>
  <div style={{ opacity: 0, animation: 'fadeUp 0.8s ease-out 0.3s forwards' }}>perfect</div>
  <div style={{ opacity: 0, animation: 'fadeUp 0.8s ease-out 0.5s forwards' }}>
    <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text">cover</span>
  </div>
  <div style={{ opacity: 0, animation: 'fadeUp 0.8s ease-out 0.7s forwards' }}>
    <span className="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">pages</span>
  </div>
  <div style={{ opacity: 0, animation: 'fadeUp 0.8s ease-out 0.9s forwards' }}>in seconds.</div>
          
        
          
          
      
        </h1>

        <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-2xl font-light leading-relaxed transition-colors duration-300" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          Stop fighting with formatting. CoverGen helps you create beautifully structured assignment cover pages instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1"
          >
            Open Studio <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            className="px-8 py-4 border border-border-strong hover:bg-bg-hover text-text-primary rounded-full font-semibold transition-colors text-lg"
            onClick={() => {
              const featuresEl = document.getElementById('features');
              if (featuresEl) {
                const yOffset = -50; 
                const y = featuresEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
              } else {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Explore Features
          </button>
        </div>

        <div className="flex gap-8 text-sm text-text-secondary mb-32 transition-colors duration-300">
          <div className="flex items-center gap-2 font-medium">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            No sign up required
          </div>
          <div className="flex items-center gap-2 font-medium">
             <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
             100% Free forever
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full text-left my-12 max-w-5xl mx-auto px-6">
           <FeatureCard 
              icon={<Eye strokeWidth={1.5} className="w-8 h-8 text-blue-400 dynamic-icon-float" />}
             
             
             
              iconBg="bg-blue-500"
              title={<span className="text-blue-500 dark:text-blue-400">Live Preview</span>}
              desc="Real-time A4 canvas updates instantly. What you see is exactly what gets exported."
              index={0}
           />
           <FeatureCard 
              icon={<Type strokeWidth={1.5} className="w-8 h-8 text-pink-400 dynamic-icon-float" />}
             
             
             
              iconBg="bg-pink-500"
              title={<span className="text-pink-500 dark:text-pink-400">Custom Fonts</span>}
              desc="Granular typography controls with premium academic and modern serif/sans-serif fonts."
              index={1}
           />
           <FeatureCard 
              icon={<ImageIcon strokeWidth={1.5} className="w-8 h-8 text-purple-400 dynamic-icon-float" />}
             
             
             
              iconBg="bg-purple-500"
              title={<span className="text-purple-500 dark:text-purple-400">Watermarks</span>}
              desc="Advanced magic background eraser and precision positioning for flawless university logos."
              index={2}
           />
           <FeatureCard 
              icon={<Download strokeWidth={1.5} className="w-8 h-8 text-green-400 dynamic-icon-float" />}
             
             
             
              iconBg="bg-green-500"
              title={<span className="text-green-500 dark:text-green-400">High-Quality Export</span>}
              desc="Download pixel-perfect, high-fidelity PDF, PNG, or JPG files format completely offline."
              index={3}
           />
        </div>
      </main>

      <footer className="text-center py-10 mt-auto border-t border-border-subtle text-text-muted text-sm transition-colors duration-300">
        © 2026 CoverGen - Professional Assignment Cover Page Generator
      </footer>
    </motion.div>
  );
}

function FeatureCard({ icon, iconBg, title, desc, index }: { icon: React.ReactNode, iconBg: string, title: React.ReactNode, desc: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-full w-full perspective-1000"
    >
       {/* Ambient glowing orb behind card */}
       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full ${iconBg} opacity-0 group-hover:opacity-20 blur-[80px] transition-all duration-700 pointer-events-none transform group-hover:scale-110`}></div>
       
       <div className="relative h-full bg-white/60 dark:bg-black/40 backdrop-blur-xl overflow-hidden rounded-[32px] border border-white/40 dark:border-white/10 group-hover:border-white/80 dark:group-hover:border-white/20 transition-all duration-700 p-8 sm:p-10 flex flex-col items-start z-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] group-hover:shadow-[0_30px_60px_rgb(0,0,0,0.12)] dark:group-hover:shadow-[0_30px_60px_rgb(0,0,0,0.4)] transform-gpu group-hover:-translate-y-2 group-hover:rotate-x-2 group-hover:-rotate-y-2">
         
         {/* Animated gradient top border */}
         <div className={`absolute top-0 left-0 right-0 h-1 ${iconBg} opacity-60 group-hover:opacity-100 group-hover:h-2 transition-all duration-500 bg-gradient-to-r from-transparent via-current to-transparent bg-[length:200%_100%] animate-pulse`}></div>
         
         {/* Icon Wrapper with 3D levitation */}
         <div className="relative mb-10 transform-style-3d">
            {/* Pulsing aura behind icon */}
            <div className={`absolute inset-0 ${iconBg} blur-2xl opacity-20 group-hover:opacity-60 transition-opacity duration-700 scale-150 animate-pulse`}></div>
            
            {/* Glass Icon Box */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/80 to-white/10 dark:from-white/20 dark:to-white/5 border border-white/50 dark:border-white/10 flex items-center justify-center shadow-xl relative z-10 transform-gpu group-hover:scale-110 group-hover:-rotate-6 group-hover:translate-z-10 transition-all duration-500 ease-out`}>
              <div className={`relative z-20 text-text-primary drop-shadow-md transform scale-[1.2] sm:scale-[1.5] transition-transform duration-500 group-hover:scale-[1.4] sm:group-hover:scale-[1.7] ${iconBg.replace('bg-', 'text-').replace('-500', '-600 dark:text-white')}`}>
                {icon}
              </div>
              {/* Refraction highlight */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
            </div>
         </div>
         
         <div className="transform-gpu group-hover:translate-z-5 transition-transform duration-500">
           <h3 className="text-2xl sm:text-3xl font-black mb-4 text-text-primary tracking-tight transition-all duration-500">{title}</h3>
           <p className="text-text-secondary leading-relaxed text-lg sm:text-xl font-medium opacity-80 group-hover:opacity-100 group-hover:text-text-primary transition-all duration-500">{desc}</p>
         </div>
         
         {/* Futuristic grid pattern overlay */}
         <div className="absolute bottom-0 right-0 w-full h-full pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity duration-700 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '24px 24px', backgroundPosition: 'calc(100% + 12px) calc(100% + 12px)' }}></div>
         
         {/* Light sweep effect on hover */}
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
       </div>
    </motion.div>
  )
}

const FONT_GROUPS = [
  {
    label: 'Serif',
    options: [
      { value: 'Playfair Display', label: 'Playfair Display' },
      { value: 'Cinzel', label: 'Cinzel' },
      { value: 'EB Garamond', label: 'Garamond' },
      { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
      { value: 'Merriweather', label: 'Merriweather' },
      { value: 'Lora', label: 'Lora' },
      { value: 'PT Serif', label: 'PT Serif' },
      { value: 'Noto Serif', label: 'Noto Serif' },
      { value: 'Libre Baskerville', label: 'Libre Baskerville' },
      { value: 'Crimson Text', label: 'Crimson Text' },
      { value: 'Georgia, serif', label: 'Georgia' },
      { value: 'Baskerville, serif', label: 'Baskerville' },
      { value: '"Palatino Linotype", "Book Antiqua", Palatino, serif', label: 'Palatino' },
      { value: '"Bodoni MT", serif', label: 'Bodoni MT' },
      { value: 'Centaur, serif', label: 'Centaur' },
    ]
  },
  {
    label: 'Sans-Serif',
    options: [
      { value: 'Montserrat', label: 'Montserrat' },
      { value: 'Inter', label: 'Inter' },
      { value: 'Arial', label: 'Arial' },
      { value: 'Roboto', label: 'Roboto' },
      { value: 'Open Sans', label: 'Open Sans' },
      { value: 'Oswald', label: 'Oswald' },
      { value: 'Nunito', label: 'Nunito' },
      { value: 'Poppins', label: 'Poppins' },
      { value: 'Lato', label: 'Lato' },
      { value: 'Work Sans', label: 'Work Sans' },
      { value: '"Helvetica Neue", Helvetica, sans-serif', label: 'Helvetica Neue' },
      { value: '"Trebuchet MS", sans-serif', label: 'Trebuchet MS' },
      { value: 'Verdana, sans-serif', label: 'Verdana' },
      { value: 'Tahoma, sans-serif', label: 'Tahoma' },
      { value: '"Century Gothic", sans-serif', label: 'Century Gothic' },
      { value: '"Franklin Gothic Medium", sans-serif', label: 'Franklin Gothic' },
      { value: 'Futura, sans-serif', label: 'Futura' },
      { value: 'Raleway', label: 'Raleway' },
      { value: 'Ubuntu', label: 'Ubuntu' }
    ]
  },
  {
    label: 'Bengali / বাংলা',
    options: [
      { value: '"Noto Sans Bengali", sans-serif', label: 'Noto Sans Bengali' },
      { value: '"Hind Siliguri", sans-serif', label: 'Hind Siliguri' },
      { value: '"Kalpurush", sans-serif', label: 'Kalpurush' },
      { value: '"Galada", cursive', label: 'Galada' },
      { value: '"Mina", sans-serif', label: 'Mina' },
      { value: '"Baloo Da 2", cursive', label: 'Baloo Da 2' },
    ]
  },
  {
    label: 'Monospace & Other',
    options: [
      { value: 'Courier New', label: 'Courier New' },
      { value: 'JetBrains Mono', label: 'JetBrains Mono' },
      { value: 'Fira Code', label: 'Fira Code' },
      { value: 'Space Mono', label: 'Space Mono' },
      { value: 'Inconsolata', label: 'Inconsolata' },
      { value: 'Consolas, monospace', label: 'Consolas' },
      { value: 'Monaco, monospace', label: 'Monaco' },
      { value: '"Lucida Console", monospace', label: 'Lucida Console' },
      { value: '"Source Code Pro", monospace', label: 'Source Code Pro' },
      { value: '"Comic Sans MS", cursive', label: 'Comic Sans MS' },
      { value: 'Impact, sans-serif', label: 'Impact' }
    ]
  }
];

const CustomFontPicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  let currentLabel = value;
  for (const group of FONT_GROUPS) {
    const found = group.options.find(o => o.value === value);
    if (found) { currentLabel = found.label; break; }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="w-full p-3 rounded-xl border border-border-strong bg-bg-input outline-none text-text-primary focus:border-blue-500/50 flex justify-between items-center text-sm shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        style={{ fontFamily: value }}
      >
        <span>{currentLabel}</span>
        <ChevronDown className="w-4 h-4 text-text-muted" />
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-full mb-1 left-0 right-0 max-h-64 overflow-y-auto bg-bg-panel border border-border-strong rounded-xl shadow-xl custom-scrollbar py-2">
          {FONT_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg-main/50 sticky top-0 backdrop-blur-sm z-10">
                {group.label}
              </div>
              {group.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setIsOpen(false); }}
                  className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-bg-hover transition-colors text-sm"
                  style={{ fontFamily: option.value }}
                >
                  <span className={value === option.value ? 'text-blue-500 font-bold' : 'text-text-primary'}>
                    {option.label}
                  </span>
                  {value === option.value && <Check className="w-4 h-4 text-blue-500" />}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomColorPicker = ({ color, onChange, presetColors, size = "lg" }: { color: string, onChange: (val: string) => void, presetColors: string[], size?: "sm" | "lg" }) => {
  const buttonClass = size === 'lg' 
    ? "w-10 h-10 rounded-lg border-2 border-border-strong shadow-sm shrink-0 relative overflow-hidden" 
    : "w-8 h-8 rounded-lg border border-border-strong shadow-sm shrink-0 relative overflow-hidden";
    
  const presetSize = size === 'lg' ? "w-8 h-8" : "w-6 h-6";

  return (
    <div className="flex flex-col gap-3">
      {/* Current Color & Custom Picker Row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-panel border border-border-strong rounded-xl shadow-sm">
          <div className="w-5 h-5 rounded-full border border-border-strong" style={{ backgroundColor: color }}></div>
          <span className="text-xs font-mono uppercase text-text-primary">{color}</span>
        </div>
        
        <div 
          className={`${buttonClass} bg-[conic-gradient(red,yellow,lime,aqua,blue,fuchsia,red)] flex items-center justify-center group`}
          title="Choose any custom color"
        >
          <div className="bg-white/80 p-1 rounded-full text-black opacity-0 group-hover:opacity-100 transition-opacity absolute pointer-events-none z-10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </div>
          <input 
            type="color" 
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-[-10px] w-24 h-24 opacity-0 cursor-pointer z-20"
          />
        </div>
        <span className="text-xs text-text-muted font-medium">Custom Color</span>
      </div>

      {/* Presets Grid */}
      <div className="flex-1 flex gap-1.5 flex-wrap">
        {presetColors.map(c => (
          <button 
            key={c}
            onClick={() => onChange(c)}
            className={`${presetSize} rounded-full shrink-0 shadow-sm border-2 transition-transform hover:scale-110 ${color.toLowerCase() === c.toLowerCase() ? 'border-blue-500 scale-110' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>
    </div>
  );
};

// --- Editor Page ---
function EditorPage({ onLogoClick, theme, toggleTheme }: { onLogoClick: () => void, theme: string, toggleTheme: () => void, key?: React.Key }) {
  const [viewPhase, setViewPhase] = useState<'content' | 'styling' | 'designer'>('content');
  const [activeTab, setActiveTab] = useState<TabMode>('styling');
  const [selectedStyleElement, setSelectedStyleElement] = useState<keyof CoverStyles>('topic');
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as 'en' | 'bn';
    setLanguage(lang);
    setData(prev => {
      const newData = { ...prev };
      if (lang === 'bn') {
         if (!prev.courseCodeHeading || prev.courseCodeHeading.trim() === 'COURSE NO:') newData.courseCodeHeading = 'কোর্স কোড:';
         if (!prev.courseTitleHeading || prev.courseTitleHeading.trim() === 'COURSE NAME:') newData.courseTitleHeading = 'কোর্সের শিরোনাম:';
         if (!prev.submittedToHeading || prev.submittedToHeading.trim() === 'SUBMITTED TO') newData.submittedToHeading = 'যার কাছে জমা দেওয়া হচ্ছে';
         if (!prev.submittedByHeading || prev.submittedByHeading.trim() === 'SUBMITTED BY') newData.submittedByHeading = 'জমা দিচ্ছেন';
         if (!prev.dateHeading || prev.dateHeading.trim() === 'Date of Submission:') newData.dateHeading = 'জমা দেওয়ার তারিখ:';
      } else {
         if (!prev.courseCodeHeading || prev.courseCodeHeading.trim() === 'কোর্স কোড:') newData.courseCodeHeading = 'COURSE NO:';
         if (!prev.courseTitleHeading || prev.courseTitleHeading.trim() === 'কোর্সের শিরোনাম:') newData.courseTitleHeading = 'COURSE NAME:';
         if (!prev.submittedToHeading || prev.submittedToHeading.trim() === 'যার কাছে জমা দেওয়া হচ্ছে') newData.submittedToHeading = 'SUBMITTED TO';
         if (!prev.submittedByHeading || prev.submittedByHeading.trim() === 'জমা দিচ্ছেন') newData.submittedByHeading = 'SUBMITTED BY';
         if (!prev.dateHeading || prev.dateHeading.trim() === 'জমা দেওয়ার তারিখ:') newData.dateHeading = 'Date of Submission:';
      }
      return newData;
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = Math.min(Math.max(320, e.clientX), window.innerWidth * 0.6);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const [data, setData] = useState<CoverData>({
    assignmentType: '',
    topic: '',
    courseCodeHeading: '',
    courseCode: '',
    courseTitleHeading: '',
    courseTitle: '',
    submittedToHeading: '',
    submittedTo: '',
    submittedByHeading: '',
    submittedBy: '',
    dateHeading: '',
    date: '',
  });

  const [styles, setStyles] = useState<CoverStyles>({
    assignmentType: { ...defaultFieldStyle, color: '#1a3688', fontSize: 20, isBold: true, fontWeight: 'bold' },
    topic: { ...defaultFieldStyle, fontSize: 32, isBold: true, fontWeight: 'bold' },
    courseCodeHeading: { ...defaultFieldStyle, fontSize: 16, isBold: true, fontWeight: 'bold' },
    courseCode: { ...defaultFieldStyle, fontSize: 16, isBold: false, fontWeight: 'normal' },
    courseTitleHeading: { ...defaultFieldStyle, fontSize: 16, isBold: true, fontWeight: 'bold' },
    courseTitle: { ...defaultFieldStyle, fontSize: 16, isBold: false, fontWeight: 'normal' },
    submittedToHeading: { ...defaultFieldStyle, color: '#1a3688', fontSize: 22, isBold: true, fontWeight: 'bold' },
    submittedTo: { ...defaultFieldStyle, fontSize: 18, isBold: false, fontWeight: 'normal' },
    submittedByHeading: { ...defaultFieldStyle, color: '#1a3688', fontSize: 22, isBold: true, fontWeight: 'bold' },
    submittedBy: { ...defaultFieldStyle, fontSize: 18, isBold: false, fontWeight: 'normal' },
    dateHeading: { ...defaultFieldStyle, color: '#000000', fontSize: 18, isBold: true, fontWeight: 'bold' },
    date: { ...defaultFieldStyle, color: '#000000', fontSize: 16, isBold: false, fontWeight: 'normal' },
  });

  const [watermark, setWatermark] = useState<WatermarkConfig>({
    url: '',
    processedUrl: '',
    size: 50,
    opacity: 0.15,
    tolerance: 230,
    mode: 'single',
    hAlign: 'center',
    vAlign: 'center',
    offsetX: 0,
    offsetY: 0,
    offsetUnit: '%',
    tileSpacing: 20,
    rotation: -25,
  });

  const [logo, setLogo] = useState<LogoConfig>({
    url: '',
    size: 240,
    offsetX: 0,
    offsetY: 0,
    offsetUnit: 'px',
  });

  const [isCanvasTransparent, setIsCanvasTransparent] = useState(false);

  const [previewMode, setPreviewMode] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [zoomMode, setZoomMode] = useState<'fit' | 'manual'>('fit');
  const [manualZoom, setManualZoom] = useState<number>(1);
  const [exportScale, setExportScale] = useState(3);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'jpg' | 'png' | 'svg'>('pdf');

  // --- History & Undo/Redo ---
  const [history, setHistory] = useState<{data: CoverData, styles: CoverStyles}[]>([]);
  const [future, setFuture] = useState<{data: CoverData, styles: CoverStyles}[]>([]);
  
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const result = await response.json();
      
      setData(prev => ({
        ...prev,
        topic: result.topic || prev.topic,
        courseTitle: result.courseTitle || prev.courseTitle,
        submittedTo: result.submittedTo || prev.submittedTo,
        submittedBy: result.submittedBy || prev.submittedBy
      }));
      
      setIsAIDialogOpen(false);
      setAiPrompt('');
    } catch (err) {
      console.error("AI Generation error", err);
      setAiError(language === 'bn' ? 'তথ্য জেনারেট করতে সমস্যা হয়েছে।' : 'An error occurred while generating content.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isUndoRedoActive = useRef(false);

  useEffect(() => {
    setHistory([{ data, styles }]);
  }, []); // Initial hydration

  useEffect(() => {
    if (isUndoRedoActive.current) {
      isUndoRedoActive.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setHistory(prev => {
        const last = prev[prev.length - 1];
        if (!last) return [{ data, styles }];
        
        if (JSON.stringify(last.data) !== JSON.stringify(data) || 
            JSON.stringify(last.styles) !== JSON.stringify(styles)) {
          setFuture([]); // Clear future on new edit
          const newHistory = [...prev, { data, styles }];
          if (newHistory.length > 50) newHistory.shift();
          return newHistory;
        }
        return prev;
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [data, styles]);

  const handleUndo = () => {
    const lastSaved = history[history.length - 1];
    const isDirty = JSON.stringify(data) !== JSON.stringify(lastSaved.data) || 
                    JSON.stringify(styles) !== JSON.stringify(lastSaved.styles);

    if (history.length > 1 || isDirty) {
      if (isDirty) {
        setFuture(prev => [{ data, styles }, ...prev]);
        isUndoRedoActive.current = true;
        setData(lastSaved.data);
        setStyles(lastSaved.styles);
      } else {
        const targetState = history[history.length - 2];
        const newHistory = history.slice(0, history.length - 1);
        
        setHistory(newHistory);
        setFuture(prev => [lastSaved, ...prev]);
        isUndoRedoActive.current = true;
        setData(targetState.data);
        setStyles(targetState.styles);
      }
    }
  };

  const handleRedo = () => {
    if (future.length > 0) {
      const nextState = future[0];
      const newFuture = future.slice(1);
      
      setHistory(prev => [...prev, nextState]);
      setFuture(newFuture);
      isUndoRedoActive.current = true;
      setData(nextState.data);
      setStyles(nextState.styles);
    }
  };

  // Enable Ctrl+Z / Cmd+Z for Undo and Ctrl+Shift+Z / Cmd+Shift+Z for Redo
  useEffect(() => {
    const handleUndoRedoKeys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        const target = e.target as HTMLElement;
        const tagName = target.tagName.toUpperCase();
        // Prevent default undo/redo if not focused on text input to let custom logic run
        // If focused on text input, it might be better to let browser handle text-level undo
        if (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        }
      }
    };
    window.addEventListener('keydown', handleUndoRedoKeys);
    return () => window.removeEventListener('keydown', handleUndoRedoKeys);
  }, [history, future, data, styles]);
  // -------------------------

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (zoomMode === 'fit') {
          setScale(entry.contentRect.width / 794);
        }
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [viewPhase, zoomMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'BrowserBack') {
        const target = e.target as HTMLElement;
        const tagName = target.tagName.toUpperCase();
        if (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT' && !target.isContentEditable) {
           e.preventDefault();
           window.history.back();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateData = (field: keyof CoverData, value: string) => setData(prev => ({ ...prev, [field]: value }));
  const updateStyle = (field: keyof CoverStyles, styleKey: keyof FieldStyle, value: string | number | boolean) => {
    setStyles(prev => ({
      ...prev,
      [field]: { ...prev[field], [styleKey]: value }
    }));
  };
  const updateWatermark = (key: keyof WatermarkConfig, value: any) => {
    setWatermark(prev => ({ ...prev, [key]: value }));
  };

  const [globalThemePrimary, setGlobalThemePrimary] = useState('#1a3688');
  const [globalThemeSecondary, setGlobalThemeSecondary] = useState('#4b5563');

  const applyGlobalColors = (primary: string, secondary: string) => {
    updateStyle('assignmentType', 'color', secondary);
    updateStyle('topic', 'color', primary);
    updateStyle('courseCodeHeading', 'color', primary);
    updateStyle('courseCode', 'color', secondary);
    updateStyle('courseTitleHeading', 'color', primary);
    updateStyle('courseTitle', 'color', secondary);
    updateStyle('submittedToHeading', 'color', primary);
    updateStyle('submittedTo', 'color', secondary);
    updateStyle('submittedByHeading', 'color', primary);
    updateStyle('submittedBy', 'color', secondary);
    updateStyle('date', 'color', secondary);
  };

  useEffect(() => {
    if (watermark.url) {
      applyMagicRemover(watermark.url, watermark.tolerance).then(url => {
        setWatermark(prev => ({ ...prev, processedUrl: url }));
      });
    }
  }, [watermark.url, watermark.tolerance]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setWatermark(prev => ({ ...prev, processedUrl: '', url: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogo(prev => ({ ...prev, url: event.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const downloadAs = async (format: 'pdf' | 'jpg' | 'png') => {
    if (!previewRef.current) return;
    const element = previewRef.current;
    
    // Briefly force scale to 1 for high-quality capture
    const originalTransform = element.style.transform;
    element.style.transform = 'scale(1)';
    // Yield to browser to ensure layout updates
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const canvas = await html2canvas(element, {
        scale: exportScale,
        useCORS: true,
        backgroundColor: isCanvasTransparent ? null : '#ffffff',
        logging: false,
        onclone: (clonedDoc, clonedElement) => {
           // Ensure cloned element has explicit dimensions to prevent flex collapse
           clonedElement.style.width = '794px';
           clonedElement.style.height = '1123px';
        }
      });

      if (format === 'pdf') {
        const imgData = canvas.toDataURL(isCanvasTransparent ? 'image/png' : 'image/jpeg', 1.0);
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, isCanvasTransparent ? 'PNG' : 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('assignment-cover.pdf');
      } else {
        const imgData = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`, 1.0);
        const link = document.createElement('a');
        link.download = `assignment-cover.${format}`;
        link.href = imgData;
        link.click();
      }
    } catch (err) {
      console.error("Export error", err);
      alert("Failed to capture image. Please try again or use SVG export.");
    } finally {
      element.style.transform = originalTransform;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  };

  const renderWatermarkPreview = () => {
    if (!watermark.processedUrl) return null;

    if (watermark.mode === 'tiled' || watermark.mode === 'pattern') {
      const tileCount = Math.max(20, Math.ceil((100 / (watermark.size || 10)) ** 2) * 5);
      const isPattern = watermark.mode === 'pattern';
      
      return (
        <div 
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          style={{ opacity: watermark.opacity }}
        >
          <div 
            className="flex flex-wrap content-start items-start justify-start w-[200%] h-[200%]"
            style={{ 
              gap: `${watermark.tileSpacing}px`, 
              padding: `${watermark.tileSpacing}px`, 
              margin: `calc(-50% - ${watermark.tileSpacing}px) -${watermark.tileSpacing}px -${watermark.tileSpacing}px calc(-50% - ${watermark.tileSpacing}px)`,
              transform: `rotate(${watermark.rotation}deg)`
            }}
          >
            {Array.from({ length: tileCount * 2 }).map((_, i) => (
              <img 
                key={i}
                src={watermark.processedUrl} 
                alt="watermark tile" 
                className="shrink-0"
                style={{ 
                  width: `${watermark.size}%`, 
                  mixBlendMode: 'normal',
                  marginLeft: (isPattern && i % 2 !== 0) ? `${watermark.size / 2}%` : '0' 
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    const { hAlign, vAlign, offsetX, offsetY, offsetUnit, size, opacity } = watermark;
    let justify = 'center';
    let align = 'center';
    
    if (hAlign === 'left') justify = 'flex-start';
    if (hAlign === 'right') justify = 'flex-end';
    if (vAlign === 'top') align = 'flex-start';
    if (vAlign === 'bottom') align = 'flex-end';

    const tx = `${offsetX}${offsetUnit}`;
    const ty = `${offsetY}${offsetUnit}`;
    const transform = `translate(${tx}, ${ty}) rotate(${watermark.rotation}deg)`;

    return (
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex" style={{
        justifyContent: justify,
        alignItems: align,
      }}>
        <img 
          src={watermark.processedUrl} 
          alt="watermark" 
          className="max-w-none"
          style={{ width: `${size}%`, opacity: opacity, mixBlendMode: 'normal', transform }}
        />
      </div>
    );
  };

  const downloadSvg = async () => {
    if (!previewRef.current) return;
    const element = previewRef.current;
    const originalTransform = element.style.transform;
    element.style.transform = 'scale(1)';
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const dataUrl = await toSvg(element, { 
        backgroundColor: isCanvasTransparent ? 'transparent' : '#ffffff',
        style: {
          width: '794px',
          height: '1123px',
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      const link = document.createElement('a');
      link.download = 'assignment-cover.svg';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("SVG export error", err);
    } finally {
      element.style.transform = originalTransform;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      className="h-screen flex flex-col bg-bg-main"
    >
      {/* Editor Top Bar */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-border-subtle bg-bg-panel shrink-0 shadow-sm z-50">
        <CoverGenLogo onClick={onLogoClick} />
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 border-r border-border-strong pr-4 mr-2">
            <button 
              onClick={handleUndo} 
              disabled={history.length <= 1 && JSON.stringify(data) === JSON.stringify(history[history.length - 1]?.data) && JSON.stringify(styles) === JSON.stringify(history[history.length - 1]?.styles)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${history.length > 1 || (history[history.length - 1] && (JSON.stringify(data) !== JSON.stringify(history[history.length - 1].data) || JSON.stringify(styles) !== JSON.stringify(history[history.length - 1].styles))) ? 'text-text-secondary hover:text-text-primary hover:bg-bg-hover cursor-pointer' : 'text-text-muted opacity-50 cursor-not-allowed'}`}
              title="Undo (Ctrl+Z)"
            >
              <Undo size={18} />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={future.length === 0}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${future.length > 0 ? 'text-text-secondary hover:text-text-primary hover:bg-bg-hover cursor-pointer' : 'text-text-muted opacity-50 cursor-not-allowed'}`}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo size={18} />
            </button>
          </div>

          <button onClick={toggleTheme} className="text-text-secondary hover:text-text-primary transition-colors p-2 rounded-full hover:bg-bg-hover">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-1 bg-bg-button hover:bg-bg-hover rounded-lg text-sm text-text-primary border border-border-strong transition-colors relative">
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="appearance-none bg-transparent outline-none pl-3 pr-8 py-1.5 cursor-pointer font-bold z-10 w-full"
            >
              <option value="en">EN</option>
              <option value="bn">BN</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary" />
          </div>
        </div>
      </header>

      {viewPhase === 'content' ? (
        <main className="flex-1 overflow-y-auto bg-bg-main z-10 custom-scrollbar pb-20 relative">
          <div className="fixed inset-0 z-[-1] bg-[#e2e8f0] dark:bg-transparent bg-[linear-gradient(to_right,rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-100 dark:opacity-60"></div>
          
          {isAIDialogOpen && (
            <div className="fixed inset-0 z-[100] flex justify-center bg-black/50 backdrop-blur-sm items-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-bg-panel w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-border-subtle flex flex-col"
              >
                <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    {language === 'bn' ? 'এআই দিয়ে তৈরি করুন' : 'Generate with AI'}
                  </h3>
                  <button onClick={() => setIsAIDialogOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-text-secondary">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <p className="text-sm text-text-secondary">
                    {language === 'bn' 
                      ? 'অ্যাসাইনমেন্টের ধরন এবং বিষয় সম্পর্কে সংক্ষেপে লিখুন। এআই স্বয়ংক্রিয়ভাবে প্রাসঙ্গিক শিরোনাম, কোর্সের বিবরণ, এবং অন্যান্য তথ্য পূরণ করে দেবে।'
                      : 'Briefly describe your assignment type and topic. AI will suggest relevant content for topic, course description, and submission details.'}
                  </p>
                  
                  <textarea 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder={language === 'bn' ? "উদা: 'কম্পিউটার নেটওয়ার্কিং এর উপর একটি ল্যাব রিপোর্ট'" : "e.g. 'A lab report on Computer Networking for Prof. Smith'"}
                    className="w-full h-32 p-4 rounded-xl border border-border-strong bg-bg-input outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                    disabled={isGenerating}
                  />
                  
                  {aiError && <p className="text-red-500 text-sm mt-2">{aiError}</p>}
                </div>
                
                <div className="p-6 border-t border-border-subtle bg-bg-main flex justify-end gap-3">
                  <button 
                    onClick={() => setIsAIDialogOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-medium hover:bg-bg-hover transition-colors text-text-secondary"
                    disabled={isGenerating}
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button 
                    onClick={handleAIGenerate}
                    disabled={!aiPrompt.trim() || isGenerating}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {language === 'bn' ? (isGenerating ? 'তৈরি হচ্ছে...' : 'জেনারেট করুন') : (isGenerating ? 'Generating...' : 'Generate')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          <div className="max-w-4xl mx-auto px-6 pt-12 text-center relative">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">{language === 'bn' ? 'অ্যাসাইনমেন্টের তথ্য' : 'Assignment Information'}</h1>
            <p className="text-text-secondary mb-8 max-w-xl mx-auto text-lg leading-relaxed">{language === 'bn' ? 'অ্যাসাইনমেন্টের মূল তথ্যগুলো পূরণ করুন। আপনি পরবর্তী ধাপে ক্যানভাসের স্টাইল এবং ফরম্যাট পরিবর্তন করতে পারবেন।' : 'Fill in the core details of your assignment. You\'ll be able to style and format the canvas in the next step.'}</p>
            
            <div className="flex justify-center mb-10">
              <button 
                onClick={() => setIsAIDialogOpen(true)}
                className="group relative px-6 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-900/40 dark:hover:to-blue-900/40 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <Wand2 className="w-5 h-5 text-indigo-500" />
                {language === 'bn' ? 'এআই দিয়ে স্বয়ংক্রিয়ভাবে পূরণ করুন' : 'Auto-fill with AI Assistant'}
              </button>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto bg-bg-panel border border-border-subtle rounded-3xl p-8 sm:p-12 mb-12 shadow-2xl relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              <div className="space-y-4 md:col-span-2 bg-[#f8fafc] dark:bg-bg-hover p-6 rounded-2xl border border-border-subtle shadow-sm">
                 <label className="text-sm uppercase tracking-widest font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div> {language === 'bn' ? 'অ্যাসাইনমেন্টের ধরন' : 'Assignment Type'}
                 </label>
                 <textarea value={data.assignmentType} onChange={e => updateData('assignmentType', e.target.value)} className="w-full p-4 rounded-xl border border-blue-200 dark:border-blue-900/30 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-blue-500 transition-colors resize-none font-bold text-lg shadow-sm" rows={2} placeholder={language === 'bn' ? 'উদা. অ্যাসাইনমেন্টের বিষয়' : 'e.g. AN ASSIGNMENT ON'} />
              </div>
              
              <div className="space-y-4 md:col-span-2 bg-[#fcf8ff] dark:bg-bg-hover p-6 rounded-2xl border border-border-subtle shadow-sm mb-4">
                 <label className="text-sm uppercase tracking-widest font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-purple-500"></div> {language === 'bn' ? 'শিরোনাম' : 'Topic Title'}
                 </label>
                 <textarea value={data.topic} onChange={e => updateData('topic', e.target.value)} className="w-full p-4 rounded-xl border border-purple-200 dark:border-purple-900/30 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-purple-500 transition-colors resize-none font-bold text-2xl leading-snug shadow-sm" rows={2} placeholder={language === 'bn' ? 'উদা. বাংলাদেশের নদী' : 'e.g. STUDY ON FRESHWATER'} />
              </div>

              <div className="p-6 rounded-2xl bg-[#f0fdfa] dark:bg-bg-hover border border-emerald-100 dark:border-emerald-900/30 shadow-sm space-y-6 md:col-span-1">
                <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400 font-bold tracking-tight text-lg">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm shadow-sm border border-emerald-500/10">1</div>
                  {language === 'bn' ? 'কোর্সের বিবরণ' : 'Course Details'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3 md:col-span-1">
                     <label className="text-xs uppercase tracking-widest font-extrabold text-emerald-700/80 dark:text-emerald-400/80 mb-1 block">{language === 'bn' ? 'কোর্স নং (শিরোনাম)' : 'Course No. (Heading)'}</label>
                     <input type="text" value={data.courseCodeHeading} onChange={e => updateData('courseCodeHeading', e.target.value)} className="w-full p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-emerald-500 transition-colors font-medium shadow-sm" placeholder={language === 'bn' ? 'উদা. কোর্স কোড:' : 'e.g. COURSE NO:'} />
                  </div>
                  <div className="space-y-3 md:col-span-1">
                     <label className="text-xs uppercase tracking-widest font-extrabold text-emerald-700/80 dark:text-emerald-400/80 mb-1 block">{language === 'bn' ? 'কোর্স নং (বিষয়বস্তু)' : 'Course No. (Content)'}</label>
                     <input type="text" value={data.courseCode} onChange={e => updateData('courseCode', e.target.value)} className="w-full p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-emerald-500 transition-colors font-medium shadow-sm" placeholder={language === 'bn' ? 'উদা. ০৫২১' : 'e.g. 0521'} />
                  </div>
                </div>
                
                <div className="space-y-3">
                   <label className="text-xs uppercase tracking-widest font-extrabold text-emerald-700/80 dark:text-emerald-400/80 mb-1 block">{language === 'bn' ? 'কোর্সের নাম (শিরোনাম)' : 'Course Name (Heading)'}</label>
                   <input type="text" value={data.courseTitleHeading} onChange={e => updateData('courseTitleHeading', e.target.value)} className="w-full p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-emerald-500 transition-colors font-medium shadow-sm" placeholder={language === 'bn' ? 'উদা. কোর্সের শিরোনাম:' : 'e.g. COURSE NAME:'} />
                </div>
                <div className="space-y-3">
                   <label className="text-xs uppercase tracking-widest font-extrabold text-emerald-700/80 dark:text-emerald-400/80 mb-1 block">{language === 'bn' ? 'কোর্সের নাম (বিষয়বস্তু)' : 'Course Name (Content)'}</label>
                   <textarea value={data.courseTitle} onChange={e => updateData('courseTitle', e.target.value)} className="w-full p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-emerald-500 transition-colors resize-none font-medium leading-snug shadow-sm" rows={2} placeholder={language === 'bn' ? 'উদা. জৈবিক পরিবেশ' : 'e.g. BIOLOGICAL ENVIRONMENT'} />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#fff1f2] dark:bg-bg-hover border border-pink-100 dark:border-pink-900/30 shadow-sm space-y-6 md:col-span-1">
                 <div className="flex items-center gap-2 mb-4 text-pink-600 dark:text-pink-400 font-bold tracking-tight text-lg">
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-700 dark:text-pink-300 flex items-center justify-center text-sm shadow-sm border border-pink-500/10">2</div>
                    {language === 'bn' ? 'জমা দেওয়ার তারিখ' : 'Submission Date'}
                  </div>
                 <div className="space-y-3 pl-1">
                   <label className="text-xs uppercase tracking-widest font-extrabold text-pink-700/80 dark:text-pink-400/80 mb-1 block">{language === 'bn' ? 'জমা দেওয়ার তারিখ (শিরোনাম)' : 'Date of Submission (Heading)'}</label>
                   <input type="text" value={data.dateHeading} onChange={e => updateData('dateHeading', e.target.value)} className="w-full p-4 rounded-xl border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-pink-500 transition-colors font-medium shadow-sm" placeholder={language === 'bn' ? 'উদা. জমা দেওয়ার তারিখ:' : 'e.g. DATE OF SUBMISSION:'} />
                 </div>
                 <div className="space-y-3 pl-1">
                   <label className="text-xs uppercase tracking-widest font-extrabold text-pink-700/80 dark:text-pink-400/80 mb-1 block">{language === 'bn' ? 'জমা দেওয়ার তারিখ (বিষয়বস্তু)' : 'Date of Submission (Content)'}</label>
                   <textarea value={data.date} onChange={e => updateData('date', e.target.value)} className="w-full p-4 rounded-xl border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-pink-500 transition-colors resize-none font-bold text-lg leading-snug shadow-sm" rows={2} placeholder={language === 'bn' ? 'উদা. ১০-০৫-২০২৬' : 'e.g. 2026-05-10'} />
                 </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#fff7ed] dark:bg-bg-hover border border-orange-200 dark:border-orange-900/30 shadow-sm space-y-6 md:col-span-1">
                  <div className="flex items-center gap-2 mb-4 text-orange-600 dark:text-orange-400 font-bold tracking-tight text-xl">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300 flex items-center justify-center text-base shadow-sm border border-orange-500/10">3</div>
                    {language === 'bn' ? 'যার কাছে জমা দেওয়া হচ্ছে' : 'Submitted To'}
                  </div>
                 <div className="space-y-3">
                   <label className="text-xs uppercase tracking-widest font-extrabold text-orange-700/80 dark:text-orange-400/80 mb-1 block">{language === 'bn' ? 'শিরোনাম' : 'Heading'}</label>
                   <input type="text" value={data.submittedToHeading} onChange={e => updateData('submittedToHeading', e.target.value)} className="w-full p-4 rounded-xl border border-orange-200 dark:border-orange-900/50 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-orange-500 transition-colors font-bold text-lg shadow-sm" placeholder={language === 'bn' ? 'উদা. যার কাছে জমা দেওয়া হচ্ছে,' : 'e.g. SUBMITTED TO,'} />
                 </div>
                 <div className="space-y-3">
                   <label className="text-xs uppercase tracking-widest font-extrabold text-orange-700/80 dark:text-orange-400/80 mb-1 block">{language === 'bn' ? 'শিক্ষকের বিবরণ' : 'Instructor Details & Affiliation'}</label>
                   <textarea value={data.submittedTo} onChange={e => updateData('submittedTo', e.target.value)} className="w-full p-4 rounded-xl border border-orange-200 dark:border-orange-900/50 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-orange-500 transition-colors resize-none font-medium leading-relaxed shadow-sm" rows={6} placeholder={language === 'bn' ? 'ড. কাজী জাহাঙ্গীর হোসেন\nঅধ্যাপক\nপরিবেশ বিজ্ঞান অনুষদ' : 'Dr. Quazi Jahangir Hossain\nProfessor\nEnvironmental Science Discipline'} />
                 </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#f5f3ff] dark:bg-bg-hover border border-violet-200 dark:border-violet-900/30 shadow-sm space-y-6 md:col-span-1">
                 <div className="flex items-center gap-2 mb-4 text-violet-600 dark:text-violet-400 font-bold tracking-tight text-xl">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-base shadow-sm border border-violet-500/10">4</div>
                    {language === 'bn' ? 'জমা দিচ্ছেন' : 'Submitted By'}
                  </div>
                 <div className="space-y-3">
                   <label className="text-xs uppercase tracking-widest font-extrabold text-violet-700/80 dark:text-violet-400/80 mb-1 block">{language === 'bn' ? 'শিরোনাম' : 'Heading'}</label>
                   <input type="text" value={data.submittedByHeading} onChange={e => updateData('submittedByHeading', e.target.value)} className="w-full p-4 rounded-xl border border-violet-200 dark:border-violet-900/50 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-violet-500 transition-colors font-bold text-lg shadow-sm" placeholder="e.g. SUBMITTED BY," />
                 </div>
                 <div className="space-y-3">
                   <label className="text-xs uppercase tracking-widest font-extrabold text-violet-700/80 dark:text-violet-400/80 mb-1 block">{language === 'bn' ? 'শিক্ষার্থীর বিবরণ' : 'Student Details & Affiliation'}</label>
                   <textarea value={data.submittedBy} onChange={e => updateData('submittedBy', e.target.value)} className="w-full p-4 rounded-xl border border-violet-200 dark:border-violet-900/50 bg-white dark:bg-bg-input outline-none text-text-primary focus:border-violet-500 transition-colors resize-none font-medium leading-relaxed shadow-sm" rows={6} placeholder={language === 'bn' ? 'অনিরুদ্ধ দে\nস্টুডেন্ট আইডি: ২৫১০০৯\nপ্রথম বর্ষ, দ্বিতীয় টার্ম' : 'Anirudha Dey\nSTUDENT ID: 251009\n1st Year, 2nd Term'} />
                 </div>
              </div>

            </div>

            <div className="mt-12 flex justify-center border-t border-border-subtle pt-10">
               <button onClick={() => setViewPhase('styling')} className="px-10 py-4 bg-[#1a3688] hover:bg-[#2042a3] text-white rounded-2xl font-bold tracking-wide text-lg flex items-center gap-3 transition-colors shadow-xl shadow-blue-900/20">
                 {language === 'bn' ? 'টাইপোগ্রাফিতে যান' : 'Continue to Typography'} <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </div>
        </main>
      ) : viewPhase === 'styling' ? (
        <main className="flex-1 overflow-y-auto bg-bg-main z-10 custom-scrollbar pb-20 relative">
          <div className="fixed inset-0 z-[-1] bg-[#e2e8f0] dark:bg-transparent bg-[radial-gradient(rgba(148,163,184,0.3)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none opacity-100 dark:opacity-60"></div>
          
          <div className="max-w-5xl mx-auto px-6 pt-12 text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">{language === 'bn' ? 'টাইপোগ্রাফি এবং স্টাইলিং' : 'Typography & Styling'}</h1>
            <p className="text-text-secondary max-w-xl mx-auto text-lg leading-relaxed">{language === 'bn' ? 'কভার পৃষ্ঠার প্রতিটি উপাদানের ভিজ্যুয়াল স্টাইল ঠিকভাবে টিউন করুন।' : 'Perfectly tune the visual style of every element on your cover page.'}</p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6 px-6">
            {(Object.keys(styles) as Array<keyof CoverStyles>).map((key) => {
              const labelMap: Record<keyof CoverStyles, string> = {
                assignmentType: 'Assignment Type',
                topic: 'Topic Title',
                courseCodeHeading: 'Course Code (Heading)',
                courseCode: 'Course Code (Content)',
                courseTitleHeading: 'Course Name (Heading)',
                courseTitle: 'Course Name (Content)',
                submittedToHeading: 'Submitted To (Heading)',
                submittedTo: 'Submitted To (Content)',
                submittedByHeading: 'Submitted By (Heading)',
                submittedBy: 'Submitted By (Content)',
                dateHeading: 'Date (Heading)',
                date: 'Date (Content)'
              };
              
              const title = labelMap[key] || key;
              const style = styles[key];
              const textValue = data[key];

              return (
                <div key={key} className="bg-bg-panel border border-border-subtle rounded-3xl p-6 shadow-sm overflow-hidden relative group">
                  <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Preview Area */}
                    <div className="flex-1 min-w-[300px] flex flex-col justify-center bg-[#f8fafc] dark:bg-white rounded-2xl p-6 border border-border-subtle relative overflow-hidden">
                      <div className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Content & Preview</div>
                      
                      <div className="w-full flex items-center justify-center min-h-[120px] mt-2 mb-4">
                        <div 
                           className="text-center whitespace-pre-wrap transition-all duration-300 dark:text-black"
                           style={getFieldCss(style)}
                        >
                          {textValue || 'Empty Content'}
                        </div>
                      </div>

                      <div className="w-full pt-4 border-t border-border-subtle relative">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">Edit Text</label>
                         {(key === 'topic' || key === 'assignmentType' || key === 'courseTitle' || key === 'submittedByHeading' || key === 'submittedToHeading') ? (
                           <textarea 
                             value={textValue}
                             onChange={(e) => updateData(key, e.target.value)}
                             className="w-full p-3 rounded-xl border border-border-strong bg-bg-input outline-none text-text-primary text-sm focus:border-blue-500/50 resize-y min-h-[80px]"
                           />
                         ) : (
                           <input 
                             type="text"
                             value={textValue}
                             onChange={(e) => updateData(key, e.target.value)}
                             className="w-full p-3 rounded-xl border border-border-strong bg-bg-input outline-none text-text-primary text-sm focus:border-blue-500/50"
                           />
                         )}
                      </div>
                    </div>

                    {/* Controls Area */}
                    <div className="flex-[1.5] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                      <div className="col-span-1 sm:col-span-2">
                        <h3 className="text-xl font-bold mb-1">{title}</h3>
                        <p className="text-xs text-text-secondary">Customize the typography perfectly.</p>
                      </div>

                      {/* Font Family */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Font Family</label>
                        <CustomFontPicker 
                          value={style.fontFamily} 
                          onChange={(val) => updateStyle(key, 'fontFamily', val)} 
                        />
                      </div>

                      {/* Font Weight */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Font Weight</label>
                        <select 
                          value={style.fontWeight || (style.isBold ? 'bold' : 'normal')}
                          onChange={(e) => updateStyle(key, 'fontWeight', e.target.value)}
                          className="w-full p-3 rounded-xl border border-border-strong bg-bg-input outline-none text-text-primary focus:border-blue-500/50"
                        >
                          <option value="300">Light (300)</option>
                          <option value="normal">Regular (400)</option>
                          <option value="500">Medium (500)</option>
                          <option value="600">Semi-Bold (600)</option>
                          <option value="bold">Bold (700)</option>
                          <option value="800">Extra Bold (800)</option>
                        </select>
                      </div>

                      {/* Font Size */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Size (px)</label>
                          <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">{style.fontSize}</span>
                        </div>
                        <div className="h-[46px] flex items-center">
                          <input 
                            type="range" min="10" max="80"
                            value={style.fontSize}
                            onChange={(e) => updateStyle(key, 'fontSize', parseInt(e.target.value) || 16)}
                            className="w-full accent-blue-500"
                          />
                        </div>
                      </div>

                      {/* Additional Styling */}
                      <div className="space-y-2 col-span-1 sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Text Style</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const isBold = style.fontWeight === 'bold' || style.fontWeight === '700' || style.fontWeight === '800';
                              updateStyle(key, 'fontWeight', isBold || style.isBold ? 'normal' : 'bold');
                            }}
                            className={`p-2.5 rounded-lg border transition-colors ${(style.fontWeight === 'bold' || style.fontWeight === '700' || style.fontWeight === '800' || style.isBold) ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                            title="Bold"
                          >
                            <Bold size={18} />
                          </button>
                          <button 
                            onClick={() => updateStyle(key, 'isItalic', !style.isItalic)}
                            className={`p-2.5 rounded-lg border transition-colors ${style.isItalic ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                            title="Italic"
                          >
                            <Italic size={18} />
                          </button>
                          <button 
                            onClick={() => updateStyle(key, 'textDecoration', style.textDecoration === 'underline' ? 'none' : 'underline')}
                            className={`p-2.5 rounded-lg border transition-colors ${style.textDecoration === 'underline' ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                            title="Underline"
                          >
                            <Underline size={18} />
                          </button>
                          <button 
                            onClick={() => updateStyle(key, 'textDecoration', style.textDecoration === 'line-through' ? 'none' : 'line-through')}
                            className={`p-2.5 rounded-lg border transition-colors ${style.textDecoration === 'line-through' ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                            title="Strikethrough"
                          >
                            <Strikethrough size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Text Transform */}
                      <div className="space-y-2 col-span-1 sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Text Transform</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateStyle(key, 'textTransform', style.textTransform === 'uppercase' ? 'none' : 'uppercase')}
                            className={`p-2.5 rounded-lg border transition-colors ${style.textTransform === 'uppercase' ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                            title="Uppercase"
                          >
                            <span className="font-bold text-sm tracking-widest leading-none">AA</span>
                          </button>
                          <button 
                            onClick={() => updateStyle(key, 'textTransform', style.textTransform === 'lowercase' ? 'none' : 'lowercase')}
                            className={`p-2.5 rounded-lg border transition-colors ${style.textTransform === 'lowercase' ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                            title="Lowercase"
                          >
                            <span className="font-bold text-sm tracking-widest leading-none">aa</span>
                          </button>
                          <button 
                            onClick={() => updateStyle(key, 'textTransform', style.textTransform === 'capitalize' ? 'none' : 'capitalize')}
                            className={`p-2.5 rounded-lg border transition-colors ${style.textTransform === 'capitalize' ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                            title="Capitalize"
                          >
                            <span className="font-bold text-sm tracking-wider leading-none">Aa</span>
                          </button>
                        </div>
                      </div>

                      {/* Font Color */}
                      <div className="space-y-2 col-span-1 sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Color</label>
                        <CustomColorPicker 
                          color={style.color}
                          onChange={(val) => updateStyle(key, 'color', val)}
                          presetColors={['#000000', '#1a3688', '#800000', '#2E4053', '#0E6655', '#4A235A', '#154360', '#6E2C00', '#4D5656', '#145A32', '#7B241C', '#1B4F72']}
                          size="lg"
                        />
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center mt-12 border-t border-border-subtle pt-10 pb-20">
               <button onClick={() => setViewPhase('content')} className="px-6 py-4 text-text-secondary hover:bg-bg-hover rounded-2xl font-bold tracking-wide flex items-center gap-2 transition-colors">
                 <ChevronRight className="w-5 h-5 rotate-180" /> Back to Content
               </button>
               <button onClick={() => setViewPhase('designer')} className="px-10 py-4 bg-[#1a3688] hover:bg-[#2042a3] text-white rounded-2xl font-bold tracking-wide text-lg flex items-center gap-3 transition-colors shadow-xl shadow-blue-900/20">
                 Finalize Canvas <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </div>
        </main>
      ) : (
      
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Body */}
        
        {/* Left Side Panel */}
        <div 
          className={`border-r border-border-subtle flex flex-col z-10 shrink-0 relative transition-all duration-300 ${
            showExportModal || previewMode 
              ? 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-md' 
              : 'bg-bg-panel'
          }`}
          style={{ width: `${sidebarWidth}px`, maxWidth: '100%', display: 'flex' }}
        >
          {/* Draggable Divider */}
          <div 
            className={`absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-blue-500/50 z-50 transition-colors ${isDragging ? 'bg-blue-500' : 'bg-transparent'}`}
            onMouseDown={() => setIsDragging(true)}
            style={{ transform: 'translateX(50%)' }}
            title="Drag to resize panel"
          />

          <div className="flex justify-between items-center p-4 border-b border-border-subtle shrink-0">
            <button onClick={() => setViewPhase('styling')} className="text-sm font-bold text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-bg-hover">
               <ChevronRight className="w-4 h-4 rotate-180" /> Back to Typography
            </button>
          </div>
          
          <div className="flex w-full border-b border-border-subtle bg-bg-panel shrink-0 p-2 gap-1 overflow-x-auto custom-scrollbar">
               <button onClick={() => setActiveTab('templates')} className={`flex-1 min-w-20 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'templates' ? 'bg-bg-button text-text-primary shadow-sm' : 'text-text-secondary hover:bg-bg-hover'}`}>Templates</button>
               <button onClick={() => setActiveTab('logo')} className={`flex-1 min-w-20 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'logo' ? 'bg-bg-button text-text-primary shadow-sm' : 'text-text-secondary hover:bg-bg-hover'}`}>Logo</button>
               <div className={`flex flex-1 min-w-28 items-center rounded-md transition-colors ${activeTab === 'watermark' ? 'bg-bg-button shadow-sm' : 'hover:bg-bg-hover'}`}>
                 <button onClick={() => setActiveTab('watermark')} className={`w-full py-1.5 text-xs font-bold ${activeTab === 'watermark' ? 'text-text-primary' : 'text-text-secondary'}`}>Watermark</button>
                 <label className="flex items-center pr-2 cursor-pointer" title="Transparent Canvas Background">
                   <input 
                     type="checkbox" 
                     checked={isCanvasTransparent}
                     onChange={(e) => setIsCanvasTransparent(e.target.checked)}
                     className="rounded border-border-strong text-blue-500 focus:ring-blue-500/50 bg-bg-input cursor-pointer"
                   />
                 </label>
               </div>
               <button onClick={() => setActiveTab('styling')} className={`flex-1 min-w-20 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'styling' ? 'bg-bg-button text-text-primary shadow-sm' : 'text-text-secondary hover:bg-bg-hover'}`}>Styling</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {activeTab === 'templates' && (
                <div className="space-y-6 pb-10">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold">Pre-designed Templates</h2>
                    <p className="text-xs text-text-muted leading-relaxed">Select a template to quickly apply a cohesive style combination to your entire cover page.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {coverTemplates.map(template => (
                      <button 
                        key={template.id}
                        onClick={() => {
                          setHistory(prev => {
                            const newHistory = [...prev, { data, styles }];
                            if (newHistory.length > 50) newHistory.shift();
                            return newHistory;
                          });
                          setFuture([]);
                          isUndoRedoActive.current = true;
                          setStyles(template.styles);
                        }}
                        className="flex flex-col items-start p-4 bg-bg-main border border-border-strong rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left group"
                      >
                         <h3 className="text-sm font-bold text-text-primary mb-1 group-hover:text-blue-600 transition-colors">{template.name}</h3>
                         <p className="text-[11px] text-text-secondary leading-relaxed mb-3">{template.description}</p>
                         
                         <div className="w-full flex gap-1 h-3 rounded-sm overflow-hidden opacity-80 mt-auto">
                            <div className="flex-1" style={{ backgroundColor: template.styles.assignmentType.color }}></div>
                            <div className="flex-1 border-x border-border-subtle" style={{ backgroundColor: template.styles.topic.color }}></div>
                            <div className="flex-1" style={{ backgroundColor: template.styles.courseCode.color || '#000' }}></div>
                         </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'logo' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold">University Logo</h2>
                  <div className="p-4 rounded-xl border border-border-subtle bg-bg-input space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-wider font-semibold text-text-secondary">Upload Logo</label>
                      <label className="cursor-pointer px-4 py-2 rounded-full border border-border-strong bg-bg-panel hover:bg-bg-hover text-xs font-medium flex items-center gap-2 transition-colors">
                        <ImageIcon size={14}/> Browse
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                    </div>
                    {logo.url && (
                      <div className="space-y-4 pt-4 border-t border-border-subtle">
                        <div className="w-full flex justify-center py-6 bg-bg-panel rounded-lg border border-border-strong overflow-hidden relative min-h-[150px] items-center">
                           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #888 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                           <img src={logo.url} alt="Logo Preview" className="object-contain relative z-10 transition-all duration-200" style={{ filter: 'contrast(110%) brightness(105%)', maxWidth: '100px', maxHeight: '100px', transform: `scale(${logo.size / 150})` }} />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-text-secondary flex justify-between mb-2"><span>Size</span><span>{logo.size}px</span></div>
                          <div className="flex items-center gap-3">
                            <input type="range" min="30" max="1000" value={logo.size} onChange={e => setLogo({...logo, size: parseInt(e.target.value)})} className="flex-1 accent-blue-500" />
                            <input 
                              type="number" 
                              min="30" 
                              max="1000" 
                              value={logo.size} 
                              onChange={e => setLogo({...logo, size: parseInt(e.target.value) || 240})} 
                              className="w-16 p-1.5 text-xs rounded-xl border border-border-strong bg-bg-panel outline-none text-text-primary focus:border-blue-500/50 text-center shadow-sm" 
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-text-secondary mb-2">Offset X</div>
                            <input 
                              type="number" 
                              value={logo.offsetX} 
                              onChange={e => setLogo({...logo, offsetX: Number(e.target.value)})} 
                              className="w-full p-2 text-sm rounded-xl border border-border-strong bg-bg-panel outline-none text-text-primary focus:border-blue-500/50 shadow-sm" 
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-text-secondary mb-2">Offset Y</div>
                            <input 
                              type="number" 
                              value={logo.offsetY} 
                              onChange={e => setLogo({...logo, offsetY: Number(e.target.value)})} 
                              className="w-full p-2 text-sm rounded-xl border border-border-strong bg-bg-panel outline-none text-text-primary focus:border-blue-500/50 shadow-sm" 
                            />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-text-secondary mb-2">Unit</div>
                            <select 
                              value={logo.offsetUnit} 
                              onChange={e => setLogo({...logo, offsetUnit: e.target.value as 'px' | '%'})}
                              className="w-full p-2 text-sm rounded-xl border border-border-strong bg-bg-panel outline-none text-text-primary focus:border-blue-500/50 shadow-sm"
                            >
                              <option value="px">px</option>
                              <option value="%">%</option>
                            </select>
                          </div>
                        </div>
                        <button onClick={() => setLogo({...logo, url: ''})} className="text-red-400 text-sm hover:text-red-300 transition-colors">Remove Logo</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'watermark' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold">Background Watermark</h2>
                  <div className="p-4 rounded-xl border border-border-subtle bg-bg-input space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-wider font-semibold text-text-secondary">Upload Custom</label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer px-4 py-2 rounded-full border border-border-strong bg-bg-panel hover:bg-bg-hover text-xs font-medium flex items-center gap-2 transition-colors">
                          <ImageIcon size={14}/> Browse
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                    {watermark.url && (
                      <div className="space-y-4 pt-4 border-t border-border-subtle">
                        <div className="w-full flex justify-center py-6 bg-bg-panel rounded-lg border border-border-strong overflow-hidden relative min-h-[200px] items-center">
                           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #888 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                           <img src={watermark.processedUrl || watermark.url} alt="Watermark Preview" className="object-contain relative z-10 transition-all duration-200" style={{ filter: 'grayscale(100%) brightness(1.2)', opacity: watermark.opacity, maxWidth: '100px', maxHeight: '100px', transform: `scale(${watermark.size / 50})` }} />
                        </div>
                        <div className="flex justify-between">
                             <button onClick={() => updateWatermark('url', '')} className="text-red-400 text-sm hover:text-red-300 p-1 transition-colors rounded hover:bg-bg-hover flex gap-1 items-center" title="Clear Watermark">
                               <X size={14} /> Remove Watermark
                             </button>
                        </div>
                        <button 
                          onClick={() => setPreviewMode(true)}
                          className="w-full mb-2 py-3 bg-[#1a3688] hover:bg-[#2042a3] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <Eye size={18} /> Preview Full Page & Download
                        </button>
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase opacity-50 flex justify-between"><span>Watermark Fading (Opacity)</span><span>{Math.round(watermark.opacity * 100)}%</span></div>
                          <input type="range" min="0.05" max="1" step="0.05" value={watermark.opacity} onChange={e => updateWatermark('opacity', parseFloat(e.target.value))} className="w-full accent-blue-500" />
                          <div className="text-[10px] text-text-muted text-center">Lower values fade the watermark. Default 15%.</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase opacity-50 flex justify-between"><span>Magic Background Remover (Tolerance)</span><span>{watermark.tolerance}</span></div>
                          <input type="range" min="0" max="255" value={watermark.tolerance} onChange={e => updateWatermark('tolerance', parseInt(e.target.value))} className="w-full accent-blue-500" />
                          <div className="text-[10px] text-text-muted text-center">Erase light backgrounds to make them transparent. Default 230.</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase opacity-50 flex justify-between mb-2"><span>Scale</span><span>{watermark.size}%</span></div>
                          <input type="range" min="10" max="200" value={watermark.size} onChange={e => updateWatermark('size', parseInt(e.target.value))} className="w-full accent-blue-500" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase opacity-50 flex justify-between mb-2"><span>Rotation</span><span>{watermark.rotation}°</span></div>
                          <div className="flex items-center gap-3">
                            <input type="range" min="-180" max="180" value={watermark.rotation} onChange={e => updateWatermark('rotation', parseInt(e.target.value))} className="flex-1 accent-blue-500" />
                            <input 
                              type="number" 
                              min="-180" 
                              max="180" 
                              value={watermark.rotation} 
                              onChange={e => updateWatermark('rotation', parseInt(e.target.value) || 0)} 
                              className="w-16 p-1.5 text-xs rounded-xl border border-border-strong bg-bg-panel outline-none text-text-primary focus:border-blue-500/50 text-center shadow-sm" 
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] uppercase opacity-50 block mb-1">Display Mode</label>
                            <div className="flex bg-bg-panel border border-border-strong rounded-lg p-1">
                              <button 
                                onClick={() => updateWatermark('mode', 'single')} 
                                className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${watermark.mode === 'single' ? 'bg-bg-button text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                              >
                                Single
                              </button>
                              <button 
                                onClick={() => updateWatermark('mode', 'tiled')} 
                                className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${watermark.mode === 'tiled' ? 'bg-bg-button text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                              >
                                Tiled Grid
                              </button>
                              <button 
                                onClick={() => updateWatermark('mode', 'pattern')} 
                                className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${watermark.mode === 'pattern' ? 'bg-bg-button text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                              >
                                Pattern
                              </button>
                            </div>
                          </div>
                          
                          {watermark.mode === 'single' && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] uppercase opacity-50 block mb-1">Align X</label>
                                  <select value={watermark.hAlign} onChange={e => updateWatermark('hAlign', e.target.value)} className="w-full p-2.5 text-sm rounded-xl border border-border-strong bg-bg-panel appearance-none outline-none text-text-primary focus:border-blue-500/50">
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-[10px] uppercase opacity-50 block mb-1">Align Y</label>
                                  <select value={watermark.vAlign} onChange={e => updateWatermark('vAlign', e.target.value)} className="w-full p-2.5 text-sm rounded-xl border border-border-strong bg-bg-panel appearance-none outline-none text-text-primary focus:border-blue-500/50">
                                    <option value="top">Top</option>
                                    <option value="center">Center</option>
                                    <option value="bottom">Bottom</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex gap-4 pt-4 border-t border-border-subtle mt-2">
                                <div className="flex-1">
                                  <div className="text-[10px] uppercase font-bold tracking-wider text-text-secondary mb-2">Offset X</div>
                                  <input 
                                    type="number" 
                                    value={watermark.offsetX} 
                                    onChange={e => updateWatermark('offsetX', Number(e.target.value))} 
                                    className="w-full p-2 text-sm rounded-xl border border-border-strong bg-bg-panel outline-none text-text-primary focus:border-blue-500/50 shadow-sm" 
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="text-[10px] uppercase font-bold tracking-wider text-text-secondary mb-2">Offset Y</div>
                                  <input 
                                    type="number" 
                                    value={watermark.offsetY} 
                                    onChange={e => updateWatermark('offsetY', Number(e.target.value))} 
                                    className="w-full p-2 text-sm rounded-xl border border-border-strong bg-bg-panel outline-none text-text-primary focus:border-blue-500/50 shadow-sm" 
                                  />
                                </div>
                                <div>
                                  <div className="text-[10px] uppercase font-bold tracking-wider text-text-secondary mb-2">Unit</div>
                                  <select 
                                    value={watermark.offsetUnit} 
                                    onChange={e => updateWatermark('offsetUnit', e.target.value as 'px' | '%')}
                                    className="w-full p-2 text-sm rounded-xl border border-border-strong bg-bg-panel outline-none text-text-primary focus:border-blue-500/50 shadow-sm"
                                  >
                                    <option value="px">px</option>
                                    <option value="%">%</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {(watermark.mode === 'tiled' || watermark.mode === 'pattern') && (
                            <div className="space-y-3 pt-2">
                              <div className="space-y-1">
                                <div className="text-[10px] uppercase opacity-50 flex justify-between"><span>Tile Spacing</span><span>{watermark.tileSpacing}px</span></div>
                                <input type="range" min="0" max="200" value={watermark.tileSpacing} onChange={e => updateWatermark('tileSpacing', parseInt(e.target.value) || 0)} className="w-full accent-blue-500" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'styling' && (
                <div className="space-y-8 pb-10">
                  
                  {/* Global Theme Settings */}
                  <div className="space-y-4 pb-6 border-b border-border-subtle">
                    <h2 className="text-lg font-bold">Global Theme Settings</h2>
                    <p className="text-xs text-text-muted leading-relaxed">Define primary and secondary colors. These will be intelligently applied across all components on the cover page.</p>
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Primary Color (Headings)</label>
                        <CustomColorPicker 
                          color={globalThemePrimary}
                          presetColors={ACADEMIC_COLORS}
                          onChange={(val) => {
                             setGlobalThemePrimary(val);
                             applyGlobalColors(val, globalThemeSecondary);
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Secondary Color (Text)</label>
                        <CustomColorPicker 
                          color={globalThemeSecondary}
                          presetColors={ACADEMIC_COLORS}
                          onChange={(val) => {
                             setGlobalThemeSecondary(val);
                             applyGlobalColors(globalThemePrimary, val);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-lg font-bold">Element Styling</h2>
                    <p className="text-xs text-text-muted leading-relaxed">Adjust font size, color, style, and weight for each block on the cover page.</p>

                    <div className="space-y-6 pt-2">
                       {(Object.keys(styles) as Array<keyof CoverStyles>).map((key) => {
                         const labelMap: Record<keyof CoverStyles, string> = {
                           assignmentType: 'Assignment Type',
                           topic: 'Topic Title',
                           courseCodeHeading: 'Course Code (Heading)',
                           courseCode: 'Course Code (Content)',
                           courseTitleHeading: 'Course Name (Heading)',
                           courseTitle: 'Course Name (Content)',
                           submittedToHeading: 'Submitted To (Heading)',
                           submittedTo: 'Submitted To (Content)',
                           submittedByHeading: 'Submitted By (Heading)',
                           submittedBy: 'Submitted By (Content)',
                           dateHeading: 'Date (Heading)',
                           date: 'Date (Content)'
                         };
                         
                         const title = labelMap[key] || key;
                         const style = styles[key];

                         return (
                           <div key={`sidebar-styling-${key}`} className="p-4 bg-bg-main border border-border-subtle rounded-xl space-y-4 shadow-sm">
                             <label className="text-sm font-bold tracking-tight text-text-primary">{title}</label>
                             
                             {/* Font Size & Weight */}
                             <div className="space-y-3 pt-2">
                               <div className="flex justify-between items-end mb-1">
                                 <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Size & Weight</span>
                                 <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">{style.fontSize}px</span>
                               </div>
                               <div className="flex items-center gap-3">
                                 <input 
                                   type="range" min="10" max="80"
                                   value={style.fontSize}
                                   onChange={(e) => updateStyle(key, 'fontSize', parseInt(e.target.value) || 16)}
                                   className="flex-1 accent-blue-500"
                                 />
                                 <select 
                                   value={style.fontWeight || (style.isBold ? 'bold' : 'normal')}
                                   onChange={(e) => updateStyle(key, 'fontWeight', e.target.value)}
                                   className="w-24 p-1.5 rounded-xl border border-border-strong bg-bg-input outline-none text-text-primary focus:border-blue-500/50 text-xs shadow-sm"
                                 >
                                   <option value="normal">Reg</option>
                                   <option value="500">Med</option>
                                   <option value="600">Semi</option>
                                   <option value="bold">Bold</option>
                                   <option value="800">X-Bold</option>
                                 </select>
                               </div>
                             </div>

                             {/* Font Color & Styling Row */}
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border-subtle">
                               <CustomColorPicker 
                                 color={style.color}
                                 onChange={(val) => updateStyle(key, 'color', val)}
                                 presetColors={['#000000', '#1a3688', '#800000', '#0E6655']}
                                 size="sm"
                               />

                               <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                 <button
                                   onClick={() => {
                                     const isBold = style.fontWeight === 'bold' || style.fontWeight === '700' || style.fontWeight === '800';
                                     updateStyle(key, 'fontWeight', isBold || style.isBold ? 'normal' : 'bold');
                                   }}
                                   className={`p-1.5 rounded-md border transition-colors shadow-sm ${(style.fontWeight === 'bold' || style.fontWeight === '700' || style.fontWeight === '800' || style.isBold) ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                                   title="Bold"
                                 >
                                   <Bold size={14} />
                                 </button>
                                 <button 
                                   onClick={() => updateStyle(key, 'isItalic', !style.isItalic)}
                                   className={`p-1.5 rounded-md border transition-colors shadow-sm ${style.isItalic ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                                   title="Italic"
                                 >
                                   <Italic size={14} />
                                 </button>
                                 <button 
                                   onClick={() => updateStyle(key, 'textDecoration', style.textDecoration === 'underline' ? 'none' : 'underline')}
                                   className={`p-1.5 rounded-md border transition-colors shadow-sm ${style.textDecoration === 'underline' ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                                   title="Underline"
                                 >
                                   <Underline size={14} />
                                 </button>
                                 <div className="w-px h-4 bg-border-strong mx-1" />
                                 <button
                                   onClick={() => updateStyle(key, 'textTransform', style.textTransform === 'uppercase' ? 'none' : 'uppercase')}
                                   className={`p-1.5 rounded-md border transition-colors shadow-sm ${style.textTransform === 'uppercase' ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                                   title="Uppercase"
                                 >
                                   <span className="font-bold text-[10px] tracking-widest leading-none">AA</span>
                                 </button>
                                 <button 
                                   onClick={() => updateStyle(key, 'textTransform', style.textTransform === 'lowercase' ? 'none' : 'lowercase')}
                                   className={`p-1.5 rounded-md border transition-colors shadow-sm ${style.textTransform === 'lowercase' ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                                   title="Lowercase"
                                 >
                                   <span className="font-bold text-[10px] tracking-widest leading-none">aa</span>
                                 </button>
                                 <button 
                                   onClick={() => updateStyle(key, 'textTransform', style.textTransform === 'capitalize' ? 'none' : 'capitalize')}
                                   className={`p-1.5 rounded-md border transition-colors shadow-sm ${style.textTransform === 'capitalize' ? 'bg-blue-500 text-white border-blue-500' : 'bg-bg-input border-border-strong text-text-secondary hover:text-text-primary'}`}
                                   title="Capitalize"
                                 >
                                   <span className="font-bold text-[10px] tracking-wider leading-none">Aa</span>
                                 </button>
                               </div>
                             </div>
                           </div>
                         );
                       })}
                    </div>
                  </div>

                  {/* Predefined Palettes */}
                  <div className="space-y-4 pt-6 border-t border-border-strong">
                    <h2 className="text-lg font-bold">Academic Color Palettes</h2>
                    <p className="text-xs text-text-muted leading-relaxed">Quickly apply a cohesive academic color scheme to your cover page.</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: "Oxford Blue & Gold", hex: "#002147", text: "#333333", head: "#002147", topic: "#B78727" },
                        { name: "Cambridge Crimson", hex: "#A3C1AD", text: "#222222", head: "#8C1515", topic: "#8C1515" },
                        { name: "Ivy League Green",  hex: "#00693E", text: "#2C3E50", head: "#00693E", topic: "#00693E" },
                        { name: "Classic Monochrome", hex: "#000000", text: "#222222", head: "#000000", topic: "#000000" },
                        { name: "Yale Sapphire", hex: "#0F4D92", text: "#1A202C", head: "#0F4D92", topic: "#0F4D92" },
                        { name: "Stanford Red", hex: "#8C1515", text: "#4A4A4A", head: "#8C1515", topic: "#8C1515" },
                        { name: "Princeton Orange", hex: "#E77500", text: "#2D3748", head: "#222222", topic: "#E77500" },
                        { name: "Elegant Burgundy", hex: "#800020", text: "#3B3B3B", head: "#800020", topic: "#800020" }
                      ].map(palette => (
                        <button
                          key={palette.name}
                          onClick={() => {
                            // Apply palette horizontally across styles
                            updateStyle('assignmentType', 'color', palette.head);
                            updateStyle('topic', 'color', palette.topic);
                            updateStyle('courseCode', 'color', palette.text);
                            updateStyle('courseTitle', 'color', palette.text);
                            updateStyle('submittedToHeading', 'color', palette.head);
                            updateStyle('submittedTo', 'color', palette.text);
                            updateStyle('submittedByHeading', 'color', palette.head);
                            updateStyle('submittedBy', 'color', palette.text);
                            updateStyle('date', 'color', palette.text);
                          }}
                          className="flex flex-col items-start p-3 bg-bg-panel border border-border-strong rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left"
                        >
                          <div className="flex gap-1 mb-2">
                            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: palette.head }}></div>
                            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: palette.topic }}></div>
                            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: palette.text }}></div>
                          </div>
                          <span className="text-[11px] font-bold text-text-primary truncate w-full">{palette.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
            
          </div>

          {/* Mobile Preview Action */}
          <div className="md:hidden p-4 border-t border-border-subtle bg-bg-panel shrink-0">
            <button 
              onClick={() => setPreviewMode(true)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
            >
              <Eye size={18} /> Preview & Download
            </button>
          </div>
        </div>

        {/* Live Canvas Area */}
        <div className="hidden md:flex flex-1 bg-bg-main overflow-auto p-4 md:p-10 justify-center items-start custom-scrollbar relative">
          
          {/* Subtle Grid behind canvas */}
          <div className="absolute inset-0 z-0 bg-[#e2e8f0] dark:bg-transparent bg-[linear-gradient(to_right,rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-100 dark:opacity-60"></div>

          <div className="w-full z-10 mx-auto flex flex-col items-center" style={{ minWidth: zoomMode === 'manual' ? `${794 * manualZoom}px` : 'auto' }}>
            
            {/* Download Action Bar strictly above A4 page */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-5 px-4 py-3 bg-bg-button border border-border-strong rounded-2xl shadow-xl" style={{ maxWidth: '800px' }}>
              <div className="flex items-center text-text-primary text-sm font-medium mb-3 sm:mb-0">
                <Eye size={16} className="mr-2 text-blue-400" /> Live Canvas View
                <button onClick={() => setPreviewMode(true)} className="ml-4 px-2 py-1 bg-bg-button hover:bg-bg-button-hover rounded text-xs transition-colors border border-border-strong">Full Preview</button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-white dark:bg-bg-input border border-border-strong rounded-lg px-2 py-1">
                 <button onClick={() => { setZoomMode('manual'); setManualZoom(z => Math.max(0.5, z - 0.25)); }} className="px-2 py-0.5 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors">-</button>
                 <select 
                    value={zoomMode === 'fit' ? 'fit' : manualZoom} 
                    onChange={(e) => {
                       const v = e.target.value;
                       if (v === 'fit') setZoomMode('fit');
                       else { setZoomMode('manual'); setManualZoom(Number(v)); }
                    }}
                    className="bg-transparent border-none text-xs font-medium outline-none text-center cursor-pointer text-text-primary"
                 >
                    <option value="fit" className="text-black bg-white">Fit</option>
                    <option value="0.5" className="text-black bg-white">50%</option>
                    <option value="0.75" className="text-black bg-white">75%</option>
                    <option value="1" className="text-black bg-white">100%</option>
                    <option value="1.25" className="text-black bg-white">125%</option>
                    <option value="1.5" className="text-black bg-white">150%</option>
                    <option value="2" className="text-black bg-white">200%</option>
                 </select>
                 <button onClick={() => { setZoomMode('manual'); setManualZoom(z => Math.min(3, z + 0.25)); }} className="px-2 py-0.5 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors">+</button>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => setShowExportModal(true)} className="px-4 py-2 text-sm font-bold tracking-wider uppercase bg-[#1a3688] hover:bg-[#2042a3] text-white rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20">
                  <Download size={14} /> Export Options
                </button>
              </div>
            </div>

            <div ref={containerRef} className={zoomMode === 'fit' ? `w-full max-w-[800px] aspect-[1/1.414] relative ${isCanvasTransparent ? 'bg-transparent' : 'bg-white'} shadow-2xl shadow-black/50 overflow-hidden rounded-sm transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]` : `relative ${isCanvasTransparent ? 'bg-transparent' : 'bg-white'} shadow-2xl shadow-black/50 overflow-hidden rounded-sm transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]`} style={zoomMode === 'manual' ? { width: `${794 * manualZoom}px`, height: `${1123 * manualZoom}px` } : {}}>
            <div 
              ref={!previewMode ? previewRef : null}
              className={`absolute top-0 left-0 w-[794px] h-[1123px] origin-top-left flex flex-col items-center justify-between z-10 ${isCanvasTransparent ? 'bg-transparent' : 'bg-white'}`}
              style={{
                transform: `scale(${zoomMode === 'fit' ? scale : manualZoom})`,
                width: '794px',
                height: '1123px'
              }}
            >
              {/* Background Watermark */}
              {renderWatermarkPreview()}

              {/* Canvas Content */}
              <div className="z-10 w-full h-full flex flex-col justify-between py-12 px-16 text-black">
                
                {/* Top Headers */}
                <div className="w-full text-center pt-8">
                   <div 
                     className="whitespace-pre-wrap leading-[1.7] mb-8"
                     style={getFieldCss(styles.assignmentType)}
                   >
                     {data.assignmentType}
                   </div>
                   <div 
                     className="whitespace-pre-wrap leading-snug px-8"
                     style={getFieldCss(styles.topic)}
                   >
                     {data.topic}
                   </div>
                </div>

                {/* Logo Section */}
                <div className="flex justify-center my-6 min-h-[100px] items-center">
                  {logo.url && (
                    <img src={logo.url} alt="Logo" style={{ 
                      width: `${logo.size}px`, 
                      height: 'auto',
                      objectFit: 'contain',
                      mixBlendMode: 'multiply',
                      transform: `translate(${logo.offsetX}${logo.offsetUnit}, ${logo.offsetY}${logo.offsetUnit})`,
                      filter: 'contrast(110%) brightness(105%)'
                    }} />
                  )}
                </div>

                {/* Course Metadata */}
                <div className="w-full text-center">
                   <div className="mb-2">
                     <span style={getFieldCss(styles.courseCodeHeading)} className="mr-2">
                       {data.courseCodeHeading}
                     </span>
                     <span style={getFieldCss(styles.courseCode)}>
                       {data.courseCode}
                     </span>
                   </div>
                   <div>
                     <span style={getFieldCss(styles.courseTitleHeading)} className="mr-2">
                       {data.courseTitleHeading}
                     </span>
                     <span style={getFieldCss(styles.courseTitle)}>
                       {data.courseTitle}
                     </span>
                   </div>
                </div>

                {/* Submitted To / By */}
                <div className="flex w-full mt-10 justify-between">
                   <div className="text-left w-[45%]">
                     <div 
                       className="whitespace-pre-wrap leading-[1.7] mb-4"
                       style={getFieldCss(styles.submittedToHeading)}
                     >
                       {data.submittedToHeading}
                     </div>
                     <div 
                       className="whitespace-pre-wrap leading-[1.6] text-black text-base"
                       style={getFieldCss(styles.submittedTo)}
                     >
                       {data.submittedTo}
                     </div>
                   </div>
                   <div className="text-right w-[45%]">
                     <div 
                       className="whitespace-pre-wrap leading-[1.7] mb-4"
                       style={getFieldCss(styles.submittedByHeading)}
                     >
                       {data.submittedByHeading}
                     </div>
                     <div 
                       className="whitespace-pre-wrap leading-[1.6] text-black text-base"
                       style={getFieldCss(styles.submittedBy)}
                     >
                       {data.submittedBy}
                     </div>
                   </div>
                </div>

                {/* Date */}
                <div className="mt-auto pt-16 text-center pb-8">
                   <span style={getFieldCss(styles.dateHeading)} className="mr-2">
                     {data.dateHeading}
                   </span>
                   <span style={getFieldCss(styles.date)}>
                     {data.date}
                   </span>
                 </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      )}

      <AnimatePresence>
        {previewMode && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col pt-16 pb-8 px-4 overflow-y-auto custom-scrollbar"
          >
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center px-6 z-[101]">
              <div className="text-text-primary font-medium">Fullscreen Preview</div>
              <button 
                onClick={() => setPreviewMode(false)}
                className="px-4 py-2 bg-bg-button hover:bg-bg-button-hover rounded-lg text-text-primary font-medium transition-colors"
              >
                Close Preview
              </button>
            </div>
            
            <div className="w-full h-auto flex flex-wrap justify-center gap-2 mb-4 z-[101] mt-16 md:mt-2">
              <button onClick={() => setShowExportModal(true)} className="px-4 py-2 text-sm font-bold tracking-wider uppercase bg-[#1a3688] hover:bg-[#2042a3] text-white rounded-xl transition-colors flex items-center gap-2 shadow-md">
                <Download size={14} /> Export Options
              </button>
            </div>
            
            <div className="w-full flex justify-center mb-10 overflow-x-auto custom-scrollbar">
              <div 
                ref={previewMode ? previewRef : null}
                className={`w-[794px] h-[1123px] shrink-0 ${isCanvasTransparent ? 'bg-transparent' : 'bg-white'} shadow-2xl relative mt-2 flex flex-col items-center justify-between origin-top`} 
                style={{ 
                  transform: `scale(${Math.min(1, (window.innerWidth - 32) / 794)})`, 
                  marginBottom: `-${1123 * (1 - Math.min(1, (window.innerWidth - 32) / 794))}px` 
                }}
              >
                {/* Background Watermark */}
                {renderWatermarkPreview()}
                <div className="z-10 w-full h-full flex flex-col justify-between py-12 px-16 text-black">
                  <div className="w-full text-center pt-8">
                     <div className="whitespace-pre-wrap leading-[1.7] mb-8" style={getFieldCss(styles.assignmentType)}>
                       {data.assignmentType}
                     </div>
                     <div className="whitespace-pre-wrap leading-snug px-8" style={getFieldCss(styles.topic)}>
                       {data.topic}
                     </div>
                  </div>
                  <div className="flex justify-center my-6 min-h-[100px] items-center">
                    {logo.url && (
                      <img src={logo.url} alt="Logo" style={{ width: `${logo.size}px`, height: 'auto', objectFit: 'contain', mixBlendMode: 'multiply', transform: `translate(${logo.offsetX}${logo.offsetUnit}, ${logo.offsetY}${logo.offsetUnit})`, filter: 'contrast(110%) brightness(105%)' }} />
                    )}
                  </div>
                  <div className="w-full text-center">
                     <div className="mb-2">
                       <span style={getFieldCss(styles.courseCodeHeading)} className="mr-2">
                         {data.courseCodeHeading}
                       </span>
                       <span style={getFieldCss(styles.courseCode)}>
                         {data.courseCode}
                       </span>
                     </div>
                     <div>
                       <span style={getFieldCss(styles.courseTitleHeading)} className="mr-2">
                         {data.courseTitleHeading}
                       </span>
                       <span style={getFieldCss(styles.courseTitle)}>
                         {data.courseTitle}
                       </span>
                     </div>
                  </div>
                  <div className="flex w-full mt-10 justify-between">
                     <div className="text-left w-[45%]">
                       <div className="whitespace-pre-wrap leading-[1.7] mb-4" style={getFieldCss(styles.submittedToHeading)}>
                         {data.submittedToHeading}
                       </div>
                       <div className="whitespace-pre-wrap leading-[1.6] text-black text-base" style={getFieldCss(styles.submittedTo)}>{data.submittedTo}</div>
                     </div>
                     <div className="text-right w-[45%]">
                       <div className="whitespace-pre-wrap leading-[1.7] mb-4" style={getFieldCss(styles.submittedByHeading)}>
                         {data.submittedByHeading}
                       </div>
                       <div className="whitespace-pre-wrap leading-[1.6] text-black text-base" style={getFieldCss(styles.submittedBy)}>{data.submittedBy}</div>
                     </div>
                  </div>
                  <div className="mt-auto pt-16 text-center pb-8">
                     <span style={getFieldCss(styles.dateHeading)} className="mr-2">
                       {data.dateHeading}
                     </span>
                     <span style={getFieldCss(styles.date)}>
                       {data.date}
                     </span>
                  </div>
                </div>
              </div>
            </div>
            
          </motion.div>
        )}

        {showExportModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-panel border border-border-strong rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-border-subtle bg-bg-main relative">
                <h3 className="text-xl font-bold text-text-primary">Export Options</h3>
                <button onClick={() => setShowExportModal(false)} className="p-2 bg-bg-button hover:bg-bg-button-hover rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                 <div className="space-y-3">
                   <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Export Format</label>
                   <div className="grid grid-cols-2 gap-3">
                     {[
                       { id: 'pdf', label: 'PDF Document', desc: 'Best for printing' },
                       { id: 'png', label: 'PNG Image', desc: 'Lossless quality' },
                       { id: 'jpg', label: 'JPG Image', desc: 'Smaller file size' },
                       { id: 'svg', label: 'SVG Vector', desc: 'Scalable graphics' }
                     ].map(f => (
                       <button
                         key={f.id}
                         onClick={() => setExportFormat(f.id as any)}
                         className={`p-3 rounded-xl border text-left transition-all ${exportFormat === f.id ? 'border-blue-500 bg-blue-500/10' : 'border-border-strong bg-bg-input hover:border-gray-400'}`}
                       >
                         <div className="font-bold text-text-primary uppercase">{f.label}</div>
                         <div className="text-[10px] text-text-secondary mt-1">{f.desc}</div>
                       </button>
                     ))}
                   </div>
                 </div>

                 {exportFormat !== 'pdf' && exportFormat !== 'svg' && (
                   <div className="space-y-3">
                     <label className="text-xs font-bold uppercase tracking-wider text-text-secondary flex justify-between">
                       Resolution Scale
                       <span className="text-blue-500">{exportScale}x</span>
                     </label>
                     <input 
                       type="range" min="1" max="4" step="1"
                       value={exportScale}
                       onChange={(e) => setExportScale(Number(e.target.value))}
                       className="w-full accent-blue-500"
                     />
                     <div className="flex justify-between text-[10px] text-text-muted px-1">
                       <span>Standard</span>
                       <span>Ultra</span>
                     </div>
                   </div>
                 )}
              </div>
              <div className="p-5 border-t border-border-subtle bg-bg-main flex justify-end gap-3">
                <button onClick={() => setShowExportModal(false)} className="px-5 py-2.5 rounded-xl font-bold bg-bg-button hover:bg-bg-button-hover text-text-primary transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowExportModal(false);
                    if (exportFormat === 'svg') downloadSvg();
                    else downloadAs(exportFormat as 'pdf'|'jpg'|'png');
                  }} 
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#1a3688] hover:bg-[#2042a3] text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-colors"
                >
                  <Download size={18} /> Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
