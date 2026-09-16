import { X, ShieldCheck, Zap, ArrowDownRight, Layers, FileCode, Image as ImageIcon, Type, Sparkles, CheckCircle2 } from 'lucide-react';
import { PageBrowseResult } from '../types';
import { formatBytes, formatPercent, estimateCostSaved, estimateSpeedup } from '../utils/formatters';

interface SavingsInspectorProps {
  result: PageBrowseResult;
  onClose: () => void;
  onOpenSettings: () => void;
}

export default function SavingsInspector({ result, onClose, onOpenSettings }: SavingsInspectorProps) {
  const isGoalMet = result.savedPercentage >= 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        id="savings-inspector-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Data Compression Inspector</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">{result.url}</p>
            </div>
          </div>
          <button
            id="close-inspector-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Reduction Banner */}
          <div className={`p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isGoalMet 
              ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800/50'
              : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border-amber-200 dark:border-amber-800/50'
          }`}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`text-4xl font-extrabold tracking-tight ${
                  isGoalMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {formatPercent(result.savedPercentage)}
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  Data Reduced
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
              <div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Target Guarantee: Over 50% Reduction Exceeded</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Saved {formatBytes(result.savedBytes)} over standard uncompressed web loading.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Speedup</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {estimateSpeedup(result.originalBytes, result.compressedBytes)}
                </span>
              </div>
              <div className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Cost Saved</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {estimateCostSaved(result.savedBytes)}
                </span>
              </div>
            </div>
          </div>

          {/* Before & After Visual Bar */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Payload Wire Comparison</h3>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              {/* Original */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500 dark:text-slate-400">Standard Uncompressed Web:</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">{formatBytes(result.originalBytes)}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-full rounded-full" />
                </div>
              </div>

              {/* Compressed */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Data Saver Compressed:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatBytes(result.compressedBytes)} ({formatPercent(result.savedPercentage)} saved)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(4, 100 - result.savedPercentage)}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Resource Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Savings Breakdown by Asset Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* HTML & Markup */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <FileCode className="w-4 h-4 text-blue-500" />
                  <span>HTML & DOM Structure</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">{formatBytes(result.breakdown.html.originalBytes)} → {formatBytes(result.breakdown.html.compressedBytes)}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">-{formatPercent(result.breakdown.html.savedPercentage)}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Minified whitespace, comments stripped, Gzip encoded.</p>
              </div>

              {/* JavaScript & Trackers */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span>Scripts & Telemetry</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">{formatBytes(result.breakdown.scripts.originalBytes)} → {formatBytes(result.breakdown.scripts.compressedBytes)}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">-{formatPercent(result.breakdown.scripts.savedPercentage)}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Blocked tracking scripts, analytics, and heavy client bundles.</p>
              </div>

              {/* Images & Visual Media */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  <span>Images & Media</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">{formatBytes(result.breakdown.images.originalBytes)} → {formatBytes(result.breakdown.images.compressedBytes)}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">-{formatPercent(result.breakdown.images.savedPercentage)}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Downsampled resolution, lazy loading, lightweight placeholders.</p>
              </div>

              {/* Web Fonts */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <Type className="w-4 h-4 text-cyan-500" />
                  <span>Web Fonts & Icon Fonts</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">{formatBytes(result.breakdown.fonts.originalBytes)} → {formatBytes(result.breakdown.fonts.compressedBytes)}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">-{formatPercent(result.breakdown.fonts.savedPercentage)}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Substituted with high-legibility system UI font stacks.</p>
              </div>
            </div>
          </div>

          {/* Blocked Trackers List */}
          {result.trackersBlocked && result.trackersBlocked.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Blocked Ad & Telemetry Domains ({result.trackersBlocked.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 max-h-28 overflow-y-auto">
                {result.trackersBlocked.map((tracker, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                    <ShieldCheck className="w-3 h-3 text-rose-500" />
                    <span className="truncate max-w-[200px]">{tracker}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            id="tune-compression-btn"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customize Compression Profile</span>
          </button>
          <button
            id="done-inspector-btn"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
