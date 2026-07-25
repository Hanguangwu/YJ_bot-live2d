# AGENTS.md — Live2D YJ 实现方案

## 架构总览

```
index.html           ← 引入 live2dcubismcore.js
  └─ src/main.ts     ← Vue 应用挂载
       └─ App.vue    ← 主页面：组合 Live2D + Confetti
            ├─ Live2DCanvas.vue  ← Pixi Application + Live2DSprite
            ├─ useLive2D.ts      ← Live2D 生命周期与 API 封装
            └─ useConfetti.ts    ← Canvas Confetti 特效封装
```

## 依赖清单

| 包名 | 用途 | 安装方式 |
|---|---|---|
| `easy-live2d` | Live2D 模型渲染 SDK（基于 Pixi.js） | `pnpm add easy-live2d` |
| `pixi.js` | 2D WebGL 渲染引擎（宿主） | `pnpm add pixi.js` |
| `canvas-confetti` | 彩纸特效库 | `pnpm add canvas-confetti` |
| `@types/canvas-confetti` | TypeScript 类型声明 | `pnpm add -D @types/canvas-confetti` |
| `live2dcubismcore.js` | Live2D Cubism Core（二进制） | 手动下载放入 `public/Core/` |

## 文件清单与职责

### 1. `index.html` — 入口 HTML

**修改点：**
- 在 `<head>` 或 `<body>` 顶部添加 `<script src="/Core/live2dcubismcore.js"></script>`
- `live2dcubismcore.js` 必须在所有 ES Module 之前加载，因为它以全局 script 方式挂载 Live2D 底层 API

### 2. `src/composables/useLive2D.ts` — Live2D 组合式函数

**职责：** 封装 Live2D 模型的完整生命周期。

```typescript
// 导出接口
interface UseLive2DReturn {
  canvasRef: Ref<HTMLCanvasElement | null>  // 模板 ref，绑定到 <canvas>
  sprite: Ref<Live2DSprite | null>          // Live2DSprite 实例
  isReady: Ref<boolean>                     // 模型是否就绪
  startMotion: (group: string, no: number, priority?: Priority) => Promise<void>
  startRandomMotion: (group: string) => Promise<void>
  setExpression: (id: string) => void
  setRandomExpression: () => void
  destroy: () => void
}
```

**实现要点：**
1. 在 `onMounted` 中初始化 Pixi `Application`
   - `backgroundAlpha: 0`（透明背景）
   - `autoDensity: true`
   - `resolution: Math.max(window.devicePixelRatio || 1, 1)`
2. 创建 `Live2DSprite` 实例
   - `modelPath` 指向 `/Resources/<model>/<model>.model3.json`
   - `ticker: Ticker.shared`
   - `draggable: true`
3. 设置 `sprite.width = canvas.clientWidth` 适配宽度
4. 监听 `sprite.onLive2D('ready', ...)` 设置 `isReady.value = true`
5. 在 `onUnmounted` 中调用 `sprite.destroy()` 和 `app.destroy()`
6. 全局 `Config` 设置：

```typescript
import { Config, LogLevel } from 'easy-live2d'

Config.MotionGroupIdle = 'Idle'
Config.MouseFollow = true
Config.CubismLoggingLevel = LogLevel.LogLevel_Warning
```

### 3. `src/components/Live2DCanvas.vue` — Live2D 画布组件

**模板结构：**

```vue
<template>
  <canvas ref="canvasRef" class="live2d-canvas" />
</template>
```

**样式关键点：**
- 全屏铺满：`width: 100vw; height: 100vh; display: block;`
- `position: fixed` 使 canvas 作为背景层
- `z-index` 控制层级

**逻辑：**
- 调用 `useLive2D()` composable
- 通过 `defineExpose` 暴露 `sprite` 实例和 API，供父组件 `App.vue` 调用

### 4. `src/composables/useConfetti.ts` — Confetti 组合式函数

**导出接口：**

