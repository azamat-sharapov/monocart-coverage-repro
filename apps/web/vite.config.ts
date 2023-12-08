import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    envDir: '../../../',
    build: {
      // TODO: production sourcemaps enabled
      // while we are in the beginning of development.
      // It should be disabled when we go live.
      sourcemap: true,
    },
    server: {
      port: 8000,
    },
    plugins: [
      vue(),

      // this is causing coverage issues
      Components({
        dts: false,
        resolvers: [
          {
            type: 'component',
            // TODO: this resolver does not catch Checkbox component
            // for some reason. Therefore Checkbox must be imported
            // manually. Create reproduction and report it.
            resolve: (name: string) => {
              if (name === 'RouterLink' || name === 'RouterView') {
                return { name, from: 'vue-router' }
              }
              return { from: `@papershift/ui/src/${name}.vue` }
            },
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
