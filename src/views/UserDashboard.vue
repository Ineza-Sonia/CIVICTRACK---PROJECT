<template>
  <main id="main-content" tabindex="-1" class="dash-main">
    <div class="container">

      <!-- Page header -->
      <header class="dash-header" aria-labelledby="dash-title">
        <div class="dash-header-copy">
          <p class="section-label">Citizen Dashboard</p>
          <h1 id="dash-title" class="dash-title">
            Good to see you, {{ firstName }}.
          </h1>
          <p class="dash-subtitle">
            Track your complaints, file new reports, and stay informed.
          </p>
        </div>
        <button
          class="new-complaint-btn"
          @click="showForm = true"
          aria-label="Open form to file a new complaint"
        >
          <FilePlus :size="17" aria-hidden="true" />
          New Complaint
        </button>
      </header>

      <!-- Stats row -->
      <section
        class="stats-row"
        aria-labelledby="stats-heading"
      >
        <h2 id="stats-heading" class="sr-only">Your complaint statistics</h2>
        <div
          v-for="stat in userStats"
          :key="stat.label"
          class="stat-card card"
          :aria-label="`${stat.label}: ${stat.value}`"
        >
          <div class="sc-icon" :class="stat.color" aria-hidden="true">
            <component :is="stat.icon" :size="18" />
          </div>
          <div class="sc-body">
            <span class="sc-num">{{ stat.value }}</span>
            <span class="sc-lbl">{{ stat.label }}</span>
          </div>
        </div>
      </section>

      <!-- Complaints list -->
      <section class="complaints-section" aria-labelledby="my-list-heading">
        <div class="section-toolbar">
          <h2 id="my-list-heading" class="section-h2">My Complaints</h2>
          <div
            class="filters"
            role="group"
            aria-label="Filter by status"
          >
            <button
              v-for="f in filters"
              :key="f.value"
              class="filter-btn"
              :class="{ active: activeFilter === f.value }"
              @click="activeFilter = f.value"
              :aria-pressed="activeFilter === f.value"
            >
              {{ f.label }}
              <span
                class="filter-count"
                :aria-label="`${f.count} complaints`"
              >{{ f.count }}</span>
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="filteredComplaints.length === 0"
          class="empty-state"
          role="status"
          aria-live="polite"
        >
          <div class="empty-icon" aria-hidden="true">
            <ClipboardList :size="44" />
          </div>
          <h3 class="empty-title">No complaints here yet</h3>
          <p class="empty-desc">
            File your first complaint and start holding your
            community accountable.
          </p>
          <button class="new-complaint-btn" @click="showForm = true">
            <FilePlus :size="16" aria-hidden="true" />
            File First Complaint
          </button>
        </div>

        <!-- Grid of cards -->
        <div
          v-else
          class="complaints-grid"
          role="list"
          aria-label="Your complaints"
        >
          <div
            v-for="c in filteredComplaints"
            :key="c.id"
            role="listitem"
          >
            <ComplaintCard :complaint="c" :show-actions="true">
              <template #actions>
                <button
                  class="view-btn"
                  @click="openDetail(c)"
                  :aria-label="`View full details for: ${c.title}`"
                >
                  <Eye :size="13" aria-hidden="true" /> Details
                </button>
              </template>
            </ComplaintCard>
          </div>
        </div>
      </section>
    </div>

    <!-- File complaint modal -->
    <BaseModal v-model="showForm" title="File a New Complaint" width="680px">
      <ComplaintForm @submitted="onSubmitted" />
    </BaseModal>

    <!-- Detail modal -->
    <BaseModal
      v-model="showDetail"
      :title="selected?.title || 'Complaint Details'"
      width="640px"
    >
      <div v-if="selected" class="detail-view">

        <!-- Meta row -->
        <div class="detail-meta">
          <span class="tracking-pill" aria-label="Tracking code">
            <Hash :size="13" aria-hidden="true" />
            {{ selected.trackingCode }}
          </span>
          <ComplaintStatusBadge :status="selected.status" />
        </div>

        <!-- Key info grid -->
        <dl class="detail-grid">
          <div class="detail-cell">
            <dt class="dc-label">Category</dt>
            <dd class="dc-value">{{ getCategoryLabel(selected.category) }}</dd>
          </div>
          <div class="detail-cell">
            <dt class="dc-label">Priority</dt>
            <dd class="dc-value" :class="`prio-${selected.priority}`">
              {{ selected.priority }}
            </dd>
          </div>
          <div v-if="selected.location" class="detail-cell">
            <dt class="dc-label">Location</dt>
            <dd class="dc-value">{{ selected.location }}</dd>
          </div>
          <div class="detail-cell">
            <dt class="dc-label">Submitted</dt>
            <dd class="dc-value">{{ formatDate(selected.submittedAt) }}</dd>
          </div>
        </dl>

        <!-- Full description -->
        <div class="detail-block">
          <h3 class="db-title">Description</h3>
          <p class="db-body">{{ selected.description }}</p>
        </div>

        <!-- Admin note -->
        <div v-if="selected.adminNote" class="detail-block admin-response">
          <h3 class="db-title">
            <MessageSquare :size="14" aria-hidden="true" />
            Authority Response
          </h3>
          <p class="db-body">{{ selected.adminNote }}</p>
        </div>

        <!-- Timeline -->
        <div class="detail-block">
          <h3 class="db-title">Status Timeline</h3>
          <ol class="timeline" aria-label="Complaint status timeline">
            <li
              v-for="(entry, i) in selected.timeline"
              :key="i"
              class="tl-item"
            >
              <span class="tl-dot" :class="`tl-${entry.status}`" aria-hidden="true"></span>
              <div class="tl-content">
                <ComplaintStatusBadge :status="entry.status" />
                <p class="tl-note">{{ entry.note }}</p>
                <time class="tl-date" :datetime="entry.date">
                  {{ formatDate(entry.date) }}
                </time>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </BaseModal>

    <BaseToast />
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/store/useAuthStore'
import { useComplaintStore, CATEGORIES } from '@/store/useComplaintStore'
import { useToast } from '@/composables/useToast'
import { useAnnouncer } from '@/composables/useAnnouncer'
import { formatDate } from '@/utils/validators'
import ComplaintCard        from '@/components/complaints/ComplaintCard.vue'
import ComplaintForm        from '@/components/complaints/ComplaintForm.vue'
import ComplaintStatusBadge from '@/components/complaints/ComplaintStatusBadge.vue'
import BaseModal            from '@/components/ui/BaseModal.vue'
import BaseToast            from '@/components/ui/BaseToast.vue'
import {
  FilePlus, Eye, Hash, ClipboardList, MessageSquare,
  FileText, Clock, CheckCircle, AlertCircle
} from 'lucide-vue-next'

