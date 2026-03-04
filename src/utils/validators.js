/**
 * CIVICTRACK — Form Validators & Date Utilities
 */

// ─── Field Validators ──────────────────────────────────────────

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

export function validateRequired(value) {
  return value !== null &&
         value !== undefined &&
         String(value).trim().length > 0
}

export function validateMinLength(value, min) {
  return String(value).trim().length >= min
}

export function validateMaxLength(value, max) {
  return String(value).trim().length <= max
}

export function validatePhone(phone) {
  return /^\+?[\d\s\-().]{7,20}$/.test(String(phone).trim())
}

/**
 * Password strength check.
 * Returns an array of unmet requirement strings.
 * Empty array = password is valid.
 */
export function validatePassword(password) {
  const errors = []
  if (password.length < 8)               errors.push('at least 8 characters')
  if (!/[A-Z]/.test(password))           errors.push('one uppercase letter')
  if (!/[0-9]/.test(password))           errors.push('one number')
  if (!/[^A-Za-z0-9]/.test(password))   errors.push('one special character')
  return errors
}

// ─── Date & Time Utilities ─────────────────────────────────────

/**
 * Full date + time: "Jan 15, 2025, 02:30 PM"
 */
export function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit'
  })
}

/**
 * Short date only: "Jan 15, 2025"
 */
export function formatDateShort(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric'
  })
}

/**
 * Relative time: "Just now", "3m ago", "2h ago", "5d ago"
 */
export function timeAgo(dateString) {
  if (!dateString) return '—'
  const diff = Math.floor((Date.now() - new Date(dateString)) / 1000)
  if (diff < 60)     return 'Just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return formatDateShort(dateString)
}

// ─── String Utilities ─────────────────────────────────────────

export function truncate(str, maxLength = 140) {
  if (!str) return ''
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str
}

export function initials(fullName = '') {
  return fullName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}