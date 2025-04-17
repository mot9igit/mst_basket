<template>
  <div>
    <yandex-map
      v-model="map"
      :settings="{
        location: {
          center: [37.617644, 55.755819],
          zoom: 9,
        },
        behaviors: ['drag', 'scrollZoom'],
      }"
      width="100%"
      height="500px"
    >
      <yandex-map-default-scheme-layer />
      <yandex-map-default-features-layer />
      <yandex-map-default-marker :settings="{ coordinates: [37.617644, 55.755819] }" />

      <!-- Слушаем изменения карты -->
      <yandex-map-listener :settings="{ onUpdate: handleUpdate }" />
    </yandex-map>

    <div style="margin-top: 20px;">
      <p>Север (top): {{ bounds.top }}</p>
      <p>Юг (bottom): {{ bounds.bottom }}</p>
      <p>Запад (left): {{ bounds.left }}</p>
      <p>Восток (right): {{ bounds.right }}</p>
      <p>Масштаб (zoom): {{ zoom }}</p>
    </div>
  </div>
</template>

<script setup>
import { shallowRef, reactive, ref } from 'vue';
import {
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapListener,
} from 'vue-yandex-maps';

const map = shallowRef(null);

const bounds = reactive({
  top: null,
  bottom: null,
  left: null,
  right: null,
});

const zoom = ref(null);

function handleUpdate(e) {
  if (e.type === 'update' && e.location && e.location.bounds) {
    const [[left, top], [right, bottom]] = e.location.bounds;

    bounds.top = top.toFixed(6);
    bounds.bottom = bottom.toFixed(6);
    bounds.left = left.toFixed(6);
    bounds.right = right.toFixed(6);

    zoom.value = e.location.zoom.toFixed(2);

    console.log('Границы и зум обновлены:', bounds, 'Zoom:', zoom.value);
  }
}
</script>
