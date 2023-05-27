import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
build: {
      sourcemap: true,
      /*rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const arr = id.toString().split('node_modules/')[1].split('/')
              switch(arr[0]) {
                case '@kangc':
                case '@naturefw':
                case '@popperjs':
                case '@vue':
                case 'axios':
                case 'ant-design-vue':
                  return '_' + arr[0]
                  break
                default :
                  return '__vendor'
                  break
              }
            }
          },
        },
      }*/
    },
})
