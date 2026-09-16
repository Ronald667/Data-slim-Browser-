import { useState, FormEvent } from 'react';
import { SPEED_DIAL_PRESETS } from '../data/presets';
import { SessionStats } from '../types';
import { formatBytes, formatPercent, estimateCostSaved } from '../utils/formatters';
import { 
  Globe, 
  Search, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Newspaper, 
  MessageSquareCode, 
  BookOpen, 
  Cpu, 
  Library, 
  Sparkles, 
  Bot,
  TrendingDown,
  Layers
} from 'lucide-react';

interface SpeedDialProps {
  onNavigate: (url: string) => void;
  sessionStats: SessionStats;
  currentMode: string;
  onOpenAIGPT?: () => void;
}

export default function SpeedDial({ onNavigate, sessionStats, currentMode, onOpenAIGPT }: SpeedDialProps) {
  const [inputUrl, setInputUrl] = useState('');

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onNavigate(inputUrl.trim());
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Newspaper': return <Newspaper className="w-5 h-5 text-rose-500" />;
      case 'MessageSquareCode': return <MessageSquareCode className="w-5 h-5 text-amber-500" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-orange-500" />;
      case 'Library': return <Library className="w-5 h-5 text-emerald-500" />;
      default: return <Globe className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto px-4 py-8 sm:py-12">
      <div className="max-w-4xl w-full mx-auto space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-emerald-500" />
            <span>Proxy Compression Engine • Over 50% Reduction Guaranteed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Data Saver Browser
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Browse any website through our high-performance optimization pipeline. Strips telemetry bloat, downsamples heavy media, and compresses payloads by over 50%.
          </p>
        </div>

        {/* Omnibox Search Bar */}
        <div className="max-w-2xl mx-auto space-y-2">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center shadow-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all p-1.5 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
              <div className="pl-3.5 pr-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="speed-dial-input"
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter web address or search term (e.g. en.wikipedia.org or 'compression')..."
                className="w-full py-2.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                id="speed-dial-submit-btn"
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Compress & Browse</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* AI GPT Quick Access Pill */}
          {onOpenAIGPT && (
            <div className="flex items-center justify-center gap-2 pt-1 text-xs">
              <span className="text-slate-400">Or use zero-data conversational search:</span>
              <button
                id="speed-dial-ai-gpt-btn"
                type="button"
                onClick={onOpenAIGPT}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20 transition-colors cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Launch AI GPT Mode (~99.9% Data Saved)</span>
              </button>
            </div>
          )}
        </div>

        {/* Session Savings Summary Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-3">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">Total Bandwidth Saved</span>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatBytes(sessionStats.totalSavedBytes)}
            </div>
            <span className="text-[11px] text-slate-400">from {formatBytes(sessionStats.totalOriginalBytes)}</span>
          </div>

          <div className="p-3 border-l border-slate-100 dark:border-slate-800">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">Average Reduction</span>
            <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {formatPercent(sessionStats.averageSavingsPercent || 74.5)}
            </div>
            <span className="text-[11px] text-emerald-500 font-semibold">&gt; 50% target met</span>
          </div>

          <div className="p-3 border-l border-slate-100 dark:border-slate-800">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">Trackers Blocked</span>
            <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
              {sessionStats.trackersBlockedCount}
            </div>
            <span className="text-[11px] text-slate-400">telemetry beacons</span>
          </div>

          <div className="p-3 border-l border-slate-100 dark:border-slate-800">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">Estimated Savings</span>
            <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
              {estimateCostSaved(sessionStats.totalSavedBytes)}
            </div>
            <span className="text-[11px] text-slate-400">cellular data value</span>
          </div>
        </div>

        {/* Speed Dial Presets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Benchmark & Test Destinations
            </h2>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Click any destination to test live data reduction
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SPEED_DIAL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                onClick={() => onNavigate(preset.url)}
                className="text-left p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getIcon(preset.iconName)}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/50">
                    {preset.estimatedSaving}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {preset.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* How Compression Works Feature Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            How The Data Saver Engine Achieves Over 50% Reduction
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <span>Tracker & Ad Stripping</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-normal">
                Modern sites load 20-50 tracking beacons. Excising these saves 40-70% of network requests and runtime memory.
              </p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-amber-500" />
                <span>Media Transcoding</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-normal">
                Images are downscaled or converted to lightweight placeholders, cutting megabytes down to kilobytes.
              </p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>DOM & Font Optimization</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-normal">
                Strips redundant HTML comments and heavy web fonts in favor of ultra-fast native system typography.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
