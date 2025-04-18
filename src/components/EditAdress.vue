<template>
	<div class="addressEdit" @click="closeModal" :class="{ show: modal }">
	  <div class="addressEdit__content" @click.stop>
		<div class="kenost-select-address">
		  <div class="kenost-select-address__half kenost-select-address__inputs">
			<h3>{{ address ? "Редактирование адреса" : "Новый адрес" }}</h3>
  
			<!-- <div class="dart-input dart-input-text mt-3">
			  <input
			  	@blur="setCoordinatesFromAddress"
				type="text"
				v-model="dataAdress.adress"
				placeholder="Начните вводить адрес"
				class="required"
			  />
			</div> -->
			<div class="dart-input dart-input-text mt-3" style="position: relative;">
				<input
					type="text"
					v-model="dataAdress.adress"
					placeholder="Начните вводить адрес"
					class="required"
					@input="handleAddressInput"
				/>

				<ul v-if="showSuggestions && geocodeSuggestions.length" class="suggestions-list">
					<li
					v-for="(item, index) in geocodeSuggestions"
					:key="index"
					@click="selectSuggestedAddress(item)"
					>
					{{ item.text }}
					</li>
				</ul>
			</div>
			<div class="input-two">
				<div class="dart-input dart-input-text mt-2">
					<input type="text" v-model="dataAdress.room" placeholder="Квартира" />
				</div>
				<div class="dart-input dart-input-text mt-2">
					<input type="text" v-model="dataAdress.floor" placeholder="Этаж" />
				</div>
			</div>
			<div class="input-two">
				<div class="dart-input dart-input-text mt-2">
					<input type="text" v-model="dataAdress.entrance" placeholder="Подъезд" />
				</div>
				<div class="dart-input dart-input-text mt-2">
					<input type="text" v-model="dataAdress.doorphone" placeholder="Домофон" />
				</div>
			</div>
			<button :disabled="!this.dataAdress.adress" class="popup-btn mt-2" @click="save()">Сохранить</button>
		  </div>
  
		  <div class="kenost-select-address__half">
			<div class="map-wrapper">
				<yandex-map
					ref="yMap"
					:settings="{
						location: mapSettings.location,
						behaviors: ['drag', 'dblClickZoom'], // ← scrollZoom не включаем
					}"
					style="height: 500px"
					>
					<yandex-map-default-scheme-layer />
					<yandex-map-default-features-layer />
					<yandex-map-listener :settings="{ onUpdate: onMapUpdate }" />
				</yandex-map>
				<div class="placemark" :class="{'show': this.movement}"></div>
				<div class="placemarkDot"></div>
				<div class="map-control">
					<div class="map-zoom-buttons">
						<button class="map-zoom-buttons-plus" @click="zoomIn">
							<svg role="img" aria-hidden="true" data-icon="plus" viewBox="0 0 24 24" name="plus" class="css-mbvo24"><path d="M11 11V4a1 1 0 0 1 1-1 1 1 0 0 1 1 1v7h7a1 1 0 0 1 1 1 1 1 0 0 1-1 1h-7v7a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-7H4a1 1 0 0 1-1-1 1 1 0 0 1 1-1h7Z"></path></svg>
						</button>
						<button class="map-zoom-buttons-minus" @click="zoomOut">
							<svg role="img" aria-hidden="true" data-icon="minus" viewBox="0 0 24 24" name="minus" class="css-mbvo24"><path d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"></path></svg>
						</button>
					</div>
					<button class="map-location-btn" @click="locateMe">
						<svg role="img" aria-hidden="true" data-icon="my-location" viewBox="0 0 24 24" name="my-location" class="css-144avp9">
							<path d="M2.649 10.939c-.86-.323-.867-1.536-.011-1.869l18-7c.81-.315 1.61.484 1.294 1.295l-7 18c-.333.856-1.546.848-1.868-.011l-2.84-7.575-7.575-2.84z"></path>
						</svg>
					</button>
				</div>
				
  
			  <!-- Фиксированный маркер по центру -->
			  <!-- <div class="map-pin-center">
				<img
				  src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
				  alt="Маркер"
				  width="32"
				  height="32"
				/>
			  </div> -->
			</div>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  import {
	YandexMap,
	YandexMapDefaultSchemeLayer,
	YandexMapDefaultFeaturesLayer,
	YandexMapListener,
	YandexMapMarker
  } from 'vue-yandex-maps'
  import { mapActions, mapGetters } from 'vuex'
  import axios from 'axios'
  
  export default {
	name: 'AddressEdit',
	props: {
	  modal: { type: Boolean, default: false },
	  address: {
		type: Array,
		default: () => []
		}
	},
	model: {
	  prop: 'modal',
	  event: 'update:modal'
	},
	data() {
	  return {
		selectAddress: null,
		dataAdress: {
		  adress: '',
		  room: '',
		  floor: '',
		  entrance: '',
		  doorphone: ''
		},
		mapSettings: {
		  location: {
			center: [37.620393, 55.75396],
			zoom: 16
		  },
		  behaviors: ['drag', 'dblClickZoom'] // отключили scrollZoom
		},
		centerCoords: [37.620393, 55.75396],
		geocodeTimeout: null,
		movement: false,
		geocodeSuggestions: [],
		showSuggestions: false,
		debounceTimer: null
	  }
	},
	components: {
	  YandexMap,
	  YandexMapDefaultSchemeLayer,
	  YandexMapDefaultFeaturesLayer,
	  YandexMapListener,
	  YandexMapMarker
	},
	computed: {
	  ...mapGetters([])
	},
	mounted() {
	  
	},
	methods: {
	  ...mapActions(['']),
	  closeModal() {
		this.$emit('update:modal', false)
	  },
	  chooseAddress(item) {
		this.$emit('update:address', this.selectAddress)
		this.closeModal()
	  },
	  save(){
		let data = this.dataAdress
		if(this.address){
			data.id = this.address.id
		}
		data.coordinates = this.centerCoords
		console.log(data)
	  },
	  zoomIn() {
		const newZoom = Math.min(this.mapSettings.location.zoom + 1, 19)
		this.mapSettings.location.zoom = newZoom
		},

		zoomOut() {
		const newZoom = Math.max(this.mapSettings.location.zoom - 1, 2)
		this.mapSettings.location.zoom = newZoom
		},
	  async locateMe() {
			if (!navigator.geolocation) {
			alert("Геолокация не поддерживается вашим браузером.")
			return
			}

			navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords
				this.centerCoords = [longitude, latitude]
				this.mapSettings.location.center = [longitude, latitude]
				this.geocodeCenter()
			},
			error => {
				console.error("Геолокация не доступна", error)
				alert("Не удалось получить геолокацию.")
			}
			)
		},
	  onMapUpdate(e) {
		if (e?.location?.center) {
			const [lon, lat] = e.location.center
			if (this.centerCoords[0] !== lon || this.centerCoords[1] !== lat) {
			this.movement = true
			this.centerCoords = e.location.center

			if (this.geocodeTimeout) clearTimeout(this.geocodeTimeout)

			this.geocodeTimeout = setTimeout(() => {
				this.geocodeCenter()
				this.movement = false
			}, 1000)
			}
		}
	},
	async geocodeCenter() {
		if (!this.centerCoords) return
		try {
			const response = await axios.get("https://geocode-maps.yandex.ru/1.x/", {
			params: {
				apikey: "7270e707-f1a7-4397-a1d7-0c545cf0b735",
				geocode: this.centerCoords.join(","),
				format: "json",
				results: 1
			}
			})

			const geoObject = response.data?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject
			const kind = geoObject?.metaDataProperty?.GeocoderMetaData?.kind

			// Устанавливаем адрес только если найден дом
			if (geoObject && kind === 'house') {
			this.dataAdress.adress = geoObject.metaDataProperty.GeocoderMetaData.text
			} else {
			this.dataAdress.adress = ""
			}

		} catch (error) {
			console.error("Ошибка при геокодинге:", error)
		}
		},
	  selectSuggestedAddress(item) {
			this.dataAdress.adress = item.text
			this.centerCoords = [item.coordinates[0], item.coordinates[1]]
			this.mapSettings.location.center = [item.coordinates[0], item.coordinates[1]]
			this.showSuggestions = false
		},
		handleAddressInput() {
			clearTimeout(this.debounceTimer)

			this.debounceTimer = setTimeout(() => {
				this.fetchAddressSuggestions(this.dataAdress.adress)
			}, 500)
		},
	  async fetchAddressSuggestions(query) {
		if (!query?.trim()) return

		const search = query.trim().replace(/\s+/g, '+')

		try {
			const response = await axios.get('https://geocode-maps.yandex.ru/1.x/', {
			params: {
				apikey: '7270e707-f1a7-4397-a1d7-0c545cf0b735',
				geocode: search,
				format: 'json',
				results: 5
			}
			})

			const features = response.data?.response?.GeoObjectCollection?.featureMember || []

			this.geocodeSuggestions = features.map(f => {
			const geo = f.GeoObject
			return {
				text: geo.metaDataProperty.GeocoderMetaData.text,
				coordinates: geo.Point.pos.split(' ').map(Number)
			}
			})

			this.showSuggestions = true
		} catch (err) {
			console.error('Ошибка при получении вариантов адресов:', err)
			this.geocodeSuggestions = []
			this.showSuggestions = false
		}
		},
	  async setCoordinatesFromAddress() {
		if (!this.dataAdress.adress?.trim()) return

		const addressForSearch = this.dataAdress.adress.trim().replace(/\s+/g, '+')

		try {
			const response = await axios.get(
			`https://geocode-maps.yandex.ru/1.x/`, {
				params: {
				apikey: '7270e707-f1a7-4397-a1d7-0c545cf0b735',
				geocode: addressForSearch,
				format: 'json'
				}
			}
			)

			if (response.status !== 200) return

			const pos = response.data?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.Point?.pos

			if (pos) {
			const [lon, lat] = pos.split(' ').map(Number)
			this.centerCoords = [lon, lat]
			this.mapSettings.location.center = [lon, lat]
			}
		} catch (error) {
			console.error('Не удалось получить координаты по адресу:', error)
		}
	}
	},
	watch: {
	// 	address: {
	// 	handler(newVal) {
	// 		console.log("address changed", newVal)
	// 		if (!newVal) {
	// 			this.locateMe().then(() => {
	// 				this.dataAdress.adress = ""
	// 			})
	// 		}
	// 	},
	// 	deep: true,
	// 	immediate: true // если хочешь, чтобы сработал при первом рендере
	// }
	}
  }
  </script>
  
  <style scoped>
  .kenost-select-address {
	display: flex;
  }
  .kenost-select-address__half {
	width: 50%;
  }
  .kenost-select-address__inputs {
	padding: 32px;
	position: relative;
  }
  .map-wrapper {
	position: relative;
  }
  .map-pin-center {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -100%);
	z-index: 1000;
	pointer-events: none;
	}

	.placemarkDot{
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		pointer-events: none;
		width: 20px;
		height: 20px;
		top: calc(50% + 3px);
	}

	.placemarkDot::before{
		content: '';
		position: absolute;
		height: 14px;
		bottom: 28px;
		left: 0;
		right: 0;
		width: 3px;
		background-color: black;
		border-radius: 2px;
		margin: 0 auto;
	}

	.placemarkDot::after{
		content: '';
		position: absolute;
		height: 100%;
		left: 0;
		right: 0;
		bottom: 50%;
		background-repeat: no-repeat;
		width: 20px;
		background-image: url(/dot.svg);
	}

	.placemark{
		width: 44px;
		height: 50px;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		pointer-events: none;
	}

	.placemark {
		animation: downMarker .4s forwards ease-out;
	}

	.placemark.show{
		animation: upMarker .4s forwards ease-out;
	}

	@keyframes upMarker {
		0% {
			top: calc(50% - 31px);
		}
		100% {
			top: calc(50% - 40px);
		}
	}

	@keyframes downMarker {
		0% {
			top: calc(50% - 40px);
		}
		35% {
			top: calc(50% - 27px);
		}
		65% {
			top: calc(50% - 33px);
		}
		80% {
			top: calc(50% - 30px);
		}
		100% {
			top: calc(50% - 31px);
		}
	}

	.placemark::after{
		width: 44px;
    	background-image: url(/mapmarker.svg);
		content: '';
		position: absolute;
		height: 100%;
		left: 0;
		right: 0;
		bottom: 50%;
		background-repeat: no-repeat;
	}

	.map-control{
		position: absolute;
		top: calc(50% - 64px);
		right: 16px;
	}

	.map-location-btn{
		transition: all 0.3s;
		margin-top: 16px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0 4px 30px 0 rgba(0, 0, 0, .1), 0 1px 3px 0 rgba(0, 0, 0, .05);
		border: none;
		cursor: pointer;
		transition: all 0.3s;
	}

	.map-location-btn:hover{
		background-color: #f2f1f0;
	}

	.map-location-btn svg{
		width: 15px;
		height: 15px;
	}

	.map-zoom-buttons{
		width: 36px;
		height: 72px;
		box-shadow: 0 4px 30px 0 rgba(0, 0, 0, .1), 0 1px 3px 0 rgba(0, 0, 0, .05);
		border-radius: 40px;
	}

	.map-zoom-buttons-plus{
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		border-top-right-radius: 40px;
		border-top-left-radius: 40px;
		border: none;
		cursor: pointer;
		transition: all 0.3s;
	}

	.map-zoom-buttons-plus img{
		width: 20px;
		height: 20px;
	}
	.map-zoom-buttons-minus img{
		width: 20px;
		height: 20px;
	}

	.map-zoom-buttons-minus{
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		border-bottom-right-radius: 40px;
		border-bottom-left-radius: 40px;
		border: none;
		cursor: pointer;
		transition: all 0.3s;
	}

	.map-zoom-buttons-minus:hover,
	.map-zoom-buttons-plus:hover{
		background-color: #f2f1f0;
	}

	.input-two{
		display: flex;
		gap: 8px;
	}
	.suggestions-list {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 1000;
		background: white;
		border: 1px solid #ddd;
		max-height: 200px;
		overflow-y: auto;
		width: 100%;
		list-style: none;
		padding: 0;
		margin: 4px 0 0;
		border-radius: 6px;
		box-shadow: 0 4px 10px rgba(0,0,0,0.08);
		}

		.suggestions-list li {
		padding: 8px 12px;
		cursor: pointer;
		}

		.suggestions-list li:hover {
		background-color: #f2f2f2;
		}

		.__ymap{
			cursor: grab;
		}

		.popup-btn {
			width: calc(100% - 64px);
			background: #F00;
			color: white;
			border: none;
			padding: 10px;
			border-radius: 8px;
			font-weight: bold;
			cursor: pointer;
			min-height: 40px;
			transition: all 0.3s;
			position: absolute;
			bottom: 32px;
		}
		
		.popup-btn:disabled{
			opacity: 0.7;
			cursor: no-drop;
		}

		.popup-btn:hover {
			background: #EC0000;
		}
  </style>
  