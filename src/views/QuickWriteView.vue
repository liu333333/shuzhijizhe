<template>
  <div class="view-container">
    <h2>AI对话</h2>
    <QuickWrite />
  </div>
</template>

<script setup>
import QuickWrite from '../components/QuickWrite.vue'
</script>

<style scoped>
.view-container {
  padding: 2rem;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

h2 {
  margin-bottom: 1.5rem;
  color: var(--text-color);
}
</style>
