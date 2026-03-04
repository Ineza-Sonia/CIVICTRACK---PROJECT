# CIVICTRACK — Project Structure

A citizen complaint reporting platform built with Vue 3, Vite, Pinia, and Vue Router. Designed for maximum accessibility (WCAG 2.1 AA), human-centered, and inclusive for all citizens including those with disabilities.

---

## Directory Structure

```
civic-track/
├── index.html                 # Entry HTML, meta, fonts
├── package.json               # Dependencies (Vue, Vite, Pinia, Router, VueUse, lucide-vue-next)
├── vite.config.js             # Vite config, @ alias
├── PROJECT_STRUCTURE.md       # This file
├── ADMIN_ACCESS.md            # Admin sign-in instructions (not for public)
│
└── src/
    ├── main.js                # App bootstrap, Pinia, Router
    ├── App.vue                # Root layout, skip link, header, footer, accessibility toolbar
    │
    ├── router/
    │   └── index.js           # Routes, auth guards, title updates
    │
    ├── store/
    │   ├── index.js           # Pinia instance
    │   ├── useAccessibilityStore.js   # Theme, font size, reduced motion
    │   ├── useAuthStore.js            # Login, register, localStorage auth
    │   └── useComplaintStore.js       # Complaints CRUD, categories, statuses
    │
    ├── views/
    │   ├── LandingPage.vue    # Welcome/hero, quick actions, how it works, categories
    │   ├── LoginPage.vue      # Sign in form
    │   ├── RegisterPage.vue   # Account creation
    │   ├── UserDashboard.vue  # Citizen dashboard: my complaints, stats, file new
    │   └── AdminDashboard.vue # Admin panel: overview, complaints, users, settings
    │
    ├── components/
    │   ├── layout/
    │   │   ├── SkipToMain.vue       # WCAG skip-to-content link
    │   │   ├── AppHeader.vue        # Nav, logo, auth, accessibility toggle
    │   │   └── AppFooter.vue        # Brand, links, contact, WCAG badge
    │   │
    │   ├── complaints/
    │   │   ├── ComplaintForm.vue    # File complaint form
    │   │   ├── ComplaintCard.vue    # Complaint summary card
    │   │   └── ComplaintStatusBadge.vue  # Status badge (colorblind-safe)
    │   │
    │   ├── charts/
    │   │   └── StatsSummary.vue     # Stats visualization
    │   │
    │   └── ui/
    │       ├── AccessibilityToolbar.vue  # Theme, font size, reduce motion
    │       ├── BaseModal.vue
    │       ├── BaseToast.vue
    │       ├── BaseCard.vue
    │       └── BaseButton.vue
    │
    ├── styles/
    │   ├── main.css           # Layout, cards, inputs, grids, animations
    │   ├── _variables.css     # Tokens, themes, font sizes
    │   ├── _reset.css         # CSS reset
    │   └── _accessibility.css # Skip link, focus, sr-only, reduced motion
    │
    ├── composables/
    │   ├── useAnnouncer.js    # Screen reader announcements
    │   ├── useToast.js        # Toast notifications
    │   └── useLocalStorage.js # Local storage helpers
    │
    └── utils/
        └── sanitize.js        # Input sanitization (XSS prevention)
```

---

## Key Features

| Feature | Implementation |
|--------|----------------|
| **WCAG 2.1 AA** | Skip link, focus-visible, ARIA, semantic HTML, min touch targets 44px |
| **Light / Dark / High Contrast** | `data-theme` on `<html>`, stored in `localStorage` |
| **Font size** | sm (14px), md (16px), lg (18px), xl (20px) via `data-font-size` |
| **Reduced motion** | OS `prefers-reduced-motion` + manual toggle |
| **Colorblind-safe** | Icons + patterns on status badges, not color alone |
| **Auth** | LocalStorage; seeded admin: admin@civictrack.gov / Admin@2024 |
| **Complaints** | LocalStorage; categories, priorities, statuses, tracking codes |

---

## Scripts

```bash
npm install    # Install dependencies
npm run dev    # Start dev server
npm run build  # Production build
npm run preview # Preview production build
```

---

## Accessibility Toolbar

Located in the header. Users can:
- Choose **Light**, **Dark**, or **High Contrast**
- Choose **Small**, **Medium**, **Large**, or **Extra Large** text
- Toggle **Reduce Animations**

Settings persist in `localStorage` under `ct_a11y`.
