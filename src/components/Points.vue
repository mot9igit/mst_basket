<template>
  <div class="points" @click="closeModal" :class="{ show: modal }">
    <div class="points__content" @click.stop>
      <div class="kenost-modal-closer" @click="closeModal">
        <svg @click="closeModal" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </div>
      <div class="kenost-points">
        <div class="kenost-points__list">
          <span class="h1-mini">Выберите пункт выдачи</span>
          <div class="kenost-points__list-points">
            <template v-for="(item) in delivery_points.all_points">
              <template v-if="this.delivery?.[item?.delivery_code]?.[item?.fias_guid]?.time == 0"></template>
              <div class="map-item" v-else>
                <div class="map-item__title">
                  <img class="map-item__image" :src="'https://mst.tools' + item.delivery_logo" alt="">
                  <div>
                    {{ item.type == "PVZ"? "Пункт выдачи заказов": "" }}
                    {{ item.delivery_name }}
                  </div>
                </div>
                <div class="map-item__address">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.00002 16.1998C9.00002 16.1998 14.6348 11.1911 14.6348 7.43459C14.6348 4.32258 12.112 1.7998 9.00002 1.7998C5.88801 1.7998 3.36523 4.32258 3.36523 7.43459C3.36523 11.1911 9.00002 16.1998 9.00002 16.1998Z" stroke="#797979"/>
                    <path d="M10.8002 7.19992C10.8002 8.19403 9.99436 8.99992 9.00025 8.99992C8.00613 8.99992 7.20025 8.19403 7.20025 7.19992C7.20025 6.20581 8.00613 5.39992 9.00025 5.39992C9.99436 5.39992 10.8002 6.20581 10.8002 7.19992Z" stroke="#797979"/>
                  </svg>
                  <span class="map-item__address-full">{{ item.address }}</span>
                </div>
                <div class="map-item__info">
                  Доставка:
                  <span>
                  {{ this.delivery?.[item.delivery_code]?.[item.fias_guid]?.length == 0? this.getPrice(item.fias_guid, item.delivery_code) : `${pluralizeDays(this.delivery?.[item.delivery_code]?.[item.fias_guid]?.time)}` }}
                  ·
                  {{ this.delivery?.[item.delivery_code]?.[item.fias_guid]?.length == 0? this.getPrice(item.fias_guid, item.delivery_code) : Number(this.delivery?.[item.delivery_code]?.[item.fias_guid]?.price) == 0 ? 'Бесплатно' : `${Number(this.delivery?.[item.delivery_code]?.[item.fias_guid]?.price).toLocaleString('ru')} ₽` }}
                  </span>
                </div>
                <div class="map-item__bottom">
                  <span>
                    {{ item.work_time }}
                  </span>
                  <button class="popup-btn-red" @click="choosePoint(item)">Выбрать</button>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="kenost-map">
          <yandex-map
            ref="yMap"
            v-model="map"
            :settings="mapSettings"
          >
            <yandex-map-default-features-layer />
            <yandex-map-default-scheme-layer />

            <!-- Обработка кластеров -->
            <template v-if="delivery_points?.clusters?.length">
              <yandex-map-marker
                v-for="(cluster, index) in delivery_points.clusters"
                :key="'cluster-' + index"
                :settings="{ coordinates: [Number(cluster.coords.longitude), Number(cluster.coords.latitude)] }"
              >
                <div class="cluster">
                  {{ cluster.count }}
                </div>
              </yandex-map-marker>
            </template>

            <!-- Обработка отдельных точек -->
              <template
                v-for="(point, index) in delivery_points?.points"
                :key="'point-' + index"
              >
              <template v-if="this.delivery[point?.delivery_code][point?.fias_guid]?.time == 0"></template>
              <yandex-map-marker
                v-else
                :settings="{ coordinates: [Number(point?.coords?.longitude), Number(point?.coords?.latitude)] }"
                @click="selectPoint(point)"
              >
                <div class="marker">
                  <div v-if="currentZoom >= 15" class="marker-label">
                    {{ point.delivery_name }}, {{ point.type == 'PVZ'? "ПВЗ" : point.type == 'POSTAMAT'? "постамат" : '' }} <br /> {{ this.delivery[point.delivery_code][point.fias_guid]?.length == 0? this.getPrice(point.fias_guid, point.delivery_code) : `${Number(this.delivery[point.delivery_code][point.fias_guid]?.price).toLocaleString('ru')}  ₽, ${pluralizeDays(this.delivery[point.delivery_code][point.fias_guid]?.time)}` }}
                  </div>
                  <div class="custom-marker">
                    <img
                      :src="'https://mst.tools' + point.delivery_logo"
                      :alt="point.name"
                      class="marker-icon"
                    />
                  </div>
                </div>
              </yandex-map-marker>
            </template>

            <yandex-map-listener :settings="{ onUpdate: handleMapUpdate }" />
          </yandex-map>
          
          <div v-if="selectedPoint" class="popup">
            <div class="popup-header">
              <strong>{{ selectedPoint.address }}</strong>
              <div class="popup-close" @click="selectedPoint = null">✕</div>
            </div>
            <div class="popup-body">
              <div class="pipup-name">
                {{ selectedPoint.delivery_name }}, 
                {{ selectedPoint.type === 'PVZ' ? "пункт выдачи заказов" : selectedPoint.type === 'POSTAMAT' ? "постамат" : '' }}
              </div>
              <div>
                {{ this.delivery[selectedPoint.delivery_code][selectedPoint.fias_guid]?.length == 0? this.getPrice(selectedPoint.fias_guid, selectedPoint.delivery_code) : `${pluralizeDays(this.delivery[selectedPoint.delivery_code][selectedPoint.fias_guid]?.time)}` }}  · 
                <span class="old-price">{{ this.delivery[selectedPoint.delivery_code][selectedPoint.fias_guid]?.length == 0? this.getPrice(selectedPoint.fias_guid, selectedPoint.delivery_code) : `${Math.round(Number(this.delivery[selectedPoint.delivery_code][selectedPoint.fias_guid]?.price) * 1.2).toLocaleString('ru')}` }} ₽</span> 
                <b>{{ this.delivery[selectedPoint.delivery_code][selectedPoint.fias_guid]?.length == 0? this.getPrice(selectedPoint.fias_guid, selectedPoint.delivery_code) : `${Number(this.delivery[selectedPoint.delivery_code][selectedPoint.fias_guid]?.price).toLocaleString('ru')}` }} ₽</b>
              </div>
              <div class="popup-work" v-if="selectedPoint.work_time">{{ selectedPoint.work_time }}</div>
            </div>
            <button :disabled="this.delivery[selectedPoint.delivery_code][selectedPoint.fias_guid]?.length == 0 || this.delivery[selectedPoint.delivery_code][selectedPoint.fias_guid]?.time == 0" class="popup-btn mt-2" @click="choosePoint(selectedPoint)">Выбрать пункт</button>
          </div>
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
  data() {
    return {
      map: shallowRef(null),
      mapSettings: {
        location: {
          center: [37.620393, 55.75396],
          zoom: 16
        }
      },
      currentZoom: 10,
      selectedPoint: null,
      bounds: {
        top: null,
        bottom: null,
        left: null,
        right: null
      },
      delivery: {},
      lastRequestTime: 0,
      requestCooldown: 1000,
      debounceTimer: null,
      zoomThreshold: 1,
      lastZoom: 10,
      lastBounds: null,
      isLoad: false,
      clusterRadius: 50000, // Начальное значение радиуса кластеризации в метрах
      fetchFIas: []
    }
  },
  components: {
    YandexMap,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    YandexMapMarker,
    YandexMapListener
  },
  computed: {
    ...mapGetters(["delivery_points", "cost"]),
    clusters() {
      return this.delivery_points?.data?.clusters || []
    },
    points() {
      return this.delivery_points?.data?.points || []
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    ...mapActions(["delivery_points_api", "marketplace_response_api"]),
    initMap() {
      if (this.delivery_points?.data?.position) {
        this.mapSettings.location.center = [
          Number(this.delivery_points.data.position.geo_lon),
          Number(this.delivery_points.data.position.geo_lat)
        ];
      }
      this.fetchPoints();
    },
    closeModal() {
      this.$emit('update:modal', false)
    },
    //Для сдека - fias_guid, code
    //Для пвз мст - uuid (id склада), code
    
    getPrice(number, code){
      console.log(number, code)
      if(!number || !code){
        return;
      }
      if(code == "cdek"){
        if(!this.fetchFIas.includes(`${number}-${code}`)){
          this.fetchFIas.push(`${number}-${code}`)
          this.marketplace_response_api({
            action: 'get/price/fias/delivery',
            fias: number,
            code: code
          }).then((res) => {
            if(res.data.data){
              this.delivery[code][number] = res.data.data;
            } else {
              this.delivery[code][number].price = 0;
            }
          })
        }
      } else if(code == "mst"){
        if(!this.fetchFIas.includes(`${number}-${code}`)){
          this.fetchFIas.push(`${number}-${code}`)
          this.marketplace_response_api({
            action: 'get/price/fias/delivery',
            uuid: number,
            code: code
          }).then((res) => {
            if(res.data.data){
              this.delivery[code][number] = res.data.data;
            } else {
              this.delivery[code][number].price = 0;
            }
          })
        }
      }
      
      //Имитация запроса цены
      //console.log(fias_guid)
    },
    handleMapUpdate(e) {
      if (e.type === 'update' && e.location) {
        const [[left, top], [right, bottom]] = e.location.bounds;
        const newBounds = {
          top: top.toFixed(6),
          bottom: bottom.toFixed(6),
          left: left.toFixed(6),
          right: right.toFixed(6)
        };
        const newZoom = e.location.zoom.toFixed(2);
        
        // Рассчитываем оптимальный радиус кластеризации
        this.clusterRadius = this.calculateClusterRadius(newZoom, e.location.bounds);
        
        // Всегда обновляем значения
        this.bounds = newBounds;
        this.currentZoom = newZoom;
        this.lastZoom = newZoom;
        this.lastBounds = newBounds;
        
        clearTimeout(this.debounceTimer);
        
        this.debounceTimer = setTimeout(() => {
          const now = Date.now();
          if (now - this.lastRequestTime > this.requestCooldown) {
            this.fetchPoints();
            this.lastRequestTime = now;
          }
        }, 300);
      }
    },
    calculateClusterRadius(zoom, bounds) {
      // Базовый расчет на основе зума - более агрессивное уменьшение
      let radiusBasedOnZoom = 10000 / Math.pow(2, zoom - 10); // Начинаем с 10км и уменьшаем быстрее
      
      // Расчет на основе видимой области
      if (bounds && bounds.length === 2) {
        const [[left, top], [right, bottom]] = bounds;
        const latDiff = Math.abs(top - bottom);
        const lonDiff = Math.abs(left - right);
        
        // Берем минимальную разницу, чтобы не учитывать сильно вытянутые области
        const minDiff = Math.min(latDiff, lonDiff);
        
        // Более консервативный коэффициент (0.2 вместо 0.4)
        const radiusBasedOnBounds = minDiff * 111000 * 0.2;
        
        // Ограничиваем минимальный радиус 50 метрами
        const minRadius = 50;
        
        // Берем минимальный радиус, но не меньше 50 метров
        return Math.max(
          minRadius,
          Math.min(radiusBasedOnZoom, radiusBasedOnBounds)
        );
      }
      
      // Ограничение для случая без bounds
      return Math.max(50, radiusBasedOnZoom);
    },
    fetchPoints() {
      if (this.bounds.top && this.bounds.bottom && this.bounds.left && this.bounds.right) {
        this.delivery_points_api({
          action: "points",
          bounds: this.bounds,
          zoom: this.currentZoom,
          clusterRadius: Math.round(this.clusterRadius) // Передаем рассчитанный радиус
        });
      } else {
        this.delivery_points_api({
          action: "points"
        });
      }
    },
    selectPoint(point) {
      this.selectedPoint = point;
    },
    choosePoint(point) {
      let cost = this.delivery[point.delivery_code][point.fias_guid];
      this.$emit('update:point', { point: point, cost: cost, code: point.delivery_code });
      this.closeModal();
    },
    pluralizeDays(n) {
      const mod10 = n % 10;
      const mod100 = n % 100;

      if (mod10 === 1 && mod100 !== 11) return `${n} день`;
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return `${n} дня`;
      return `${n} дней`;
    },
    // Функция для глубокого объединения объектов
    mergeDeliveryObjects(current, incoming) {
      const result = { ...current }; // Копируем текущий объект
      
      // Перебираем все службы доставки (например, 'cdek')
      for (const [deliveryName, deliveryData] of Object.entries(incoming)) {
        if (!result[deliveryName]) {
          result[deliveryName] = {};
        }
        
        // Для каждого fias_guid в новой версии
        for (const [fiasGuid, points] of Object.entries(deliveryData)) {
          // Если такого fiasGuid еще нет в текущих данных или он пустой
          if (!result[deliveryName][fiasGuid] || result[deliveryName][fiasGuid].length === 0) {
            result[deliveryName][fiasGuid] = points;
          }
          // Если в текущих данных есть информация (например, cost), она сохранится
        }
      }
      
      return result;
    }
  },
  watch: {
    delivery_points: {
      handler(newVal) {
        if (newVal?.position && !this.isLoad) {
          this.mapSettings.location.center = [
            Number(newVal.position.geo_lon),
            Number(newVal.position.geo_lat)
          ];
          this.isLoad = true;
        }

        if (newVal?.delivery) {
          if(Object.keys(this.delivery).length == 0){
            this.delivery = newVal?.delivery
          } else {
            this.delivery = this.mergeDeliveryObjects(this.delivery, newVal?.delivery);
          }
          //console.log(this.delivery)
        }
      },
      deep: true
    },
    cost (newVal) {
      this.fetchFIas = []
      for (const deliveryService in this.delivery) {
        if (this.delivery.hasOwnProperty(deliveryService)) {
          const serviceEntries = this.delivery[deliveryService];
          for (const uuid in serviceEntries) {
            if (serviceEntries.hasOwnProperty(uuid)) {
              serviceEntries[uuid] = [];
            }
          }
        }
      }
    },
  },
  beforeUnmount() {
    clearTimeout(this.debounceTimer);
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

.popup-btn-red{
  width: fit-content;
  background: #F00;
  color: white;
  border: none;
  padding: 10px 34px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.4s;
}

.popup-btn-red:hover{
  background: #EC0000;
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
  font-size: 14px;
}
.popup-btn:hover {
  background: #EC0000;
}

.popup-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.kenost-map{
  height: 600px;
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

.custom-marker{
  height: 100%;
}
</style>