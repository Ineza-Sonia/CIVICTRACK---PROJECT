<template>
  <footer class="app-footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">

        <!-- Brand column -->
        <div class="footer-brand">
          <div class="footer-logo" aria-label="CIVICTRACK">
            <span class="logo-mark" aria-hidden="true">
              <ShieldCheck :size="18" />
            </span>
            <span class="logo-text">CIVIC<span class="logo-accent">TRACK</span></span>
          </div>
          <p class="footer-tagline">
            Bridging the gap between citizens and authorities —
            transparently, securely, and with dignity.
          </p>
          <div class="footer-trust-badges" aria-label="Platform trust indicators">
            <span class="trust-badge">
              <Lock :size="11" aria-hidden="true" /> Secure
            </span>
            <span class="trust-badge">
              <Eye :size="11" aria-hidden="true" /> Transparent
            </span>
            <span class="trust-badge">
              <Users :size="11" aria-hidden="true" /> Community-Led
            </span>
          </div>
        </div>

        <!-- Platform links -->
        <nav class="footer-nav" aria-label="Platform pages">
          <h3 class="footer-heading">Platform</h3>
          <ul role="list">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/register">File a Complaint</router-link></li>
            <li><router-link to="/login">Track Your Report</router-link></li>
            <li><router-link to="/login">Sign In</router-link></li>
          </ul>
        </nav>

        <!-- Support links -->
        <nav class="footer-nav" aria-label="Support and legal pages">
          <h3 class="footer-heading">Support</h3>
          <ul role="list">
            <li><a href="#" aria-label="How CIVICTRACK works">How It Works</a></li>
            <li><a href="#" aria-label="Accessibility statement">Accessibility</a></li>
            <li><a href="#" aria-label="Privacy policy">Privacy Policy</a></li>
            <li><a href="#" aria-label="Terms of use">Terms of Use</a></li>
          </ul>
        </nav>

        <!-- Contact -->
        <div class="footer-contact">
          <h3 class="footer-heading">Contact Authorities</h3>
          <ul role="list" class="contact-list">
            <li>
              <Phone :size="13" aria-hidden="true" />
              <div>
                <span class="contact-label">Emergency Line</span>
                <a href="tel:112" class="contact-value" aria-label="Call emergency line 112">112</a>
              </div>
            </li>
            <li>
              <Phone :size="13" aria-hidden="true" />
              <div>
                <span class="contact-label">Non-Emergency</span>
                <a href="tel:+250788000000" class="contact-value" aria-label="Call non-emergency line">+250 788 000 000</a>
              </div>
            </li>
            <li>
              <Mail :size="13" aria-hidden="true" />
              <div>
                <span class="contact-label">Email Support</span>
                <a href="mailto:support@civictrack.gov" class="contact-value">support@civictrack.gov</a>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <hr class="footer-divider" />

      <div class="footer-bottom">
        <p class="footer-copy">
          © {{ year }} CIVICTRACK. Built for every citizen, without exception.
        </p>
        <p class="footer-wcag">
          <span aria-hidden="true">WCAG 2.1 AA Compliant</span>
          <span class="sr-only">
            This platform meets Web Content Accessibility Guidelines 2.1 Level AA.
          </span>
          &nbsp;·&nbsp; Accessible to all
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { ShieldCheck, Lock, Eye, Users, Phone, Mail } from 'lucide-vue-next'

const year = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  padding-top: var(--space-16);
  padding-bottom: var(--space-8);
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1.4fr;
  gap: var(--space-12);
  margin-bottom: var(--space-12);
}

/* Brand */
.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--accent-primary);
  color: #fff;
  border-radius: var(--radius-sm);
}

.logo-text {
  font-weight: 700;
  font-size: var(--text-base);
  letter-spacing: 0.06em;
  color: var(--text-primary);
}
.logo-accent { color: var(--accent-primary); }

.footer-tagline {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
  max-width: 280px;
}

.footer-trust-badges {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
}

/* Nav */
.footer-heading {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

.footer-nav ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.footer-nav a {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast);
}
.footer-nav a:hover { color: var(--accent-primary); }

/* Contact */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  color: var(--text-secondary);
}

.contact-label {
  display: block;
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

.contact-value {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast);
}
.contact-value:hover { color: var(--accent-primary); }

/* Bottom bar */
.footer-divider {
  border: none;
  border-top: 1px solid var(--border-subtle);
  margin-bottom: var(--space-6);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.footer-copy { font-size: var(--text-sm); color: var(--text-secondary); }
.footer-wcag { font-size: var(--text-xs); color: var(--text-secondary); }

/* Responsive */
@media (max-width: 1024px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: var(--space-8); }
}
@media (max-width: 640px) {
  .footer-grid  { grid-template-columns: 1fr; gap: var(--space-8); }
  .footer-bottom{ flex-direction: column; align-items: flex-start; }
}
</style>