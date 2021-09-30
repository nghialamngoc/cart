<script>
import { defineComponent } from "@vue/runtime-core";
import { baseUrl } from "../../constant";

export default defineComponent({
  props: ["step"],
  emits: ["onChangeStep"],
  setup(props, { emit }) {
    const goBack = () => {
      if (props.step === 2) {
        emit("onChangeStep", 1);
      }
    };

    return {
      baseUrl,
      goBack,
    };
  },
});
</script>

<template>
  <header id="header" class="header header--checkout">
    <div class="container-fluid">
      <h1 class="header__logo">
        <div class="fz-14" @click="goBack">
          <i
            class="fas fa-chevron-left"
            style="margin-right: 3px"
            v-if="step != 3"
          ></i>
          GIỎ HÀNG
        </div>
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
        <div :class="`header-step__item ${step >= 2 && 'active'}`">
          <div class="header-step__item__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/pg-2.svg`"
              alt=""
            />
          </div>
        </div>
        <div :class="`header-step__item ${step >= 3 && 'active'}`">
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
