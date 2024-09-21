import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.DEV_ENV == 'true' ? '/' : './',
  build: {
    outDir: 'electron/build'
  },
  plugins: [svelte()],
  resolve: {
    alias: {
      $root: path.resolve(__dirname, 'src'),
      $lib: path.resolve(__dirname, 'src/lib'),
      $stores: path.resolve(__dirname, 'src/stores'),
      $utils: path.resolve(__dirname, 'src/utils'),
      $assets: path.resolve(__dirname, 'src/assets')
    }
  }
})
