<template>
  <main id="main-content" tabindex="-1" class="admin-main">
    <div class="admin-layout">

      <!-- ── Sidebar ── -->
      <aside
        class="admin-sidebar"
        :class="{ collapsed: collapsed }"
        aria-label="Admin navigation sidebar"
      >
        <nav>
          <div class="sidebar-brand" aria-hidden="true">
            <ShieldCheck :size="18" />
            <span v-if="!collapsed" class="brand-label">Admin Panel</span>
          </div>
          <ul role="list" class="sidebar-nav">
            <li v-for="item in sidebarItems" :key="item.id">
              <button
                class="sidebar-item"
                :class="{ active: activeTab === item.id }"
                @click="activeTab = item.id"
                :aria-pressed="activeTab === item.id"
                :aria-label="item.label"
                :title="collapsed ? item.label : undefined"
              >
                <component :is="item.icon" :size="17" aria-hidden="true" />
                <span v-if="!collapsed">{{ item.label }}</span>
                <span
                  v-if="item.badge && !collapsed"
                  class="sidebar-badge"
                  :aria-label="`${item.badge} pending`"
                >{{ item.badge }}</span>
              </button>
            </li>
          </ul>
        </nav>
        <button
          class="collapse-btn"
          @click="collapsed = !collapsed"
          :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :aria-expanded="!collapsed"
        >
          <ChevronLeft  v-if="!collapsed" :size="15" aria-hidden="true" />
          <ChevronRight v-else            :size="15" aria-hidden="true" />
        </button>
      </aside>

      <!-- ── Main area ── -->
      <div class="admin-content">

        <!-- Content header -->
        <header class="admin-header">
          <div class="admin-header-left">
            <h1 class="admin-page-title">{{ currentTabLabel }}</h1>
            <p class="admin-date">{{ todayFormatted }}</p>
          </div>
          <div class="admin-header-right">
            <div class="search-box" role="search">
              <label for="admin-search" class="sr-only">Search complaints by title, tracking code, or description</label>
              <Search :size="16" class="search-icon" aria-hidden="true" />
              <input
                id="admin-search"
                v-model.trim="searchQuery"
                type="search"
                class="input search-input"
                placeholder="Search by title, code, or description…"
                aria-label="Search complaints by title, tracking code, or description"
                autocomplete="off"
              />
            </div>
          </div>
        </header>

        <!-- Mobile tab bar (visible when sidebar is hidden) -->
        <nav
          class="admin-mobile-tabs"
          aria-label="Admin section navigation"
        >
          <button
            v-for="item in sidebarItems"
            :key="item.id"
            class="mobile-tab-btn"
            :class="{ active: activeTab === item.id }"
            @click="activeTab = item.id"
            :aria-pressed="activeTab === item.id"
          >
            <component :is="item.icon" :size="16" aria-hidden="true" />
            <span>{{ item.label }}</span>
            <span v-if="item.badge" class="mobile-tab-badge">{{ item.badge }}</span>
          </button>
        </nav>

        <!-- ════════ OVERVIEW TAB ════════ -->
        <section
          v-if="activeTab === 'overview'"
          aria-labelledby="ov-heading"
        >
          <h2 id="ov-heading" class="sr-only">Overview</h2>

          <!-- Stats cards -->
          <div class="ov-stats" aria-label="Platform statistics overview">
            <div
              v-for="stat in overviewStats"
              :key="stat.label"
              class="ov-card card"
              :aria-label="`${stat.label}: ${stat.value}`"
            >
              <div class="ov-card-top">
                <div class="ov-icon" :class="stat.color" aria-hidden="true">
                  <component :is="stat.icon" :size="18" />
                </div>
                <span class="ov-sub">{{ stat.sub }}</span>
              </div>
              <span class="ov-value">{{ stat.value }}</span>
              <span class="ov-label">{{ stat.label }}</span>
            </div>
          </div>

          <!-- Category breakdown -->
          <div class="breakdown-card card" aria-labelledby="breakdown-title">
            <h2 id="breakdown-title" class="bc-title">Complaints by Category</h2>
            <div
              class="breakdown-rows"
              role="list"
              aria-label="Breakdown of complaints per category"
            >
              <div
                v-for="cat in store.stats.byCategory"
                :key="cat.value"
                class="br-row"
                role="listitem"
              >
                <div class="br-info">
                  <component :is="getCatIcon(cat.icon)" :size="14" aria-hidden="true" />
                  <span class="br-label">{{ cat.label }}</span>
                </div>
                <div
                  class="br-bar-track"
                  role="progressbar"
                  :aria-valuenow="cat.count"
                  :aria-valuemax="store.stats.total || 1"
                  :aria-label="`${cat.label}: ${cat.count} complaints`"
                >
                  <div
                    class="br-bar-fill"
                    :style="{ width: `${store.stats.total ? Math.round((cat.count / store.stats.total) * 100) : 0}%` }"
                  ></div>
                </div>
                <span class="br-count" aria-hidden="true">{{ cat.count }}</span>
              </div>
            </div>
          </div>

          <!-- Recent reports table -->
          <div class="table-card card">
            <div class="table-card-header">
              <h2 class="bc-title">Recent Reports</h2>
              <button class="text-link" @click="activeTab = 'complaints'">
                View all <ChevronRight :size="13" aria-hidden="true" />
              </button>
            </div>
            <div class="table-wrap" role="region" aria-label="Recent complaints">
              <table class="data-table" aria-label="Recent complaints list">
                <thead>
                  <tr>
                    <th scope="col">Tracking</th>
                    <th scope="col">Title</th>
                    <th scope="col">Category</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="c in recentComplaints" :key="c.id">
                    <td>
                      <code class="mono-code">{{ c.trackingCode }}</code>
                    </td>
                    <td class="title-cell">{{ c.title }}</td>
                    <td>{{ getCategoryLabel(c.category) }}</td>
                    <td>
                      <span class="priority-pill" :class="`pp-${c.priority}`">
                        {{ c.priority }}
                      </span>
                    </td>
                    <td><ComplaintStatusBadge :status="c.status" /></td>
                    <td>
                      <time :datetime="c.submittedAt">
                        {{ formatDateShort(c.submittedAt) }}
                      </time>
                    </td>
                    <td>
                      <button
                        class="action-btn"
                        @click="openManage(c)"
                        :aria-label="`Manage complaint: ${c.title}`"
                      >
                        <Settings :size="13" aria-hidden="true" /> Manage
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!recentComplaints.length">
                    <td colspan="7" class="empty-row">No complaints submitted yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ════════ ALL COMPLAINTS TAB ════════ -->
        <section
          v-else-if="activeTab === 'complaints'"
          aria-labelledby="all-heading"
        >
          <h2 id="all-heading" class="sr-only">All Complaints</h2>

          <div class="filter-bar">
            <div
              class="filters"
              role="group"
              aria-label="Filter complaints by status"
            >
              <button
                v-for="f in statusFilters"
                :key="f.value"
                class="filter-btn"
                :class="{ active: statusFilter === f.value }"
                @click="statusFilter = f.value"
                :aria-pressed="statusFilter === f.value"
              >
                {{ f.label }}
                <span class="filter-count" :aria-label="`${f.count} complaints`">
                  {{ f.count }}
                </span>
              </button>
            </div>
          </div>

          <div class="table-card card">
            <div class="table-wrap" role="region" aria-label="All complaints">
              <table class="data-table" aria-label="Complete complaints list">
                <thead>
                  <tr>
                    <th scope="col">Tracking</th>
                    <th scope="col">Title</th>
                    <th scope="col">Category</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Anon</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="c in filteredComplaints" :key="c.id">
                    <td><code class="mono-code">{{ c.trackingCode }}</code></td>
                    <td class="title-cell">{{ c.title }}</td>
                    <td>{{ getCategoryLabel(c.category) }}</td>
                    <td>
                      <span class="priority-pill" :class="`pp-${c.priority}`">
                        {{ c.priority }}
                      </span>
                    </td>
                    <td>
                      <span v-if="c.anonymous" class="anon-tag" aria-label="Anonymous submission">
                        <EyeOff :size="12" aria-hidden="true" /> Yes
                      </span>
                      <span v-else class="text-tertiary" aria-label="Not anonymous">—</span>
                    </td>
                    <td><ComplaintStatusBadge :status="c.status" /></td>
                    <td>
                      <time :datetime="c.submittedAt">{{ formatDateShort(c.submittedAt) }}</time>
                    </td>
                    <td class="actions-cell">
                      <button
                        class="action-btn"
                        @click="openManage(c)"
                        :aria-label="`Manage: ${c.title}`"
                      >
                        <Settings :size="13" aria-hidden="true" /> Manage
                      </button>
                      <button
                        class="delete-btn"
                        @click="openDelete(c)"
                        :aria-label="`Delete complaint: ${c.title}`"
                      >
                        <Trash2 :size="13" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!filteredComplaints.length">
                    <td colspan="8" class="empty-row">No complaints match this filter.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ════════ USERS TAB ════════ -->
        <section
          v-else-if="activeTab === 'users'"
          aria-labelledby="users-heading"
        >
          <h2 id="users-heading" class="sr-only">Registered Citizens</h2>

          <div class="table-card card">
            <div class="table-wrap" role="region" aria-label="Registered users">
              <table class="data-table" aria-label="Registered citizens list">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Registered</th>
                    <th scope="col">Complaints Filed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in allUsers" :key="u.id">
                    <td class="user-cell">
                      <span class="user-avatar" aria-hidden="true">
                        {{ initials(u.fullName) }}
                      </span>
                      <span>{{ u.fullName }}</span>
                    </td>
                    <td>{{ u.email }}</td>
                    <td>
                      <span class="role-pill" :class="`role-${u.role}`">
                        {{ u.role }}
                      </span>
                    </td>
                    <td>
                      <time :datetime="u.createdAt">
                        {{ formatDateShort(u.createdAt) }}
                      </time>
                    </td>
                    <td>{{ userComplaintCount(u.id) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>

    <!-- ── Manage Status Modal ── -->
    <BaseModal
      v-model="showManage"
      :title="`Update: ${managing?.trackingCode || ''}`"
      width="560px"
    >
      <div v-if="managing" class="manage-body">
        <div class="manage-meta">
          <ComplaintStatusBadge :status="managing.status" />
          <p class="manage-complaint-title">{{ managing.title }}</p>
        </div>

        <div class="form-group">
          <label for="new-status" class="form-label">New Status</label>
          <select id="new-status" v-model="newStatus" class="input">
            <option v-for="(info, key) in STATUSES" :key="key" :value="key">
              {{ info.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="admin-note" class="form-label">
            Authority Note
            <span class="caption"> (optional — visible to citizen)</span>
          </label>
          <textarea
            id="admin-note"
            v-model="adminNote"
            class="input"
            rows="3"
            placeholder="Add a note for the citizen about this update…"
          ></textarea>
        </div>

        <div class="manage-actions">
          <button class="submit-btn" @click="applyUpdate">
            <Check :size="15" aria-hidden="true" />
            Update Status
          </button>
          <button class="cancel-btn" @click="showManage = false">
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- ── Delete Confirm Modal ── -->
    <BaseModal v-model="showDelete" title="Confirm Deletion" width="420px">
      <div v-if="deleting" class="delete-body">
        <div class="delete-icon-wrap" aria-hidden="true">
          <Trash2 :size="34" />
        </div>
        <p class="delete-question">
          Are you sure you want to permanently delete this complaint?
        </p>
        <p class="delete-code caption">
          Tracking code: <strong>{{ deleting.trackingCode }}</strong>
        </p>
        <div class="manage-actions">
          <button class="submit-btn danger" @click="confirmDelete">
            <Trash2 :size="15" aria-hidden="true" />
            Delete Permanently
          </button>
          <button class="cancel-btn" @click="showDelete = false">
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>

    <BaseToast />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/useAuthStore'
import { useComplaintStore, CATEGORIES, STATUSES } from '@/store/useComplaintStore'
import { useToast } from '@/composables/useToast'
import { useAnnouncer } from '@/composables/useAnnouncer'
import { formatDateShort, initials } from '@/utils/validators'
import ComplaintStatusBadge from '@/components/complaints/ComplaintStatusBadge.vue'
import BaseModal            from '@/components/ui/BaseModal.vue'
import BaseToast            from '@/components/ui/BaseToast.vue'
import {
  ShieldCheck, Search, Settings, Trash2, Check,
  EyeOff, ChevronLeft, ChevronRight,
  LayoutDashboard, ClipboardList, Users,
  FileText, Clock, Eye, CheckCircle,
  Shield, Construction, Leaf, Landmark,
  HeartPulse, Zap, MoreHorizontal
} from 'lucide-vue-next'

const auth  = useAuthStore()
const store = useComplaintStore()
const toast = useToast()
const { announce } = useAnnouncer()

onMounted(() => store.load())

const activeTab   = ref('overview')
const collapsed   = ref(false)
const searchQuery = ref('')
const statusFilter= ref('all')

const showManage  = ref(false)
const managing    = ref(null)
const newStatus   = ref('pending')
const adminNote   = ref('')

const showDelete  = ref(false)
const deleting    = ref(null)

const todayFormatted = computed(() =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
)

const sidebarItems = computed(() => [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    badge: null
  },
  {
    id: 'complaints',
    label: 'Complaints',
    icon: ClipboardList,
    badge: store.stats.pending > 0 ? store.stats.pending : null
  },
  {
    id: 'users',
    label: 'Citizens',
    icon: Users,
    badge: null
  }
])

const currentTabLabel = computed(() =>
  sidebarItems.value.find(i => i.id === activeTab.value)?.label || 'Admin'
)

const overviewStats = computed(() => [
  { label: 'Total Complaints', value: store.stats.total,    icon: FileText,    color: 'ov-blue',   sub: 'All time'          },
  { label: 'Pending',          value: store.stats.pending,  icon: Clock,       color: 'ov-orange', sub: 'Needs attention'   },
  { label: 'Under Review',     value: store.stats.review,   icon: Eye,         color: 'ov-blue',   sub: 'In progress'       },
  { label: 'Resolved',         value: store.stats.resolved, icon: CheckCircle, color: 'ov-green',  sub: 'Completed'         }
])

const recentComplaints = computed(() => {
  const list = filteredComplaints.value
  return list.slice(0, 8)
})

const allUsers = computed(() => auth.getAllUsers())

const userComplaintCount = (userId) =>
  store.complaints.filter(c => c.userId === userId).length

const statusFilters = computed(() => [
  { value: 'all',      label: 'All',       count: store.stats.total    },
  { value: 'pending',  label: 'Pending',   count: store.stats.pending  },
  { value: 'review',   label: 'In Review', count: store.stats.review   },
  { value: 'resolved', label: 'Resolved',  count: store.stats.resolved },
  { value: 'rejected', label: 'Rejected',  count: store.stats.rejected }
])

const filteredComplaints = computed(() => {
  let list = store.allComplaints
  if (statusFilter.value !== 'all')
    list = list.filter(c => c.status === statusFilter.value)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.trackingCode.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    )
  }
  return list
})

function openManage(c) {
  managing.value  = c
  newStatus.value = c.status
  adminNote.value = c.adminNote || ''
  showManage.value= true
}

function applyUpdate() {
  store.updateStatus(managing.value.id, newStatus.value, adminNote.value)
  const label = STATUSES[newStatus.value].label
  toast.success(`${managing.value.trackingCode} updated to "${label}".`)
  announce(`Status updated to ${label}.`)
  showManage.value = false
}

function openDelete(c) {
  deleting.value  = c
  showDelete.value= true
}

function confirmDelete() {
  store.deleteComplaint(deleting.value.id)
  toast.success(`Complaint ${deleting.value.trackingCode} deleted.`)
  announce(`Complaint ${deleting.value.trackingCode} deleted.`)
  showDelete.value = false
}

const iconMap = {
  Shield, Construction, Leaf, Landmark,
  HeartPulse, Users, Zap, MoreHorizontal
}
function getCatIcon(name) { return iconMap[name] || MoreHorizontal }
function getCategoryLabel(val) { return CATEGORIES.find(c => c.value === val)?.label || val }
</script>

<style scoped>
.admin-main {
  padding-top: var(--header-height);
  min-height: 100vh;
  background: var(--bg-canvas);
}

.admin-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: calc(100vh - var(--header-height));
}

