/**
 * Reactive localStorage composable.
 * Wraps a key with a ref that stays in sync with localStorage.
 */
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue = null) {
  function read() {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : defaultValue
    } catch {
      return defaultValue
    }
  }

  function write(value) {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (e) {
      console.warn(`[useLocalStorage] Could not write key "${key}":`, e)
    }
  }

  const data = ref(read())

  watch(
    data,
    (newVal) => write(newVal),
    { deep: true }
  )

  function remove() {
    localStorage.removeItem(key)
    data.value = defaultValue
  }

  return { data, remove }
}