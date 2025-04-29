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
          <yandex-map-marker
            v-for="(point, index) in delivery_points?.points"
            :key="'point-' + index"
            :settings="{ coordinates: [Number(point.coords.longitude), Number(point.coords.latitude)] }"
            @click="selectPoint(point)"
          >
            <div class="marker">
              <div v-if="currentZoom >= 15" class="marker-label">
                {{ point.delivery_name }} {{ this.delivery[point.delivery_code][point.fias_guid]?.length == 0? '' : '' }}
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

          <yandex-map-listener :settings="{ onUpdate: handleMapUpdate }" />
        </yandex-map>
        
        <div v-if="selectedPoint" class="popup">
          <div class="popup-header">
            <strong>{{ selectedPoint.address }}</strong>
            <div class="popup-close" @click="selectedPoint = null">✕</div>
          </div>
          <div class="popup-body">
            <div class="pipup-name">{{ selectedPoint.name }}</div>
            <div v-if="selectedPoint.delivery_name === 'СДЭК'">
              {{ pluralizeDays(delivery_points.cdek.cost.time) }} · 
              <span class="old-price">{{ (Number(delivery_points.cdek.cost.price) * 1.2).toLocaleString('ru') }} ₽</span> 
              <b>{{ delivery_points.cdek.cost.price.toLocaleString('ru') }} ₽</b>
            </div>
            <div class="popup-work" v-if="selectedPoint.work_time">{{ selectedPoint.work_time }}</div>
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
          zoom: 10
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
      clusterRadius: 50000 // Начальное значение радиуса кластеризации в метрах
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
    ...mapGetters(["delivery_points"]),
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
    ...mapActions(["delivery_points_api"]),
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
    getPrice(fias_guid){
      //Имитация запроса цены
      console.log(fias_guid)
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
        
        const zoomChanged = Math.abs(newZoom - this.lastZoom) >= this.zoomThreshold;
        const boundsChanged = !this.lastBounds || 
          Math.abs(newBounds.top - this.lastBounds.top) > 0.1 ||
          Math.abs(newBounds.bottom - this.lastBounds.bottom) > 0.1 ||
          Math.abs(newBounds.left - this.lastBounds.left) > 0.1 ||
          Math.abs(newBounds.right - this.lastBounds.right) > 0.1;
        
        if (zoomChanged || boundsChanged) {
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
      }
    },
    selectPoint(point) {
      this.selectedPoint = point;
    },
    choosePoint(point) {
      let cost = null;
      let code = null;
      if (point.delivery_name === 'СДЭК') {
        cost = this.delivery_points.cdek?.cost;
        code = "cdek";
      }
      this.$emit('update:point', { point: this.selectedPoint, cost: cost, code: code });
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
        // if (newVal?.data?.position) {
        //   this.mapSettings.location.center = [
        //     Number(newVal.data.position.geo_lon),
        //     Number(newVal.data.position.geo_lat)
        //   ];
        // }

        if (newVal?.delivery) {
          if(Object.keys(this.delivery).length == 0){
            this.delivery = newVal?.delivery
          } else {
            this.delivery = this.mergeDeliveryObjects(this.delivery, newVal?.delivery);
          }
          console.log(this.delivery)
        }
      },
      deep: true
    }
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

.custom-marker{
  height: 100%;
}
</style>