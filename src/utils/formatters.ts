/**
 * Formats byte counts into human-readable strings (e.g., 2.4 MB, 480 KB).
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm))} ${sizes[safeI]}`;
}

/**
 * Formats percentage with standard 1 decimal place.
 */
export function formatPercent(val: number): string {
  return `${Math.round(val * 10) / 10}%`;
}

/**
 * Calculates estimated cellular cost saved (assuming average ~$10 / GB roaming or tier).
 */
export function estimateCostSaved(savedBytes: number): string {
  const mb = savedBytes / (1024 * 1024);
  const cost = (mb / 1024) * 10;
  if (cost < 0.01) {
    return `< $0.01`;
  }
  return `$${cost.toFixed(2)}`;
}

/**
 * Calculates estimated load time speedup.
 */
export function estimateSpeedup(originalBytes: number, compressedBytes: number): string {
  if (compressedBytes <= 0) return '1x';
  const ratio = originalBytes / compressedBytes;
  return `${ratio.toFixed(1)}x`;
}
