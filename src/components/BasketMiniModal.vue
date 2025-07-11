<template>
    <div class="mobile-basket mobileBasketToggleClose" @click="closeModal" :class="{'show': globalState.basket_mini_modal }">
        <div @click.stop class="d-col-basket" v-if="!loading_basket">
            <span class="h3">
                Корзина
            <div v-if="Object.keys(basket).length > 0" @click="clearBasket()" class="basket-clear-btn">
                Очистить
            </div>
            </span>
            <div v-if="Object.keys(basket).length > 0" class="basket-container">
            <template v-for="(org) in basket" :key="org.id">
                <template v-for="(store) in org.data" :key="store.id">
                <div class="basket-container__adres" style="background: #50C0E6">{{ org.org.name }}: {{ store.data.address_short }}</div>
                <template v-for="(product, index) in store.products" :key="product.id">
                    <div class="basket-container__card product-item">
                    <a :href="product.uri" class="basket-container__img">
                        <img :src="'https://mst.tools' + product?.image" alt="Электростанция бензиновая синхронная (генератор) ИНТЕРСКОЛ ЭБ3500" title="Электростанция бензиновая синхронная (генератор) ИНТЕРСКОЛ ЭБ3500">
                    </a>
                    <div class="basket-container__info">
                        <div class="basket-container__title">
                        <a :href="product.uri">{{product.pagetitle}}</a>
                        <div @click="deleteProduct(product.key)" class="btn-close link-no-style"></div>
                        </div>
                        <p class="basket-container__article">{{product?.article}}</p>
                        <div class="basket-container__count">
                        <p>В наличии <span>{{ product.remain.remains }} шт.</span></p>
                        </div>
                        <div class="basket-container__price">
                        <Counter
                            @click="this.loading = true"
                            :min="0" 
                            :max="product.remain.remains" 
                            :initial="product.count"
                            :keyProduct="product.key"
                            @change="handleCountChange" 
                        />
                        <div class="product-price-order">
                            <p>{{ Number(product.price).toLocaleString('ru') }} ₽</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <hr>
                </template>
                </template>
            </template>
            </div>
            <div v-else class="basket-empty">
            <div class="basket-empty__content">
                <img src="https://mst.tools/assets/templates/img/icons/blank_cart.svg" alt="">
                <span class="h3">В вашей корзине пока пусто</span>
            </div>
            </div>
            <button @click="openModal" v-if="Object.keys(basket).length > 0" class="dart-btn dart-btn-primary btn-arrange" :disabled="loading" :class="{loading: loading}">
            <span class="dot-loader-none">Оформить заказ</span>
            <span class="dot-loader">
                <span></span>
                <span></span>
                <span></span>
            </span>
            <span class="dot-loader-none">
                <span class="ms2_total_cost">{{ Number(cost).toLocaleString('ru') }}</span> ₽
            </span>
            </button>
        </div>
        <div @click.stop class="d-col-basket loading" v-else>
            <span class="h3">
            Корзина
            </span>
            <span class="dot-loader">
            <span></span>
            <span></span>
            <span></span>
            </span>
        </div>
    </div>
</template>
  
<script>
import Counter from './Counter.vue'
import { inject } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'BasketMiniModal',
  components: { Counter },
  setup() {
    const globalState = inject('globalState')

    const openModal = () => {
      const form = document
      let event = new CustomEvent("cart/open/order", {});
      form.dispatchEvent(event)
      globalState.basket_modal = true
    }

    return {
      globalState,
      openModal
    }
  },
  computed: {
    ...mapGetters(['basket', 'cost']),
  },
  data() {
    return {
      loading_basket: true,
      loading: false,
    }
  },
  mounted() {
    this.get_basket_api({ action: "basket/get" }).finally(() => {
      this.loading_basket = false
    })
  },
  methods: {
    ...mapActions(['get_basket_api', 'basket_api', 'delivery_courier_api']),
    addBasket(product_id) {
      this.loading = true
      this.basket_api({
        action: 'basket/add',
        product_id: product_id,
        count: 1,
        store: 48,
        org: 1
      }).then((res) => {
        const form = document
        let event = new CustomEvent("cart/add", {
          detail: res.data.data
        });
        form.dispatchEvent(event)
      }).finally(() => this.loading = false)
    },
    closeModal(){
        this.$emit("update:modal", false);
    },
    handleCountChange(count, key) {
      this.basket_api({ action: 'basket/change', key, count }).then((res) => {
        const form = document
        let event = new CustomEvent("cart/change", {
          detail: res.data.data
        });
        form.dispatchEvent(event)
      })
      this.loading = false
    },
    deleteProduct(key) {
      this.loading = true
      this.basket_api({ action: 'basket/delete', key }).then((res) => {
        const form = document
        let event = new CustomEvent("cart/delete", {
          detail: res.data.data
        });
        form.dispatchEvent(event)
      }).finally(() => this.loading = false)
    },
    clearBasket() {
      this.loading = true
      this.basket_api({ action: 'basket/delete' }).then((res) => {
        const form = document
        let event = new CustomEvent("cart/delete", {
          detail: res.data.data
        });
        form.dispatchEvent(event)
      }).finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped lang="scss">
    
</style>
  