const auth  = useAuthStore()
const store = useComplaintStore()
const toast = useToast()
const { announce } = useAnnouncer()

onMounted(() => store.load())

const showForm    = ref(false)
const showDetail  = ref(false)
const selected    = ref(null)
const activeFilter= ref('all')

const firstName = computed(() =>
  auth.currentUser?.fullName?.split(' ')[0] || 'Citizen'
)

const mine = computed(() =>
  store.complaints.filter(c => c.userId === auth.currentUser?.id)
)

const filters = computed(() => [
  { value: 'all',      label: 'All',       count: mine.value.length },
  { value: 'pending',  label: 'Pending',   count: mine.value.filter(c => c.status === 'pending').length  },
  { value: 'review',   label: 'In Review', count: mine.value.filter(c => c.status === 'review').length   },
  { value: 'resolved', label: 'Resolved',  count: mine.value.filter(c => c.status === 'resolved').length }
])

const filteredComplaints = computed(() =>
  activeFilter.value === 'all'
    ? mine.value
    : mine.value.filter(c => c.status === activeFilter.value)
)

const userStats = computed(() => [
  { label: 'Total Filed', value: mine.value.length,
    icon: FileText,    color: 'sc-blue'   },
  { label: 'Pending',     value: mine.value.filter(c => c.status === 'pending').length,
    icon: Clock,       color: 'sc-orange' },
  { label: 'Resolved',    value: mine.value.filter(c => c.status === 'resolved').length,
    icon: CheckCircle, color: 'sc-green'  },
  { label: 'Rejected',    value: mine.value.filter(c => c.status === 'rejected').length,
    icon: AlertCircle, color: 'sc-red'    }
])

function openDetail(c) {
  selected.value   = c
  showDetail.value = true
}

watch(showDetail, (v) => {
  if (!v) selected.value = null
})

function onSubmitted(complaint) {
  showForm.value = false
  toast.success(`Submitted! Tracking code: ${complaint.trackingCode}`)
  announce(`Complaint submitted. Tracking code: ${complaint.trackingCode}.`)
}

function getCategoryLabel(val) {
  return CATEGORIES.find(c => c.value === val)?.label || val
}
</script>

<style scoped>
.dash-main {
  padding-top: calc(var(--header-height) + var(--space-10));
  padding-bottom: var(--space-20);
  min-height: 100vh;
}

/* Header */
.dash-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-6);
  margin-bottom: var(--space-10);
  flex-wrap: wrap;
}

