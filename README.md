# YJ_bot-Live2D 

基于 **Vite + Vue 3 + TypeScript** 的 Live2D 展示页面，集成 **[easy-live2d](https://panzer-jack.github.io/easy-live2d/)** 和 **[canvas-confetti](https://www.kirilv.com/canvas-confetti/)** 特效。

## 特性

- 🎭 **Live2D 模型展示** — 基于 Pixi.js + easy-live2d，支持动作播放、表情切换、拖拽交互
- 🎆 **Canvas Confetti 特效** — Fireworks（烟花彩纸） + Stars（星辰闪烁）
- ⚡ **Vite + Vue 3 + TypeScript** — 现代前端工具链
- 📦 **pnpm** — 快速、磁盘高效的包管理

## 前置条件

- Node.js >= 18
- pnpm >= 8

## 安装

```bash
# 安装依赖
pnpm add easy-live2d pixi.js canvas-confetti

# 安装类型声明（如果需要）
pnpm add -D @types/canvas-confetti
```

## Live2D Cubism Core

`easy-live2d` 本身不包含 Live2D Core。你需要按 Live2D 官方许可自行下载。

1. 访问 [Live2D 官方下载页](https://www.live2d.com/download/cubism-sdk/) 下载 Cubism SDK for Web
2. 将 `Core/live2dcubismcore.js` 复制到项目的 `public/Core/` 目录
3. 在 `index.html` 中通过 `<script>` 提前引入：

```html
<script src="/Core/live2dcubismcore.js"></script>
```

> ⚠️ `live2dcubismcore.js` 必须在所有业务代码之前加载，`Live2DSprite` 依赖浏览器 API，不适合 SSR。

## 模型资源

将 Live2D 模型文件放入 `public/Resources/` 目录，以模型入口文件 `model3.json` 所在的目录结构存放。

目录结构示例：

```
public/
├── Core/
│   └── live2dcubismcore.js
└── Resources/
    └── Hiyori/
        ├── Hiyori.model3.json
        ├── Hiyori.moc3
        ├── Hiyori.physics3.json
        ├── Hiyori.userdata3.json
        ├── expressions/
        ├── motions/
        └── textures/
```

## 项目架构

```
src/
├── App.vue                  # 主应用组件（Live2D + Confetti 集成）
├── main.ts                  # 应用入口
├── style.css                # 全局样式
├── components/
│   └── Live2DCanvas.vue     # Live2D 画布组件（封装 Pixi Application）
├── composables/
│   ├── useLive2D.ts         # Live2D 初始化与控制的组合式函数
│   └── useConfetti.ts       # Canvas Confetti 特效的组合式函数
└── types/
    └── live2d.d.ts          # Live2D 相关类型声明（如果需要）
```

### 关键组件说明

#### `Live2DCanvas.vue`
- 渲染 `<canvas>` 元素
- 初始化 Pixi `Application`
- 创建并挂载 `Live2DSprite`
- 监听窗口尺寸变化（ResizeObserver）
- 通过 `defineExpose` 暴露 sprite 实例供父组件操控

#### `useLive2D.ts`
- 封装 `Live2DSprite` 的创建、配置、销毁逻辑
- 管理 `Config` 全局设置（如 `MouseFollow`、`MotionGroupIdle`）
- 提供动作播放、表情切换等 API
- 自动处理 `onMounted` / `onUnmounted` 生命周期

#### `useConfetti.ts`
- 封装 `canvas-confetti` 的导入和调用
- 提供 `fireworks()` 和 `stars()` 两个预设特效
- 支持自定义参数覆盖

## Canvas Confetti 特效

安装 canvas-confetti：

```bash
pnpm add canvas-confetti
pnpm add -D @types/canvas-confetti
```

### Fireworks（烟花彩纸）

从页面两侧持续发射彩纸，持续 15 秒：

```typescript
import confetti from 'canvas-confetti'

function fireworks() {
  const duration = 15 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  }, 250)
}
```

### Stars（星辰闪烁）

从画面中心爆发星形 + 圆形彩纸：

```typescript
import confetti from 'canvas-confetti'

function stars() {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
  }

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star'],
    })

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle'],
    })
  }

  shoot()
  setTimeout(shoot, 100)
  setTimeout(shoot, 200)
}
```

## 开发

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 快速集成步骤

1. **安装依赖** — `pnpm add easy-live2d pixi.js canvas-confetti`
2. **放置 Cubism Core** — 将 `live2dcubismcore.js` 放入 `public/Core/`
3. **放置模型** — 将 Live2D 模型放入 `public/Resources/<model-name>/`
4. **更新 index.html** — 添加 `<script src="/Core/live2dcubismcore.js">`
5. **编写组件** — 创建 `Live2DCanvas.vue`、`useLive2D.ts`、`useConfetti.ts`
6. **集成主应用** — 在 `App.vue` 中组合 Live2D + Confetti 特效

## 参考链接

- [easy-live2d 官方文档](https://panzer-jack.github.io/easy-live2d/)
- [easy-live2d GitHub](https://github.com/Panzer-Jack/easy-live2d)
- [Pixi.js 官方文档](https://pixijs.com/)
- [Canvas Confetti 官方文档](https://www.kirilv.com/canvas-confetti/)
- [canvas-confetti GitHub](https://github.com/catdad/canvas-confetti)
- [Live2D Cubism SDK](https://www.live2d.com/download/cubism-sdk/)
