<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="cart-sticky">
    <div class="container">
      <div class="cart-sticky__top">
        <div class="row row-cols-2 gx-2 align-items-center">
          <div class="col">
            <span class="fz-14 fw-medium ls-20">Tổng thanh toán</span>
          </div>
          <div class="col text-end">
            <span class="fz-16 fw-bold ls-20 text-primary">800.000đ</span>
          </div>
        </div>
      </div>
      <div class="cart-sticky__bottom">
        <a href="#" class="btn btn-primary fz-14 fw-semi p-2 w-100">Đặt hàng</a>
      </div>
    </div>
  </div>
</template>
