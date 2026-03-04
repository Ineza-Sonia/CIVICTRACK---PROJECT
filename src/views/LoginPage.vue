<template>
  <main id="main-content" tabindex="-1" class="auth-page">
    <div class="auth-split">

      <!-- Left decorative panel with friendly illustration -->
      <div class="auth-panel" aria-hidden="true">
        <div class="panel-inner">
          <div class="panel-illustration" role="img" aria-label="Welcoming community illustration">
            <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="100" cy="55" r="28" fill="rgba(255,255,255,0.25)"/>
              <path d="M65 95c0-19 16-35 35-35s35 16 35 35" stroke="rgba(255,255,255,0.5)" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="60" cy="50" r="14" fill="rgba(255,255,255,0.2)"/>
              <path d="M42 78c0-10 8-18 18-18s18 8 18 18" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round"/>
              <circle cx="140" cy="48" r="12" fill="rgba(255,255,255,0.2)"/>
              <path d="M125 72c0-8 7-15 15-15s15 7 15 15" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round"/>
              <path d="M85 62l10 10 25-25" stroke="rgba(255,255,255,0.9)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="panel-logo">
            <ShieldCheck :size="30" />
          </div>
          <h2 class="panel-headline">
            Every voice<br />deserves to be<br />
            <em>heard.</em>
          </h2>
          <p class="panel-sub">
            Sign in to track your complaints, file new reports,
            and stay updated on what matters in your community.
          </p>
          <div class="panel-stats">
            <div class="ps-item">
              <span class="ps-val">Secure</span>
              <span class="ps-lbl">End-to-end</span>
            </div>
            <div class="ps-item">
              <span class="ps-val">Private</span>
              <span class="ps-lbl">Your data</span>
            </div>
            <div class="ps-item">
              <span class="ps-val">Fast</span>
              <span class="ps-lbl">Instant access</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right form -->
      <div class="auth-form-side">
        <div class="auth-form-wrap">

          <router-link to="/" class="back-link" aria-label="Return to home page">
            <ArrowLeft :size="15" aria-hidden="true" /> Back to home
          </router-link>

          <h1 class="auth-heading">Welcome back</h1>
          <p class="auth-subtext">
            No account yet?
            <router-link to="/register">Create one free</router-link>
          </p>

          <form
            @submit.prevent="handleLogin"
            novalidate
            aria-label="Sign in to your account"
          >
            <!-- Server error -->
            <div
              v-if="auth.error"
              class="form-alert"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle :size="15" aria-hidden="true" />
              {{ auth.error }}
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="login-email" class="form-label">
                Email address
                <span aria-hidden="true" class="req"> *</span>
              </label>
              <input
                id="login-email"
                v-model="form.email"
                type="email"
                class="input"
                autocomplete="email"
                placeholder="you@example.com"
                required
                :aria-invalid="!!errors.email"
                :aria-describedby="errors.email ? 'err-login-email' : undefined"
              />
              <p
                v-if="errors.email"
                id="err-login-email"
                class="form-error"
                role="alert"
              >
                <AlertCircle :size="13" aria-hidden="true" />
                {{ errors.email }}
              </p>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="login-pass" class="form-label">
                Password
                <span aria-hidden="true" class="req"> *</span>
              </label>
              <div class="input-with-btn">
                <input
                  id="login-pass"
                  v-model="form.password"
                  :type="showPass ? 'text' : 'password'"
                  class="input"
                  autocomplete="current-password"
                  placeholder="Your password"
                  required
                  :aria-invalid="!!errors.password"
                  :aria-describedby="errors.password ? 'err-login-pass' : undefined"
                />
                <button
                  type="button"
                  class="reveal-btn"
                  @click="showPass = !showPass"
                  :aria-label="showPass ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPass"
                >
                  <Eye    v-if="!showPass" :size="16" aria-hidden="true" />
                  <EyeOff v-else           :size="16" aria-hidden="true" />
                </button>
              </div>
              <p
                v-if="errors.password"
                id="err-login-pass"
                class="form-error"
                role="alert"
              >
                <AlertCircle :size="13" aria-hidden="true" />
                {{ errors.password }}
              </p>
            </div>

            <button
              type="submit"
              class="auth-submit"
              :disabled="auth.isLoading"
              :aria-busy="auth.isLoading"
            >
              <span v-if="auth.isLoading" class="btn-spinner" aria-hidden="true"></span>
              <LogIn v-else :size="17" aria-hidden="true" />
              {{ auth.isLoading ? 'Signing in…' : 'Sign In' }}
              <span v-if="auth.isLoading" class="sr-only">Please wait.</span>
            </button>

            <p class="secure-note">
              <Lock :size="12" aria-hidden="true" />
              Secured connection. Credentials are never stored in plain text.
            </p>
          </form>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'
