export type FormatPriceOptions = {
  currency?: string;
  locale?: string;
  style?: 'currency' | 'decimal';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
  showCurrency?: boolean;
};

const DEFAULT_OPTIONS: Required<FormatPriceOptions> = {
  currency: 'USD',
  locale: 'en-US',
  style: 'currency',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  compact: false,
  showCurrency: true,
};

/**
 * Formats a price with various options
 * @param price - Price value (number or string)
 * @param options - Formatting options
 * @returns Formatted price string
 */
const formatPrice = (
  price: number | string | undefined,
  options?: FormatPriceOptions
): string => {
  if (price === undefined || price === null || price === '') return 'N/A';

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) return 'N/A';

  const {
    currency,
    locale,
    style,
    minimumFractionDigits,
    maximumFractionDigits,
    compact,
    showCurrency,
  } = { ...DEFAULT_OPTIONS, ...options };

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: showCurrency ? style : 'decimal',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
      ...(compact ? { notation: 'compact' } : {}),
    });

    const formatted = formatter.format(numericPrice);

    // If showing decimal style but currency was requested
    if (!showCurrency && style === 'currency') {
      return `${formatted} ${currency}`;
    }

    return formatted;
  } catch {
    const fallback = numericPrice.toFixed(maximumFractionDigits);
    return showCurrency ? `${fallback} ${currency}` : fallback;
  }
};

/**
 * Formats a price range
 * @param min - Minimum price
 * @param max - Maximum price
 * @param options - Formatting options
 * @returns Formatted price range string
 */
export const formatPriceRange = (
  min?: number,
  max?: number,
  options?: FormatPriceOptions
): string => {
  if (min == null && max == null) return 'Price not specified';
  if (min == null) return `Up to ${formatPrice(max, options)}`;
  if (max == null) return `From ${formatPrice(min, options)}`;
  return `${formatPrice(min, { ...options, showCurrency: true })} - ${formatPrice(max, options)}`;
};

/**
 * Parses a formatted price string back to a number
 * @param formattedPrice - Formatted price string
 * @param locale - Locale (default: 'en-US')
 * @returns Numeric value or null if invalid
 */
export const parsePrice = (formattedPrice: string, locale: string = 'en-US'): number | null => {
  try {
    const cleaned = formattedPrice.replace(/[^0-9.,]/g, '');

    // Detect locale-specific separators
    const parts = new Intl.NumberFormat(locale).formatToParts(1234.5);
    const decimal = parts.find(part => part.type === 'decimal')?.value || '.';
    const group = parts.find(part => part.type === 'group')?.value || ',';

    const standardized = cleaned
      .replace(new RegExp(`\\${group}`, 'g'), '')
      .replace(new RegExp(`\\${decimal}`), '.');

    return parseFloat(standardized);
  } catch {
    return null;
  }
};

export { formatPrice };

export default formatPrice;
