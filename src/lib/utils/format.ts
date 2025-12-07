/**
 * German-specific formatting utilities
 * Following CLAUDE.md requirements for date format (DD.MM.YYYY) and number format (1.234,56 €)
 */

// ============================================
// Date Formatting
// ============================================

/**
 * Format date as DD.MM.YYYY
 */
export function formatGermanDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}.${month}.${year}`;
}

/**
 * Format date with time as DD.MM.YYYY, HH:MM
 */
export function formatGermanDateTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '';
  
  const dateStr = formatGermanDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${dateStr}, ${hours}:${minutes} Uhr`;
}

/**
 * Format date as relative time in German
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffSecs < 60) return 'gerade eben';
  if (diffMins < 60) return `vor ${diffMins} Minute${diffMins !== 1 ? 'n' : ''}`;
  if (diffHours < 24) return `vor ${diffHours} Stunde${diffHours !== 1 ? 'n' : ''}`;
  if (diffDays < 7) return `vor ${diffDays} Tag${diffDays !== 1 ? 'en' : ''}`;
  if (diffWeeks < 4) return `vor ${diffWeeks} Woche${diffWeeks !== 1 ? 'n' : ''}`;
  if (diffMonths < 12) return `vor ${diffMonths} Monat${diffMonths !== 1 ? 'en' : ''}`;
  
  return formatGermanDate(d);
}

/**
 * Get German weekday name
 */
export function getGermanWeekday(dayNumber: number): string {
  const weekdays = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ];
  return weekdays[dayNumber] || '';
}

/**
 * Get German month name
 */
export function getGermanMonth(monthNumber: number): string {
  const months = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];
  return months[monthNumber] || '';
}

/**
 * Format date as "5. Januar 2024"
 */
export function formatGermanDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getDate()}. ${getGermanMonth(d.getMonth())} ${d.getFullYear()}`;
}

// ============================================
// Number Formatting
// ============================================

/**
 * Format number with German locale (1.234,56)
 */
export function formatGermanNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format currency in Euro with German locale
 */
export function formatEuro(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

/**
 * Format percentage with German locale
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// ============================================
// Duration Formatting
// ============================================

/**
 * Format duration in seconds to MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format duration in a readable German format
 */
export function formatDurationReadable(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} Sekunde${seconds !== 1 ? 'n' : ''}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} Minute${minutes !== 1 ? 'n' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  
  if (remainingMins === 0) {
    return `${hours} Stunde${hours !== 1 ? 'n' : ''}`;
  }
  
  return `${hours} Std. ${remainingMins} Min.`;
}

// ============================================
// Word Count
// ============================================

/**
 * Count words in a string
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Format word count for display
 */
export function formatWordCount(count: number): string {
  return `${formatGermanNumber(count)} Wörter`;
}

// ============================================
// Phone Number Formatting
// ============================================

/**
 * Format German phone number
 */
export function formatGermanPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Handle German numbers
  if (digits.startsWith('49')) {
    // +49 format
    const local = digits.slice(2);
    if (local.length >= 10) {
      return `+49 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
    }
  }
  
  if (digits.startsWith('0')) {
    // Local format
    if (digits.length >= 10) {
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }
  }
  
  return phone; // Return original if can't format
}

// ============================================
// File Size
// ============================================

/**
 * Format file size in German
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  const value = bytes / Math.pow(k, i);
  return `${formatGermanNumber(value, i > 0 ? 1 : 0)} ${sizes[i]}`;
}
