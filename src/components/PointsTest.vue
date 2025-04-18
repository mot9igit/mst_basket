<template>
  <yandex-map :settings="mapSettings" style="height: 500px">
    <yandex-map-default-scheme-layer />
    <yandex-map-default-features-layer />

    <yandex-map-clusterer :grid-size="64" zoom-on-cluster-click>
      <yandex-map-marker
        v-for="item in items"
        :key="item.id"
        :settings="{ coordinates: item.mapcoordinates }"
      >
        <div class="marker">
          <img
            src="https://zelenyi-magazin.ru/wa-data/public/shop/products/54/17/1754/images/1865/1865.1200.png"
            class="marker-icon"
            alt="СДЭК"
          />
        </div>
      </yandex-map-marker>

      <!-- кастомный кластер -->
      <template #cluster="{ length }">
        <div class="cluster">
          {{ length }}
        </div>
      </template>
    </yandex-map-clusterer>
  </yandex-map>
</template>

<script>
import {
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapMarker,
  YandexMapClusterer
} from 'vue-yandex-maps'

export default {
  components: {
    YandexMap,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    YandexMapMarker,
    YandexMapClusterer
  },
  data() {
    return {
      mapSettings: {
        location: {
          center: [37.620393, 55.75396],
          zoom: 11
        }
      },
      items: [
        { id: 1, mapcoordinates: [37.62, 55.75] },
        { id: 2, mapcoordinates: [37.621, 55.7505] },
        { id: 3, mapcoordinates: [37.622, 55.751] },
        { id: 4, mapcoordinates: [37.623, 55.7515] },
        { id: 5, mapcoordinates: [37.624, 55.752] }
      ]
    }
  }
}
</script>

<style scoped>
.marker {
  width: 34px;
  height: 34px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.marker-icon {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  object-fit: contain;
}

.cluster {
  width: 40px;
  height: 40px;
  background-color: #ff4b4b;
  color: white;
  font-weight: bold;
  font-size: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
