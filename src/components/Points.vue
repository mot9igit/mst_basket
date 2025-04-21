<template>
  <div class="points" @click="closeModal" :class="{ show: modal }">
    <div class="points__content" @click.stop>
      <span class="h1-mini">Выберите пункт выдачи</span>
      <div class="kenost-map">
        <yandex-map
          ref="yMap"
          v-model="map"
          :settings="mapSettings"
        >
          <yandex-map-default-features-layer />
          <yandex-map-default-scheme-layer />

          <yandex-map-clusterer :grid-size="64" zoom-on-cluster-click>
            <yandex-map-marker
              v-for="item in basket_delivery.cdek.data"
              :key="item.id"
              :settings="{ coordinates: [Number(item.location.longitude), Number(item.location.latitude)] }"
              @click="selectPoint(item)"
            >
              <div class="marker">
                <div v-if="currentZoom >= 12" class="marker-label">
                  СДЭК <br /> {{Number(basket_delivery.cdek.cost.price).toLocaleString('ru')}} ₽, {{pluralizeDays(basket_delivery.cdek.cost.time)}}.
                </div>
                <div class="custom-marker">
                  <img
                    src="https://zelenyi-magazin.ru/wa-data/public/shop/products/54/17/1754/images/1865/1865.1200.png"
                    :alt="item.name"
                    class="marker-icon"
                  />
                </div>
              </div>
            </yandex-map-marker>

            <template #cluster="{ length }">
              <div class="cluster">
                {{ length }}
              </div>
            </template>
          </yandex-map-clusterer>

          <yandex-map-listener :settings="{ onUpdate: handleMapUpdate }" />
        </yandex-map>
        <div v-if="selectedPoint" class="popup">
          <div class="popup-header">
            <strong>{{ selectedPoint?.location?.address }}</strong>
            <div class="popup-close" @click="selectedPoint = null">✕</div>
          </div>
          <div class="popup-body">
            <div class="pipup-name">{{ selectedPoint?.owner_code == "CDEK"? "СДЭК" : null }}{{ selectedPoint?.type == "PVZ"? ", пункт выдачи заказов" : null }}</div>
            <div v-if="selectedPoint?.owner_code == 'CDEK'">{{pluralizeDays(basket_delivery.cdek.cost.time)}} · 
              <span class="old-price">{{(Number(basket_delivery.cdek.cost.price) * 1.2).toLocaleString('ru')}} ₽</span> 
              <b>{{(basket_delivery.cdek.cost.price).toLocaleString('ru')}} ₽</b>
            </div>
            <div class="popup-work" v-if="selectedPoint.work_time">{{ selectedPoint.work_time }}</div>
            <!-- <div>{{ selectedPoint.note }}</div> -->
          </div>
          <button class="popup-btn mt-2" @click="choosePoint(selectedPoint)">Выбрать пункт</button>
        </div>
      </div>
    </div>
  </div>
