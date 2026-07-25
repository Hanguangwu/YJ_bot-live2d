<script setup lang="ts">
import Live2DCanvas from './components/Live2DCanvas.vue'
import SpeechBubble from './components/SpeechBubble.vue'
import { useConfetti } from './composables/useConfetti'
import { useDialog } from './composables/useDialog'
import { useBackgroundCarousel } from './composables/useBackgroundCarousel'

const { fireworks, stars } = useConfetti()
const { isVisible, currentText, showRandom } = useDialog()
const { currentIndex, images, isTransitioning } = useBackgroundCarousel(5000)

function onModelClick() {
  showRandom()
}
</script>

<template>
  <!-- Background carousel layer -->
  <div class="bg-carousel">
    <div
      v-for="(img, idx) in images"
      :key="img"
      class="bg-slide"
      :class="{ active: idx === currentIndex, transitioning: idx === currentIndex && isTransitioning }"
      :style="{ backgroundImage: `url(${img})` }"
    />
  </div>

  <!-- Live2D canvas (transparent background) -->
  <Live2DCanvas @click-model="onModelClick" />

  <!-- Speech bubble -->
  <SpeechBubble :message="currentText" :visible="isVisible" />

  <!-- Controls -->
  <div class="controls">
    <button class="btn btn-fireworks" @click="fireworks">
      🎆 Fireworks
    </button>
    <button class="btn btn-stars" @click="stars">
      ✨ Stars
    </button>
  </div>
</template>

<style scoped>
/* ---- Background Carousel ---- */
.bg-carousel {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: #0a0a0f;
}

.bg-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease;
}

.bg-slide.active,
.bg-slide.transitioning {
  opacity: 1;
}

.bg-slide.active {
  opacity: 1;
}

/* ---- Controls ---- */
.controls {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn:active {
  transform: translateY(0);
}

.btn-fireworks {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-stars {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}
</style>
