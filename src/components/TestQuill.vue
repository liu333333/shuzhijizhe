<template>
  <div class="test-quill">
    <h2>Quill Test</h2>
    <QuillEditor ref="editor" />
    <button class="btn btn-primary" @click="testQuillInstance">Test Quill Instance</button>
    <div class="test-result" v-if="testResult">
      <h3>Test Result:</h3>
      <p>{{ testResult }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuillEditor from './QuillEditor.vue'

const editor = ref(null)
const testResult = ref('')

const testQuillInstance = () => {
  if (editor.value && editor.value.quill) {
    // Test if we can access the quill instance
    const quill = editor.value.quill
    const length = quill.getLength()
    const selection = quill.getSelection()
    
    testResult.value = `Quill instance accessed successfully! Length: ${length}, Selection: ${JSON.stringify(selection)}`
  } else {
    testResult.value = 'Failed to access quill instance'
  }
}
</script>

<style scoped>
.test-quill {
  width: 100%;
}

.test-result {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: rgba(67, 97, 238, 0.05);
}
</style>