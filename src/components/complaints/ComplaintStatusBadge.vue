<template>
  <span
    class="badge badge-colorblind-safe"
    :class="[badgeClass, `badge-pattern-${status}`]"
    :aria-label="`Status: ${statusInfo.label}`"
    :data-status="status"
  >
    <component :is="statusIcon" :size="11" aria-hidden="true" class="badge-icon" />
    <span class="badge-text">{{ statusInfo.label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { Clock, Eye, CheckCircle, XCircle } from 'lucide-vue-next'
import { STATUSES } from '@/store/useComplaintStore'

const props = defineProps({
  status: { type: String, required: true }
})

const statusInfo  = computed(() => STATUSES[props.status] || STATUSES.pending)
const badgeClass  = computed(() => statusInfo.value.badge)
const statusIcon  = computed(() => ({
  Clock, Eye, CheckCircle, XCircle
}[{
  pending:  'Clock',
  review:   'Eye',
  resolved: 'CheckCircle',
  rejected: 'XCircle'
}[props.status]] || Clock))
</script>