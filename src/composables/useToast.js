/**
 * Global toast notification system.
 * Used by BaseToast.vue — call from any component.
 */
import { ref } from 'vue'

// Shared state outside the function so it's truly global
const toasts = ref([])

export function useToast() {
  function addToast({ message, type = 'info', duration = 4500 }) {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  // Shorthand helpers
  const success = (msg) => addToast({ message: msg, type: 'success' })
  const error   = (msg) => addToast({ message: msg, type: 'error'   })
  const info    = (msg) => addToast({ message: msg, type: 'info'    })
  const warning = (msg) => addToast({ message: msg, type: 'warning' })

  return { toasts, addToast, removeToast, success, error, info, warning }
}