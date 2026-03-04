<template>
  <article
    class="card complaint-card"
    :aria-label="`Complaint: ${complaint.title}, status: ${complaint.status}`"
  >
    <!-- Top row: tracking code + badge -->
    <div class="card-top">
      <div class="card-meta">
        <span class="tracking-code" aria-label="Tracking code">
          <Hash :size="11" aria-hidden="true" />
          {{ complaint.trackingCode }}
        </span>
        <ComplaintStatusBadge :status="complaint.status" />
      </div>
      <div v-if="showActions" class="card-actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Title -->
    <h3 class="card-title">{{ complaint.title }}</h3>

    <!-- Description snippet -->
    <p class="card-description">{{ truncated }}</p>

    <!-- Footer row: tags + time -->
    <div class="card-footer">
      <div class="card-tags" aria-label="Complaint tags">
        <span class="tag">
          <component :is="categoryIcon" :size="11" aria-hidden="true" />
          {{ categoryLabel }}
        </span>
        <span v-if="complaint.location" class="tag">
          <MapPin :size="11" aria-hidden="true" />
          {{ complaint.location }}
        </span>
        <span
          v-if="complaint.anonymous"
          class="tag tag-anon"
          aria-label="Submitted anonymously"
        >
          <EyeOff :size="11" aria-hidden="true" />
          Anonymous
        </span>
        <span class="tag" :class="`priority-tag-${complaint.priority}`">
          {{ complaint.priority }}
        </span>
      </div>
      <time
        class="card-time"
        :datetime="complaint.submittedAt"
        :title="formatDate(complaint.submittedAt)"
      >
        {{ timeAgo(complaint.submittedAt) }}
      </time>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import {
  Hash, MapPin, EyeOff,
  Shield, Construction, Leaf, Landmark,
  HeartPulse, Users, Zap, MoreHorizontal
} from 'lucide-vue-next'
import ComplaintStatusBadge from './ComplaintStatusBadge.vue'
import { CATEGORIES } from '@/store/useComplaintStore'
import { timeAgo, formatDate, truncate } from '@/utils/validators'

const props = defineProps({
  complaint:   { type: Object,  required: true  },
  showActions: { type: Boolean, default: false  }
})

const iconMap = {
  Shield, Construction, Leaf, Landmark,
  HeartPulse, Users, Zap, MoreHorizontal
}

const categoryInfo  = computed(() =>
  CATEGORIES.find(c => c.value === props.complaint.category) || CATEGORIES[CATEGORIES.length - 1]
)
const categoryLabel = computed(() => categoryInfo.value?.label || 'Other')
const categoryIcon  = computed(() => iconMap[categoryInfo.value?.icon] || MoreHorizontal)
const truncated     = computed(() => truncate(props.complaint.description, 130))
</script>

<style scoped>
.complaint-card {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: box-shadow var(--duration-normal) var(--ease-out),
              transform var(--duration-normal) var(--ease-out),
              border-color var(--duration-normal) var(--ease-out);
}
.complaint-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Top */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.tracking-code {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  background: var(--bg-inset);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}
.card-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Content */
.card-title {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text-primary);
  line-height: var(--leading-snug);
}
.card-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  flex: 1;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-top: var(--space-1);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}
.card-tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  background: var(--bg-surface-2);
  border-radius: var(--radius-full);
  font-size: 11px;
  color: var(--text-tertiary);
  font-weight: 500;
}
.tag-anon {
  color: var(--color-info-500);
  background: var(--color-info-100);
}
[data-theme="dark"] .tag-anon { background: rgba(42,95,122,0.2); }

.priority-tag-critical { background: var(--color-danger-100);  color: var(--color-danger-500);  }
.priority-tag-high     { background: var(--color-warning-100); color: var(--color-warning-500); }
.priority-tag-medium   { background: var(--accent-subtle);     color: var(--accent-primary);    }
.priority-tag-low      { background: var(--color-success-100); color: var(--color-success-500); }

[data-theme="dark"] .priority-tag-critical { background: rgba(146,50,50,0.2); }
[data-theme="dark"] .priority-tag-high     { background: rgba(150,107,26,0.2); }
[data-theme="dark"] .priority-tag-low      { background: rgba(42,122,82,0.2); }

.card-time {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  white-space: nowrap;
  flex-shrink: 0;
}
</style>