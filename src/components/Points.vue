<template>
    <div class="points" @click="closeModal" :class="{ show: modal }">
      <div class="points__content" @click.stop>
        <span class="h1-mini">Выберите пункт выдачи</span>
        <p>Текущий зум: {{ currentZoom }}</p>
        <ul>
          <li>(top): {{ bounds.top }}</li>
          <li>(bottom): {{ bounds.bottom }}</li>
          <li>(left): {{ bounds.left }}</li>
          <li>(right): {{ bounds.right }}</li>
        </ul>
        <div>
          <yandex-map
            ref="yMap"
            v-model="map"
            :settings="mapSettings"
            height="500px"
          >
            <yandex-map-default-features-layer />
            <yandex-map-default-scheme-layer />
            <yandex-map-clusterer grid-size="64" zoom-on-cluster-click>
              <yandex-map-marker
                v-for="item in items"
                :key="item.id"
                position="top left-center"
                :settings="{ coordinates: item.mapcoordinates }"
              >
                <div class="marker">
                  <div v-if="currentZoom >= 12" class="marker-label">
                    СДЭК <br></br> 149 ₽, 3-7 дней.
                  </div>
                  <img :src="item.image" :alt="item.name" width="30" height="30" />
                </div>
              </yandex-map-marker>
            </yandex-map-clusterer>
  
            <!-- Слушатель карты -->
            <yandex-map-listener :settings="{ onUpdate: handleMapUpdate }" />
          </yandex-map>
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
    data() {
      return {
        map: shallowRef(null),
        mapSettings: {
          location: {
            center: [37.620393, 55.75396],
            zoom: 11
          }
        },
        items: [
          { id: 1, name: 'Пункт #1', image: 'https://mst.tools/assets/content/about-1.jpg', mapcoordinates: [37.278818, 55.831059] },
          { id: 2, name: 'Пункт #2', image: 'https://mst.tools/assets/content/images/shops_logo/frame-534813826.png', mapcoordinates: [37.489733, 56.093601] },
          { id: 3, name: 'Пункт #3', image: 'https://mst.tools/assets/content/about-1.jpg', mapcoordinates: [37.719901, 55.849035] },
          { id: 4, name: 'Пункт #4', image: 'https://mst.tools/assets/content/about-1.jpg', mapcoordinates: [37.739496, 55.642993] },
          { id: 5, name: 'Пункт #5', image: 'https://mst.tools/assets/content/about-1.jpg', mapcoordinates: [37.465649, 55.765798] },
          { id: 6, name: 'Пункт #6', image: 'https://mst.tools/assets/content/about-1.jpg', mapcoordinates: [37.605329, 55.884493] },
          { id: 7, name: 'Пункт #7', image: 'https://mst.tools/assets/content/about-1.jpg', mapcoordinates: [37.829394, 55.736106] },
          { id: 8, name: 'Пункт #8', image: 'https://mst.tools/assets/content/about-1.jpg', mapcoordinates: [37.582202, 55.672308] }
        ],
        currentZoom: 11,
        bounds: {
          top: null,
          bottom: null,
          left: null,
          right: null
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
        ...mapGetters(["basket", "cost"]),
    },
    mounted() {
        this.basket_api({
            action: "test",
        })
    },
    methods: {
    ...mapActions(["basket_api"]),
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
          console.log('Зум:', this.currentZoom, 'Границы:', this.bounds)
        }
      }
    }
  }
  </script>
  
  
<style scoped>
  .marker img {
    border-radius: 50%;
    border: 2px solid #00000044;
    width: 100%;
    height: 100% !important;
    object-fit: contain;
  }

  .marker {
    cursor: pointer;
    position: relative;
    width: 33px;
    height: 33px;
    background: #fff;
    border-radius: 50%;
    border: 2px solid #fff;
    -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .11);
    box-shadow: 0 2px 3px #0000001c;
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
</style>
  