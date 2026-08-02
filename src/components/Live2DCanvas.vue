<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useLive2D, type UseLive2DReturn } from '../composables/useLive2D'

const props = withDefaults(defineProps<{
  modelPath?: string
}>(), {
  modelPath: './shizuku_ja/runtime/shizuku.model3.json',
})

const emit = defineEmits<{
  'click-model': []
}>()

const {
  canvasRef,
  sprite,
  isReady,
  startMotion,
  startRandomMotion,
  setExpression,
  setRandomExpression,
  destroy,
} = useLive2D(props.modelPath)

/* ---- DOM-level click-vs-drag detection on the canvas ---- */
let pointerStart: { x: number; y: number } | null = null

function onPointerDown(e: PointerEvent) {
  pointerStart = { x: e.clientX, y: e.clientY }
}

function onPointerUp(e: PointerEvent) {
  if (!pointerStart) return
  const dx = e.clientX - pointerStart.x
  const dy = e.clientY - pointerStart.y
  pointerStart = null
  if (Math.sqrt(dx * dx + dy * dy) < 15) {
    emit('click-model')
  }
}

onMounted(() => {
  const el = canvasRef.value
  if (!el) return
  el.addEventListener('pointerdown', onPointerDown)
  el.addEventListener('pointerup', onPointerUp)
})

onUnmounted(() => {
  const el = canvasRef.value
  if (!el) return
  el.removeEventListener('pointerdown', onPointerDown)
  el.removeEventListener('pointerup', onPointerUp)
})

defineExpose<UseLive2DReturn>({
  canvasRef,
  sprite,
  isReady,
  startMotion,
  startRandomMotion,
  setExpression,
  setRandomExpression,
  destroy,
})
</script>

<template>
  <canvas ref="canvasRef" class="live2d-canvas" />
</template>

<style scoped>
.live2d-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: block;
  z-index: 0;
}
</style>
