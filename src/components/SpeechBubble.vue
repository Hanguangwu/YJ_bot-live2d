<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  visible: boolean
}>()

const emit = defineEmits<{
  complete: []
}>()

const displayText = ref('')
const isTyping = ref(false)

let typeTimer: ReturnType<typeof setInterval> | null = null

function startTyping(text: string) {
  stopTyping()
  displayText.value = ''
  isTyping.value = true
  let idx = 0
  typeTimer = setInterval(() => {
    if (idx < text.length) {
      displayText.value += text[idx]
      idx++
    } else {
      stopTyping()
      emit('complete')
    }
  }, 50) // typing speed: 50ms per character
}

function stopTyping() {
  if (typeTimer !== null) {
    clearInterval(typeTimer)
    typeTimer = null
  }
  isTyping.value = false
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      startTyping(props.message)
    } else {
      stopTyping()
      displayText.value = ''
    }
  },
)

watch(
  () => props.message,
  (newMsg) => {
    if (props.visible) {
      startTyping(newMsg)
    }
  },
)
</script>

<template>
  <Transition name="bubble">
    <div v-if="visible" class="speech-bubble">
      <div class="bubble-content">
        {{ displayText }}<span v-if="isTyping" class="cursor">|</span>
      </div>
      <div class="bubble-tail" />
    </div>
  </Transition>
</template>

<style scoped>
.speech-bubble {
  position: fixed;
  bottom: 35%;
  left: 50%;
  transform: translateX(-50%);
  max-width: 420px;
  z-index: 20;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
}

.bubble-content {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 16px 24px;
  border-radius: 18px;
  font-size: 1.05rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  backdrop-filter: blur(8px);
}

.cursor {
  display: inline-block;
  animation: blink 0.6s step-end infinite;
  color: #888;
  font-weight: bold;
}

.bubble-tail {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid rgba(255, 255, 255, 0.95);
}

/* Transition */
.bubble-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.bubble-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.bubble-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(12px) scale(0.95);
}
.bubble-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px) scale(0.95);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
