/**
 * WCAG 2.1 — Live Region Announcer
 * Injects an aria-live region into the DOM so screen readers
 * announce dynamic events (form submissions, errors, navigation).
 */
import { onMounted } from 'vue'

export function useAnnouncer() {
  onMounted(() => {
    if (!document.getElementById('a11y-announcer')) {
      const el = document.createElement('div')
      el.id = 'a11y-announcer'
      el.setAttribute('aria-live',   'polite')
      el.setAttribute('aria-atomic', 'true')
      el.setAttribute('role',        'status')
      el.style.cssText =
        'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;'
      document.body.appendChild(el)
    }
  })

  /**
   * Announce a message to screen readers.
   * @param {string} message   - The text to announce
   * @param {'polite'|'assertive'} priority
   *   polite    → waits for user to finish current task (default, most cases)
   *   assertive → interrupts immediately (errors, critical alerts only)
   */
  function announce(message, priority = 'polite') {
    const el = document.getElementById('a11y-announcer')
    if (!el) return
    el.setAttribute('aria-live', priority)
    // Clear first so repeated identical messages still fire
    el.textContent = ''
    requestAnimationFrame(() => {
      el.textContent = message
    })
  }

  function announceAssertive(message) {
    announce(message, 'assertive')
  }

  return { announce, announceAssertive }
}