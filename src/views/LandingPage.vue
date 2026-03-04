<template>
  <main id="main-content" tabindex="-1">

    <!-- ══════════════════════════════════════
         HERO SECTION
    ══════════════════════════════════════ -->
    <section class="hero" aria-labelledby="hero-heading">

      <!-- Background decoration + hero image area -->
      <div class="hero-bg" aria-hidden="true">
        <div class="hero-grid"></div>
        <div class="hero-blob blob-1"></div>
        <div class="hero-blob blob-2"></div>
        <!-- Friendly hero illustration: handshake and document -->
        <div class="hero-image-area" role="img" aria-label="Community handshake and document submission - friendly, approachable illustration">
          <svg class="hero-illustration" viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="180" cy="100" r="55" fill="currentColor" fill-opacity="0.06"/>
            <circle cx="180" cy="100" r="40" fill="currentColor" fill-opacity="0.08"/>
            <path d="M120 140c0-22 27-40 60-40s60 18 60 40" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-opacity="0.25"/>
            <path d="M135 165c0-18 20-33 45-33s45 15 45 33" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.2"/>
            <rect x="140" y="155" width="80" height="55" rx="6" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2" stroke-opacity="0.3"/>
            <path d="M155 178h50M155 188h35M155 198h45" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.35"/>
            <circle cx="200" cy="175" r="8" fill="currentColor" fill-opacity="0.25"/>
            <path d="M150 115l-15 15 25 25" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.4"/>
          </svg>
        </div>
      </div>

      <div class="container hero-inner">

        <!-- Left: Copy -->
        <div class="hero-copy">
          <div class="hero-badge animate-fadeInUp" aria-label="Platform category">
            <ShieldCheck :size="13" aria-hidden="true" />
            Civic Accountability Platform
          </div>

          <h1
            id="hero-heading"
            class="headline animate-fadeInUp delay-100"
          >
            Every complaint deserves an answer.<br />
            <span class="headline-italic">CIVICTRACK makes sure yours gets one.</span>
          </h1>

          <p class="subheadline animate-fadeInUp delay-200">
            Report crimes, disputes, and public concerns in minutes — no paperwork,
            no endless phone trees. Track every step. Hold authorities accountable.
          </p>

          <div class="hero-cta animate-fadeInUp delay-300">
            <router-link to="/register" class="cta-btn cta-primary-btn">
              <FilePlus :size="18" aria-hidden="true" />
              File a Complaint
            </router-link>
            <router-link to="/login" class="cta-btn cta-secondary-btn">
              <Search :size="16" aria-hidden="true" />
              Track Your Report
            </router-link>
          </div>

          <dl class="hero-stats animate-fadeInUp delay-400" aria-label="Platform highlights">
            <div v-for="s in heroStats" :key="s.label" class="hero-stat">
              <dt class="stat-value">{{ s.value }}</dt>
              <dd class="stat-label">{{ s.label }}</dd>
            </div>
          </dl>
        </div>

        <!-- Right: Dashboard mockup -->
        <div class="hero-visual animate-fadeIn delay-300" aria-hidden="true">
          <div class="mockup-window">
            <div class="mockup-bar">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
              <span class="mockup-title">CIVICTRACK Dashboard</span>
            </div>
            <div class="mockup-body">
              <div class="mockup-stats">
                <div class="ms-card ms-blue">
                  <span class="ms-num">124</span>
                  <span class="ms-lbl">Total</span>
                </div>
                <div class="ms-card ms-orange">
                  <span class="ms-num">38</span>
                  <span class="ms-lbl">Pending</span>
                </div>
                <div class="ms-card ms-green">
                  <span class="ms-num">71</span>
                  <span class="ms-lbl">Resolved</span>
                </div>
              </div>
              <div class="mockup-rows">
                <div
                  v-for="row in mockupRows"
                  :key="row.id"
                  class="mockup-row"
                  :style="{ animationDelay: `${row.delay}ms` }"
                >
                  <span class="row-dot" :class="row.dot"></span>
                  <div class="row-lines">
                    <div class="row-line long"></div>
                    <div class="row-line short"></div>
                  </div>
                  <span class="row-badge" :class="row.badge"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════
         QUICK ACTION BUTTONS
    ══════════════════════════════════════ -->
    <section class="quick-actions-section" aria-labelledby="qa-label">
      <div class="container">
        <p
          id="qa-label"
          class="section-label text-center"
        >
          What would you like to do?
        </p>
        <div class="qa-grid" role="list" aria-label="Quick action buttons">
          <router-link
            v-for="action in quickActions"
            :key="action.title"
            :to="action.to"
            class="qa-card card"
            role="listitem"
          >
            <div
              class="qa-icon"
              :style="{ background: action.bg, color: action.color }"
              aria-hidden="true"
            >
              <component :is="action.icon" :size="22" />
            </div>
            <div class="qa-text">
              <h3 class="qa-title">{{ action.title }}</h3>
              <p class="qa-desc">{{ action.desc }}</p>
            </div>
            <ChevronRight :size="16" class="qa-arrow" aria-hidden="true" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         THE PROBLEM WE SOLVE
    ══════════════════════════════════════ -->
    <section
      class="section problem-section"
      aria-labelledby="problem-heading"
    >
      <div class="container">
        <div class="section-intro">
          <p class="section-label">The Problem We're Solving</p>
          <h2 id="problem-heading" class="section-heading">
            Your complaint matters. So why does it feel invisible?
          </h2>
          <p class="section-body">
            Traditional reporting fails citizens every day. Paperwork vanishes.
            Phone lines go nowhere. There is no trail. No proof. No accountability.
            CIVICTRACK changes that.
          </p>
        </div>

        <div class="grid-3" role="list" aria-label="Problems CIVICTRACK solves">
          <div
            v-for="problem in problems"
            :key="problem.title"
            class="problem-card card"
            role="listitem"
          >
            <div class="problem-icon" aria-hidden="true">
              <component :is="problem.icon" :size="20" />
            </div>
            <h3 class="problem-title">{{ problem.title }}</h3>
            <p class="problem-desc">{{ problem.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         HOW IT WORKS
    ══════════════════════════════════════
    <section
      class="section how-section"
      aria-labelledby="how-heading"
    >
      <div class="container">
        <div class="section-intro text-center">
          <p class="section-label">Simple. Fast. Accountable.</p>
          <h2 id="how-heading" class="section-heading text-center">
            Three steps. One clear path.
          </h2>
          <p class="section-body text-center">
            No bureaucracy. No runaround. Submit your complaint, track its progress,
            and see it through to resolution.
          </p>
        </div>

        <ol class="steps" aria-label="How CIVICTRACK works">
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            class="step"
            :class="{ 'step-reverse': i % 2 !== 0 }"
          >
            <div class="step-visual" aria-hidden="true">
              <span class="step-number">{{ String(i + 1).padStart(2,'0') }}</span>
              <div class="step-icon-box">
                <component :is="step.icon" :size="30" />
              </div>
            </div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.desc }}</p>
              <ul class="step-features" role="list">
                <li v-for="f in step.features" :key="f">
                  <Check :size="13" aria-hidden="true" />
                  {{ f }}
                </li>
              </ul>
            </div>
          </li>
        </ol>
      </div>
    </section> 