/* ── Sidebar ── */
.admin-sidebar {
  width: var(--sidebar-width);
  background: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-5) var(--space-3) var(--space-4);
  transition: width var(--duration-normal) var(--ease-out);
  position: sticky;
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  overflow: hidden;
}
.admin-sidebar.collapsed { width: 60px; }

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  color: var(--accent-primary);
  margin-bottom: var(--space-5);
  white-space: nowrap;
  overflow: hidden;
}
.brand-label {
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: 0.04em;
  color: var(--text-secondary);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
  text-align: left;
  font-family: var(--font-body);
  white-space: nowrap;
  overflow: hidden;
}
.sidebar-item:hover { background: var(--bg-surface-2); color: var(--text-primary); }
.sidebar-item.active {
  background: var(--accent-subtle);
  color: var(--accent-primary);
  font-weight: 600;
}

.sidebar-badge {
  margin-left: auto;
  background: var(--color-warning-500);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all var(--duration-fast);
  font-family: var(--font-body);
}
.collapse-btn:hover { background: var(--bg-surface-2); color: var(--text-primary); }

/* ── Content area ── */
.admin-content {
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  overflow: auto;
  min-width: 0;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  flex-wrap: wrap;
}
.admin-header-left { min-width: 0; flex: 1 1 auto; }
.admin-header-right { flex-shrink: 0; }

