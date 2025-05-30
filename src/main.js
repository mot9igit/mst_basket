import { createApp } from 'vue'
import store from './store'
import App from './App.vue'
import Modals from './Modals.vue'
import { reactive } from 'vue'
import { watch } from 'vue'

import './assets/main.scss'
import { createYmaps } from 'vue-yandex-maps'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { toast } from 'vue3-toastify';

const app = createApp(App)
const modals = createApp(Modals)

const globalState = reactive({
  basket_modal: false,
  basket_mini_modal: false
})

// 🔒 Блокировка скролла при открытии модалок
watch(
  () => [globalState.basket_modal, globalState.basket_mini_modal],
  ([basket_modal, basket_mini_modal]) => {
    const body = document.body
    const html = document.documentElement

    if (basket_modal || basket_mini_modal) {
      body.style.overflow = 'hidden'
      html.style.overflow = 'hidden'
    } else {
      body.style.overflow = ''
      html.style.overflow = ''
    }
  }
)

// Глобальный обработчик клика по кнопкам "В корзину"
document.addEventListener('click', async (e) => {
  const target = e.target
  // console.log(target.classList)
  // console.log(target.classList.contains('kenost-vue-button'))

  // Кнопка "Добавить в корзину"
  if (target.classList.contains('kenost-vue-button')) {
    const productId = parseInt(target.dataset.kenostIdProduct)
    const storeId = parseInt(target.dataset.kenostStore || 48)
    const orgId = parseInt(target.dataset.kenostOrg || 1)

    if (!storeId || !orgId) return null

    if (!isNaN(productId)) {
      target.classList.add('load')

      try {
        const res = await store.dispatch('basket_api', {
          action: 'basket/add',
          product_id: productId,
          count: 1,
          store: storeId,
          org: orgId
        })

        if(!res.data.data.error){
          const form = document
          let event = new CustomEvent("cart/add", {
            detail: res.data.data
          });
          form.dispatchEvent(event)

          toast("Товар добавлен в корзину!", {
            autoClose: 3000,
            type: "success",
          });
        } else {
          toast(res.data.data.error, {
            autoClose: 3000,
            type: 'error',
          });
        }
        
      } catch (error) {
        console.error('Ошибка при добавлении товара:', error)
      } finally {
        target.classList.remove('load')
      }
    }
  }

  // Кнопка для показа мини-модалки корзины
  if (target.closest('.kenost-vue-basket-modal-change')) {
    globalState.basket_mini_modal = true;
  }
})

app.config.globalProperties.$globalState = globalState
modals.provide('globalState', globalState)

app
  .use(store)
  .use(createYmaps({
    apikey: '7270e707-f1a7-4397-a1d7-0c545cf0b735',
    lang: 'ru_RU',
  }))
  .use(Vue3Toastify, {
    autoClose: 3000,
    position: "top-right",
    theme: "colored",
    hideProgressBar: true,
    dangerouslyHTMLString: true
  })
  .mount('#mst-kenost-basket')

modals
  .use(store)
  .use(createYmaps({
    apikey: '7270e707-f1a7-4397-a1d7-0c545cf0b735',
    lang: 'ru_RU',
  }))
  .use(Vue3Toastify, {
    autoClose: 3000,
    position: "top-right",
    theme: "colored",
    hideProgressBar: true,
    dangerouslyHTMLString: true
  })
  .mount('#mst-kenost-basket-modals')
