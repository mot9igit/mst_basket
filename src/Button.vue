<template>
  <button @click="addBasket(4992)">Добавить товар</button>
</template>

<script>
  import { mapActions, mapGetters } from "vuex";

  export default {
    name: 'Button',
    data() {
      return {

      }
    },
    components: {
      
    },
    computed: {

    },
    mounted() {
      
    },
    updated() {

    },
    methods: {
      ...mapActions([
        'basket_api'
      ]),
      addBasket(product_id){
        this.basket_api({
          action: 'add',
          product_id: product_id,
          count: 1,
          store: 48,
          org: 1
        })
      },
    },
    watch: {
      
    }
}
</script>
<style scoped lang="scss">
  
</style>
