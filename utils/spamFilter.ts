/**
 * Simple spam filter utility for comments.
 * Checks for blacklisted keywords and suspicious links.
 */

const BLACKLISTED_KEYWORDS = [
  "buy now", "free money", "cryptocurrency", "casino", "poker",
  "dating", "viagra", "cheap", "discount", "offer", "click here",
  "subscribe to my channel", "follow me"
];

const SUSPICIOUS_LINK_REGEX = /https?:\/\/(?!isoftwareacademy\.com|localhost|www\.google\.com)[^\s]+/gi;

export function checkSpam(content: string): { isSpam: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const lowercaseContent = content.toLowerCase();

  // 1. Check keywords
  BLACKLISTED_KEYWORDS.forEach(keyword => {
    if (lowercaseContent.includes(keyword)) {
      reasons.push(`Contains blacklisted keyword: ${keyword}`);
    }
  });

  // 2. Check suspicious links
  const links = content.match(SUSPICIOUS_LINK_REGEX);
  if (links && links.length > 0) {
    reasons.push(`Contains suspicious links: ${links.join(", ")}`);
  }

  // 3. Check for excessive uppercase
  const uppercaseCount = (content.match(/[A-Z]/g) || []).length;
  if (content.length > 20 && (uppercaseCount / content.length) > 0.6) {
    reasons.push("Excessive use of uppercase letters");
  }

  return {
    isSpam: reasons.length > 0,
    reasons
  };
}