```typescript
interface UseConfettiReturn {
  fireworks: () => void   // 烟花彩纸（持续 15s 从两侧发射）
  stars: () => void       // 星辰闪烁（爆裂星形 + 圆形）
}
```

**Fireworks 实现：**
- 每 250ms 从页面左右两侧 (x: 0.1~0.3, 0.7~0.9) 发射彩纸
- 持续 15 秒，粒子数随时间递减
- `startVelocity: 30, spread: 360, ticks: 60`

**Stars 实现：**
- 三连发星形 + 圆形混合爆裂
- 零重力 (`gravity: 0`)、慢衰减 (`decay: 0.94`)
- 金色系配色

### 5. `src/App.vue` — 主应用组件

**职责：** 组合 Live2D + Confetti 特效。

```vue
<script setup lang="ts">
import Live2DCanvas from './components/Live2DCanvas.vue'
import { useConfetti } from './composables/useConfetti'

const { fireworks, stars } = useConfetti()

// 示例：在模型就绪后播放特效
// onMounted(() => { fireworks() })
</script>

<template>
  <Live2DCanvas ref="live2dRef" />
  <div class="controls">
    <button @click="fireworks">🎆 Fireworks</button>
    <button @click="stars">✨ Stars</button>
  </div>
</template>
```

## 实施步骤（按顺序）

### 步骤 1：安装依赖
```bash
pnpm add easy-live2d pixi.js canvas-confetti
pnpm add -D @types/canvas-confetti
```

### 步骤 2：准备 Cubism Core + 模型资源
- 创建 `public/Core/`，放入 `live2dcubismcore.js`
- 创建 `public/Resources/<model>/`，放入模型文件（model3.json, moc3, textures, motions 等）

### 步骤 3：修改 `index.html`
- 在 `<head>` 中添加 `<script src="/Core/live2dcubismcore.js"></script>`
- 更新 `<title>`

### 步骤 4：创建 `src/composables/useLive2D.ts`
- 实现 Live2D 模型初始化、控制、销毁

### 步骤 5：创建 `src/composables/useConfetti.ts`
- 实现 fireworks() 和 stars() 两个特效

### 步骤 6：创建 `src/components/Live2DCanvas.vue`
- 画布组件，使用 useLive2D composable

### 步骤 7：修改 `src/App.vue`
- 集成 Live2DCanvas + Confetti 控制按钮

### 步骤 8：验证
- `pnpm dev` 启动，确认 Live2D 模型渲染、交互正常
- 确认 Fireworks / Stars 特效正常触发
- `pnpm build` 构建通过，无 TypeScript 错误

## 注意事项

1. **live2dcubismcore.js 加载时机** — 必须作为普通 `<script>` 在 module script 之前加载，不能使用 ES Module 方式导入
2. **Pixi.js 版本兼容** — `easy-live2d` 基于 Pixi.js v8+，确认 `pixi.js` 安装版本为 8.x
3. **Canvas Confetti 类型** — `canvas-confetti` 默认导出函数类型，`@types/canvas-confetti` 提供完整类型
4. **模型路径** — `modelPath` 相对于 `public/` 目录，例如 `/Resources/Hiyori/Hiyori.model3.json`
5. **跨域资源** — 若模型资源部署在 CDN，需设置 `Config.crossOrigin = 'anonymous'`（默认值），且服务端返回 `Access-Control-Allow-Origin`
6. **SSR 限制** — `Live2DSprite` 依赖浏览器 API，所有初始化逻辑必须在 `onMounted` 中执行

## 验证清单

- [ ] `pnpm dev` 启动无报错
- [ ] 浏览器打开显示 Live2D 模型
- [ ] 模型支持鼠标跟随（`Config.MouseFollow = true`）
- [ ] 模型可拖拽（`draggable: true`）
- [ ] 点击 Fireworks 按钮，页面两侧发射彩纸
- [ ] 点击 Stars 按钮，中心爆发星形彩纸
- [ ] `pnpm build` 构建成功，无 TypeScript 编译错误
- [ ] `pnpm preview` 预览生产构建正常
