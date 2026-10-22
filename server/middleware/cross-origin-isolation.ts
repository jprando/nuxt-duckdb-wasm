import { defineEventHandler } from 'nuxt/server'

export default defineEventHandler((event) => {
  event.res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  event.res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
})
