import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function buildDepPaths(names: string[]) {
  return names.map((name) => {
    let _name = name
    if (_name.includes('/')) {
      _name = _name.replace('/', '+')
    }
    return `/.pnpm/${_name}`
  })
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 4000,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3090',
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // manualChunks 配置
          manualChunks(id) {
            const vendorNames = ['react', 'react-dom', 'react-router-dom']
            const uiLibNames = [
              '@radix-ui',
              'react-hook-form',
              '@tanstack/react-table',
            ]
            const iconLibNames = ['lucide-react']
            // console.log(id)
            if (id.includes('node_modules')) {
              const packageDepName = id.split('node_modules')[1]
              // console.log(packageDepName)

              if (
                buildDepPaths(vendorNames).some((name) =>
                  packageDepName.includes(name),
                )
              ) {
                return 'vendor'
              }

              if (
                buildDepPaths(uiLibNames).some((name) =>
                  packageDepName.includes(name),
                )
              ) {
                return 'ui-libs'
              }

              if (
                buildDepPaths(iconLibNames).some((name) =>
                  packageDepName.includes(name),
                )
              ) {
                return 'icon-libs'
              }
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: ['lucide-react'],
    },
  }
})
