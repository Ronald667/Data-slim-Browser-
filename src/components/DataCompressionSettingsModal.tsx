import { X, Sliders, Shield, Zap, Image, Type, FileCode, Check } from 'lucide-react';
import { CompressionSettings, CompressionProfile, ImageQualitySetting } from '../types';

interface DataCompressionSettingsModalProps {
  settings: CompressionSettings;
  onUpdateSettings: (newSettings: CompressionSettings) => void;
  onClose: () => void;
}

export default function DataCompressionSettingsModal({
  settings,
  onUpdateSettings,
  onClose,
}: DataCompressionSettingsModalProps) {
  const handleProfileSelect = (profile: CompressionProfile) => {
    switch (profile) {
      case 'balanced':
        onUpdateSettings({
          ...settings,
          profile: 'balanced',
          imageQuality: 'medium',
          compressImages: true,
          blockTrackers: true,
          blockHeavyScripts: false,
          stripWebFonts: true,
          minifyMarkup: true,
        });
        break;
      case 'turbo':
        onUpdateSettings({
          ...settings,
          profile: 'turbo',
          imageQuality: 'low',
          compressImages: true,
          blockTrackers: true,
          blockHeavyScripts: true,
          stripWebFonts: true,
          minifyMarkup: true,
        });
        break;
      case 'extreme':
        onUpdateSettings({
          ...settings,
          profile: 'extreme',
          imageQuality: 'placeholder',
          compressImages: true,
          blockTrackers: true,
          blockHeavyScripts: true,
          stripWebFonts: true,
          minifyMarkup: true,
        });
        break;
      case 'reader':
        onUpdateSettings({
          ...settings,
          profile: 'reader',
          imageQuality: 'placeholder',
          compressImages: true,
          blockTrackers: true,
          blockHeavyScripts: true,
          stripWebFonts: true,
          minifyMarkup: true,
        });
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        id="compression-settings-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Compression & Data-Saving Rules</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure proxy optimization and wire reduction</p>
            </div>
          </div>
          <button
            id="close-settings-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Compression Profile Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Compression Profile
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Balanced */}
              <button
                type="button"
                id="profile-balanced-btn"
                onClick={() => handleProfileSelect('balanced')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.profile === 'balanced'
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Balanced</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950">
                    ~55%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Preserves layout, optimizes images & blocks trackers.</p>
              </button>

              {/* Turbo */}
              <button
                type="button"
                id="profile-turbo-btn"
                onClick={() => handleProfileSelect('turbo')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.profile === 'turbo'
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Turbo Mode</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950">
                    ~75%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Low-res WebP, blocks heavy scripts & web fonts.</p>
              </button>

              {/* Extreme */}
              <button
                type="button"
                id="profile-extreme-btn"
                onClick={() => handleProfileSelect('extreme')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.profile === 'extreme'
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Extreme Lite</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950">
                    ~90%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">SVG placeholders, pure text focus, ultra low bandwidth.</p>
              </button>
            </div>
          </div>

          {/* Granular Toggles */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Granular Optimization Filters
            </label>

            <div className="space-y-2.5">
              {/* Image Quality setting */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Image className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Image Compression Quality</span>
                    <span className="text-[11px] text-slate-400">Control visual fidelity vs data transmission</span>
                  </div>
                </div>
                <select
                  id="image-quality-select"
                  value={settings.imageQuality}
                  onChange={(e) => onUpdateSettings({ ...settings, imageQuality: e.target.value as ImageQualitySetting })}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="placeholder">SVG Placeholders (99% saved)</option>
                  <option value="low">Low-Res WebP (75% saved)</option>
                  <option value="medium">Balanced WebP (50% saved)</option>
                  <option value="original">Original Images</option>
                </select>
              </div>

              {/* Block Trackers */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-rose-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Block Trackers & Ad Networks</span>
                    <span className="text-[11px] text-slate-400">Excision of GTM, Hotjar, Facebook Pixel, Outbrain</span>
                  </div>
                </div>
                <input
                  id="toggle-block-trackers"
                  type="checkbox"
                  checked={settings.blockTrackers}
                  onChange={(e) => onUpdateSettings({ ...settings, blockTrackers: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>

              {/* Strip Web Fonts */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Type className="w-4 h-4 text-cyan-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Strip Custom Web Fonts</span>
                    <span className="text-[11px] text-slate-400">Use native system fonts, saves 200KB-800KB of font bundles</span>
                  </div>
                </div>
                <input
                  id="toggle-strip-fonts"
                  type="checkbox"
                  checked={settings.stripWebFonts}
                  onChange={(e) => onUpdateSettings({ ...settings, stripWebFonts: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>

              {/* Block Heavy JS */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Block Heavy Client Scripts</span>
                    <span className="text-[11px] text-slate-400">Eliminates megabytes of unneeded bundle execution</span>
                  </div>
                </div>
                <input
                  id="toggle-block-heavy-js"
                  type="checkbox"
                  checked={settings.blockHeavyScripts}
                  onChange={(e) => onUpdateSettings({ ...settings, blockHeavyScripts: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>

              {/* Minify Markup */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <FileCode className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Minify HTML & Comments</span>
                    <span className="text-[11px] text-slate-400">Strips redundant markup whitespace and comments</span>
                  </div>
                </div>
                <input
                  id="toggle-minify-markup"
                  type="checkbox"
                  checked={settings.minifyMarkup}
                  onChange={(e) => onUpdateSettings({ ...settings, minifyMarkup: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex justify-end">
          <button
            id="apply-settings-btn"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Compression Rules</span>
          </button>
        </div>
      </div>
    </div>
  );
}
