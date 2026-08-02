import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface UseBackgroundCarouselReturn {
  currentIndex: Ref<number>
  images: string[]
  isTransitioning: Ref<boolean>
  start: () => void
  stop: () => void
}

const IMAGE_FILES = [
  'alan_frijns-ai-7685862_1920.jpg',
  'alan_frijns-ai-art-7717056_1920.jpg',
  'alan_frijns-ai-art-7717058_1920.jpg',
  'alan_frijns-ai-art-7717067_1920.jpg',
  'alan_frijns-ai-generated-7845460_1920.jpg',
  'archipix-ai-generated-8612487_1920.jpg',
  'gabimedia-ai-illustration-8133524_1920.jpg',
  'kyraxys-ai-generated-8709510_1920.png',
]

export function useBackgroundCarousel(
  intervalMs = 5000,
): UseBackgroundCarouselReturn {
  const currentIndex = ref(0)
  const isTransitioning = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  const images = IMAGE_FILES.map((f) => `./imgs/${f}`)

  function advance() {
    isTransitioning.value = true
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % images.length
      isTransitioning.value = false
    }, 1000)
  }

  function start() {
    if (timer !== null) return
    timer = setInterval(advance, intervalMs)
  }

  function stop() {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    stop()
  })

  return {
    currentIndex,
    images,
    isTransitioning,
    start,
    stop,
  }
}
