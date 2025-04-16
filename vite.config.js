
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // css: {
  //   postcss: {
  //     plugins: [
  //       autoprefixer({}) 
  //     ],
  //   }
  // },
  server: {
    proxy: {
      '/rest': {
        target: 'https://mst.tools/',
        changeOrigin: true,
        secure: true
      }
    },
  },
})
