<template>
  <div class="stats-summary" aria-label="Complaint statistics summary">

    <!-- Stat cards -->
    <div class="summary-grid" role="list">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="summary-card card"
        role="listitem"
        :aria-label="`${stat.label}: ${stat.value}`"
      >
        <div class="sc-icon" :class="stat.color" aria-hidden="true">
          <component :is="stat.icon" :size="18" />
        </div>
        <div class="sc-content">
          <span class="sc-value">{{ stat.value }}</span>
          <span class="sc-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Resolution rate bar -->
    <div class="resolution-rate" aria-labelledby="rate-label">
      <div class="rate-header">
        <span id="rate-label" class="rate-label">Resolution Rate</span>
        <span class="rate-value" aria-label="Resolution rate percentage">{{ resolutionRate }}%</span>
      </div>
      <div
        class="rate-bar"
        role="progressbar"
        :aria-valuenow="resolutionRate"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`Resolution rate: ${resolutionRate}%`"
      >
        <div
          class="rate-fill"
          :style="{ width: `${resolutionRate}%` }"
        ></div>
      </div>
    </div>

    <!-- Category breakdown -->
    <div class="category-breakdown" aria-label="Complaints by category">
      <p class="breakdown-title">By Category</p>
      <ul role="list" class="breakdown-list">
        <li
          v-for="cat in topCategories"
          :key="cat.value"
          class="breakdown-item"
          role="listitem"
        >
          <div class="bi-label-row">
            <component :is="getCatIcon(cat.icon)" :size="13" aria-hidden="true" />
            <span class="bi-label">{{ cat.label }}</span>
            <span class="bi-count" :aria-label="`${cat.count} complaints`">{{ cat.count }}</span>
          </div>
          <div
            class="bi-bar"
            role="progressbar"
            :aria-valuenow="cat.count"
            :aria-valuemax="maxCategoryCount"
            :aria-label="`${cat.label}: ${cat.count} of ${maxCategoryCount} complaints`"
          >
            <div
              class="bi-fill"
              :style="{ width: `${maxCategoryCount > 0 ? Math.round((cat.count / maxCategoryCount) * 100) : 0}%` }"
            ></div>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  FileText, Clock, Eye, CheckCircle, XCircle,
  Shield, Construction, Leaf, Landmark,
  HeartPulse, Users, Zap, MoreHorizontal
} from 'lucide-vue-next'
import { useComplaintStore } from '@/store/useComplaintStore'

const store = useComplaintStore()

const stats = computed(() => [
  { label: 'Total',      value: store.stats.total,    icon: FileText,    color: 'ic-blue'   },
  { label: 'Pending',    value: store.stats.pending,  icon: Clock,       color: 'ic-orange' },
  { label: 'In Review',  value: store.stats.review,   icon: Eye,         color: 'ic-blue'   },
  { label: 'Resolved',   value: store.stats.resolved, icon: CheckCircle, color: 'ic-green'  },
  { label: 'Rejected',   value: store.stats.rejected, icon: XCircle,     color: 'ic-red'    }
])

const resolutionRate = computed(() => {
  if (!store.stats.total) return 0
  return Math.round((store.stats.resolved / store.stats.total) * 100)
})

const topCategories = computed(() =>
  store.stats.byCategory
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
)

const maxCategoryCount = computed(() =>
  Math.max(...topCategories.value.map(c => c.count), 1)
)

const iconMap = {
  Shield, Construction, Leaf, Landmark,
  HeartPulse, Users, Zap, MoreHorizontal
}
function getCatIcon(name) { return iconMap[name] || MoreHorizontal }
</script>

<style scoped>
.stats-summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-3);
}

.summary-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
}

.sc-icon {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ic-blue   { background: var(--accent-subtle);     color: var(--accent-primary);    }
.ic-orange { background: var(--color-warning-100); color: var(--color-warning-500); }
.ic-green  { background: var(--color-success-100); color: var(--color-success-500); }
.ic-red    { background: var(--color-danger-100);  color: var(--color-danger-500);  }

[data-theme="dark"] .ic-blue   { background: rgba(255,255,255,0.07); }
[data-theme="dark"] .ic-orange { background: rgba(150,107,26,0.15); }
[data-theme="dark"] .ic-green  { background: rgba(42,122,82,0.15);  }
[data-theme="dark"] .ic-red    { background: rgba(146,50,50,0.15);  }

.sc-value {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}
.sc-label {
  display: block;
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 3px;
}

/* Resolution rate */
.resolution-rate {
  background: var(--bg-surface-2);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
}
.rate-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.rate-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
}
.rate-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-success-500);
}
.rate-bar {
  height: 8px;
  background: var(--bg-surface-3);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.rate-fill {
  height: 100%;
  background: var(--color-success-500);
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out);
}

/* Category breakdown */
.breakdown-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-4);
}
.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.breakdown-item { display: flex; flex-direction: column; gap: var(--space-1); }
.bi-label-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-tertiary);
}
.bi-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  flex: 1;
}
.bi-count {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}
.bi-bar {
  height: 5px;
  background: var(--bg-surface-3);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.bi-fill {
  height: 100%;
  background: var(--accent-primary);
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out);
  min-width: 4px;
}

@media (max-width: 900px) {
  .summary-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>