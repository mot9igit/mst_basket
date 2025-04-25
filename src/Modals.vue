<template>
  <BasketModal
    :modal="globalState.basket_modal"
    @update:modal="globalState.basket_modal = $event"
  />
  <BasketMiniModal
    :modal="globalState.basket_mini_modal"
    @update:modal="globalState.basket_mini_modal = $event"
  />
</template>

<script>
import { inject } from 'vue'
import BasketModal from './components/BasketModal.vue'
import BasketMiniModal from './components/BasketMiniModal.vue'

export default {
  name: 'Modals',
  components: { BasketModal, BasketMiniModal },
  setup() {
    const globalState = inject('globalState')
    return { globalState }
  }
}
</script>
<style scoped lang="scss">
  
</style>
