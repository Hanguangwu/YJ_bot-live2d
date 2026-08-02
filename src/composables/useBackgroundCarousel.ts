import { ref, onMounted, onUnmounted, type Ref } from 'vue'

import img1 from '../assets/imgs/alan_frijns-ai-7685862_1920.jpg'
import img2 from '../assets/imgs/alan_frijns-ai-art-7717056_1920.jpg'
import img3 from '../assets/imgs/alan_frijns-ai-art-7717058_1920.jpg'
import img4 from '../assets/imgs/alan_frijns-ai-art-7717067_1920.jpg'
import img5 from '../assets/imgs/alan_frijns-ai-generated-7845460_1920.jpg'
import img6 from '../assets/imgs/archipix-ai-generated-8612487_1920.jpg'
import img7 from '../assets/imgs/gabimedia-ai-illustration-8133524_1920.jpg'
import img8 from '../assets/imgs/kyraxys-ai-generated-8709510_1920.png'

const images = [img1, img2, img3, img4, img5, img6, img7, img8]

export interface UseBackgroundCarouselReturn {
  currentIndex: Ref<number>
  images: string[]
  isTransitioning: Ref<boolean>
  start: () => void
  stop: () => void
}

export function useBackgroundCarousel(
  intervalMs = 5000,
): UseBackgroundCarouselReturn {
  const currentIndex = ref(0)
  const isTransitioning = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

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