.admin-page-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  color: var(--text-primary);
}
.admin-date {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-top: 2px;
}

.search-box {
  position: relative;
  width: 240px;
}
.search-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
  z-index: 1;
}
.search-input {
  width: 100%;
  padding-left: var(--space-10);
  min-height: 44px;
}

/* Mobile tab bar */
.admin-mobile-tabs {
  display: none;
  gap: var(--space-2);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-subtle);
  margin: calc(-1 * var(--space-6)) 0 0;
}
.mobile-tab-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  flex: 1;
  justify-content: center;
  min-height: 44px;
}
.mobile-tab-btn:hover { background: var(--bg-surface-2); color: var(--text-primary); }
.mobile-tab-btn.active {
  background: var(--accent-subtle);
  color: var(--accent-primary);
  font-weight: 600;
}
.mobile-tab-badge {
  background: var(--color-warning-500);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

/* ── Overview stats ── */
.ov-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.ov-card {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ov-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.ov-icon {
  width: 40px; height: 40px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
}
.ov-blue   { background: var(--accent-subtle);     color: var(--accent-primary);    }
.ov-orange { background: var(--color-warning-100); color: var(--color-warning-500); }
.ov-green  { background: var(--color-success-100); color: var(--color-success-500); }
[data-theme="dark"] .ov-blue   { background: rgba(255,255,255,0.07); }
[data-theme="dark"] .ov-orange { background: rgba(150,107,26,0.15); }
[data-theme="dark"] .ov-green  { background: rgba(42,122,82,0.15);  }

.ov-sub   { font-size: 11px; color: var(--text-tertiary); }
.ov-value {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  color: var(--text-primary);
  line-height: 1;
  font-weight: 700;
}
.ov-label { font-size: var(--text-sm); color: var(--text-tertiary); font-weight: 500; }

/* ── Breakdown card ── */
.breakdown-card, .table-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
}

.bc-title {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-5);
}

