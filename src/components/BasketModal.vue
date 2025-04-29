<template>
  <div class="dart-order" @click="closeModal" :class="{ show: modal }">
    <div class="dart-order__content" @click.stop>
      <div class="dart-order__title">
        <span class="h1-mini">Оформление заказа</span>
        <div @click="closeModal" class="btn-close link-no-style">
        </div>
      </div>
      <div class="dart-order__container">
        <div class="dart-order__left js-order-cart" :class="{'cursornone': this.loading_global}">
          <template v-for="org in basket" :key="org.id">
            <template v-for="store in org.data" :key="store.id">
              <div class="dart-order__el">
                <h3>Заказ из магазина {{ org.org.name }}</h3>
                <div class="dart-order__info dart-order__info-mt">
                  <img
                    :src="
                      'https://mst.tools/assets/content/' + store.data.image
                    "
                    alt=""
                  />
                  <p class="dart-shop-address" style="background: #50c0e6">
                    {{ store.data.address_short }}
                  </p>
                </div>
                <div>
                  <template v-for="product in store.products" :key="product.id">
                    <div class="dart-procuct-cart product-item">
                      <meta itemprop="orderQuantity" :content="product.count" />
                      <meta itemprop="identifier" :content="product.id" />
                      <meta itemprop="name" :content="product.pagetitle" />
                      <meta
                        itemprop="description"
                        :content="product.description"
                      />
                      <meta
                        itemprop="brand"
                        :content="product['vendor.name']"
                      />
                      <div
                        itemprop="offers"
                        itemscope
                        itemtype="http://schema.org/Offer"
                      >
                        <meta itemprop="price" :content="product.price" />
                        <meta itemprop="priceCurrency" content="RUB" />
                      </div>
                      <a :href="product.uri" class="dart-procuct-cart__img">
                        <img
                          v-if="product.image"
                          :src="'https://mst.tools' + product.image"
                          :alt="product.pagetitle"
                        />
                        <img
                          v-else
                          src="https://mst.tools/assets/files/img/nopic.png"
                          :alt="product.pagetitle"
                        />
                      </a>
                      <div class="dart-procuct-cart__info">
                        <div class="dart-procuct-cart__title">
                          <a :href="product.uri">{{ product.pagetitle }}</a>
                          <a
                            @click="deleteProduct(product.key)"
                            class="btn-close link-no-style"
                            ></a>
                        </div>
                        <p class="dart-procuct-cart__article">
                          {{ product?.article }}
                        </p>
                        <div class="dart-procuct-cart__count">
                          <p>
                            В наличии
                            <span>{{ product.remain.remains }} шт.</span>
                          </p>
                        </div>
                        <div class="dart-procuct-cart__price">
                          <Counter
                            :min="0"
                            :max="product.remain.remains"
                            :initial="product.count"
                            :keyProduct="product.key"
                            @change="handleCountChange"
                          />
                          <div class="order-product-price-and-bonus">
                            <div class="product-price-order">
                              <p>
                                {{ Number(product.price).toLocaleString("ru") }}
                                ₽
                              </p>
                            </div>
                            <!-- <div class="order-product-bonus">
                              +{{
                                Math.round(
                                  (product.price / 100) * 2
                                ).toLocaleString("ru")
                              }}
                              <img
                                src="https://mst.tools/assets/templates/img/icons/bonus.svg"
                                alt="Бонусы"
                              />
                              за покупку
                            </div> -->
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
          <form>
            <h3>Способы получения</h3>
            <div class="dart-order__delivery-methods" id="deliveries">
              <a
                class="dart-btn dart-btn-radio-mini"
                :class="{ active: this.deliveryMethod === 1 }"
                @click.prevent="handleDeliveryClick(1)"
              >
                <input
                  type="radio"
                  name="delivery"
                  value="1"
                  id="delivery_1"
                  :checked="deliveryMethod === 1"
                  readonly
                />
                <label for="delivery_1" class="text">
                  <div class="dart-order__delivery-title">Самовывоз</div>
                </label>
              </a>
              <a
                class="dart-btn dart-btn-radio-mini"
                :class="{ active: this.deliveryMethod === 2 }"
                @click.prevent="handleDeliveryClick(2)"
              >
                <input
                  type="radio"
                  name="delivery"
                  value="2"
                  id="delivery_2"
                  :checked="deliveryMethod === 2"
                  readonly
                />
                <label for="delivery_2" class="text">
                  <div class="dart-order__delivery-title">Курьером до квартиры</div>
                </label>
              </a>
              <a
                class="dart-btn dart-btn-radio-mini"
                :class="{ active: this.deliveryMethod === 3 }"
                @click.prevent="handleDeliveryClick(3)"
              >
                <input
                  type="radio"
                  name="delivery"
                  value="3"
                  id="delivery_3"
                  :checked="deliveryMethod === 3"
                  readonly
                />
                <label for="delivery_3" class="text">
                  <div class="dart-order__delivery-title">Доставка в пункт выдачи</div>
                </label>
              </a>
            </div>

            <h3 class="mt-3" v-if="this.deliveryMethod == 2 || this.deliveryMethod == 3">Адрес доставки</h3>
            <div v-if="this.deliveryMethod == 2">
              <a @click="() => {
                if(!this.loading_global){
                  this.modalAdress = true
                }
              }" class="dart-btn dart-btn-choice mt-2 dart-modal-toggler" data-dart-modal="dm-my-addres" style="width: 100%;">
                <p v-if="!this.address" class="text_address">Выбрать адрес доставки</p>
                <p v-else class="text_address text-black ellipsis">{{ this.address.text_address }}<span v-if="this.address.room"> кв. {{this.address.room}},</span> <span v-if="this.address.entrance">под. {{this.address.entrance}},</span><span v-if="this.address.floor"> эт. {{this.address.floor}} </span></p>
                <svg v-if="!this.address" class="styles-module-icon-JSbNo" data-icon-name="ArrowRight" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="height: 20px;"><path d="M6.91412 3.57408C6.58869 3.89952 6.58869 4.42715 6.91412 4.75259L12.1582 9.99667L6.91412 15.2407C6.58869 15.5662 6.58869 16.0938 6.91412 16.4193C7.23956 16.7447 7.7672 16.7447 8.09263 16.4193L13.926 10.5859C14.2514 10.2605 14.2514 9.73285 13.926 9.40741L8.09263 3.57408C7.7672 3.24864 7.23956 3.24864 6.91412 3.57408Z"></path></svg>
                <svg v-else class="styles-module-icon-JSbNo" data-icon-name="CheckRound" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="height: 20px;"><path d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM14.5657 8.16569C14.8781 7.85327 14.8781 7.34673 14.5657 7.03431C14.2533 6.7219 13.7467 6.7219 13.4343 7.03431L9.2 11.2686L7.36568 9.43431C7.05327 9.12189 6.54673 9.12189 6.23431 9.43431C5.9219 9.74673 5.9219 10.2533 6.23431 10.5657L8.63432 12.9657C8.94673 13.2781 9.45327 13.2781 9.76569 12.9657L14.5657 8.16569Z"></path></svg>
              </a>
            </div>


            <div v-if="this.deliveryMethod == 3">
              <a @click="() => {
                if(!this.loading_global){
                  this.modalPoints = true
                }
              }" class="dart-btn dart-btn-choice mt-2 dart-modal-toggler" data-dart-modal="dm-my-addres" style="width: 100%;">
                <p v-if="!this.point" class="text_address">Выбрать пункт выдачи</p>
                <p v-else class="text_address text-black">{{ this.point?.point?.owner_code == "CDEK"? "СДЭК" : null }}, {{ this.point?.point?.location?.address }}</p>
                <svg v-if="!this.point" class="styles-module-icon-JSbNo" data-icon-name="ArrowRight" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="height: 20px;"><path d="M6.91412 3.57408C6.58869 3.89952 6.58869 4.42715 6.91412 4.75259L12.1582 9.99667L6.91412 15.2407C6.58869 15.5662 6.58869 16.0938 6.91412 16.4193C7.23956 16.7447 7.7672 16.7447 8.09263 16.4193L13.926 10.5859C14.2514 10.2605 14.2514 9.73285 13.926 9.40741L8.09263 3.57408C7.7672 3.24864 7.23956 3.24864 6.91412 3.57408Z"></path></svg>
                <svg v-else class="styles-module-icon-JSbNo" data-icon-name="CheckRound" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="height: 20px;"><path d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM14.5657 8.16569C14.8781 7.85327 14.8781 7.34673 14.5657 7.03431C14.2533 6.7219 13.7467 6.7219 13.4343 7.03431L9.2 11.2686L7.36568 9.43431C7.05327 9.12189 6.54673 9.12189 6.23431 9.43431C5.9219 9.74673 5.9219 10.2533 6.23431 10.5657L8.63432 12.9657C8.94673 13.2781 9.45327 13.2781 9.76569 12.9657L14.5657 8.16569Z"></path></svg>
              </a>
            </div>

            <h3 class="mt-3" v-if="this.deliveryMethod == 2 && this.address">Курьерская служба</h3>
            <div v-if="this.deliveryMethod == 2 && this.address" class="kenost-courier-delivery">
              <template v-if="this.loading_courier && !Object.keys(this.delivery_courier).length">
                <div class="kenost-courier-delivery__card">
                  <div>
                    <div class="kenost-skeleton kenost-skeleton__image"></div>
                    <div class="kenost-skeleton kenost-skeleton__name"></div>
                    <div class="kenost-skeleton kenost-skeleton__price"></div>
                  </div>
                </div>
                <div class="kenost-courier-delivery__card">
                  <div>
                    <div class="kenost-skeleton kenost-skeleton__image"></div>
                    <div class="kenost-skeleton kenost-skeleton__name"></div>
                    <div class="kenost-skeleton kenost-skeleton__price"></div>
                  </div>
                </div>
                <div class="kenost-courier-delivery__card">
                  <div>
                    <div class="kenost-skeleton kenost-skeleton__image"></div>
                    <div class="kenost-skeleton kenost-skeleton__name"></div>
                    <div class="kenost-skeleton kenost-skeleton__price"></div>
                  </div>
                </div>
              </template>
              
              <template v-else v-for="delivery in delivery_courier" :key="delivery.code">
                <button v-if="delivery.price" type="button" :disabled="this.loading_courier" @click="selectCourier(delivery)" class="kenost-courier-delivery__card" :class="{'active': delivery.code == this.courier?.code}">
                  <div v-if="loading_courier">
                    <div class="kenost-skeleton kenost-skeleton__image"></div>
                    <div class="kenost-skeleton kenost-skeleton__name"></div>
                    <div class="kenost-skeleton kenost-skeleton__price"></div>
                  </div>
                  <template v-else>
                    <img class="kenost-courier-delivery__image" :src="'https://mst.tools'+delivery.logo" alt="">
                    <div class="kenost-courier-delivery__name" >{{ delivery.name }}</div>
                    <div class="kenost-courier-delivery__info">
                      <div class="kenost-courier-delivery__price" :class="{'kenost-courier-delivery__best': delivery.best}">{{(delivery.price).toLocaleString('ru')}} ₽</div>
                      · 
                      <div class="kenost-courier-delivery__time" v-if="delivery.time == 'express'">Как можно скорее</div>
                      <div class="kenost-courier-delivery__time" v-else-if="delivery.time">{{pluralizeDays(delivery.time)}}</div>
                    </div>
                    <svg v-if="delivery.code == this.courier?.code" class="kenost-courier-delivery__icon" data-icon-name="CheckRound" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="height: 20px;"><path d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM14.5657 8.16569C14.8781 7.85327 14.8781 7.34673 14.5657 7.03431C14.2533 6.7219 13.7467 6.7219 13.4343 7.03431L9.2 11.2686L7.36568 9.43431C7.05327 9.12189 6.54673 9.12189 6.23431 9.43431C5.9219 9.74673 5.9219 10.2533 6.23431 10.5657L8.63432 12.9657C8.94673 13.2781 9.45327 13.2781 9.76569 12.9657L14.5657 8.16569Z"></path></svg>
                  </template>
                  
                </button>
              </template>
            </div>


            <div class="dart-order__inputs-container">
              <div class="dart-order__all-delivery">
                <h3>Получатель</h3>
                <div class="dart-input dart-input-text mt-2" :class="{'kenost-error': errors.receiver}">
                  <input
                    type="text"
                    name="receiver"
                    id="order_receiver"
                    :disabled="this.loading_global"
                    v-model="orderData.receiver"
                    placeholder="Иванов Иван Иванович"
                    class="required"
                    @blur="() => {
                      validateField('receiver')
                      orderAdd('receiver')
                    }"
                  />
                  <span class="error-message" v-if="errors.receiver">{{
                    errors.receiver
                  }}</span>
                </div>
                <div class="dart-input dart-input-text mt-2" :class="{'kenost-error': errors.email}">
                  <input
                    type="email"
                    name="email"
                    id="order_email"
                    v-model="orderData.email"
                    :disabled="this.loading_global"
                    placeholder="example@example.com"
                    class="required"
                    @blur="() => {
                      validateEmail
                      orderAdd('email')
                    }"
                  />
                  <span class="error-message" v-if="errors.email">{{
                    errors.email
                  }}</span>
                </div>
                <div class="dart-input dart-input-text mt-2" :class="{'kenost-error': errors.phone}">
                  <input
                    type="text"
                    name="phone"
                    id="order_phone"
                    ref="phoneInput"
                    v-model="orderData.phone"
                    :disabled="loading_global"
                    @blur="() => {
                      validatePhone();
                      orderAdd('phone');
                    }"
                    placeholder="+7 999 123-45-67"
                  />

                  <span class="error-message" v-if="errors.phone">{{
                    errors.phone
                  }}</span>
                </div>
              </div>
            </div>
          </form>
          <div class="dart-order__oplata">
            <div class="dart-order__info-oplata">
              <!-- <div class="dart-order__list dart-order__list-border">
                <b>Бонусов будет начислено</b>
                <b class="dart-order__list-bonus"
                  ><span id="ms2_order_cart_bonus"
                    >+{{
                      Math.round((cost / 100) * 2).toLocaleString("ru")
                    }}</span
                  ><img
                    src="https://mst.tools/assets/templates/img/icons/bonus.svg"
                    alt="Бонусы MachineStore"
                /></b>
              </div> -->
              <div class="dart-order__list">
                <b>Товары</b>
                <b
                  ><span id="ms2_order_cart_cost">{{
                    Number(cost).toLocaleString("ru")
                  }}</span>
                  ₽</b
                >
              </div>
              <div class="dart-order__list">
                <b>Доставка</b>
                <b v-if="this.deliveryMethod == 2 && this.courier"><span id="ms2_order_delivery_cost">{{ Number(this.courier.price).toLocaleString('ru') }}</span> ₽</b>
                <b v-else-if="this.deliveryMethod == 3 && this.point"><span id="ms2_order_delivery_cost">{{ Number(this.point.cost.price).toLocaleString('ru') }}</span> ₽</b>
                <b v-else><span id="ms2_order_delivery_cost">0</span> ₽</b>
              </div>
              <!-- <div class="dart-order__list dart-order__list-border">
                <div class="dart-cheackbox-container">
                  <input
                    class="dart-cheackbox"
                    id="debiting-bonus"
                    type="checkbox"
                    name="debiting-bonus"
                  />
                  <label for="debiting-bonus"><b>Списать бонусы?</b></label>
                </div>

                <b id="ms2_order_cart_bonus_apply"> </b>
              </div> -->
              <b id="ms2_order_cart_bonus_apply"><b> </b></b>
            </div>
            <b id="ms2_order_cart_bonus_apply"
              ><b>
                <div class="summary-block__title"></div>
                <div
                  class="dart-order__promo"
                  :class="{
                    active: this.orderData.promocode,
                    apply: this.orderData.activePromo,
                  }"
                >
                  <div class="dart-input dart-input-text">
                    <input
                      :disabled="this.orderData.activePromo || this.loading_global"
                      type="text"
                      placeholder="Промокод"
                      name="promocode"
                      v-model="this.orderData.promocode"
                    />
                  </div>
                  <div class="dart-order__promo-button" @click="changePromo()">
                    <a class="dart-btn dart-btn-secondary-mini">{{
                      this.orderData.activePromo ? "Удалить" : "Применить"
                    }}</a>
                  </div>
                </div>
                <button
                  @click="submit"
                  class="dart-btn dart-btn-primary btn-arrange pseudo_submit"
                  :disabled="loading" :class="{loading: loading}"
                >
                <span class="dot-loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                <span class="dot-loader-none">Оплатить</span>
                  <span class="dot-loader-none">
                    <span v-if="this.deliveryMethod == 2 && this.courier">{{(Number(cost) + Number(this.courier.price)).toLocaleString("ru")}}</span>
                    <span v-else-if="this.deliveryMethod == 3 && this.point">{{(Number(cost) + this.point.cost.price).toLocaleString("ru")}}</span>
                    <span v-else>{{(Number(cost)).toLocaleString("ru")}}</span>
                    ₽</span>
                </button>
              </b></b
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <Points :modal="modalPoints"  @update:modal="this.modalPoints = $event" @update:point="this.point = $event"/>
  <Adress :modal="modalAdress" @update:modal="this.modalAdress = $event" @update:address="this.address = $event"/>
