<template>
  <div class="view-container">
    <h2>出口成章</h2>
    <StepWrite />
  </div>
</template>

<script setup>
import StepWrite from '../components/StepWrite.vue'
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
