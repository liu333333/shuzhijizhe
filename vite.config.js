import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 定义环境变量
const isProduction = process.env.NODE_ENV === 'production'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    // 配置别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  plugins: [vue()],
  server: {
			host: '0.0.0.0',
			port: 5173, // 端口号
			open: true, // 是否自动打开浏览器
			proxy: {
				'/api': {
					target: isProduction 
					? 'https://ai-box.dahe.cn'      // 正式线
					: 'https://ai-box-beta.dahe.cn', // 测试线
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api/, ''),
					headers:{'Cookie':'sid=e3d1edc3-f893-4a74-8589-087f38103c18'},
				}
			}
		}
})