</template>

<script>
import Counter from "./Counter.vue";
import Points from "./Points.vue"
import Adress from "./Adress.vue"
import { mapActions, mapGetters } from "vuex";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Cleave from 'cleave.js';
import 'cleave.js/dist/addons/cleave-phone.ru';

export default {
  name: "BasketModal",
  components: {
    Counter,
    Points,
    Adress
  },
  props: {
    modal: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: "modal",
    event: "update:modal",
  },
  data() {
    return {
      modalPoints: false,
      modalAdress: false,
      deliveryMethod: 1,
      point: null,
      address: null,
      courier: null,
      loading_courier: false,
      orderData: {
        receiver: "",
        email: "",
        phone: "",
        promocode: "",
        activePromo: false,
      },
      errors: {
        receiver: "",
        email: "",
        phone: "",
      },
      loading: false,
      loading_global: false
    };
  },
  computed: {
    ...mapGetters(["basket", "cost", "delivery_courier"]),
  },
  mounted() {
    this.get_basket_api({
      action: "basket/get",
    }).finally(() => (this.loading = false));

    this.phoneMask = new Cleave(this.$refs.phoneInput, {
      phone: true,
      phoneRegionCode: 'RU',
      prefix: '+7',
      noImmediatePrefix: false,
      delimiters: ['(', ') ', '-', '-'],
      blocks: [2, 3, 3, 2, 2],
      numericOnly: true
    });
  },
  methods: {
    ...mapActions([
      "get_basket_api",
      "basket_api",
      "delivery_courier_api",
      "marketplace_response_api"
    ]),
    pluralizeDays(n) {
      const mod10 = n % 10;
      const mod100 = n % 100;

      if (mod10 === 1 && mod100 !== 11) {
        return `от ${n} дня`;
      } else {
        return `от ${n} дней`;
      }
    },
    handleDeliveryClick(value) {
      if (!this.loading_global) {
        this.deliveryMethod = value;
      }
    },
    closeModal() {
      if(this.loading_global){
        return
      }
      this.$emit("update:modal", false);
    },
    changePromo() {
      if (this.orderData.activePromo) {
        this.orderData.promocode = "";
      }

      this.orderData.activePromo = !this.orderData.activePromo;
    },
    addBasket(product_id) {
      this.loading = true;
      this.basket_api({
        action: "basket/add",
        product_id: product_id,
        count: 1,
        store: 48,
        org: 1,
      }).finally(() => {
        this.loading = false;
      });
    },

    handleCountChange(count, key) {
      this.loading = true;
      this.basket_api({
        action: "basket/change",
        key: key,
        count: count,
      }).finally(() => {
        this.loading = false;
      });
    },

    deleteProduct(key) {
      this.loading = true;
      this.basket_api({
        action: "basket/delete",
        key: key,
      }).finally(() => {
        this.loading = false;
      });
    },

    clearBasket() {
      this.loading = true;
      this.basket_api({
        action: "basket/delete",
      }).finally(() => {
        this.loading = false;
      });
    },

    // Валидация телефона
    validatePhone() {
      let phoneDigits = (this.orderData.phone || '').replace(/\D/g, '');

      // Если больше 11 цифр — обрезаем лишнее
      if (phoneDigits.length > 11) {
        phoneDigits = phoneDigits.substring(0, 11);
      }

      if (phoneDigits.length !== 11 || !phoneDigits.startsWith('7')) {
        this.errors.phone = "Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX";
      } else {
        this.errors.phone = "";
      }
    },

    // Валидация email
    validateEmail() {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(this.orderData.email)) {
        this.errors.email = "Введите корректную почту";
      } else {
        this.errors.email = "";
      }
    },

    orderAdd(field, value){
      switch(field){
        case 'receiver': {
          if (this.orderData.receiver == "") {
            break;
          }
          this.marketplace_response_api({
            action: "order/add",
            key: "receiver",
            value: this.orderData.receiver
          })
          break;
        }
        case 'email': {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!re.test(this.orderData.email)) {
            break;
          }
          this.marketplace_response_api({
            action: "order/add",
            key: "email",
            value: this.orderData.email
          })
          break;
        }
        case 'phone': {
          const phoneDigits = this.orderData.phone.replace(/\D/g, "");
          if (phoneDigits.length !== 11) {
            break;
          }

          const regExp = /[\*\%#&\$\s]/g;
          const phoneClean = this.orderData.phone.replace(regExp, '');
          this.marketplace_response_api({
            action: "order/add",
            key: "phone",
            value: phoneClean
          })
          break;
        }
        case 'delivery_data': {
          let delivery_data = {};
          //delivery_data
          if(this.deliveryMethod == 2){
            delivery_data = {
              service: {
                main_key: this.courier?.code,
                method: 'door', //Доставка курьером
                delivery: this.deliveryMethod, //ID из msDelivery - в нашем случае совпадает с this.deliveryMethod
                address: this.address.text_address,
              }
            }

            delivery_data.service[this.courier?.code] = {
              price: {
                door: {
                  price: this.courier.price,
                  time: this.courier.time
                }
              }
            }
          } else if(this.deliveryMethod == 3){
            delivery_data = {
              service: {
                main_key: this.point.code,
                method: 'terminal', //Доставка курьером
                delivery: this.deliveryMethod, //ID из msDelivery - в нашем случае совпадает с this.deliveryMethod
                address: this.point.point.location.address,
              }
            }

            delivery_data.service[this.point.code] = {
              price: {
                terminal: {
                  price: this.point.cost.price,
                  time: this.point.cost.time
                }
              }
            }
          }

          this.marketplace_response_api({
            action: "order/add",
            key: "my_delivery_data",
            value: JSON.stringify(delivery_data)
          })
          break;
        }
        
        default:{
          this.marketplace_response_api({
            action: "order/add",
            key: field,
            value: value
          })
          break;
        }
      }
    },
    // Общая валидация поля
    validateField(field) {
      if (!this.orderData[field].trim()) {
        this.errors[field] = "Это поле обязательно для заполнения";
      } else {
        this.errors[field] = "";
      }
    },

    //Выбор курьерской службы
    selectCourier(item){
      this.courier = item;
      this.orderAdd('delivery_data')
    },

    submit() {
      this.loading_global = true
      this.loading = true
      this.validateField("receiver");
      this.validatePhone();
      this.validateEmail();

      // Проверка обязательных полей
      const hasErrors = this.errors.receiver || this.errors.phone || this.errors.email;

      if (hasErrors) {
        toast("Пожалуйста, заполните все обязательные поля корректно.", {
          autoClose: 3000,
          type: "error",
        });
        this.loading = false
        this.loading_global = false
        return;
      }

      // Проверка способа доставки
      if (this.deliveryMethod === 2 && !this.address) {
        toast("Выберите адрес доставки.", {
          autoClose: 3000,
          type: "error",
        });
        this.loading = false
        this.loading_global = false
        return;
      }

      if (this.deliveryMethod === 3 && !this.point) {
        toast("Выберите пункт выдачи.", {
          autoClose: 3000,
          type: "error",
        });
        this.loading = false
        this.loading_global = false
        return;
      }

      this.orderAdd('payment', 3)
      this.orderAdd('delivery', this.deliveryMethod)

      if(this.deliveryMethod == 2){
        if(this.address.postal_code){
          this.orderAdd('index', this.address.postal_code)
        }
        if(this.address.region){
          this.orderAdd('region', this.address.region)
        }
        if(this.address.city){
          this.orderAdd('city', this.address.city)
        }
        if(this.address.street){
          this.orderAdd('street', this.address.street)
        }
        if(this.address.entrance){
          this.orderAdd('entrance', this.address.entrance)
        }
        if(this.address.floor){
          this.orderAdd('floor', this.address.floor)
        }
        if(this.address.room){
          this.orderAdd('room', this.address.room)
        }
        if(this.address.text_address){
          this.orderAdd('text_address', this.address.text_address)
        }
      }

      if(this.deliveryMethod == 3){
        if(this.point?.code == "cdek"){
          if(this.point?.point?.location?.postal_code){
            this.orderAdd('index', this.point?.point?.location?.postal_code)
          }
          if(this.point?.point?.location?.region){
            this.orderAdd('region', this.point?.point?.location?.region)
          }
          if(this.point?.point?.location?.city){
            this.orderAdd('city', this.point?.point?.location?.city)
          }
          if(this.point?.point?.location?.address){
            this.orderAdd('street', this.point?.point?.location?.address)
          }
          if(this.point?.point?.location?.address_full){
            this.orderAdd('text_address', this.point?.point?.location?.address_full)
          }
        }
      }

      // Всё в порядке — отправка заказа
      // this.loading = true;

      const regExp = /[\*\%#&\$\s]/g;
      const phoneClean = this.orderData.phone.replace(regExp, '');

      let delivery_data = {};
      //delivery_data
      if(this.deliveryMethod == 2){
        delivery_data = {
          service: {
            main_key: this.courier.code,
            method: 'door', //Доставка курьером
            delivery: this.deliveryMethod, //ID из msDelivery - в нашем случае совпадает с this.deliveryMethod
            address: this.address.text_address,
          }
        }

        delivery_data.service[this.courier.code] = {
          price: {
            door: {
              price: this.courier.price,
              time: this.courier.time
            }
          }
        }
      } else if(this.deliveryMethod == 3){
        delivery_data = {
          service: {
            main_key: this.point.code,
            method: 'terminal', //Доставка курьером
            delivery: this.deliveryMethod, //ID из msDelivery - в нашем случае совпадает с this.deliveryMethod
            address: this.point.point.location.address,
          }
        }

        delivery_data.service[this.point.code] = {
          price: {
            terminal: {
              price: this.point.cost.price,
              time: this.point.cost.time
            }
          }
        }
      }

      const data = {
        receiver: this.orderData.receiver,
        email: this.orderData.email,
        phone: phoneClean,
        delivery: this.deliveryMethod,
        payment: 3,
        delivery_data: delivery_data
      }

      this.marketplace_response_api({
        action: 'order/submit',
        data: data
      }).then((res) => {
        console.log(res?.data?.data?.data?.redirect)
        if(res?.data?.data?.data?.redirect){
          window.location.href = res?.data?.data?.data?.redirect;
        }
      }).finally(() => {
        this.loading = false
        this.loading_global = false
      })

      // setTimeout(() => {
      //   this.loading = false;
      //   toast("Заказ успешно оформлен!", {
      //     autoClose: 3000,
      //     type: "success",
      //   });
      //   this.closeModal();
      // }, 1000);
    }


  },
  watch: {
		address(newVal) {
      this.loading = true
      // Отправляем запрос на получение доставок курьером
      this.loading_courier = true
      this.delivery_courier_api({
        action: "courier",
        address_id: this.address.id
      }).finally(() => {
        this.loading_courier = false
        this.loading = false
      })
		},
    delivery_courier: {
			handler(newVal) {
				if (newVal) {
          if(Object.values(newVal)[0]?.price){
            this.courier = Object.values(newVal)[0];
          }
          this.orderAdd('delivery_data')
				}
			},
			deep: true,
			immediate: true // если хочешь, чтобы сработал при первом рендере
		},
    cost (newVal) {
      if(newVal == 0){
        this.closeModal();
      }
      if(this.address){
        this.loading = true
        //Обновляем цену доставки курьером
        this.loading_courier = true
        this.delivery_courier_api({
          action: "courier",
          address_id: this.address.id
        }).finally(() => {
          this.loading_courier = false
          this.loading = false
        })
      }
      if(this.point){
        this.loading = true
        //Обновляем цену доставки в ПВЗ
        this.marketplace_response_api({
          action: 'points',
          cost: true
        }).then((res) => {
          this.point.cost = res?.data?.data[this.point.code]?.cost
        }).finally(() => this.loading = false)
        this.orderAdd('delivery_data')
      }
    }
	}
};
</script>

<style scoped></style>
