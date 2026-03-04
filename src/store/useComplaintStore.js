import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'ct_complaints'

export const CATEGORIES = [
  { value: 'crime',          label: 'Crime & Safety',         icon: 'Shield'        },
  { value: 'infrastructure', label: 'Roads & Infrastructure',  icon: 'Construction'  },
  { value: 'environment',    label: 'Environment',             icon: 'Leaf'          },
  { value: 'government',     label: 'Government Services',     icon: 'Landmark'      },
  { value: 'health',         label: 'Health & Sanitation',     icon: 'HeartPulse'    },
  { value: 'dispute',        label: 'Social Disputes',         icon: 'Users'         },
  { value: 'utilities',      label: 'Utilities (Water/Power)', icon: 'Zap'           },
  { value: 'other',          label: 'Other',                   icon: 'MoreHorizontal'}
]

export const STATUSES = {
  pending:  { label: 'Pending',      badge: 'badge-pending',  icon: 'Clock'        },
  review:   { label: 'Under Review', badge: 'badge-review',   icon: 'Eye'          },
  resolved: { label: 'Resolved',     badge: 'badge-resolved', icon: 'CheckCircle'  },
  rejected: { label: 'Rejected',     badge: 'badge-rejected', icon: 'XCircle'      }
}

export const PRIORITIES = [
  { value: 'low',      label: 'Low'      },
  { value: 'medium',   label: 'Medium'   },
  { value: 'high',     label: 'High'     },
  { value: 'critical', label: 'Critical' }
]

export const useComplaintStore = defineStore('complaints', () => {
  const complaints = ref([])

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY)
    complaints.value = raw ? JSON.parse(raw) : []
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints.value))
  }

  function submit(data, userId) {
    const complaint = {
      id:           `CMP-${Date.now()}`,
      trackingCode: `CT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      title:        data.title.trim(),
      description:  data.description.trim(),
      category:     data.category,
      priority:     data.priority || 'medium',
      location:     data.location?.trim() || '',
      anonymous:    data.anonymous || false,
      userId:       data.anonymous ? null : userId,
      status:       'pending',
      submittedAt:  new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
      adminNote:    '',
      timeline: [
        {
          status: 'pending',
          note:   'Complaint received and logged.',
          date:   new Date().toISOString()
        }
      ]
    }
    complaints.value.unshift(complaint)
    save()
    return complaint
  }

  function updateStatus(id, status, note = '') {
    const c = complaints.value.find(x => x.id === id)
    if (!c) return
    c.status    = status
    c.adminNote = note
    c.updatedAt = new Date().toISOString()
    c.timeline.push({
      status,
      note: note || STATUSES[status].label,
      date: new Date().toISOString()
    })
    save()
  }

  function deleteComplaint(id) {
    complaints.value = complaints.value.filter(x => x.id !== id)
    save()
  }

  const allComplaints = computed(() => complaints.value)

  const stats = computed(() => {
    const all = complaints.value
    return {
      total:    all.length,
      pending:  all.filter(c => c.status === 'pending').length,
      review:   all.filter(c => c.status === 'review').length,
      resolved: all.filter(c => c.status === 'resolved').length,
      rejected: all.filter(c => c.status === 'rejected').length,
      byCategory: CATEGORIES.map(cat => ({
        ...cat,
        count: all.filter(c => c.category === cat.value).length
      }))
    }
  })

  return {
    complaints, allComplaints, stats,
    load, submit, updateStatus, deleteComplaint
  }
})