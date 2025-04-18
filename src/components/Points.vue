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

      <yandex-map
        ref="yMap"
        v-model="map"
        :settings="mapSettings"
        height="500px"
      >
        <yandex-map-default-features-layer />
        <yandex-map-default-scheme-layer />

        <yandex-map-clusterer :grid-size="64" zoom-on-cluster-click>
          <yandex-map-marker
            v-for="item in basket_delivery"
            :key="item.id"
            :settings="{ coordinates: [Number(item.location.longitude), Number(item.location.latitude)] }"
          >
            <div class="marker">
              <div v-if="currentZoom >= 12" class="marker-label">
                СДЭК <br /> 149 ₽, 3–7 дней.
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
        currentZoom: 11,
        bounds: {
          top: null,
          bottom: null,
          left: null,
          right: null
        },
        items: [
        {
          id: 1,
          mapcoordinates: [37.62, 55.75]
        },
        {
          id: 2,
          mapcoordinates: [37.621, 55.7505]
        },
        {
          id: 3,
          mapcoordinates: [37.622, 55.751]
        }
      ],
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
          action: "test",
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
          console.log('Зум:', this.currentZoom, 'Границы:', this.bounds)
        }
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
    background-color: #F00;
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
  