<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: ['step'],
  setup() {
    const baseUrl = !window.location.origin.includes("localhost")
      ? window.location.origin
      : "https://quang.tvtsolutions.com";

    return {
      baseUrl,
    };
  },
});
</script>

<template>
  <header id="header" class="header header--checkout">
    <div class="container-fluid">
      <h1 class="header__logo">
        <a href="#" class="fz-14">
          <i class="fas fa-chevron-left"></i>
          GIỎ HÀNG
        </a>
      </h1>
      <div class="header-step">
        <div class="header-step__item active">
          <div class="header-step__item__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/pg-1.svg`"
              alt=""
            />
          </div>
        </div>
        <div class="header-step__item active">
          <div class="header-step__item__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/pg-2.svg`"
              alt=""
            />
          </div>
        </div>
        <div class="header-step__item">
          <div class="header-step__item__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/pg-3.svg`"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