</template>

  
  <script>
  import { shallowRef } from 'vue'
  import { mapActions, mapGetters } from "vuex";
  import {
    YandexMap,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    YandexMapMarker,
    YandexMapClusterer,
    YandexMapListener
  } from 'vue-yandex-maps'
  
  export default {
    name: 'Points',
    props: {
      modal: {
        type: Boolean,
        default: false
      }
    },
    model: {
      prop: 'modal',
      event: 'update:modal'
    },
    point: {
      prop: 'point',
      event: 'update:point'
    },
    data() {
      return {
        map: shallowRef(null),
        mapSettings: {
          location: {
            center: this.basket_delivery?.position?.geo_lat? [Number(this.basket_delivery?.position?.geo_lat), Number(this.basket_delivery?.position?.geo_lon)] : [37.620393, 55.75396],
            zoom: 11
          }
        },
        currentZoom: 11,
        bounds: {
          top: null,
          bottom: null,
          left: null,
          right: null
        },
        selectedPoint: null,
        point: null,
        clustererOptions: {
          preset: 'islands#invertedRedClusterIcons',
          groupByCoordinates: false
        }
      }
    },
    components: {
      YandexMap,
      YandexMapDefaultSchemeLayer,
      YandexMapDefaultFeaturesLayer,
      YandexMapMarker,
      YandexMapClusterer,
      YandexMapListener
    },
    computed: {
        ...mapGetters(["basket_delivery"]),
    },
    mounted() {
        this.basket_delivery_api({
          action: "points",
        })
    },
    methods: {
    ...mapActions(["basket_delivery_api"]),
      closeModal() {
        this.$emit('update:modal', false)
      },
      checkVendor(id) {
        console.log('Выбран пункт:', id)
      },
      handleMapUpdate(e) {
        if (e.type === 'update' && e.location) {
          const [[left, top], [right, bottom]] = e.location.bounds
          this.bounds.top = top.toFixed(6)
          this.bounds.bottom = bottom.toFixed(6)
          this.bounds.left = left.toFixed(6)
          this.bounds.right = right.toFixed(6)
          this.currentZoom = e.location.zoom.toFixed(2)
  
          // Debug log
          // console.log('Зум:', this.currentZoom, 'Границы:', this.bounds)
        }
      },
      selectPoint(item) {
        if (this.selectedPoint?.id === item.id) {
          this.selectedPoint = null
          // нужно чуть подождать, чтобы Vue обработал null → потом вернуть
          this.$nextTick(() => {
            this.selectedPoint = item
          })
        } else {
          this.selectedPoint = item
        }
      },
      choosePoint(item) {
        // console.log('Выбран пункт:', item)
        // this.point = this.selectedPoint
        console.log(this.selectedPoint)
        let cost = null;
        if(this.selectedPoint.owner_code == "CDEK"){
          cost = this.basket_delivery.cdek.cost
        }
        this.$emit('update:point', {point: this.selectedPoint, cost: cost})
        this.selectedPoint = null
        this.closeModal()
      },
      pluralizeDays(n) {
        const mod10 = n % 10;
        const mod100 = n % 100;

        if (mod10 === 1 && mod100 !== 11) return `${n} день`;
        if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return `${n} дня`;
        return `${n} дней`;
      }

    }
  }
  </script>
  
  
<style scoped>
  .marker img {
    border-radius: 50%;
    border: 1px solid #00000044;
    box-shadow: 0 2px 3px #0000001c;
    width: 100%;
    height: 100% !important;
    object-fit: contain;
  }

  .marker {
    cursor: pointer;
    position: relative;
    background: #FFF;
    width: 33px;
    height: 33px;
    border-radius: 50%;
    -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .11);
    text-align: center;
    color: #fff;
    font-weight: 700;
    margin-top: -10px;
  }

  .marker-label {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    background: #FFF;
    color: #000;
    font-weight: 500;
    font-size: 12px;
    padding: 4px 14px;
    z-index: 1;
    padding: 5px 15px;
    white-space: pre;
    text-align: center;
    border-radius: 4px;
    box-shadow: 0 1px 20px -2px rgba(0, 0, 0, .2);
  }

  .cluster {
    width: 36px;
    height: 36px;
    background-color: #282828;
    color: white;
    font-weight: bold;
    font-size: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  .popup {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  padding: 16px;
  z-index: 999;
}
.popup-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}
.popup-body {
  font-size: 14px;
  margin-bottom: 12px;
}
.old-price {
  text-decoration: line-through;
  color: #888;
  margin-right: 4px;
}
.popup-btn {
  width: 100%;
  background: #282828;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}
.popup-btn:hover {
  background: #222;
}

.kenost-map{
  height: 500px;
  position: relative;
}

.popup-close{
  cursor: pointer;
}

.popup-work{
  margin-top: 8px;
}

.pipup-name{
  margin-bottom: 8px;
  font-weight: bold;
}

</style>
  