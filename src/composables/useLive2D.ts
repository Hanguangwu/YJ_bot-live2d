import { Config, Live2DSprite, LogLevel, Priority } from 'easy-live2d'
import { Application, Ticker } from 'pixi.js'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

// Must be set before Live2DSprite instantiation
Config.MotionGroupIdle = 'Idle'
Config.MouseFollow = true
Config.CubismLoggingLevel = LogLevel.LogLevel_Warning

export interface UseLive2DReturn {
  canvasRef: Ref<HTMLCanvasElement | null>
  sprite: Ref<Live2DSprite | null>
  isReady: Ref<boolean>
  startMotion: (group: string, no: number, priority?: Priority) => Promise<void>
  startRandomMotion: (group: string) => Promise<void>
  setExpression: (id: string) => void
  setRandomExpression: () => void
  destroy: () => void
}

export function useLive2D(modelPath: string): UseLive2DReturn {
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const sprite = ref<Live2DSprite | null>(null)
  const isReady = ref(false)

  const app = new Application()

  const startMotion = async (group: string, no: number, priority: Priority = Priority.Normal) => {
    if (!sprite.value) return
    await sprite.value.startMotion({ group, no, priority })
  }

  const startRandomMotion = async (group: string) => {
    if (!sprite.value) return
    await sprite.value.startRandomMotion({ group, priority: Priority.Normal })
  }

  const setExpression = (id: string) => {
    if (!sprite.value) return
    sprite.value.setExpression({ expressionId: id })
  }

  const setRandomExpression = () => {
    if (!sprite.value) return
    sprite.value.setRandomExpression()
  }

  const destroy = () => {
    if (sprite.value) {
      sprite.value.destroy()
      sprite.value = null
    }
    app.destroy(true)
    isReady.value = false
  }

  onMounted(async () => {
    if (!canvasRef.value) return

    await app.init({
      canvas: canvasRef.value,
      backgroundAlpha: 0,
      autoDensity: true,
      resolution: Math.max(window.devicePixelRatio || 1, 1),
    })

    const live2dSprite = new Live2DSprite({
      modelPath,
      ticker: Ticker.shared,
      draggable: true,
    })

    live2dSprite.width = canvasRef.value.clientWidth
    app.stage.addChild(live2dSprite)

    live2dSprite.onLive2D('ready', () => {
      isReady.value = true
      console.log('Live2D model ready')
    })

    sprite.value = live2dSprite
  })

  onUnmounted(() => {
    destroy()
  })

  return {
    canvasRef,
    sprite: sprite as Ref<Live2DSprite | null>,
    isReady,
    startMotion,
    startRandomMotion,
    setExpression,
    setRandomExpression,
    destroy,
  } as UseLive2DReturn
}