.breakdown-rows { display: flex; flex-direction: column; gap: var(--space-4); }

.br-row {
  display: grid;
  grid-template-columns: 200px 1fr 40px;
  align-items: center;
  gap: var(--space-4);
}

.br-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-tertiary);
  overflow: hidden;
}
.br-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.br-bar-track {
  height: 7px;
  background: var(--bg-surface-3);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.br-bar-fill {
  height: 100%;
  background: var(--accent-primary);
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out);
  min-width: 3px;
}
.br-count {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  text-align: right;
}

/* ── Table card ── */
.table-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--accent-primary);
  cursor: pointer;
  transition: color var(--duration-fast);
  font-family: var(--font-body);
}
.text-link:hover { color: var(--accent-hover); }

.table-wrap {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.data-table th {
  text-align: left;
  padding: var(--space-2) var(--space-4);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-tertiary);
  border-bottom: 1px solid var(--border-subtle);
  white-space: nowrap;
}

.data-table td {
  padding: var(--space-3) var(--space-4);
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}

.data-table tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: var(--bg-surface-2); }

.mono-code {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
  background: var(--bg-inset);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.title-cell {
  color: var(--text-primary);
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.priority-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  font-family: var(--font-mono);
}
.pp-critical { background: var(--color-danger-100);  color: var(--color-danger-500);  }
.pp-high     { background: var(--color-warning-100); color: var(--color-warning-500); }
.pp-medium   { background: var(--accent-subtle);     color: var(--accent-primary);    }
.pp-low      { background: var(--color-success-100); color: var(--color-success-500); }
[data-theme="dark"] .pp-critical { background: rgba(146,50,50,0.2); }
[data-theme="dark"] .pp-high     { background: rgba(150,107,26,0.2); }
[data-theme="dark"] .pp-low      { background: rgba(42,122,82,0.2); }

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: var(--radius-md);
  font-size: 11px;
  font-weight: 600;
  color: var(--accent-primary);
  background: var(--accent-subtle);
  border: 1px solid var(--color-primary-200);
  cursor: pointer;
  transition: all var(--duration-fast);
  font-family: var(--font-body);
  white-space: nowrap;
}
.action-btn:hover { background: var(--accent-muted); }
[data-theme="dark"] .action-btn { border-color: var(--accent-muted); }

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px; height: 30px;
  border-radius: var(--radius-md);
  color: var(--color-danger-500);
  background: var(--color-danger-100);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--duration-fast);
  margin-left: var(--space-2);
}
.delete-btn:hover { background: var(--color-danger-500); color: #fff; }
[data-theme="dark"] .delete-btn { background: rgba(146,50,50,0.15); }

.actions-cell { white-space: nowrap; }

.anon-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--color-info-500);
  font-weight: 500;
}

