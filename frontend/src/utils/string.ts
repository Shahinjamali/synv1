export const truncateWords = (
  text: string | undefined,
  wordLimit: number
): string => {
  if (!text) return '';

  const words = text.trim().split(/\s+/);

  if (words.length >= wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  // Pad with invisible dots or &nbsp; to keep line height consistent
  const padding = ' \u00A0'.repeat(wordLimit - words.length); // non-breaking space
  return words.join(' ') + padding;
};
