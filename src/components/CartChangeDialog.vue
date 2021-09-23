<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: ["isOpen", "hideError"],
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="x-modal" v-if="isOpen" @click="hideError">
    <div class="x-modal__mark"></div>
    <div class="x-modal__content">
      <div class="thank-box">
        <p class="thank-box__title">Thông báo</p>
        <p class="thank-box__sub">Giỏ hàng của bạn đã cập nhập. Vui lòng kiểm tra lại trước khi đặt hàng!</p>
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

.x-modal__content {
  background: white;
  opacity: 1;
  z-index: 2;
  width: 300px;
  padding: 20px;
  border-radius: 10px;
}

.x-loading__content {
  flex-grow: 1;
}

.thank-box__icon {
  width: 50px;
  margin: 10px;
}

.thank-box__title {
  font-size: 14px;
}
</style>
