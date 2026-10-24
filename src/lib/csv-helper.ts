import { NextResponse } from 'next/server';

/**
 * Transliterates Cyrillic text to safe ASCII for HTTP header fallbacks.
 */
export function transliterate(str: string): string {
  const ru: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };

  return str
    .split('')
    .map(char => {
      const lower = char.toLowerCase();
      if (ru[lower] !== undefined) {
        return char === char.toUpperCase() ? ru[lower].toUpperCase() : ru[lower];
      }
      return char;
    })
    .join('');
}

/**
 * Generates RFC 6266 / RFC 5987 compliant Content-Disposition header value
 * with ASCII-safe fallback and UTF-8 encoded filename for modern browsers.
 * This guarantees zero crashes in Node.js ByteString converters.
 */
export function makeContentDisposition(filename: string): string {
  const cleanFilename = filename.trim();
  const asciiFallback = transliterate(cleanFilename)
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_')
    .replace(/_+/g, '_');

  const utf8Encoded = encodeURIComponent(cleanFilename)
    .replace(/['()]/g, escape)
    .replace(/\*/g, '%2A');

  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${utf8Encoded}`;
}

/**
 * Escapes a cell value for CSV (delimited by semicolon for Excel compatibility).
 * Also sanitizes against CSV Formula Injection (DDE attacks) by prefixing
 * formula characters (=, +, -, @, \t, \r) with a single quote.
 */
export function escapeCsvValue(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  let str = String(val);

  // Prevent CSV Formula Injection
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  if (str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Constructs a standardized CSV response with UTF-8 BOM for Microsoft Excel.
 */
export function createCsvResponse(csvRows: string[], filename: string): NextResponse {
  // UTF-8 BOM \uFEFF ensures Russian Cyrillic displays correctly in Excel
  const csvContent = '\uFEFF' + csvRows.join('\r\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': makeContentDisposition(filename),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
