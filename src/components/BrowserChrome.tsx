import { useState, useEffect, FormEvent } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Lock, 
  Zap, 
  Plus, 
  X, 
  Columns, 
  Sparkles, 
  Bot,
  Sliders, 
  Globe, 
  CheckCircle2, 
  Loader2,
  FileText
} from 'lucide-react';
import { BrowserTab, CompressionSettings, SessionStats } from '../types';
import { formatPercent, formatBytes } from '../utils/formatters';

interface BrowserChromeProps {
  tabs: BrowserTab[];
  activeTabId: string;
  activeTab: BrowserTab;
  settings: CompressionSettings;
  sessionStats: SessionStats;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
  onNavigate: (url: string) => void;
  onReload: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onGoHome: () => void;
  onToggleCompare: () => void;
  onToggleAIDigest: () => void;
  onToggleAIGPT: () => void;
  onOpenInspector: () => void;
  onOpenSettings: () => void;
}

export default function BrowserChrome({
  tabs,
  activeTabId,
  activeTab,
  settings,
  sessionStats,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onNavigate,
  onReload,
  onGoBack,
  onGoForward,
  onGoHome,
  onToggleCompare,
  onToggleAIDigest,
  onToggleAIGPT,
  onOpenInspector,
  onOpenSettings,
}: BrowserChromeProps) {
  const [urlInput, setUrlInput] = useState(activeTab.url);

  useEffect(() => {
    setUrlInput(activeTab.url);
  }, [activeTab.url]);

  const handleUrlSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onNavigate(urlInput.trim());
    }
  };

  const result = activeTab.result;
  const hasSavings = result && result.savedPercentage > 0;
  const isGoalMet = result && result.savedPercentage >= 50;

  return (
    <header className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 select-none flex flex-col">
      {/* 1. Tabs Strip */}
      <div className="flex items-center justify-between px-2 pt-2 gap-2 overflow-x-auto scrollbar-none">
        {/* Tab Items */}
        <div className="flex items-center gap-1 min-w-0">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs font-medium max-w-[200px] cursor-pointer transition-colors border-t border-x ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 shadow-xs'
                    : 'bg-transparent text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800/40 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500 shrink-0" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0" />
                )}

                <span className="truncate flex-1">{tab.title || 'New Tab'}</span>

                {/* Savings mini pill in tab */}
                {tab.result && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold shrink-0">
                    -{Math.round(tab.result.savedPercentage)}%
                  </span>
                )}

                {tabs.length > 1 && (
                  <button
                    id={`close-tab-${tab.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            id="new-tab-btn"
            onClick={onNewTab}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Open New Tab"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Global Lifetime Data Meter */}
        <div className="hidden md:flex items-center gap-2 pr-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-bold">
            <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
            <span>{formatBytes(sessionStats.totalSavedBytes)} Saved</span>
            <span className="font-semibold text-emerald-600/80 dark:text-emerald-400/80">
              ({formatPercent(sessionStats.averageSavingsPercent)} avg)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Navigation & Omnibox Bar */}
      <div className="bg-white dark:bg-slate-800/90 px-3 py-2 flex items-center gap-2 shadow-xs">
        {/* Back Button */}
        <button
          id="nav-back-btn"
          disabled={activeTab.historyIndex <= 0}
          onClick={onGoBack}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Forward Button */}
        <button
          id="nav-forward-btn"
          disabled={activeTab.historyIndex >= activeTab.history.length - 1}
          onClick={onGoForward}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Forward"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Reload Button */}
        <button
          id="nav-reload-btn"
          onClick={onReload}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Reload"
        >
          <RotateCw className={`w-4 h-4 ${activeTab.isLoading ? 'animate-spin text-emerald-500' : ''}`} />
        </button>

        {/* Home Button */}
        <button
          id="nav-home-btn"
          onClick={onGoHome}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Speed Dial / New Tab"
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Omnibox (Address & Search Input) */}
        <form onSubmit={handleUrlSubmit} className="flex-1 min-w-0">
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
            {/* Security Lock */}
            <div className="text-emerald-600 dark:text-emerald-400 mr-2 shrink-0 flex items-center" title="Encrypted & Optimized Proxy Connection">
              <Lock className="w-3.5 h-3.5" />
            </div>

            {/* URL input field */}
            <input
              id="omnibox-input"
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Search or enter web address..."
              className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none truncate font-mono"
            />

            {/* Real-time Data Savings Pill in Omnibox */}
            {hasSavings && (
              <button
                type="button"
                id="omnibox-savings-pill"
                onClick={onOpenInspector}
                className={`ml-2 px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 shrink-0 transition-transform active:scale-95 ${
                  isGoalMet
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                }`}
                title="Click to inspect real data reduction breakdown"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>{formatPercent(result.savedPercentage)} Saved</span>
              </button>
            )}
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* AI GPT Mode Toggle */}
          <button
            id="toggle-ai-gpt-btn"
            onClick={onToggleAIGPT}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab.viewMode === 'ai_gpt'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
            }`}
            title="AI GPT Mode: Conversational Browser Copilot & Search"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI GPT</span>
          </button>

          {/* Side-by-Side Comparison Toggle */}
          <button
            id="toggle-compare-view-btn"
            disabled={!result}
            onClick={onToggleCompare}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab.viewMode === 'compare'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30'
            }`}
            title="Split-Screen Comparison: Standard vs Data Saver"
          >
            <Columns className="w-4 h-4" />
            <span className="hidden xl:inline">Compare</span>
          </button>

          {/* AI Smart Digest Toggle */}
          <button
            id="toggle-ai-digest-btn"
            disabled={!result}
            onClick={onToggleAIDigest}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab.viewMode === 'ai_digest'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30'
            }`}
            title="AI Smart Digest: 98% Data Reduction"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden xl:inline">AI Digest</span>
          </button>

          {/* Settings / Tuning Button */}
          <button
            id="open-compression-settings-btn"
            onClick={onOpenSettings}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Configure Data Saver Rules"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
