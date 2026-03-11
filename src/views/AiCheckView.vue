<template>
  <div class="view-container">
    <h2>素材库</h2>
    <AiCheck />
  </div>
</template>

<script setup>
import AiCheck from '../components/AiCheck.vue'
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