-->
    <!-- ══════════════════════════════════════
         REPORT CATEGORIES
    ══════════════════════════════════════ -->
    <section
      class="section categories-section"
      aria-labelledby="cat-heading"
    >
      <div class="container">
        <div class="section-intro text-center">
          <p class="section-label">Report Any Issue</p>
          <h2 id="cat-heading" class="section-heading text-center">
            What can you report?
          </h2>
          <p class="section-body text-center">
            Eight categories cover the full range of community concerns.
            Every issue has a place here.
          </p>
        </div>

        <div
  v-for="cat in CATEGORIES"
  :key="cat.value"
  class="cat-card card"
  @mouseenter="hoveredCat = cat.value"
  @mouseleave="hoveredCat = null"
  @click="openedCat = cat.value"
>
  <div class="cat-icon">
    <component :is="getCatIcon(cat.icon)" :size="19" />
  </div>

  <span class="cat-label">{{ cat.label }}</span>

  <!-- Explanation -->
  <p
    v-if="hoveredCat === cat.value || openedCat === cat.value"
    class="cat-description"
  >
    {{ cat.description }}
  </p>
</div>

        <div class="cat-cta text-center">
          <p class="section-body text-center">
            Don't see your issue listed? Use
            <strong>Other</strong> and describe it in full detail.
            Every report matters — no matter how big or small.
          </p>
          <router-link to="/register" class="cta-btn cta-primary-btn" style="display:inline-flex">
            <FilePlus :size="16" aria-hidden="true" />
            Start Your Report Now
          </router-link>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         ACCESSIBILITY & TRUST
    ══════════════════════════════════════ -->
    <section
      class="section trust-section"
      aria-labelledby="trust-heading"
    >
      <div class="container">
        <div class="trust-layout">

          <div class="trust-copy">
            <p class="section-label">Our Commitment to You</p>
            <h2 id="trust-heading" class="section-heading">
              Built for everyone.<br />
              <span class="heading-accent">No one left behind.</span>
            </h2>
            <p class="section-body">
              CIVICTRACK was designed from the ground up with every
              citizen in mind — including those with visual impairments,
              motor limitations, cognitive differences, and motion
              sensitivity. Your complaint matters. Your access is guaranteed.
            </p>
            <ul class="trust-list" role="list">
              <li v-for="f in trustFeatures" :key="f.text">
                <div class="trust-list-icon" aria-hidden="true">
                  <component :is="f.icon" :size="16" />
                </div>
                {{ f.text }}
              </li>
            </ul>
          </div>

          <div class="trust-badges" aria-label="Accessibility compliance badges">
            <div
              v-for="b in accessBadges"
              :key="b.title"
              class="trust-badge card"
            >
              <div class="tb-icon" aria-hidden="true">
                <component :is="b.icon" :size="22" />
              </div>
              <h3 class="tb-title">{{ b.title }}</h3>
              <p class="tb-desc">{{ b.desc }}</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         REAL PEOPLE, REAL STORIES (IMAGES)
    ══════════════════════════════════════ -->
    <section
      class="section stories-section"
      aria-labelledby="stories-heading"
    >
      <div class="container">
        <div class="section-intro text-center">
          <p class="section-label">Real People. Real Issues.</p>
          <h2 id="stories-heading" class="section-heading text-center">
            A platform built around everyday life.
          </h2>
          <p class="section-body text-center">
            CIVICTRACK is for parents walking home at night, traders at the market,
            students on campus, and neighbours sharing one street.
          </p>
        </div>

        <div class="stories-grid" role="list" aria-label="Example citizen stories">
          <article
            v-for="story in stories"
            :key="story.title"
            class="story-card card"
            role="listitem"
          >
            <figure class="story-media">
              <img
                :src="story.src"
                :alt="story.alt"
                loading="lazy"
                decoding="async"
                class="story-img"
              />
            </figure>
            <div class="story-body">
              <p class="story-tag">{{ story.role }}</p>
              <h3 class="story-title">{{ story.title }}</h3>
              <p class="story-text">
                {{ story.text }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         CLOSING CTA BANNER
    ══════════════════════════════════════ -->
    <section class="cta-banner" aria-labelledby="cta-banner-heading">
      <div class="container cta-banner-inner">
        <div class="cta-banner-copy">
          <h2 id="cta-banner-heading" class="cta-banner-heading">
            Your community needs your voice.
          </h2>
          <p class="cta-banner-sub">
            Every report you file is a step toward a safer, fairer,
            better place to live. It takes two minutes to start.
          </p>
        </div>
        <div class="cta-banner-actions">
          <router-link to="/register" class="cta-btn cta-white-btn">
            <UserPlus :size="16" aria-hidden="true" />
            Create Free Account
          </router-link>
          <router-link to="/login" class="cta-btn cta-outline-btn">
            Sign In
          </router-link>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup>
import {
  ShieldCheck, FilePlus, Search, ChevronRight, Check,
  Shield, Construction, Leaf, Landmark,
  HeartPulse, Users, Zap, MoreHorizontal,
  PhoneOff, ClipboardX, FileWarning,
  ClipboardPen, Eye, CheckCircle,
  Accessibility, Lock, Globe, Type,
  UserPlus
} from 'lucide-vue-next'
import { CATEGORIES } from '@/store/useComplaintStore'
import { ref } from "vue"

const hoveredCat = ref(null)
const openedCat = ref(null)
const heroStats = [
  { value: '100%',       label: 'Secure Submissions'  },
  { value: 'Real-Time',  label: 'Status Tracking'     },
  { value: 'WCAG AA',    label: 'Accessibility Built-In'},
  { value: 'Anonymous',  label: 'Reporting Option'    }
]

const mockupRows = [
  { id: 1, dot: 'dot-warning', badge: 'badge-orange', delay: 0   },
  { id: 2, dot: 'dot-blue',    badge: 'badge-blue',   delay: 150 },
  { id: 3, dot: 'dot-green',   badge: 'badge-green',  delay: 300 },
  { id: 4, dot: 'dot-red',     badge: 'badge-red',    delay: 450 }
]

const quickActions = [
  {
    title: 'File a Complaint',
    desc:  'Report a crime, dispute, or public concern.',
    to:    '/register',
    icon:  FilePlus,
    bg:    'var(--accent-subtle)',
    color: 'var(--accent-primary)'
  },
  {
    title: 'Track Your Report',
    desc:  'Check the live status of an existing complaint.',
    to:    '/login',
    icon:  Search,
    bg:    'var(--color-success-100)',
    color: 'var(--color-success-500)'
  },
  {
    title: 'Sign In to Dashboard',
    desc:  'Access your full citizen account.',
    to:    '/login',
    icon:  Shield,
    bg:    'var(--color-info-100)',
    color: 'var(--color-info-500)'
  }
]

const problems = [
  {
    icon:  PhoneOff,
    title: 'No One Answers',
    desc:  'Traditional reporting relies on calls that go to voicemail and are never returned. Your issue fades into silence.'
  },
  {
    icon:  ClipboardX,
    title: 'Lost in Paperwork',
    desc:  'Paper-based systems create gaps. Forms get misfiled or ignored. There is no trail you can verify yourself.'
  },
  {
    icon:  FileWarning,
    title: 'Zero Accountability',
    desc:  'Without a tracking system, authorities face no consequence for inaction. Your complaint has no pulse.'
  }
]

const steps = [
  {
    icon:     ClipboardPen,
    title:    'File Your Complaint',
    desc:     'Describe your issue clearly, pick a category, set priority, and optionally report anonymously. Your words go directly on the record.',
    features: ['No long forms', 'Anonymous option available', 'Secure, encrypted submission']
  },
  {
    icon:     Eye,
    title:    'We Track It For You',
    desc:     'Every complaint gets a unique tracking code. Authorities are notified immediately. Status updates in real time.',
    features: ['Unique tracking code', 'Real-time status updates', 'Full timeline visible to you']
  },
  {
    icon:     CheckCircle,
    title:    'See It Through to Resolution',
    desc:     'Complaints move from Pending to Under Review to Resolved. At every stage, you see exactly what is happening.',
    features: ['Complete timeline history', 'Authority notes visible', 'Resolution confirmation']
  }
]

const trustFeatures = [
  { icon: Accessibility, text: 'Screen reader compatible with ARIA live regions' },
  { icon: Type,          text: 'Adjustable font size from Small to Extra Large'  },
  { icon: Globe,         text: 'High contrast mode and dark mode support'        },
  { icon: Lock,          text: 'Anonymous reporting for sensitive situations'    }
]

const accessBadges = [
  { icon: Accessibility, title: 'WCAG 2.1 AA',    desc: 'Meets Web Content Accessibility Guidelines at Level AA.'   },
  { icon: Eye,           title: 'Screen Readers', desc: 'Compatible with NVDA, JAWS, VoiceOver, and TalkBack.'      },
  { icon: Type,          title: '4 Font Scales',  desc: 'Global font scaling from 14px to 20px base size.'          },
  { icon: Shield,        title: 'Motion Safe',    desc: 'Animations respect your OS and manual reduce-motion setting.'}
]

const stories = [
  {
    title: 'A safer walk home',
    role:  'Evening commuter',
    text:  'Streetlights were broken for months. One report on CIVICTRACK created a record, triggered follow-up, and got them fixed.',
    src:   'https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt:   'Two people walking along a city street at dusk under working streetlights.'
  },
  {
    title: 'Clean water for the block',
    role:  'Neighbourhood organiser',
    text:  'Repeated calls about a leaking pipe went nowhere. A documented complaint finally pushed the repair into action.',
    src:   'https://images.pexels.com/photos/6813352/pexels-photo-6813352.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt:   'Community members filling water from a public tap outside.'
  },
  {
    title: 'Noise finally addressed',
    role:  'Parent and caregiver',
    text:  'Late-night noise made it impossible for children to sleep. Filing through CIVICTRACK created a timeline authorities had to answer.',
    src:   'https://images.pexels.com/photos/4260323/pexels-photo-4260323.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt:   'Parent sitting with a child in a calm living room at night.'
  }
]

const iconMap = {
  Shield, Construction, Leaf, Landmark,
  HeartPulse, Users, Zap, MoreHorizontal
}
function getCatIcon(name) { return iconMap[name] || MoreHorizontal }
</script>

<style scoped>
/* ── Hero ─────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: var(--header-height);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.5;
}

.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.1;
  animation: float 9s ease-in-out infinite;
}

.hero-image-area {
  position: absolute;
  bottom: 5%;
  right: 4%;
  width: 340px;
  height: 220px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
  opacity: 0.65;
}
.hero-illustration {
  width: 100%;
  height: auto;
  color: var(--accent-primary);
}
.blob-1 {
  width: 640px; height: 640px;
  background: var(--accent-primary);
  top: -200px; right: -120px;
}
.blob-2 {
  width: 420px; height: 420px;
  background: var(--color-success-500);
  bottom: -80px; left: 160px;
  animation-delay: -4.5s;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: var(--space-16);
  padding-block: var(--space-24);
}

/* Hero copy */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-4);
  background: var(--accent-subtle);
  border: 1px solid var(--color-primary-200);
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  color: var(--accent-primary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: var(--space-6);
}
[data-theme="dark"] .hero-badge { border-color: var(--color-primary-700); }
[data-theme="high-contrast"] .hero-badge { border-color: var(--accent-primary); }