.dash-title {
  font-family: var(--font-display);
  font-size: clamp(var(--text-2xl), 3vw, var(--text-4xl));
  color: var(--text-primary);
  margin-top: var(--space-2);
}
.dash-subtitle {
  font-size: var(--text-base);
  color: var(--text-tertiary);
  margin-top: var(--space-1);
}

.new-complaint-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: var(--text-base);
  cursor: pointer;
  min-height: 48px;
  font-family: var(--font-body);
  transition: all var(--duration-fast);
  flex-shrink: 0;
}
.new-complaint-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-10);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
}

.sc-icon {
  width: 44px; height: 44px;
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.sc-blue   { background: var(--accent-subtle);     color: var(--accent-primary);    }
.sc-orange { background: var(--color-warning-100); color: var(--color-warning-500); }
.sc-green  { background: var(--color-success-100); color: var(--color-success-500); }
.sc-red    { background: var(--color-danger-100);  color: var(--color-danger-500);  }
[data-theme="dark"] .sc-blue   { background: rgba(255,255,255,0.07); }
[data-theme="dark"] .sc-orange { background: rgba(150,107,26,0.15); }
[data-theme="dark"] .sc-green  { background: rgba(42,122,82,0.15);  }
[data-theme="dark"] .sc-red    { background: rgba(146,50,50,0.15);  }

.sc-num {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}
.sc-lbl {
  display: block;
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 4px;
}

/* Complaints section */
.section-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}

.section-h2 {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
}

.filters { display: flex; gap: var(--space-2); flex-wrap: wrap; }

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  cursor: pointer;
  transition: all var(--duration-fast);
  min-height: 34px;
}
.filter-btn:hover           { border-color: var(--border-default); color: var(--text-primary); }
.filter-btn.active          { border-color: var(--accent-primary); background: var(--accent-subtle); color: var(--accent-primary); }

.filter-count {
  background: var(--bg-surface-3);
  border-radius: var(--radius-full);
  padding: 0 6px;
  font-size: 11px;
  font-family: var(--font-mono);
}
.filter-btn.active .filter-count { background: var(--accent-muted); }

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
  padding: var(--space-20) var(--space-8);
  background: var(--bg-surface);
  border: 1px dashed var(--border-default);
  border-radius: var(--radius-xl);
}
.empty-icon  { color: var(--text-tertiary); }
.empty-title { font-family: var(--font-body); font-size: var(--text-xl); font-weight: 700; color: var(--text-secondary); }
.empty-desc  { font-size: var(--text-base); color: var(--text-tertiary); max-width: 340px; }

/* Grid */
.complaints-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-4);
}

.view-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--accent-primary);
  background: var(--accent-subtle);
  border: 1px solid var(--color-primary-200);
  cursor: pointer;
  transition: all var(--duration-fast);
}
.view-btn:hover { background: var(--accent-muted); }
[data-theme="dark"] .view-btn { border-color: var(--accent-muted); }

/* Detail modal */
.detail-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.tracking-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  background: var(--bg-inset);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  background: var(--bg-surface-2);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}
.detail-cell { display: flex; flex-direction: column; gap: 3px; }
.dc-label {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.dc-value {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  text-transform: capitalize;
}
.prio-critical { color: var(--color-danger-500);  }
.prio-high     { color: var(--color-warning-500); }
.prio-medium   { color: var(--accent-primary);    }
.prio-low      { color: var(--color-success-500); }

.detail-block { display: flex; flex-direction: column; gap: var(--space-3); }
.db-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
}
.db-body {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.admin-response {
  background: var(--accent-subtle);
  border: 1px solid var(--color-primary-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
[data-theme="dark"] .admin-response { border-color: var(--accent-muted); }

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-left: var(--space-5);
  border-left: 2px solid var(--border-subtle);
}
.tl-item {
  display: flex;
  gap: var(--space-4);
  position: relative;
}
.tl-dot {
  position: absolute;
  left: calc(-1 * var(--space-5) - 5px);
  top: 5px;
  width: 10px; height: 10px;
  border-radius: 50%;
  border: 2px solid var(--bg-canvas);
}
.tl-pending  { background: var(--color-warning-500); }
.tl-review   { background: var(--accent-primary);    }
.tl-resolved { background: var(--color-success-500); }
.tl-rejected { background: var(--color-danger-500);  }

.tl-content { display: flex; flex-direction: column; gap: var(--space-1); }
.tl-note    { font-size: var(--text-sm); color: var(--text-secondary); }
.tl-date    { font-size: 11px; color: var(--text-tertiary); font-family: var(--font-mono); }

@media (max-width: 900px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .dash-header { flex-direction: column; }
  .complaints-grid { grid-template-columns: 1fr; }
  .detail-grid { grid-template-columns: 1fr; }
}
</style>