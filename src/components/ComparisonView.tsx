import { useState } from 'react';
import { PageBrowseResult } from '../types';
import { formatBytes, formatPercent } from '../utils/formatters';
import { Zap, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface ComparisonViewProps {
  result: PageBrowseResult;
  onExitCompare: () => void;
}

export default function ComparisonView({ result, onExitCompare }: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState<'split' | 'uncompressed' | 'compressed'>('split');

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
      {/* Comparison Top Banner */}
      <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Live Bandwidth Comparison
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-medium">
              Standard: {formatBytes(result.originalBytes)}
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold">
              Compressed: {formatBytes(result.compressedBytes)}
            </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              ({formatPercent(result.savedPercentage)} Reduced)
            </span>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
            <button
              id="view-mode-split"
              onClick={() => setActiveTab('split')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'split'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Side-by-Side
            </button>
            <button
              id="view-mode-uncompressed"
              onClick={() => setActiveTab('uncompressed')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'uncompressed'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Standard Web
            </button>
            <button
              id="view-mode-compressed"
              onClick={() => setActiveTab('compressed')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'compressed'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Data Saver
            </button>
          </div>

          <button
            id="exit-compare-btn"
            onClick={onExitCompare}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium rounded-lg transition-colors"
          >
            Exit Comparison
          </button>
        </div>
      </div>

      {/* Pane Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 overflow-hidden">
        {/* Left Pane: Standard Uncompressed Browser */}
        {(activeTab === 'split' || activeTab === 'uncompressed') && (
          <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
            {/* Header info */}
            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span className="font-semibold text-rose-900 dark:text-rose-200">Standard Web (Uncompressed)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <span>Payload: <strong className="text-rose-600 dark:text-rose-400">{formatBytes(result.originalBytes)}</strong></span>
                <span>Trackers: <strong className="text-rose-600 dark:text-rose-400">{result.trackersBlocked?.length || 14} active</strong></span>
              </div>
            </div>

            {/* Frame rendering standard or raw preview */}
            <div className="flex-1 relative bg-white overflow-hidden">
              <iframe
                title="Standard Uncompressed View"
                srcDoc={result.optimizedHtml.replace('id="data-saver-overrides"', 'id="overrides-disabled"')}
                sandbox="allow-same-origin allow-scripts"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

        {/* Right Pane: Data Saver Browser */}
        {(activeTab === 'split' || activeTab === 'compressed') && (
          <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
            {/* Header info */}
            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-emerald-900 dark:text-emerald-200">Data Saver Proxy (Optimized)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <span>Payload: <strong className="text-emerald-600 dark:text-emerald-400">{formatBytes(result.compressedBytes)}</strong></span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                  {formatPercent(result.savedPercentage)} Saved
                </span>
              </div>
            </div>

            {/* Frame rendering optimized page */}
            <div className="flex-1 relative bg-white overflow-hidden">
              <iframe
                title="Data Saver View"
                srcDoc={result.optimizedHtml}
                sandbox="allow-same-origin allow-scripts"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