.subheadline {
  margin-top: var(--space-5);
  margin-bottom: var(--space-8);
  max-width: 520px;
  font-size: clamp(var(--text-base), 1.5vw, var(--text-xl));
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.hero-cta {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-12);
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: var(--text-base);
  text-decoration: none;
  transition: all var(--duration-normal) var(--ease-out);
  min-height: 52px;
  font-family: var(--font-body);
  cursor: pointer;
  border: var(--border-width) solid transparent;
}

.cta-primary-btn {
  background: var(--accent-primary);
  color: #fff;
  border-color: var(--accent-primary);
}
.cta-primary-btn:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  color: #fff;
}

.cta-secondary-btn {
  background: var(--bg-surface);
  color: var(--text-secondary);
  border-color: var(--border-default);
}
.cta-secondary-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  background: var(--accent-subtle);
}

.hero-stats {
  display: flex;
  gap: var(--space-8);
  flex-wrap: wrap;
}
.hero-stat { display: flex; flex-direction: column; gap: 2px; }
.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--accent-primary);
  font-weight: 700;
  line-height: 1;
}
.stat-label {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Mockup */
.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mockup-window {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  animation: float 7s ease-in-out infinite;
}

.mockup-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-surface-2);
  border-bottom: 1px solid var(--border-subtle);
}
.dot {
  width: 10px; height: 10px;
  border-radius: 50%;
}
.dot-red    { background: #FF6058; }
.dot-yellow { background: #FFBD2E; }
.dot-green  { background: #28CA40; }
.mockup-title {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-tertiary);
  margin-left: var(--space-2);
}

.mockup-body { padding: var(--space-4); }

.mockup-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.ms-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  gap: 2px;
}
.ms-blue   { background: var(--accent-subtle); }
.ms-orange { background: var(--color-warning-100); }
.ms-green  { background: var(--color-success-100); }

[data-theme="dark"] .ms-blue   { background: rgba(255,255,255,0.07); }
[data-theme="dark"] .ms-orange { background: rgba(150,107,26,0.15); }
[data-theme="dark"] .ms-green  { background: rgba(42,122,82,0.15);  }

.ms-num {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
}
.ms-lbl { font-size: 10px; color: var(--text-tertiary); }

.mockup-rows { display: flex; flex-direction: column; gap: var(--space-2); }

.mockup-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-surface-2);
  border-radius: var(--radius-md);
  animation: fadeInUp 0.4s var(--ease-out) both;
}
.row-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-warning { background: var(--color-warning-500); }
.dot-blue    { background: var(--accent-primary);    }
.dot-green   { background: var(--color-success-500); }
.dot-red     { background: var(--color-danger-500);  }

