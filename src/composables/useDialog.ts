import { ref, type Ref } from 'vue'

export interface UseDialogReturn {
  isVisible: Ref<boolean>
  currentText: Ref<string>
  /**
   * Show a custom message. Ready for future voice/API integration.
   * Simply replace the call site: `show(voiceResult)` instead of `showRandom()`.
   */
  show: (text: string) => void
  showRandom: () => void
  hide: () => void
}

/**
 * Preset phrases — the user can freely edit these.
 * For future voice integration, replace the call to showRandom()
 * with a call to show(transcribedText).
 */
const PHRASES = [
  '你好呀！今天过得怎么样？',
  '天气真好，一起出去走走吧！',
  '你知道吗？我最近学会了一个新技能～',
  '要不要听个笑话？……哦，我好像不太会讲 😅',
  '今天也是元气满满的一天呢！',
  '你看起来心情不错，我也很开心！',
  '注意休息哦，别太累了～',
  '嘿，你点我干嘛？有什么事吗？',
  '我在看风景呢，别打扰我～',
  '嗯…我在想一个问题，关于宇宙的奥秘！',
  '你点的好，下次不要再点了（笑）',
  '今天有什么有趣的事吗？跟我说说呗！',
]

let lastIndex = -1

function pickRandom(): string {
  let idx: number
  do {
    idx = Math.floor(Math.random() * PHRASES.length)
  } while (idx === lastIndex && PHRASES.length > 1)
  lastIndex = idx
  return PHRASES[idx]
}

export function useDialog(): UseDialogReturn {
  const isVisible = ref(false)
  const currentText = ref('')
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  function clearHideTimer() {
    if (hideTimer !== null) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  function show(text: string) {
    clearHideTimer()
    currentText.value = text
    isVisible.value = true
    hideTimer = setTimeout(() => {
      hide()
    }, 4000)
  }

  function showRandom() {
    show(pickRandom())
  }

  function hide() {
    clearHideTimer()
    isVisible.value = false
  }

  return {
    isVisible,
    currentText,
    show,
    showRandom,
    hide,
  }
}
