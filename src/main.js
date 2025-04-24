import { createApp } from 'vue'
import store from './store'
import App from './App.vue'

import './assets/main.scss'
import { createYmaps } from 'vue-yandex-maps'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

// Глобальный обработчик клика по кнопкам "В корзину"
document.addEventListener('click', async (e) => {
  const target = e.target

  if (target.classList.contains('kenost-vue-button')) {
    const productId = parseInt(target.dataset.kenostIdProduct)
    const storeId = parseInt(target.dataset.kenostStore || 48)
    const orgId = parseInt(target.dataset.kenostOrg || 1)

    if(!storeId || !orgId){
        return null
    }

    if (!isNaN(productId)) {
      // Добавляем класс загрузки
      target.classList.add('load')

      try {
        await store.dispatch('basket_api', {
          action: 'basket/add',
          product_id: productId,
          count: 1,
          store: storeId,
          org: orgId
        })

        // Тут можно показать сообщение через toast, если хочешь
        // toast.success("Товар добавлен в корзину!");
      } catch (error) {
        console.error('Ошибка при добавлении товара:', error)
        // toast.error("Ошибка при добавлении товара");
      } finally {
        // Удаляем класс загрузки после ответа
        target.classList.remove('load')
      }
    }
  }
})

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
