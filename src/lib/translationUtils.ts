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

/**
 * Helper to get a localized field from any object with bilingual fields.
 * If language is 'en', checks if fieldNameEn exists and returns it,
 * otherwise falls back to formatting the base field value.
 */
export function getLocalizedField(obj: any, fieldName: string, language: string): string {
  if (!obj) return '';
  const isEn = language === 'en';
  const enKey = `${fieldName}En`;
  
  if (isEn && obj[enKey]) {
    return obj[enKey];
  }
  
  // Fall back to formatting the base field value (e.g., extracting parenthesized English if language is 'en')
  return formatTerm(obj[fieldName], language);
}

/**
 * Helper to get a localized category name from category object.
 * Attempts slug mapping first to keep translation file as SSoT, falls back to DB name.
 */
export function getLocalizedCategory(
  category: any,
  language: string,
  t: (key: string, options?: any) => string
): string {
  if (!category) return '';
  const isEn = language === 'en';
  
  if (isEn && category.nameEn) {
    return category.nameEn;
  }
  
  const keyMap: { [key: string]: string } = {
    'paddy-seeds': 'categories.paddy',
    'wheat-seeds': 'categories.wheat',
    'maize-seeds': 'categories.maize',
    'vegetable-seeds': 'categories.vegetable',
    'fruit-seeds': 'categories.fruit',
    'mustard-seeds': 'categories.mustard',
    'pulse-seeds': 'categories.pulse',
    'onion-seeds': 'categories.onion',
    'tomato-seeds': 'categories.tomato',
    'cucumber-seeds': 'categories.cucumber',
    'carrot-seeds': 'categories.carrot',
    'millet-seeds': 'categories.millet',
    'fodder-seeds': 'categories.fodder',
    'fertilizers': 'categories.fertilizers',
    'urea': 'categories.urea',
    'dap': 'categories.dap',
    'muriate-of-potash-mop': 'categories.mop',
    'single-super-phosphate-ssp': 'categories.ssp',
    'npk-fertilizers': 'categories.npk',
    'zinc-sulphate': 'categories.zinc',
    'gypsum': 'categories.gypsum',
    'farmyard-manure-fym': 'categories.fym',
    'vermicompost': 'categories.vermicompost',
    'pesticides': 'categories.pesticides',
    'plant-growth-promoters': 'categories.growthPromoters',
  };
  
  const key = keyMap[category.slug];
  if (key) {
    return t(key);
  }
  
  return isEn ? (category.nameEn || category.name) : category.name;
}
