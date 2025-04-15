<script setup>
</script>

<template>
  <div class="d-col-basket">
    <span class="h3"><div class="mobile-basket__close"><i class="d_icon d_icon-left-arrow mobileBasketToggleClose"></i>Корзина</div>
      <form method="post" class="ms2_form">
        <button type="submit" name="ms2_action" value="cart/clean" class="basket-clear-btn">
          Очистить
        </button>
      </form>
    </span>
  </div>
</template>

<style scoped lang="scss">
  .d-col-basket {
    overflow: hidden;
    padding: 20px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.06);
    box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.06);
    max-height: 700px;
    height: 70vh;
    background: var(--main-background-windows);

    /* УДАЛИТЬ! */
    width: 350px;

    .h3 {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      margin-bottom: 20px;
  }
  }
</style>