.text-tertiary { color: var(--text-tertiary); }
.empty-row { text-align: center; color: var(--text-tertiary); padding: var(--space-8) !important; }

/* ── Filter bar ── */
.filter-bar { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.filters { display: flex; gap: var(--space-2); flex-wrap: wrap; }

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  cursor: pointer;
  transition: all var(--duration-fast);
  min-height: 36px;
  font-family: var(--font-body);
}
.filter-btn:hover  { border-color: var(--border-default); color: var(--text-primary); }
.filter-btn.active { border-color: var(--accent-primary); background: var(--accent-subtle); color: var(--accent-primary); }

.filter-count {
  background: var(--bg-surface-3);
  border-radius: var(--radius-full);
  padding: 0 6px;
  font-size: 11px;
  font-family: var(--font-mono);
}
.filter-btn.active .filter-count { background: var(--accent-muted); }

/* ── Users table ── */
.user-cell {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--text-primary);
  font-weight: 500;
}

.user-avatar {
  width: 30px; height: 30px;
  border-radius: var(--radius-full);
  background: var(--accent-primary);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.role-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  font-family: var(--font-mono);
}
.role-admin   { background: var(--accent-subtle); color: var(--accent-primary); }
.role-citizen { background: var(--bg-surface-2);  color: var(--text-tertiary);  }

