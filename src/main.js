import './assets/main.scss'
import { createYmaps } from 'vue-yandex-maps'

import { createApp } from 'vue'
import store from './store'
import App from './App.vue'
import Button from './Button.vue'

const app = createApp(App)

const button = createApp(Button)

app
.use(store)
.use(createYmaps({
    apikey: '7270e707-f1a7-4397-a1d7-0c545cf0b735',
    lang: 'ru_RU',
}))
.mount('#app')

button
.use(store)
.mount("#mst-button")