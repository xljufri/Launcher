import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Phone, MessageSquare, Globe, Camera, 
  Image as ImageIcon, Music, FileText, Calendar, 
  Settings, CloudRain, Map, Clock, Wifi, Battery,
  Bell, Grid, ChevronDown, ChevronUp, SlidersHorizontal, X,
  Smartphone, Palette, Sparkles, LayoutTemplate, Crown, Type, ImagePlus
} from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { generateWallpaper } from './services/aiWallpaper';

const AppIcon = ({ icon: Icon, label, onClick, animation }: { icon: any, label: string, onClick?: () => void, animation: string }) => {
  const getHoverAnimation = () => {
    switch(animation) {
      case 'float': return { y: -6, transition: { repeat: Infinity, repeatType: "reverse" as const, duration: 0.6 } };
      case 'jiggle': return { rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } };
      case 'glow': return { scale: 1.05, boxShadow: "0 0 20px var(--accent)", backgroundColor: "var(--glass-bg)" };
      case 'scale': default: return { scale: 1.1 };
    }
  };

  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 cursor-pointer group"
    >
      <motion.div 
        whileHover={getHoverAnimation()}
        className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-[var(--text-color)] opacity-80 group-hover:opacity-100 group-hover:bg-[var(--glass-border)] transition-all"
      >
        <Icon size={22} strokeWidth={1.5} />
      </motion.div>
      <span className="text-[10px] font-medium tracking-wide text-[var(--text-muted)] group-hover:text-[var(--text-color)] transition-colors">
        {label}
      </span>
    </motion.div>
  );
};

const ACTIONS = [
  { id: 'none', label: 'None' },
  { id: 'notifications', label: 'Open Notifications' },
  { id: 'app_drawer', label: 'Open App Drawer' },
  { id: 'search', label: 'Focus Search' },
  { id: 'settings', label: 'Pro Settings' }
];

const getTimeOfDay = (date: Date) => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Morning with soft sunrise light';
  if (hour >= 12 && hour < 17) return 'Bright afternoon with clear sky';
  if (hour >= 17 && hour < 20) return 'Beautiful golden hour sunset';
  return 'Dark night sky with subtle stars';
};