import { useAnnouncer } from '@/composables/useAnnouncer'
import { validateEmail, validateRequired } from '@/utils/validators'
import {
  ShieldCheck, ArrowLeft,
  AlertCircle, Eye, EyeOff, LogIn, Lock
} from 'lucide-vue-next'

const router = useRouter()
const auth   = useAuthStore()
const { announce } = useAnnouncer()

const form     = reactive({ email: '', password: '' })
const errors   = reactive({})
const showPass = ref(false)

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!validateEmail(form.email))
    errors.email = 'Please enter a valid email address.'
  if (!validateRequired(form.password))
    errors.password = 'Password is required.'
  return Object.keys(errors).length === 0
}

async function handleLogin() {
  if (!validate()) {
    announce('Please correct the form errors before submitting.', 'assertive')
    return
  }
  try {
    const user = await auth.login(form.email, form.password)
    announce(`Signed in successfully. Welcome back, ${user.fullName}.`)
    await router.push(user.role === 'admin' ? '/admin' : '/dashboard')
  } catch (_) {
    announce('Sign in failed. Please check your credentials.', 'assertive')
  }
}
</script>

<style scoped>
.auth-page {
  flex: 1;
  display: flex;
  padding-top: var(--header-height);
}

.auth-split {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: calc(100vh - var(--header-height));
}

/* Left panel */
.auth-panel {
  background: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
}
[data-theme="dark"]          .auth-panel { background: var(--color-primary-800); }
[data-theme="high-contrast"] .auth-panel { background: #000; border-right: 2px solid #fff; }

.panel-inner { max-width: 380px; }

.panel-illustration {
  margin-bottom: var(--space-6);
  opacity: 0.95;
}
.panel-illustration svg {
  width: 140px;
  height: auto;
}

.panel-logo {
  width: 54px; height: 54px;
  border-radius: var(--radius-lg);
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  margin-bottom: var(--space-8);
}

.panel-headline {
  font-family: var(--font-display);
  font-size: clamp(var(--text-3xl), 3vw, var(--text-5xl));
  color: #fff;
  line-height: var(--leading-tight);
  margin-bottom: var(--space-5);
}

.panel-sub {
  color: rgba(255,255,255,0.92);
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
}

.panel-stats {
  display: flex;
  gap: var(--space-8);
  border-top: 1px solid rgba(255,255,255,0.3);
  padding-top: var(--space-6);
}
.ps-item { display: flex; flex-direction: column; gap: 2px; }
.ps-val  { font-size: var(--text-lg); font-weight: 700; color: #fff; }
.ps-lbl  { font-size: 11px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.06em; }

/* Right form side */
.auth-form-side {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  background: var(--bg-canvas);
  overflow-y: auto;
}

.auth-form-wrap {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-tertiary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  transition: color var(--duration-fast);
  align-self: flex-start;
}
.back-link:hover { color: var(--accent-primary); }

.auth-heading {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  color: var(--text-primary);
  margin-bottom: 0;
}
.auth-subtext {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.auth-subtext a { color: var(--accent-primary); text-decoration: underline; text-underline-offset: 2px; }
.auth-subtext a:hover { text-decoration-thickness: 2px; }

/* Form */
form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.req { color: var(--color-danger-500); }

.form-alert {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-danger-100);
  border: 1px solid var(--color-danger-500);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-danger-500);
}
[data-theme="dark"] .form-alert { background: rgba(146,50,50,0.15); }

.input-with-btn { position: relative; }
.input-with-btn .input { padding-right: var(--space-12); }

.reveal-btn {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  transition: color var(--duration-fast);
}
.reveal-btn:hover { color: var(--text-primary); }

.auth-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-4);
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  min-height: 52px;
  font-family: var(--font-body);
  transition: all var(--duration-fast);
}
.auth-submit:hover:not([disabled]) {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.auth-submit[disabled] { opacity: 0.7; cursor: not-allowed; }

.btn-spinner {
  display: block;
  width: 17px; height: 17px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.secure-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-align: center;
}

@media (max-width: 768px) {
  .auth-split      { grid-template-columns: 1fr; }
  .auth-panel      { display: none; }
  .auth-form-side  { padding: var(--space-8) var(--space-4); }
}
</style>