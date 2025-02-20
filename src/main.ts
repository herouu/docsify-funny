import { createApp } from 'vue'
import './style.css'
// import App from './App.vue'
import FavoritesCard from './FavoritesCard.vue'
const filePath = "/src/assets/test.json"
// createApp(App,{filePath}).mount('#app')
createApp(FavoritesCard,{filePath}).mount('#favorite')