export default function App() {
  const [time, setTime] = useState(new Date());
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'notifications' | 'app_drawer' | 'settings'>('none');
  const [settingsTab, setSettingsTab] = useState<'gestures' | 'appearance'>('appearance');
  
  // Premium Customization State
  const [theme, setTheme] = useState('theme-obsidian');
  const [iconAnim, setIconAnim] = useState('scale');
  const [clockStyle, setClockStyle] = useState('minimal');
  const [appFont, setAppFont] = useState('font-inter');

  // AI Wallpaper State
  const [useAiWallpaper, setUseAiWallpaper] = useState(false);
  const [aiWallpaper, setAiWallpaper] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [gestures, setGestures] = useState({
    swipeUp: 'app_drawer',
    swipeDown: 'notifications',
    swipeLeft: 'none',
    swipeRight: 'none',
    doubleTap: 'search'
  });

  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // AI Wallpaper Generation Logic
  useEffect(() => {
    if (!useAiWallpaper) return;

    const fetchWallpaper = async () => {
      setIsGenerating(true);
      const timeOfDayDesc = getTimeOfDay(time);
      const url = await generateWallpaper(timeOfDayDesc);
      if (url) setAiWallpaper(url);
      setIsGenerating(false);
    };

    // Only fetch if we don't have one, or if we want to force refresh (could add a button for that)
    if (!aiWallpaper) {
      fetchWallpaper();
    }
  }, [useAiWallpaper]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const triggerAction = (actionId: string) => {
    switch(actionId) {
      case 'notifications': setActiveOverlay('notifications'); break;
      case 'app_drawer': setActiveOverlay('app_drawer'); break;
      case 'search': document.getElementById('search-input')?.focus(); break;
      case 'settings': setActiveOverlay('settings'); break;
      default: break;
    }
  };

  const handlePanEnd = (e: any, info: PanInfo) => {
    if (activeOverlay !== 'none') return;
    
    const { offset } = info;
    const swipeThreshold = 50;

    if (offset.y < -swipeThreshold) triggerAction(gestures.swipeUp);
    else if (offset.y > swipeThreshold) triggerAction(gestures.swipeDown);
    else if (offset.x < -swipeThreshold) triggerAction(gestures.swipeLeft);
    else if (offset.x > swipeThreshold) triggerAction(gestures.swipeRight);
  };

  const handleTap = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, .cursor-pointer')) return;
    
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      triggerAction(gestures.doubleTap);
    }
    lastTapRef.current = now;
  };

  const renderClock = () => {
    switch(clockStyle) {
      case 'bold':
        return (
          <div className="flex flex-col items-center text-center mt-4 pointer-events-none">
            <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-7xl font-display font-bold tracking-tighter text-[var(--accent)]">
              {formatTime(time)}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-[var(--text-color)] text-[10px] mt-1 font-bold tracking-[0.3em] uppercase">
              {formatDate(time)}
            </motion.p>
          </div>
        );
      case 'glass':
        return (
          <div className="flex flex-col items-center text-center mt-4 pointer-events-none">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl px-8 py-6 flex flex-col items-center border-[var(--accent)]/20 shadow-[0_0_30px_var(--glass-bg)]">
              <h1 className="text-5xl font-light tracking-tight text-[var(--text-color)]">{formatTime(time)}</h1>
              <p className="text-[var(--accent)] text-xs mt-2 font-medium tracking-wide">{formatDate(time)}</p>
            </motion.div>
          </div>
        );
      case 'digital':
        return (
          <div className="flex flex-col items-center text-center mt-4 pointer-events-none">
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl font-mono font-bold tracking-widest text-[var(--accent)] drop-shadow-[0_0_10px_var(--accent)]">
              {formatTime(time)}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-[var(--text-muted)] font-mono text-xs mt-3 tracking-widest uppercase">
              {formatDate(time)}
            </motion.p>
          </div>
        );
      case 'minimal':
      default:
        return (
          <div className="flex flex-col items-center text-center mt-4 pointer-events-none">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-light tracking-tight text-[var(--text-color)]">
              {formatTime(time)}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-[var(--text-muted)] text-xs mt-2 font-medium tracking-wide">
              {formatDate(time)}
            </motion.p>
          </div>
        );
    }
  };

  return (
    <div 
      className={`relative w-full h-[100dvh] bg-[var(--bg-color)] overflow-hidden flex flex-col transition-colors duration-500 ${theme} ${appFont}`}
      style={useAiWallpaper && aiWallpaper ? {
        backgroundImage: `url(${aiWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {!useAiWallpaper && <div className="absolute inset-0 aura-gradient opacity-50 pointer-events-none" />}
      {useAiWallpaper && <div className="absolute inset-0 bg-black/30 pointer-events-none" />} {/* Overlay for readability */}
      
      {/* Status Bar */}
        <div className="h-12 px-8 flex items-center justify-between text-[11px] font-medium text-[var(--text-color)] opacity-80 z-40 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
          <span>{formatTime(time)}</span>
          <div className="flex items-center gap-2">
            <Wifi size={12} />
            <div className="flex items-center gap-1">
              <Battery size={12} className="rotate-90" />
              <span>84%</span>
            </div>
          </div>
        </div>

        {/* Main Interactive Area with Gesture Detection */}
        <motion.div 
          className="flex-1 flex flex-col relative z-10"
          onPanEnd={handlePanEnd}
          onClick={handleTap}
        >
          {/* Home Screen Content */}
          <div className="flex-1 px-6 pt-4 flex flex-col gap-8 pb-24">
            
            {/* Dynamic Clock Widget */}
            {renderClock()}

            {/* Minimal Search Bar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl px-4 py-3 flex items-center gap-3 mx-2 mt-8 cursor-text max-w-md w-full self-center"
              onClick={() => document.getElementById('search-input')?.focus()}
            >
              <Search size={16} className="text-[var(--text-muted)]" />
              <input 
                id="search-input"
                type="text" 
                placeholder="Search apps or web..." 
                className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-color)] placeholder:text-[var(--text-muted)]"
              />
            </motion.div>

            {/* App Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-8 gap-x-4 mt-8 max-w-4xl mx-auto w-full"
            >
              <AppIcon icon={ImageIcon} label="Photos" animation={iconAnim} />
              <AppIcon icon={Music} label="Music" animation={iconAnim} />
              <AppIcon icon={FileText} label="Notes" animation={iconAnim} />
              <AppIcon icon={Calendar} label="Calendar" animation={iconAnim} />
              <AppIcon icon={CloudRain} label="Weather" animation={iconAnim} />
              <AppIcon icon={Map} label="Maps" animation={iconAnim} />
              <AppIcon icon={Clock} label="Clock" animation={iconAnim} />
              <AppIcon icon={Settings} label="Pro Settings" onClick={() => setActiveOverlay('settings')} animation={iconAnim} />
            </motion.div>

          </div>

          {/* Minimal Dock */}
          <div className="absolute bottom-6 left-6 right-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md glass rounded-3xl p-4 flex items-center justify-around z-20">
            <AppIcon icon={Phone} label="Phone" animation={iconAnim} />
            <AppIcon icon={MessageSquare} label="Messages" animation={iconAnim} />
            <AppIcon icon={Globe} label="Browser" animation={iconAnim} />
            <AppIcon icon={Camera} label="Camera" animation={iconAnim} />
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-[var(--text-muted)] rounded-full pointer-events-none" />
        </motion.div>

        {/* Overlays */}
        <AnimatePresence>
          {/* Notifications Drawer */}
          {activeOverlay === 'notifications' && (
            <motion.div 
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-50 bg-[var(--bg-color)]/90 backdrop-blur-xl flex flex-col"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(e, info) => { if (info.offset.y < -50) setActiveOverlay('none'); }}
            >
              <div className="pt-16 px-6 flex-1">
                <h3 className="text-[var(--text-color)] font-medium text-lg mb-6 flex items-center gap-2">
                  <Bell size={18} className="text-[var(--accent)]" /> Notifications
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="glass rounded-2xl p-4 border-l-2 border-l-[var(--accent)]">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-[var(--text-color)]">Messages</span>
                      <span className="text-[10px] text-[var(--text-muted)]">Now</span>
                    </div>
                    <p className="text-sm text-[var(--text-color)] opacity-90">Hey, are we still on for tomorrow?</p>
                  </div>
                  <div className="glass rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-[var(--text-color)]">System</span>
                      <span className="text-[10px] text-[var(--text-muted)]">10m ago</span>
                    </div>
                    <p className="text-sm text-[var(--text-color)] opacity-90">App updates installed successfully.</p>
                  </div>
                </div>
              </div>
              <div className="pb-8 pt-4 flex justify-center">
                <div className="w-12 h-1.5 bg-[var(--text-muted)] rounded-full" />
              </div>
            </motion.div>
          )}

          {/* App Drawer */}
          {activeOverlay === 'app_drawer' && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-50 bg-[var(--bg-color)]/95 backdrop-blur-xl flex flex-col"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(e, info) => { if (info.offset.y > 50) setActiveOverlay('none'); }}
            >
              <div className="pt-4 pb-2 flex justify-center">
                <div className="w-12 h-1.5 bg-[var(--text-muted)] rounded-full" />
              </div>
              <div className="px-6 py-4 flex-1 overflow-y-auto no-scrollbar flex flex-col items-center">
                <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 mb-8 w-full max-w-md">
                  <Search size={16} className="text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    placeholder="Search all apps..." 
                    className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-color)] placeholder:text-[var(--text-muted)]"
                  />
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-8 gap-x-4 max-w-4xl mx-auto w-full">
                  <AppIcon icon={Phone} label="Phone" animation={iconAnim} />
                  <AppIcon icon={MessageSquare} label="Messages" animation={iconAnim} />
                  <AppIcon icon={Globe} label="Browser" animation={iconAnim} />
                  <AppIcon icon={Camera} label="Camera" animation={iconAnim} />
                  <AppIcon icon={ImageIcon} label="Photos" animation={iconAnim} />
                  <AppIcon icon={Music} label="Music" animation={iconAnim} />
                  <AppIcon icon={FileText} label="Notes" animation={iconAnim} />
                  <AppIcon icon={Calendar} label="Calendar" animation={iconAnim} />
                  <AppIcon icon={CloudRain} label="Weather" animation={iconAnim} />
                  <AppIcon icon={Map} label="Maps" animation={iconAnim} />
                  <AppIcon icon={Clock} label="Clock" animation={iconAnim} />
                  <AppIcon icon={Settings} label="Settings" onClick={() => setActiveOverlay('settings')} animation={iconAnim} />
                  <AppIcon icon={Smartphone} label="Calculator" animation={iconAnim} />
                  <AppIcon icon={Grid} label="Files" animation={iconAnim} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Modal */}
          {activeOverlay === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            >
              <div className="glass w-full max-w-lg rounded-3xl p-6 flex flex-col max-h-[85%] bg-[var(--bg-color)]/80">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[var(--text-color)] font-medium text-lg flex items-center gap-2">
                    <Crown size={18} className="text-[var(--accent)]" /> Pro Customization
                  </h3>
                  <button onClick={() => setActiveOverlay('none')} className="p-2 bg-[var(--glass-bg)] rounded-full hover:bg-[var(--glass-border)] transition-colors text-[var(--text-color)]">
                    <X size={16} />
                  </button>
                </div>

                {/* Settings Tabs */}
                <div className="flex gap-2 mb-6 p-1 glass rounded-xl">
                  <button 
                    onClick={() => setSettingsTab('appearance')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${settingsTab === 'appearance' ? 'bg-[var(--glass-border)] text-[var(--text-color)]' : 'text-[var(--text-muted)]'}`}
                  >
                    Appearance
                  </button>
                  <button 
                    onClick={() => setSettingsTab('gestures')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${settingsTab === 'gestures' ? 'bg-[var(--glass-border)] text-[var(--text-color)]' : 'text-[var(--text-muted)]'}`}
                  >
                    Gestures
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6">
                  {settingsTab === 'appearance' ? (
                    <>
                      {/* AI Wallpaper */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs text-[var(--text-muted)] flex items-center gap-2 uppercase tracking-widest font-bold">
                          <ImagePlus size={14} className="text-[var(--accent)]" /> AI Dynamic Wallpaper
                        </label>
                        <div className="glass rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[var(--text-color)]">Time-based Wallpaper</p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-1 max-w-[200px]">
                              Uses AI to generate a beautiful background based on the current time of day.
                            </p>
                          </div>
                          <button 
                            onClick={() => {
                              setUseAiWallpaper(!useAiWallpaper);
                              if (!useAiWallpaper && !aiWallpaper) {
                                setIsGenerating(true);
                              }
                            }}
                            className={`relative w-12 h-6 rounded-full transition-colors ${useAiWallpaper ? 'bg-[var(--accent)]' : 'bg-[var(--glass-border)]'}`}
                          >
                            <motion.div 
                              animate={{ x: useAiWallpaper ? 24 : 2 }}
                              className="absolute top-1 bottom-1 w-4 bg-white rounded-full shadow-md"
                            />
                          </button>
                        </div>
                        {isGenerating && (
                          <p className="text-[10px] text-[var(--accent)] animate-pulse">
                            ✨ Generating your wallpaper...
                          </p>
                        )}
                      </div>

                      {/* Themes */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs text-[var(--text-muted)] flex items-center gap-2 uppercase tracking-widest font-bold">
                          <Palette size={14} className="text-[var(--accent)]" /> Exclusive Themes
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'theme-obsidian', name: 'Obsidian' },
                            { id: 'theme-amethyst', name: 'Amethyst' },
                            { id: 'theme-gold', name: 'Aura Gold' },
                            { id: 'theme-cyber', name: 'Cyberpunk' },
                            { id: 'theme-matcha', name: 'Zen Matcha' },
                            { id: 'theme-sakura', name: 'Sakura' },
                            { id: 'theme-ocean', name: 'Deep Ocean' },
                            { id: 'theme-nordic', name: 'Nordic Light' }
                          ].map(t => (
                            <button 
                              key={t.id}
                              onClick={() => {
                                setTheme(t.id);
                                setUseAiWallpaper(false); // Disable AI wallpaper when theme is manually selected
                              }}
                              className={`p-3 rounded-xl text-xs font-medium transition-all border ${theme === t.id && !useAiWallpaper ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-color)]'}`}
                            >
                              {t.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Typography */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs text-[var(--text-muted)] flex items-center gap-2 uppercase tracking-widest font-bold">
                          <Type size={14} className="text-[var(--accent)]" /> Typography
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'font-inter', name: 'Modern (Inter)' },
                            { id: 'font-outfit', name: 'Geometric (Outfit)' },
                            { id: 'font-playfair', name: 'Elegant (Playfair)' },
                            { id: 'font-quicksand', name: 'Rounded (Quicksand)' },
                            { id: 'font-cinzel', name: 'Cinematic (Cinzel)' }
                          ].map(f => (
                            <button 
                              key={f.id}
                              onClick={() => setAppFont(f.id)}
                              className={`p-3 rounded-xl text-xs font-medium transition-all border ${appFont === f.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-color)]'}`}
                            >
                              {f.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clock Styles */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs text-[var(--text-muted)] flex items-center gap-2 uppercase tracking-widest font-bold">
                          <LayoutTemplate size={14} className="text-[var(--accent)]" /> Clock Widget Style
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'minimal', name: 'Minimal' },
                            { id: 'bold', name: 'Bold Display' },
                            { id: 'glass', name: 'Glass Card' },
                            { id: 'digital', name: 'Digital Mono' }
                          ].map(s => (
                            <button 
                              key={s.id}
                              onClick={() => setClockStyle(s.id)}
                              className={`p-3 rounded-xl text-xs font-medium transition-all border ${clockStyle === s.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-color)]'}`}
                            >
                              {s.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Icon Animations */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs text-[var(--text-muted)] flex items-center gap-2 uppercase tracking-widest font-bold">
                          <Sparkles size={14} className="text-[var(--accent)]" /> Icon Animations
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'scale', name: 'Simple Scale' },
                            { id: 'float', name: 'Floating' },
                            { id: 'glow', name: 'Neon Glow' },
                            { id: 'jiggle', name: 'Jiggle' }
                          ].map(a => (
                            <button 
                              key={a.id}
                              onClick={() => setIconAnim(a.id)}
                              className={`p-3 rounded-xl text-xs font-medium transition-all border ${iconAnim === a.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-color)]'}`}
                            >
                              {a.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Gestures */}
                      {[
                        { key: 'swipeUp', label: 'Swipe Up', icon: ChevronUp },
                        { key: 'swipeDown', label: 'Swipe Down', icon: ChevronDown },
                        { key: 'swipeLeft', label: 'Swipe Left', icon: ChevronDown, rotate: 90 },
                        { key: 'swipeRight', label: 'Swipe Right', icon: ChevronDown, rotate: -90 },
                        { key: 'doubleTap', label: 'Double Tap', icon: Smartphone }
                      ].map((gesture) => (
                        <div key={gesture.key} className="flex flex-col gap-2">
                          <label className="text-xs text-[var(--text-color)] flex items-center gap-2">
                            <gesture.icon size={14} style={{ transform: `rotate(${gesture.rotate || 0}deg)` }} className="text-[var(--accent)]" />
                            {gesture.label}
                          </label>
                          <select 
                            value={gestures[gesture.key as keyof typeof gestures]}
                            onChange={(e) => setGestures(prev => ({ ...prev, [gesture.key]: e.target.value }))}
                            className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl p-3 text-sm text-[var(--text-color)] outline-none appearance-none"
                          >
                            {ACTIONS.map(action => (
                              <option key={action.id} value={action.id} className="bg-[#1a1a1a] text-white">
                                {action.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
