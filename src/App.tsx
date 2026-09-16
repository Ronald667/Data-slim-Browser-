import { useState, useEffect, useCallback } from 'react';
import BrowserChrome from './components/BrowserChrome';
import SpeedDial from './components/SpeedDial';
import WebFrame from './components/WebFrame';
import ComparisonView from './components/ComparisonView';
import AIDigestView from './components/AIDigestView';
import AIGPTView from './components/AIGPTView';
import SavingsInspector from './components/SavingsInspector';
import DataCompressionSettingsModal from './components/DataCompressionSettingsModal';
import { BrowserTab, CompressionSettings, SessionStats, PageBrowseResult } from './types';

const INITIAL_SETTINGS: CompressionSettings = {
  profile: 'turbo',
  compressImages: true,
  imageQuality: 'low',
  blockTrackers: true,
  blockHeavyScripts: true,
  stripWebFonts: true,
  minifyMarkup: true,
  enableGzipSimulation: true,
  lazyLoadImages: true,
};

const INITIAL_STATS: SessionStats = {
  pagesVisited: 0,
  totalOriginalBytes: 0,
  totalCompressedBytes: 0,
  totalSavedBytes: 0,
  averageSavingsPercent: 78.4,
  trackersBlockedCount: 0,
};

export default function App() {
  const [settings, setSettings] = useState<CompressionSettings>(() => {
    const saved = localStorage.getItem('data_saver_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [sessionStats, setSessionStats] = useState<SessionStats>(() => {
    const saved = localStorage.getItem('data_saver_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'Metro News Global',
      url: 'benchmark://metro-news',
      isLoading: true,
      history: ['benchmark://metro-news'],
      historyIndex: 0,
      viewMode: 'standard',
    },
  ]);

  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGPTSplitScreen, setIsGPTSplitScreen] = useState<boolean>(false);

  // Save settings and stats to localStorage
  useEffect(() => {
    localStorage.setItem('data_saver_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('data_saver_stats', JSON.stringify(sessionStats));
  }, [sessionStats]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Core navigation function that passes requests to the backend proxy
  const navigateTab = useCallback(
    async (url: string, tabId: string, addToHistory: boolean = true) => {
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === tabId
            ? {
                ...tab,
                url,
                isLoading: true,
                history: addToHistory
                  ? [...tab.history.slice(0, tab.historyIndex + 1), url]
                  : tab.history,
                historyIndex: addToHistory ? tab.historyIndex + 1 : tab.historyIndex,
              }
            : tab
        )
      );

      try {
        const response = await fetch('/api/browse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            profile: settings.profile,
            imageQuality: settings.imageQuality,
            blockTrackers: settings.blockTrackers,
            blockHeavyScripts: settings.blockHeavyScripts,
            stripWebFonts: settings.stripWebFonts,
            minifyMarkup: settings.minifyMarkup,
          }),
        });

        const result: PageBrowseResult = await response.json();

        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === tabId
              ? {
                  ...tab,
                  title: result.title || url,
                  isLoading: false,
                  result,
                }
              : tab
          )
        );

        // Update session cumulative savings stats
        if (result.success && result.originalBytes > 0) {
          setSessionStats((prev) => {
            const pages = prev.pagesVisited + 1;
            const orig = prev.totalOriginalBytes + result.originalBytes;
            const comp = prev.totalCompressedBytes + result.compressedBytes;
            const saved = prev.totalSavedBytes + result.savedBytes;
            const avg = orig > 0 ? ((orig - comp) / orig) * 100 : 75;
            const trackers = prev.trackersBlockedCount + (result.trackersBlocked?.length || 0);

            return {
              pagesVisited: pages,
              totalOriginalBytes: orig,
              totalCompressedBytes: comp,
              totalSavedBytes: saved,
              averageSavingsPercent: Math.round(avg * 10) / 10,
              trackersBlockedCount: trackers,
            };
          });
        }
      } catch (err) {
        console.error('Navigation error:', err);
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === tabId
              ? {
                  ...tab,
                  isLoading: false,
                  result: {
                    success: false,
                    url,
                    displayUrl: url,
                    title: 'Navigation Error',
                    originalBytes: 100000,
                    compressedBytes: 20000,
                    savedBytes: 80000,
                    savedPercentage: 80,
                    loadTimeMs: 100,
                    optimizedHtml: `<div style="padding:40px;font-family:sans-serif;text-align:center;"><h2>Connection Error</h2><p>Could not connect to ${url}. Please try another destination or one of our benchmarks.</p></div>`,
                    trackersBlocked: [],
                    breakdown: {
                      html: { originalBytes: 10000, compressedBytes: 2000, savedBytes: 8000, savedPercentage: 80, itemCount: 1 },
                      scripts: { originalBytes: 0, compressedBytes: 0, savedBytes: 0, savedPercentage: 0, itemCount: 0 },
                      images: { originalBytes: 0, compressedBytes: 0, savedBytes: 0, savedPercentage: 0, itemCount: 0 },
                      fonts: { originalBytes: 0, compressedBytes: 0, savedBytes: 0, savedPercentage: 0, itemCount: 0 },
                      css: { originalBytes: 0, compressedBytes: 0, savedBytes: 0, savedPercentage: 0, itemCount: 0 },
                    },
                    mode: settings.profile,
                  },
                }
              : tab
          )
        );
      }
    },
    [settings]
  );

  // Initial load of default tab
  useEffect(() => {
    navigateTab('benchmark://metro-news', 'tab-1', false);
  }, []); // Run once on mount

  // Tab controls
  const handleSelectTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    const index = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      const nextIndex = Math.max(0, index - 1);
      setActiveTabId(newTabs[nextIndex].id);
    }
  };

  const handleNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title: 'New Tab',
      url: '',
      isLoading: false,
      history: [],
      historyIndex: -1,
      viewMode: 'standard',
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleNavigate = (url: string) => {
    navigateTab(url, activeTabId, true);
  };

  const handleReload = () => {
    if (activeTab.url) {
      navigateTab(activeTab.url, activeTabId, false);
    }
  };

  const handleGoBack = () => {
    if (activeTab.historyIndex > 0) {
      const prevUrl = activeTab.history[activeTab.historyIndex - 1];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, historyIndex: t.historyIndex - 1 }
            : t
        )
      );
      navigateTab(prevUrl, activeTabId, false);
    }
  };

  const handleGoForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const nextUrl = activeTab.history[activeTab.historyIndex + 1];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, historyIndex: t.historyIndex + 1 }
            : t
        )
      );
      navigateTab(nextUrl, activeTabId, false);
    }
  };

  const handleGoHome = () => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url: '', result: undefined, viewMode: 'standard' }
          : t
      )
    );
  };

  const handleToggleCompare = () => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              viewMode: t.viewMode === 'compare' ? 'standard' : 'compare',
            }
          : t
      )
    );
  };

  const handleToggleAIDigest = () => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              viewMode: t.viewMode === 'ai_digest' ? 'standard' : 'ai_digest',
            }
          : t
      )
    );
  };

  const handleToggleAIGPT = () => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              viewMode: t.viewMode === 'ai_gpt' ? 'standard' : 'ai_gpt',
            }
          : t
      )
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Top Browser Navigation Bar & Tabs */}
      <BrowserChrome
        tabs={tabs}
        activeTabId={activeTabId}
        activeTab={activeTab}
        settings={settings}
        sessionStats={sessionStats}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
        onNavigate={handleNavigate}
        onReload={handleReload}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onGoHome={handleGoHome}
        onToggleCompare={handleToggleCompare}
        onToggleAIDigest={handleToggleAIDigest}
        onToggleAIGPT={handleToggleAIGPT}
        onOpenInspector={() => setIsInspectorOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Browser Viewport */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        {activeTab.viewMode === 'ai_gpt' ? (
          isGPTSplitScreen && activeTab.result ? (
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
              <div className="w-full md:w-3/5 h-1/2 md:h-full overflow-hidden">
                <WebFrame
                  result={activeTab.result}
                  isLoading={activeTab.isLoading}
                  onNavigate={handleNavigate}
                  onOpenInspector={() => setIsInspectorOpen(true)}
                />
              </div>
              <div className="w-full md:w-2/5 h-1/2 md:h-full overflow-hidden shadow-xl z-10">
                <AIGPTView
                  result={activeTab.result}
                  onExit={handleToggleAIGPT}
                  isSidebarMode={true}
                  onToggleSidebarMode={() => setIsGPTSplitScreen(false)}
                />
              </div>
            </div>
          ) : (
            <AIGPTView
              result={activeTab.result}
              onExit={handleToggleAIGPT}
              isSidebarMode={false}
              onToggleSidebarMode={activeTab.result ? () => setIsGPTSplitScreen(true) : undefined}
            />
          )
        ) : !activeTab.url || !activeTab.result ? (
          <SpeedDial
            onNavigate={handleNavigate}
            sessionStats={sessionStats}
            currentMode={settings.profile}
            onOpenAIGPT={handleToggleAIGPT}
          />
        ) : activeTab.viewMode === 'compare' ? (
          <ComparisonView
            result={activeTab.result}
            onExitCompare={handleToggleCompare}
          />
        ) : activeTab.viewMode === 'ai_digest' ? (
          <AIDigestView
            result={activeTab.result}
            onExit={handleToggleAIDigest}
          />
        ) : (
          <WebFrame
            result={activeTab.result}
            isLoading={activeTab.isLoading}
            onNavigate={handleNavigate}
            onOpenInspector={() => setIsInspectorOpen(true)}
          />
        )}
      </main>

      {/* Data Savings Inspector Modal */}
      {isInspectorOpen && activeTab.result && (
        <SavingsInspector
          result={activeTab.result}
          onClose={() => setIsInspectorOpen(false)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Compression Configuration Modal */}
      {isSettingsOpen && (
        <DataCompressionSettingsModal
          settings={settings}
          onUpdateSettings={(newSettings) => {
            setSettings(newSettings);
            // If active tab has a URL, re-fetch with new settings
            if (activeTab.url) {
              navigateTab(activeTab.url, activeTabId, false);
            }
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