.row-lines { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.row-line  { height: 6px; background: var(--bg-surface-3); border-radius: 3px; }
.row-line.long  { width: 70%; }
.row-line.short { width: 42%; }

.row-badge {
  width: 48px; height: 16px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
.badge-orange { background: var(--color-warning-100); }
.badge-blue   { background: var(--accent-subtle);     }
.badge-green  { background: var(--color-success-100); }
.badge-red    { background: var(--color-danger-100);  }

[data-theme="dark"] .badge-orange { background: rgba(150,107,26,0.2); }
[data-theme="dark"] .badge-blue   { background: rgba(82,123,191,0.2); }
[data-theme="dark"] .badge-green  { background: rgba(42,122,82,0.2);  }
[data-theme="dark"] .badge-red    { background: rgba(146,50,50,0.2);  }

/* ── Quick Actions ──────────────────────────── */
.quick-actions-section {
  padding-block: var(--space-8);
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.qa-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-top: var(--space-5);
}

.qa-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--duration-normal) var(--ease-out);
}
.qa-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  color: var(--text-primary);
}
.qa-card:hover .qa-arrow {
  transform: translateX(4px);
  color: var(--accent-primary);
}

.qa-icon {
  width: 50px; height: 50px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.qa-title  { font-weight: 700; font-size: var(--text-base); margin-bottom: 3px; }
.qa-desc   { font-size: var(--text-sm); color: var(--text-tertiary); }
.qa-arrow  {
  color: var(--text-tertiary);
  margin-left: auto;
  flex-shrink: 0;
  transition: transform var(--duration-fast), color var(--duration-fast);
}

/* ── Section shared styles ──────────────────── */
.section-intro { margin-bottom: var(--space-12); }

.section-heading {
  font-family: var(--font-display);
  font-size: clamp(var(--text-3xl), 4vw, var(--text-5xl));
  color: var(--text-primary);
  line-height: var(--leading-tight);
  margin-top: var(--space-3);
}
.heading-accent { color: var(--accent-primary); }

.section-body {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-top: var(--space-4);
  max-width: 640px;
}

/* ── Problem section ────────────────────────── */
.problem-section { background: var(--bg-canvas); }

.problem-card { padding: var(--space-6); }

.problem-icon {
  width: 46px; height: 46px;
  border-radius: var(--radius-lg);
  background: var(--color-danger-100);
  color: var(--color-danger-500);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-4);
}
[data-theme="dark"] .problem-icon {
  background: rgba(146,50,50,0.15);
}

