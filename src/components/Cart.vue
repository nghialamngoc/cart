<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  watch,
} from "@vue/runtime-core";
import { useStore } from "vuex";

import CartTotalSumary from "./CartTotalSumary.vue";
import CartInfo from "./CartInfo.vue";
import CartPay from "./CartPay.vue";
import CartHeader from "./CartHeader.vue";
import ErrorDialog from "./ErrorDialog.vue";
import Loading from "./Loading.vue";
import CartSuccess from "./CartSuccess.vue";
import CartChangeDialog from "./CartChangeDialog.vue";

export default defineComponent({
  components: {
    ErrorDialog,
    CartHeader,
    CartInfo,
    CartPay,
    CartTotalSumary,
    Loading,
    CartSuccess,
    CartChangeDialog,
  },
  setup() {
    // store
    const store = useStore();

    // state
    const cart = computed(() => store.state.cart);
    const step = computed(() => store.state.step);
    const isLoading = computed(() => store.state.loading);
    const error = computed(() => store.state.error);
    const cartChange = computed(() => store.state.cartChange);
    const errorMessage = computed(() => store.state.errorMessage);
    const productList = computed(() => store.getters.productList);

    // Lifecycle
    onBeforeMount(async () => {
      await store.dispatch("init");
    });

    watch(cart.value, () => {
      getGiftList();
    });

    // Methods
    const onChangeStep = async (stepChange) => {
      store.dispatch("setStep", stepChange);
    };

    const onHideError = () => {
      store.dispatch("setError", "");
    };

    const onHideInfoDialog = () => {
      store.commit("setCartChange", false);
    };

    return {
      step,
      error,
      isLoading,
      cartChange,
      productList,
      errorMessage,
      // Action
      onChangeStep,
      onHideError,
      onHideInfoDialog,
    };
  },
});
</script>

<template>
  <main class="main" id="main">
    <CartHeader :step="step" @onChangeStep="onChangeStep" />
    <template v-if="productList.length === 0">
      Giỏ hàng trống mua ngay
    </template>
    <template v-else>
      <CartInfo v-if="step === 1" />
      <CartPay v-if="step === 2" />
      <CartSuccess v-if="step === 3" />

      <!-- Cart Summary -->
      <CartTotalSumary v-if="step != 3" />
    </template>
  </main>

  <ErrorDialog
    :isOpen="error"
    :message="errorMessage"
    :hideError="onHideError"
    title="Lỗi!"
  />

  <CartChangeDialog :isOpen="cartChange" :hideError="onHideInfoDialog" />

  <!-- LOADING MODAL -->
  <Loading :isLoading="isLoading"></Loading>
</template>
