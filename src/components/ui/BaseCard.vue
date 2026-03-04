<template>
  <div
    class="base-card card"
    :class="{
      'card-hoverable': hoverable,
      'card-padded':    padded,
      'card-flat':      flat
    }"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  hoverable: { type: Boolean, default: false },
  padded:    { type: Boolean, default: true  },
  flat:      { type: Boolean, default: false }
})
</script>

<style scoped>
.base-card      { display: flex; flex-direction: column; }
.card-padded    { padding: var(--space-6); }
.card-hoverable { cursor: pointer; }
.card-hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-default);
}
.card-flat {
  box-shadow: none;
  border-color: var(--border-subtle);
}
</style>