<template>
  <div class="dart-order" @click="closeModal" :class="{ show: modal }">
    <div class="dart-order__content" @click.stop>
      <div class="dart-order__title">
        <span class="h1-mini">Оформление заказа</span>
        <div @click="closeModal" class="btn-close link-no-style">
        </div>
      </div>
      <div class="dart-order__container">
        <div class="dart-order__left js-order-cart">
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
                            <div class="order-product-bonus">
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
          <form>
            <h3>Способы получения</h3>
            <div class="dart-order__delivery-methods" id="deliveries">
              <a
                class="dart-btn dart-btn-radio-mini"
                :class="{ active: this.deliveryMethod === 1 }"
                @click="this.deliveryMethod = 1"
              >
                <input
                  type="radio"
                  name="delivery"
                  value="1"
                  id="delivery_1"
                  v-model="this.deliveryMethod"
                />
                <label for="delivery_1" class="text">
                  <div class="dart-order__delivery-title">Самовывоз</div>
                </label>
              </a>
              <a
                class="dart-btn dart-btn-radio-mini"
                :class="{ active: this.deliveryMethod === 2 }"
                @click="this.deliveryMethod = 2"
              >
                <input
                  type="radio"
                  name="delivery"
                  value="2"
                  id="delivery_2"
                  v-model="this.deliveryMethod"
                />
                <label for="delivery_2" class="text">
                  <div class="dart-order__delivery-title">Курьером до квартиры</div>
                </label>
              </a>
              <a
                class="dart-btn dart-btn-radio-mini"
                :class="{ active: this.deliveryMethod === 3 }"
                @click="this.deliveryMethod = 3"
              >
                <input
                  type="radio"
                  name="delivery"
                  value="3"
                  id="delivery_3"
                  v-model="this.deliveryMethod"
                />
                <label for="delivery_3" class="text">
                  <div class="dart-order__delivery-title">
                    Доставка в пункт выдачи
                  </div>
                </label>
              </a>
            </div>

            <h3 class="mt-3" v-if="this.deliveryMethod == 2 || this.deliveryMethod == 3">Адрес доставки</h3>
            <div v-if="this.deliveryMethod == 2">
              <a @click="this.modalAdress = true" class="dart-btn dart-btn-choice mt-2 dart-modal-toggler" data-dart-modal="dm-my-addres" style="width: 100%;">
                <p v-if="!this.address" class="text_address">Выбрать адрес доставки</p>
                <p v-else class="text_address text-black ellipsis">{{ this.address.text_address }}<span v-if="this.address.room"> кв. {{this.address.room}},</span> <span v-if="this.address.entrance">под. {{this.address.entrance}},</span><span v-if="this.address.floor"> эт. {{this.address.floor}} </span></p>
                <svg v-if="!this.address" class="styles-module-icon-JSbNo" data-icon-name="ArrowRight" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="height: 20px;"><path d="M6.91412 3.57408C6.58869 3.89952 6.58869 4.42715 6.91412 4.75259L12.1582 9.99667L6.91412 15.2407C6.58869 15.5662 6.58869 16.0938 6.91412 16.4193C7.23956 16.7447 7.7672 16.7447 8.09263 16.4193L13.926 10.5859C14.2514 10.2605 14.2514 9.73285 13.926 9.40741L8.09263 3.57408C7.7672 3.24864 7.23956 3.24864 6.91412 3.57408Z"></path></svg>
                <svg v-else class="styles-module-icon-JSbNo" data-icon-name="CheckRound" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="height: 20px;"><path d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM14.5657 8.16569C14.8781 7.85327 14.8781 7.34673 14.5657 7.03431C14.2533 6.7219 13.7467 6.7219 13.4343 7.03431L9.2 11.2686L7.36568 9.43431C7.05327 9.12189 6.54673 9.12189 6.23431 9.43431C5.9219 9.74673 5.9219 10.2533 6.23431 10.5657L8.63432 12.9657C8.94673 13.2781 9.45327 13.2781 9.76569 12.9657L14.5657 8.16569Z"></path></svg>
              </a>
            </div>


            <div v-if="this.deliveryMethod == 3">
              <a @click="this.modalPoints = true" class="dart-btn dart-btn-choice mt-2 dart-modal-toggler" data-dart-modal="dm-my-addres" style="width: 100%;">
                <p v-if="!this.point" class="text_address">Выбрать пункт выдачи</p>
                <p v-else class="text_address text-black">{{ this.point?.point?.owner_code == "CDEK"? "СДЭК" : null }}, {{ this.point?.point?.location?.address }}</p>
                <svg v-if="!this.point" class="styles-module-icon-JSbNo" data-icon-name="ArrowRight" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="height: 20px;"><path d="M6.91412 3.57408C6.58869 3.89952 6.58869 4.42715 6.91412 4.75259L12.1582 9.99667L6.91412 15.2407C6.58869 15.5662 6.58869 16.0938 6.91412 16.4193C7.23956 16.7447 7.7672 16.7447 8.09263 16.4193L13.926 10.5859C14.2514 10.2605 14.2514 9.73285 13.926 9.40741L8.09263 3.57408C7.7672 3.24864 7.23956 3.24864 6.91412 3.57408Z"></path></svg>
                <svg v-else class="styles-module-icon-JSbNo" data-icon-name="CheckRound" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="height: 20px;"><path d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM14.5657 8.16569C14.8781 7.85327 14.8781 7.34673 14.5657 7.03431C14.2533 6.7219 13.7467 6.7219 13.4343 7.03431L9.2 11.2686L7.36568 9.43431C7.05327 9.12189 6.54673 9.12189 6.23431 9.43431C5.9219 9.74673 5.9219 10.2533 6.23431 10.5657L8.63432 12.9657C8.94673 13.2781 9.45327 13.2781 9.76569 12.9657L14.5657 8.16569Z"></path></svg>
              </a>
            </div>

            <div class="dart-order__inputs-container">
              <div class="dart-order__all-delivery">
                <h3>Получатель</h3>
                <div class="dart-input dart-input-text mt-2" :class="{'kenost-error': errors.receiver}">
                  <input
                    type="text"
                    name="receiver"
                    id="order_receiver"
                    v-model="orderData.receiver"
                    placeholder="Иванов Иван Иванович"
                    class="required"
                    @blur="validateField('receiver')"
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
                    placeholder="example@example.com"
                    class="required"
                    @blur="validateEmail"
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
                    v-model="orderData.phone"
                    @input="formatPhone"
                    @blur="validatePhone"
                    placeholder="+7 999 123-45-67"
                    maxlength="18"
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
              <div class="dart-order__list dart-order__list-border">
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
              </div>
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
                <b v-if="this.deliveryMethod == 2 && this.address"><span id="ms2_order_delivery_cost">9999999</span> ₽</b>
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
                      :disabled="this.orderData.activePromo"
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
                  class="dart-btn dart-btn-primary btn-arrange pseudo_submit"
                >
                  Оплатить
                  <span>
                    <span v-if="this.deliveryMethod == 2 && this.address">{{(Number(cost)).toLocaleString("ru")}}</span>
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
  {{ address }}
  {{ point }}
