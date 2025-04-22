<template>
  <div class="address" @click="closeModal" :class="{ show: modal }">
    <div class="address__content" @click.stop>
			<div class="address__content-scroll">
					<span class="h1-mini">Выберите адрес доставки</span>
					<div class="kenost-address" v-for="item in basket_address" @click="this.selectAddress = item">
						<div class="kenost-address__icon">
							<svg v-if="this.selectAddress?.id == item?.id" class="kenost-address__check" data-icon-name="CheckRound" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="height: 20px;"><path d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM14.5657 8.16569C14.8781 7.85327 14.8781 7.34673 14.5657 7.03431C14.2533 6.7219 13.7467 6.7219 13.4343 7.03431L9.2 11.2686L7.36568 9.43431C7.05327 9.12189 6.54673 9.12189 6.23431 9.43431C5.9219 9.74673 5.9219 10.2533 6.23431 10.5657L8.63432 12.9657C8.94673 13.2781 9.45327 13.2781 9.76569 12.9657L14.5657 8.16569Z"></path></svg>
							<div v-else class="kenost-address__check-null"></div>
						</div>
						<div class="kenost-address__text">
							<p class="kenost-address__text-big">{{ item.city }}, {{item.street}}, {{item.house}}</p>
							<p><span v-if="item.room">Квартира {{item.room}},</span> <span v-if="item.entrance">подъезд {{item.entrance}},</span><span v-if="item.floor"> этаж {{item.floor}},</span><span v-if="item.floor"> домофон {{item.doorphone}}</span></p>
						</div>
						<div class="kenost-address__action" @click.stop>
							<button :disabled="this.loadingIds.includes(item.id)" :class="{'load': this.loadingIds.includes(item.id)}" class="kenost-address__button" @click="() => {
								this.editAdressData = item
								this.editModal = true
							}">
								<span class="kenost-spinner"></span>
								<svg viewBox="0 0 24 24" name="edit" class="css-1cf5ojg"><path d="M17.96 2.54a1 1 0 0 0-1.42 0l-1.79 1.8 4.91 4.91 1.8-1.8a1 1 0 0 0 0-1.4l-3.5-3.5Zm.29 8.12-4.91-4.91-9.05 9.04a1 1 0 0 0-.23.37l-2 5.5a1 1 0 0 0 1.23 1.3l5-1.5a1 1 0 0 0 .42-.25l9.54-9.55Z"></path></svg>
							</button>
							<button :disabled="this.loadingIds.includes(item.id)" :class="{'load': this.loadingIds.includes(item.id)}" class="kenost-address__button" @click="deleteAddress(item)">
								<span class="kenost-spinner"></span>
								<svg viewBox="0 0 24 24" name="delete" class="css-1cf5ojg"><path d="M17 3h3c.6 0 1 .4 1 1v2H3V4c0-.6.4-1 1-1h3l.7-1.4c.2-.4.5-.6.9-.6h6.8c.4 0 .7.3.9.6L17 3ZM5 8l.9 13.1c.1.5.5.9 1.1.9h10.1c.5 0 1-.4 1-.9L19 8H5Z"></path></svg>
							</button>
						</div>
					</div>
					<button class="popup-btn-two mt-2" @click="() => {
						this.editAdressData = null
						this.editModal = true
					}">
						<!-- <svg viewBox="0 0 14 20" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_149_2063)"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.29968 11.6999L6.29969 16.7H7.69969L7.69968 11.6999H12.6998V10.2999H7.69968L7.69968 5.29999H6.29968L6.29968 10.2999H1.2998V11.6999H6.29968Z"></path></g><defs><clipPath id="clip0_149_2063"><rect width="14" height="20"></rect></clipPath></defs></svg> -->
						Добавить новый адресс
					</button>
					<button class="popup-btn mt-2" @click="chooseAddress()">Выбрать</button>
			</div>
    </div>
  </div>
  {{ this.editAdressData }}
	<AdressEdit :modal="editModal" @update:modal="this.editModal = $event" :address="this.editAdressData"/>
