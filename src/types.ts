export type CompressionProfile = 'balanced' | 'turbo' | 'extreme' | 'reader' | 'ai_digest';

export type ImageQualitySetting = 'placeholder' | 'low' | 'medium' | 'original';

export interface CompressionSettings {
  profile: CompressionProfile;
  compressImages: boolean;
  imageQuality: ImageQualitySetting;
  blockTrackers: boolean;
  blockHeavyScripts: boolean;
  stripWebFonts: boolean;
  minifyMarkup: boolean;
  enableGzipSimulation: boolean;
  lazyLoadImages: boolean;
}

export interface ResourceBreakdownItem {
  originalBytes: number;
  compressedBytes: number;
  savedBytes: number;
  savedPercentage: number;
  itemCount: number;
}

export interface CompressionBreakdown {
  html: ResourceBreakdownItem;
  scripts: ResourceBreakdownItem;
  images: ResourceBreakdownItem;
  fonts: ResourceBreakdownItem;
  css: ResourceBreakdownItem;
}

export interface PageBrowseResult {
  success: boolean;
  url: string;
  displayUrl: string;
  title: string;
  favicon?: string;
  originalBytes: number;
  compressedBytes: number;
  savedBytes: number;
  savedPercentage: number;
  loadTimeMs: number;
  optimizedHtml: string;
  rawHtmlPreview?: string;
  readerText?: string;
  trackersBlocked: string[];
  breakdown: CompressionBreakdown;
  mode: CompressionProfile;
  isDemo?: boolean;
  error?: string;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  result?: PageBrowseResult;
  history: string[];
  historyIndex: number;
  viewMode: 'standard' | 'compare' | 'reader' | 'ai_digest' | 'ai_gpt';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tokensUsed?: number;
  bytesTransferred?: number;
  savingsVsWebSearchBytes?: number;
}

export interface SessionStats {
  pagesVisited: number;
  totalOriginalBytes: number;
  totalCompressedBytes: number;
  totalSavedBytes: number;
  averageSavingsPercent: number;
  trackersBlockedCount: number;
}

export interface SpeedDialItem {
  id: string;
  title: string;
  url: string;
  category: 'news' | 'reference' | 'tech' | 'heavy_benchmark';
  description: string;
  estimatedSaving: string;
  iconName: string;
}
