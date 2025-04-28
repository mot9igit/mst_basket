<template>
  <div class="d-col-basket" v-if="!loading_basket">
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
  <div class="d-col-basket loading" v-else>
    <span class="h3">
      Корзина
    </span>
    <span class="dot-loader">
      <span></span>
      <span></span>
      <span></span>
    </span>
  </div>
</template>

<script>
  import Counter from './components/Counter.vue';
  import BasketModal from './components/BasketModal.vue';
  import { mapActions, mapGetters } from "vuex";

  export default {
    name: 'Basket',
    data() {
      return {
        loading_basket: true,
        loading: false,
      }
    },
    components: {
      Counter,
      BasketModal
    },
    computed: {
      ...mapGetters([
        'basket',
        'cost',
        'count'
      ]),
    },
    mounted() {
      this.get_basket_api({
        action: "basket/get"
      }).finally(() => this.loading_basket = false)
    },
    updated() {

    },
    methods: {
      ...mapActions([
        'get_basket_api',
        'basket_api',
        "delivery_courier_api"
      ]),
      addBasket(product_id){
        this.loading = true
        this.basket_api({
          action: 'basket/add',
          product_id: product_id,
          count: 1,
          store: 48,
          org: 1
        }).finally(() => {this.loading = false})
      },
      openModal() {
        this.$globalState.basket_modal = true
      },
      handleCountChange(count, key){
        this.basket_api({
          action: 'basket/change',
          key: key,
          count: count
        })
        this.loading = false
      },
      deleteProduct(key){
        this.loading = true
        this.basket_api({
          action: 'basket/delete',
          key: key,
        }).finally(() => {this.loading = false})
      },
      clearBasket(key){
        this.loading = true
        this.basket_api({
          action: 'basket/delete'
        }).finally(() => {this.loading = false})
      }
    },
    watch: {
      cost(newVal) {
        const costElement = document.querySelector('.kenost-basket-total-cost')
        if (costElement) {
          if(Number(newVal)){
            costElement.textContent = `${Number(newVal).toLocaleString('ru')} ₽`
          } else {
            costElement.textContent = ''
          }
        }
      },
      count(newVal) {
        const countElement = document.querySelector('.kenost-basket-total-count')
        if (countElement) {
          if(Number(newVal)){
            countElement.textContent = `${Number(newVal).toLocaleString('ru')} шт.`
          } else {
            countElement.textContent = ''
          }
        }
      },
      basket(newVal) {
        console.log(newVal)
      }
    }
}
</script>
<style scoped lang="scss">
  
</style>
