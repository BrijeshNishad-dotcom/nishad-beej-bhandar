/**
 * Helper to dynamically format bilingual terms from the database or UI.
 * - In Hindi Mode: Keeps bilingual name if present (e.g. "बीज (Seeds)", "Hybrid Paddy (हाइब्रिड धान)").
 * - In English Mode: Extracts and displays ONLY the English part.
 */
export function formatTerm(value: string | null | undefined, language: 'hi' | 'en' | string): string {
  if (!value) return '';
  
  const parensRegex = /\(([^)]+)\)/;
  const match = value.match(parensRegex);
  
  if (match) {
    const parenthesized = match[1].trim();
    const outside = value.replace(parensRegex, '').trim();
    
    // Check if Devanagari characters are present (range \u0900 to \u097F)
    const hasHindiOutside = /[\u0900-\u097F]/.test(outside);
    const hasHindiInside = /[\u0900-\u097F]/.test(parenthesized);
    
    if (language === 'en') {
      if (hasHindiInside && !hasHindiOutside) {
        // e.g. "Hybrid Paddy (हाइब्रिड धान)" -> "Hybrid Paddy"
        return outside;
      } else if (!hasHindiInside && hasHindiOutside) {
        // e.g. "बीज (Seeds)" -> "Seeds"
        return parenthesized;
      }
    }
  }
  
  return value;
}
