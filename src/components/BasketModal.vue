<template>
  <div class="dart-order" @click="closeModal" :class="{'show': modal}">
    <div class="dart-order__content" @click.stop>
      <div class="dart-order__title">
        <span class="h1-mini">Оформление заказа</span>
        <div @click="closeModal" class="btn-close link-no-style"><i class="d_icon d_icon-close"></i></div>
      </div>
      <div class="dart-order__container">
        <div class="dart-order__left js-order-cart">
          <template v-for="(org) in basket" :key="org.id">
            <template v-for="(store) in org.data" :key="store.id">
              <div class="dart-order__el">
                <h3>Заказ из магазина {{ org.org.name }}</h3>
                <div class="dart-order__info dart-order__info-mt">
                  <img :src="'https://mst.tools/assets/content/'+store.data.image" alt="">
                  <p class="dart-shop-address" style="background: #50C0E6">{{ store.data.address_short }}</p>
                </div>
                <div>
                  <template v-for="(product) in store.products" :key="product.id">
                    <div class="dart-procuct-cart product-item" data-key="30a6970d6e3ff337bccdf886aa0c3cd8" data-dart_order="" data-dart_order-item="" itemscope="" itemtype="https://schema.org/Product">
                      <meta itemprop="orderQuantity" :content="product.count">
                      <meta itemprop="identifier" :content="product.id">
                      <meta itemprop="name" :content="product.pagetitle">
                      <meta itemprop="description" :content="product.description">
                      <meta itemprop="brand" :content="product['vendor.name']">
                      <div itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
                        <meta itemprop="price" :content="product.price">
                        <meta itemprop="priceCurrency" content="RUB">
                      </div>
                      <a :href="product.uri" class="dart-procuct-cart__img">
                        <img v-if="product.image" :src="'https://mst.tools' + product.image" :alt="product.pagetitle" :title="product.pagetitle">
                        <img v-else src="https://mst.tools/assets/files/img/nopic.png" :alt="product.pagetitle" :title="product.pagetitle">
                        
                      </a>
                      <div class="dart-procuct-cart__info">
                        <div class="dart-procuct-cart__title">
                          <a :href="product.uri">{{product.pagetitle}}</a>
                          <a href="#" class="btn-close link-no-style"><i class="d_icon d_icon-close"></i></a>
                        </div>
                        <p class="dart-procuct-cart__article">{{product?.article}}</p>
                        <div class="dart-procuct-cart__count">
                          <p>В наличии <span>{{ product.remain.remains }} шт.</span></p>
                        </div>
                        <div class="dart-procuct-cart__price">
                          <Counter
                            @click="this.loading = true"
                            :min="0" 
                            :max="product.remain.remains" 
                            :initial="product.count"
                            :keyProduct="product.key"
                            @change="handleCountChange" 
                          />
                          <div class="order-product-price-and-bonus">
                            <div class="product-price-order">
                              <p>{{ Number(product.price).toLocaleString('ru') }} ₽</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </template>
        </div>
        <div class="dart-order__right">
          <h3>Способы получения</h3>
          <div class="dart-order__delivery-methods" id="deliveries">
						<a class="dart-btn dart-btn-radio-mini" data-checked="1">
							<input type="radio" name="delivery" value="1" id="delivery_1" data-payments="[3]" checked="">
              <label for="delivery_1" class="text">
                <p class="dart-order__delivery-title">Самовывоз</p>
                <!--
                <div class="dart-order__time-price">
                  <p>3 января</p>
                  <p>бесплатно</p>
                </div>
                -->
              </label>
					  </a>
						<a class="dart-btn dart-btn-radio-mini" data-checked="">
							<input type="radio" name="delivery" value="2" id="delivery_2" data-payments="[3]">
						  <label for="delivery_2" class="text">
							<p class="dart-order__delivery-title">Курьером до квартиры</p>
              <!--
              <div class="dart-order__time-price">
                <p>3 января</p>
                <p>бесплатно</p>
              </div>
              -->
              </label>
            </a>
						<a class="dart-btn dart-btn-radio-mini" data-checked="">
							<input type="radio" name="delivery" value="3" id="delivery_3" data-payments="[3]">
							<label for="delivery_3" class="text">
							<p class="dart-order__delivery-title">Доставка в пункт выдачи</p>
              <!--
              <div class="dart-order__time-price">
                <p>3 января</p>
                <p>бесплатно</p>
              </div>
              -->
						  </label>
						</a>
					</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Counter from './Counter.vue';
  import { mapActions, mapGetters } from "vuex";
export default {
  name: 'BasketModal',
  props: {
    modal: {
      type: Boolean,
      default: false
    },
  },
  model: {
    prop: 'modal',
    event: 'update:modal'
  },
  components: {
    Counter
  },
  computed: {
      ...mapGetters([
        'basket',
        'cost'
      ]),
    },
    mounted() {
      this.get_basket_api({
        action: "get"
      }).finally(() => this.loading_basket = false)
    },
    updated() {

    },
    methods: {
      ...mapActions([
        'get_basket_api',
        'basket_api'
      ]),
      closeModal() {
        this.$emit('update:modal', false);
      },
      addBasket(product_id){
        this.loading = true
        this.basket_api({
          action: 'add',
          product_id: product_id,
          count: 1,
          store: 48,
          org: 1
        }).finally(() => {this.loading = false})
      },
      handleCountChange(count, key){
        this.basket_api({
          action: 'change',
          key: key,
          count: count
        })
        this.loading = false
      },
      deleteProduct(key){
        this.loading = true
        this.basket_api({
          action: 'delete',
          key: key,
        }).finally(() => {this.loading = false})
      },
      clearBasket(key){
        this.loading = true
        this.basket_api({
          action: 'delete'
        }).finally(() => {this.loading = false})
      }
    },
}
</script>