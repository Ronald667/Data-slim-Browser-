import { useEffect, useRef } from 'react';
import { PageBrowseResult } from '../types';
import { formatBytes, formatPercent } from '../utils/formatters';
import { ShieldCheck, Zap, Clock, Info } from 'lucide-react';

interface WebFrameProps {
  result: PageBrowseResult;
  isLoading: boolean;
  onNavigate: (url: string) => void;
  onOpenInspector: () => void;
}

export default function WebFrame({
  result,
  isLoading,
  onNavigate,
  onOpenInspector,
}: WebFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for navigation events emitted by links inside the proxied iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'DATA_SAVER_NAVIGATE' && event.data.url) {
        onNavigate(event.data.url);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onNavigate]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden z-20">
          <div className="h-full bg-emerald-500 animate-pulse w-3/4 rounded-full transition-all duration-300" />
        </div>
      )}

      {/* Sandboxed Webpage Iframe */}
      <div className="flex-1 w-full h-full relative bg-white">
        <iframe
          ref={iframeRef}
          title={result.title || 'Data Saver Web View'}
          srcDoc={result.optimizedHtml}
          sandbox="allow-same-origin allow-scripts allow-forms"
          className="w-full h-full border-0 bg-white"
        />
      </div>

      {/* Floating Status Bar at Bottom */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Proxy Compressed</span>
          </div>

          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

          <div className="hidden sm:flex items-center gap-1">
            <span>Wire Payload:</span>
            <strong className="text-slate-700 dark:text-slate-200">{formatBytes(result.compressedBytes)}</strong>
            <span className="text-slate-400">({formatBytes(result.originalBytes)} original)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{result.loadTimeMs} ms</span>
          </div>

          <button
            id="status-bar-inspector-btn"
            onClick={onOpenInspector}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold transition-colors text-[11px]"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>{formatPercent(result.savedPercentage)} Saved</span>
            <Info className="w-3 h-3 ml-0.5 opacity-70" />
          </button>
        </div>
      </footer>
    </div>
  );
}