</template>

<script>
import Counter from "./Counter.vue";
import Points from "./Points.vue"
import Adress from "./Adress.vue"
import { mapActions, mapGetters } from "vuex";

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
    };
  },
  computed: {
    ...mapGetters(["basket", "cost"]),
  },
  mounted() {
    this.get_basket_api({
      action: "basket/get",
    }).finally(() => (this.loading = false));
  },
  methods: {
    ...mapActions(["get_basket_api", "basket_api"]),

    closeModal() {
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

    // Маска для телефона
    formatPhone(event) {
      let value = event.target.value.replace(/\D/g, "");
      let formattedValue = "+7 ";

      if (value.length > 1) {
        value = value.substring(1);
      }

      if (value.length > 0) {
        formattedValue += "(" + value.substring(0, 3);
      }
      if (value.length > 3) {
        formattedValue += ") " + value.substring(3, 6);
      }
      if (value.length > 6) {
        formattedValue += "-" + value.substring(6, 8);
      }
      if (value.length > 8) {
        formattedValue += "-" + value.substring(8, 10);
      }

      this.orderData.phone = formattedValue;
    },

    // Валидация телефона
    validatePhone() {
      const phoneDigits = this.orderData.phone.replace(/\D/g, "");
      if (phoneDigits.length !== 11) {
        this.errors.phone = "Введите корректный номер телефона";
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

    // Общая валидация поля
    validateField(field) {
      if (!this.orderData[field].trim()) {
        this.errors[field] = "Это поле обязательно для заполнения";
      } else {
        this.errors[field] = "";
      }
    },
  },
  watch: {
		address(newVal) {
      // Отправляем запрос на получение доставок курьером
			console.log(newVal)
		}
	}
};
</script>

<style scoped></style>
