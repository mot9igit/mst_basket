import './assets/main.scss'
import { createYmaps } from 'vue-yandex-maps'

import { createApp } from 'vue'
import store from './store'
import App from './App.vue'

const app = createApp(App)

app
.use(store)
.use(createYmaps({
    apikey: '7270e707-f1a7-4397-a1d7-0c545cf0b735',
    lang: 'ru_RU',
}))
.mount('#app')
