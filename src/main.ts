import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
const filePath = "/src/assets/test.json"
createApp(App,{filePath}).mount('#app')
