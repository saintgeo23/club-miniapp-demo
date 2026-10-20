import { createApp } from 'vue'
import App from './App.vue'
import { init } from './platform'
import './style.css'

// A messenger SDK hiccup (unsupported method on an old client) must never keep the app from rendering.
try {
  init()
} catch (e) {
  console.error('platform init failed', e)
}
createApp(App).mount('#app')
