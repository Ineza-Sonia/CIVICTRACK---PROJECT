import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAccessibilityStore = defineStore('accessibility', () => {
  const theme        = ref('light') // 'light' | 'dark' | 'high-contrast'
  const fontSize     = ref('md')    // 'sm' | 'md' | 'lg' | 'xl'
  const reducedMotion= ref(false)

  function loadPreferences() {
    const saved = localStorage.getItem('ct_a11y')
    if (saved) {
      const prefs = JSON.parse(saved)
      theme.value        = prefs.theme        || 'light'
      fontSize.value     = prefs.fontSize     || 'md'
      reducedMotion.value= prefs.reducedMotion|| false
    } else {
      // Default: always start in light mode.
      // Only respect reduced-motion OS preference (not color scheme).
      theme.value = 'light'
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        reducedMotion.value = true
      }
    }
    applyToDOM()
  }

  function savePreferences() {
    localStorage.setItem('ct_a11y', JSON.stringify({
      theme: theme.value,
      fontSize: fontSize.value,
      reducedMotion: reducedMotion.value
    }))
  }

  function applyToDOM() {
    const html = document.documentElement
    html.setAttribute('data-theme',         theme.value)
    html.setAttribute('data-font-size',     fontSize.value)
    html.setAttribute('data-reduced-motion',String(reducedMotion.value))
  }

  function setTheme(t) {
    theme.value = t
    applyToDOM()
    savePreferences()
  }

  function setFontSize(s) {
    fontSize.value = s
    applyToDOM()
    savePreferences()
  }

  function toggleReducedMotion() {
    reducedMotion.value = !reducedMotion.value
    applyToDOM()
    savePreferences()
  }

  const fontSizeOptions = [
    { value: 'sm', label: 'Small',       desc: '14px base' },
    { value: 'md', label: 'Medium',      desc: '16px base' },
    { value: 'lg', label: 'Large',       desc: '18px base' },
    { value: 'xl', label: 'Extra Large', desc: '20px base' }
  ]

  const themeOptions = [
    { value: 'light',         label: 'Light',         icon: 'Sun'      },
    { value: 'dark',          label: 'Dark',          icon: 'Moon'     },
    { value: 'high-contrast', label: 'High Contrast', icon: 'Contrast' }
  ]

  return {
    theme, fontSize, reducedMotion,
    fontSizeOptions, themeOptions,
    loadPreferences, setTheme, setFontSize, toggleReducedMotion
  }
})