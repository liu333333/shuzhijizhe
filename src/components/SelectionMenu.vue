<template>
  <div 
    class="selection-menu"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`
    }"
  >
    <button @click="$emit('rewrite')" title="AI改写">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 0 1-9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9c1.66 0 3.21.4 4.5 1.09L21 3v9z"></path>
        <path d="M16 3v6h6"></path>
      </svg>
    </button>
    <button @click="$emit('expand')" title="AI扩展">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v20M2 12h20"></path>
      </svg>
    </button>
    <button @click="$emit('ai-check')" title="AI校对">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
      </svg>
    </button>
    <button @click="$emit('close')" title="关闭">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  position: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'rewrite', 'expand', 'ai-check'])
</script>

<style scoped>
.selection-menu {
  position: absolute;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--hover-shadow);
  padding: 0.5rem;
  z-index: 1000;
  display: flex;
  gap: 0.5rem;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.95);
}

.selection-menu button {
  padding: 0.5rem;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
}

.selection-menu button:hover {
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.selection-menu button:active {
  transform: translateY(0);
}
</style>