/* ── Manage modal ── */
.manage-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.manage-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-surface-2);
  border-radius: var(--radius-md);
}
.manage-complaint-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}

.manage-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-top: var(--space-2);
  border-top: 1px solid var(--border-subtle);
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: var(--text-sm);
  cursor: pointer;
  min-height: 44px;
  font-family: var(--font-body);
  transition: all var(--duration-fast);
}
.submit-btn:hover { background: var(--accent-hover); transform: translateY(-1px); }
.submit-btn.danger { background: var(--color-danger-500); }
.submit-btn.danger:hover { opacity: 0.88; }

.cancel-btn {
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-surface-2);
  border: 1px solid var(--border-default);
  cursor: pointer;
  min-height: 44px;
  font-family: var(--font-body);
  transition: all var(--duration-fast);
}
.cancel-btn:hover { background: var(--bg-surface-3); color: var(--text-primary); }

/* ── Delete modal ── */
.delete-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  text-align: center;
}
.delete-icon-wrap {
  width: 64px; height: 64px;
  border-radius: var(--radius-full);
  background: var(--color-danger-100);
  color: var(--color-danger-500);
  display: flex; align-items: center; justify-content: center;
}
[data-theme="dark"] .delete-icon-wrap { background: rgba(146,50,50,0.15); }
.delete-question {
  font-size: var(--text-base);
  color: var(--text-primary);
  font-weight: 500;
}
.delete-code { color: var(--text-tertiary); }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .ov-stats   { grid-template-columns: repeat(2, 1fr); }
  .br-row     { grid-template-columns: 140px 1fr 36px; }
  .search-box { width: 200px; }
}
@media (max-width: 768px) {
  .admin-sidebar     { display: none; }
  .admin-content     { padding: var(--space-4); }
  .admin-header      { flex-direction: column; align-items: stretch; gap: var(--space-4); }
  .admin-header-left { flex: none; }
  .admin-header-right{ flex: none; width: 100%; }
  .search-box        { width: 100%; max-width: none; }
  .admin-mobile-tabs { display: flex; }
  .admin-page-title  { font-size: var(--text-2xl); }
  .ov-stats          { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .admin-content   { padding: var(--space-3); }
  .br-row          { grid-template-columns: 100px 1fr 32px; gap: var(--space-2); font-size: var(--text-sm); }
  .mobile-tab-btn  { font-size: var(--text-xs); padding: var(--space-2) var(--space-2); }
}
</style>