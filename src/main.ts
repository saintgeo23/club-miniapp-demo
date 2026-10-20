import { createApp } from 'vue'
import App from './App.vue'
import { init } from './platform'
import './style.css'

init()
createApp(App).mount('#app')
