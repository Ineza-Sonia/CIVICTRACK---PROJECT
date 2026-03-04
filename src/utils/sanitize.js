/**
 * CIVICTRACK — Input sanitization for XSS prevention
 * Uses allowlist approach: strip/disallow dangerous patterns.
 */

const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}

/**
 * Escape HTML entities to prevent XSS when rendering user input.
 * Use for any user-provided text displayed in templates.
 * @param {string} str - Raw string from user input
 * @returns {string} Escaped string safe for HTML
 */
export function escapeHtml(str) {
  if (str == null || typeof str !== 'string') return ''
  return str.replace(/[&<>"'`=/]/g, (c) => HTML_ENTITIES[c] ?? c)
}

/**
 * Sanitize user input for storage/display.
 * Trims whitespace, normalizes line breaks, limits length.
 * Does NOT escape — use escapeHtml when rendering.
 * @param {string} str - Raw input
 * @param {object} opts - { maxLength, allowNewlines }
 * @returns {string}
 */
export function sanitizeInput(str, opts = {}) {
  const { maxLength = 10000, allowNewlines = true } = opts
  if (str == null || typeof str !== 'string') return ''
  let s = str.trim()
  if (!allowNewlines) s = s.replace(/\s+/g, ' ')
  else s = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  return s.slice(0, maxLength)
}

/**
 * Sanitize for use in data attributes or URLs (stricter).
 * @param {string} str
 * @returns {string}
 */
export function sanitizeForAttribute(str) {
  if (str == null || typeof str !== 'string') return ''
  return str.trim().replace(/["'<>`]/g, '').slice(0, 500)
}
