<script>
import { defineComponent } from "@vue/runtime-core";
import { baseUrl } from "../../constant";

export default defineComponent({
  props: ["isLoading"],
  setup() {
    return {
      baseUrl,
    };
  },
});
</script>

<template>
  <!-- LOADING MODAL -->
  <div class="x-modal" v-if="isLoading">
    <div class="x-modal__mark"></div>
    <div class="x-loading__content" style="width: 100px">
      <div class="thank-box">
        <img
          class="thank-box__icon"
          :src="`${baseUrl}/1111111111111111111/images/loading-2.svg`"
          alt=""
        />
        <p class="thank-box__title">Loading</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.x-modal {
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1061;
}

.x-modal__mark {
  position: absolute;
  opacity: 0.5;
  width: 100%;
  height: 100%;
  background: #bfc1cb;
}

.x-loading__content {
  background: white;
  opacity: 1;
  z-index: 2;
  border-radius: 10px;
}

.thank-box__icon {
  width: 50px;
  margin: 10px;
}

.thank-box__title {
  font-size: 14px;
}
</style>
