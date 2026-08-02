import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 部署到子路径（<user>.github.io/<repo>/）时必须用相对路径，
  // 否则构建产物引用 /assets/... 绝对路径，请求到域名根目录返回 404 的 index.html，
  // 导致 "<script> 使用了不允许的 MIME 类型 ('text/html')" 错误。
  base: './',
  plugins: [vue()],
})