.problem-title {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}
.problem-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

/* ── How it works ───────────────────────────── */
.how-section {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-20);
  padding: 0;
}

.step {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: var(--space-16);
}
.step-reverse { direction: rtl; }
.step-reverse > * { direction: ltr; }

.step-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.step-number {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  color: var(--border-default);
  line-height: 1;
  font-style: italic;
}

.step-icon-box {
  width: 80px; height: 80px;
  background: var(--accent-subtle);
  border: 1px solid var(--color-primary-100);
  border-radius: var(--radius-xl);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent-primary);
}
[data-theme="dark"] .step-icon-box { border-color: var(--accent-muted); }

.step-title {
  font-family: var(--font-body);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}
.step-desc {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}
.step-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.step-features li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
.step-features li svg { color: var(--color-success-500); flex-shrink: 0; }

/* ── Categories ─────────────────────────────── */
.categories-section { background: var(--bg-canvas); }

.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-12);
}

.cat-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  transition: all var(--duration-fast);
}
.cat-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

.cat-icon {
  color: var(--accent-primary);
  flex-shrink: 0;
}
.cat-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
}

.cat-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}
.cat-cta .section-body { max-width: 520px; }

/* ── Trust section ──────────────────────────── */
.trust-section {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
}

.trust-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

.trust-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-6);
}
.trust-list li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-base);
  color: var(--text-secondary);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-surface-2);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--accent-primary);
}
.trust-list-icon {
  color: var(--accent-primary);
  flex-shrink: 0;
}