</template>

<script>
import AdressEdit from './EditAdress.vue'
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Address",
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
  point: {
    prop: "point",
    event: "update:point",
  },
  data() {
    return {
		selectAddress: null,
		editModal: false,
		editAdressData: null,
		loadingIds: []
	};
  },
  components: { AdressEdit },
  computed: {
    ...mapGetters(["basket_address"]),
  },
  mounted() {
    this.basket_my_address_api({
      action: "address/get",
    });
  },
  methods: {
    ...mapActions(["basket_my_address_api", "marketplace_response_api"]),
    closeModal() {
      this.$emit("update:modal", false);
    },
	chooseAddress(item) {
		this.$emit('update:address', this.selectAddress)
		this.closeModal()
	},
	deleteAddress(item){
		this.loadingIds.push(item.id)
		this.marketplace_response_api({
			action: "address/delete",
			id: item.id
		}).then(() => {
			this.basket_my_address_api({
				action: "address/get",
			})
		}).finally(() => {
			this.loadingIds = this.loadingIds.filter(el => el !== item.id);
		});
	}
  },
	watch: {
		basket_address(newVal) {
			if(newVal){
				this.selectAddress = newVal[0]
			}
		}
	}
};
</script>

<style scoped>

.kenost-address__icon{
	width: 30px;
}

.kenost-address__check{
	margin: 3px 3px 0px 5px;
}

.kenost-address{
	padding: 12px 12px 16px 14px;
	cursor: pointer;
	position: relative;
	display: flex;
	min-height: 55px;
}

.kenost-address:hover{
	background-color: #f5f5f5;
	border-radius: 16px;
}

.kenost-address:hover .kenost-address__action{
	opacity: 1;
}

.kenost-address__text{
	margin-left: 10px;
	color: rgb(117, 117, 117);
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	transition: all 0.3s;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.kenost-address__text-big{
	color: #000 !important;
	font-size: 18px !important;
	font-weight: 400 !important;
	line-height: 22px !important;
	transition: all 0.3s;
}

.kenost-address__text p{
	color: rgb(117, 117, 117);
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
}


.kenost-address__check-null{
	width: 16px;
	height: 16px;
	background: #e3e2e1;
	border-radius: 50%;
	margin: 3px 3px 0px 5px;
}

.kenost-address__action{
	position: absolute;
	display: flex;
	gap: 8px;
	right: 12px;
	transition: all 0.3s;
	opacity: 0;
}

.kenost-address__button{
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border: none;
	border-radius: 12px;
	background-color: rgb(255, 255, 255);
	cursor: pointer;
}

/* Спиннер */
.kenost-spinner {
	width: 16px;
	height: 16px;
	border: 2px solid #ccc;
	border-top: 2px solid #000;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	display: none;
}

.kenost-address__button.load{
	cursor: not-allowed;
}

/* Показывать спиннер, если кнопка в состоянии загрузки */
.kenost-address__button.load .kenost-spinner {
	display: inline-block;
}

.kenost-address__button.load svg {
	display: none;
}

/* Анимация вращения */
@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.kenost-address__button svg{
	width: 16px;
	height: 16px;
}

.popup-btn {
  width: 100%;
  background: #F00;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
	min-height: 40px;
	transition: all 0.3s;
	font-size: 14px;
}
.popup-btn:hover {
  background: #EC0000;
}

.popup-btn-two {
  width: 100%;
  background: #FFF;
	border: 1px solid #E2E2E2;
  color: #282828;
  padding: 10px;
  border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
  cursor: pointer;
	align-items: center;
	justify-content: center;
	gap: 4px;
	line-height: 1;
	display: flex;
	min-height: 40px;
	transition: all 0.3s;
}

.popup-btn-two:hover {
  background: rgba(0, 0, 0, 0.03);
}

</style>