.trust-badges {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.trust-badge {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.tb-icon { color: var(--accent-primary); }
.tb-title {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text-primary);
}
.tb-desc {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  line-height: var(--leading-relaxed);
}

/* ── Stories with photos ───────────────────────── */
.stories-section {
  background: var(--bg-canvas);
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.story-card {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.story-media {
  margin: 0;
  position: relative;
  overflow: hidden;
}

.story-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  transition: transform var(--duration-slow) var(--ease-out);
}

.story-card:hover .story-img {
  transform: scale(1.03);
}

.story-body {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.story-tag {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

.story-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
}

.story-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

/* ── CTA Banner ─────────────────────────────── */
.cta-banner {
  background: var(--accent-primary);
  padding-block: var(--space-20);
}
[data-theme="dark"] .cta-banner          { background: var(--color-primary-800); }
[data-theme="high-contrast"] .cta-banner { background: #000; border-top: 2px solid #fff; }

.cta-banner-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.cta-banner-heading {
  font-family: var(--font-display);
  font-size: clamp(var(--text-2xl), 3vw, var(--text-4xl));
  color: #fff;
  margin-bottom: var(--space-2);
}
.cta-banner-sub {
  font-size: var(--text-lg);
  color: rgba(255,255,255,0.8);
}

.cta-banner-actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  flex-shrink: 0;
}

.cta-white-btn {
  background: #fff;
  color: var(--accent-primary);
  border-color: #fff;
}
.cta-white-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  color: var(--accent-primary);
}

.cta-outline-btn {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255,255,255,0.5);
}
.cta-outline-btn:hover {
  border-color: #fff;
  background: rgba(255,255,255,0.1);
  color: #fff;
}

/* ── Responsive ─────────────────────────────── */
@media (max-width: 1024px) {
  .hero-inner    { grid-template-columns: 1fr; }
  .hero-visual   { display: none; }
  .trust-layout  { grid-template-columns: 1fr; }
  .step          { grid-template-columns: 1fr; }
  .step-reverse  { direction: ltr; }
  .cat-grid      { grid-template-columns: repeat(2, 1fr); }
  .stories-grid  { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .qa-grid             { grid-template-columns: 1fr; }
  .cta-banner-inner    { flex-direction: column; align-items: flex-start; }
  .trust-badges        { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .hero-cta    { flex-direction: column; }
  .hero-stats  { gap: var(--space-6); }
  .cat-grid    { grid-template-columns: 1fr; }
   .stories-grid{ grid-template-columns: 1fr; }
}
</style>