<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
  ref,
  watch,
} from "@vue/runtime-core";

import { resolveErrorMessage } from "../helper/resolveErrorMessage";
import axios from "axios";

import CartTotalSumary from "./CartTotalSumary.vue";
import CartInfo from "./CartInfo.vue";
import CartPay from "./CartPay.vue";
import CartHeader from "./CartHeader.vue";
import ErrorDialog from "./ErrorDialog.vue";
import Loading from "./Loading.vue";

export default defineComponent({
  components: {
    ErrorDialog,
    CartHeader,
    CartInfo,
    CartPay,
    CartTotalSumary,
    Loading,
  },
  setup() {
    const step = ref(1);
    const isError = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const freeShipingWhen = ref({});
    const shippingPrice = ref(0);
    const paymentMethod = ref(0);

    const cart = reactive({
      value: {},
    });
    const packList = reactive({
      value: [],
    });
    const voucherList = reactive({
      value: [],
    });
    const giftList = reactive({
      value: [],
    });
    const collection = reactive({
      value: [],
    });

    const baseUrl = !window.location.origin.includes("localhost")
      ? window.location.origin
      : "https://quang.tvtsolutions.com";

    // Lifecycle
    onBeforeMount(async () => {
      await getCartInfo();
      await getProductPackList();
      await getVoucherList();
      await getGiftList();
      getCollection();
      getFreeshipCondition();
    });

    watch(cart.value, () => {
      getGiftList();
    });

    // Services
    const callApi = async (url, payload, target, isShowError = true) => {
      try {
        isLoading.value = true;
        const { data } = await axios.post(`${baseUrl}${url}`, payload);

        if (target) {
          target.value = data.data;
        }
      } catch (err) {
        if (isShowError) {
          setError(resolveErrorMessage(err.response));
        }
      } finally {
        isLoading.value = false;
      }
    };

    const isFreeShip = computed(() => {
      const voucherFreeShip = voucherList.value.find((x) => x.type === 0);

      if (voucherFreeShip) {
        return voucherFreeShip.voucher_id === cart.value.discount_code;
      }

      return false;
    });

    // Methods
    const getFreeshipCondition = async () => {
      await callApi("/shipping/api/v1/free", null, freeShipingWhen, false);
    };

    const getCollection = async () => {
      await callApi("/cart/api/v1/collection", null, collection, false);
    };

    const getGiftList = async () => {
      await callApi(
        "/product/api/v1/gift/list",
        {
          total_price: cart.value.total_price,
        },
        giftList,
        false
      );
    };

    const getProductPackList = async () => {
      await callApi("/product/api/v1/pack/list", null, packList);
    };

    const addProductToCart = async (payload) => {
      await callApi("/cart/api/v1/add", payload, null);
      await getCartInfo();
    };

    const getVoucherList = async () => {
      await callApi(
        "/voucher/api/v1/voucher_for_cart",
        null,
        voucherList,
        false
      );
    };

    const addVoucherCode = async (voucher) => {
      if (!voucher) {
        return;
      }

      await callApi(
        "/cart/api/v1/add_voucher_code",
        {
          voucher_code: voucher,
        },
        null
      );
      getCartInfo();
    };

    const addVoucher = async (voucher) => {
      if (cart.value.discount_code === voucher.voucher_id) {
        return;
      }

      if (voucher.discount_limit > cart.value.total_price) {
        setError("Bạn chưa đủ điều kiện áp dụng voucher này");
        return;
      }

      await callApi(
        "/cart/api/v1/add_voucher",
        {
          voucher_id: voucher.voucher_id,
        },
        null
      );
      getCartInfo();
    };

    const getCartInfo = async () => {
      await callApi("/cart/api/v1/info", null, cart);
      getGiftList();
    };

    const onChangeStep = async (stepChange) => {
      if (stepChange == 3) {
        createOrder();
        return;
      }
      step.value = stepChange;
      document.getElementById("main").scrollIntoView();
    };

    const setLoading = (state) => {
      isLoading.value = state;
    };

    const setError = (message) => {
      isError.value = true;
      errorMessage.value = message;
    };

    const onHideError = () => {
      isError.value = false;
    };

    const setShippingFree = (value) => {
      shippingPrice.value = value;
    };

    const setPaymentMethod = (value) => {
      paymentMethod.value = value;
    };

    const createOrder = async() => {
      try {
        if (cart.value.customer != "0") {
          // customer address default
        }

        const payload = {
          bill_full_name: "",
          bill_phone_number: "",
          address_id: "",
          shipping_address: cart.value.address,
          shipping_full_address: cart.value.address,
          shipping_full_name: cart.value.fullname,
          shipping_phone_number: cart.value.phone,
          shipping_commune_id: cart.value.commune_id,
          shipping_commune_name: cart.value.commune_name,
          shipping_district_id: cart.value.district_id,
          shipping_district_name: cart.value.district_name,
          shipping_province_id: cart.value.commune_id,
          shipping_province_name: cart.value.commune_name,
          note: "",
          is_free_shipping: isFreeShip.value,
          shipping_fee: isFreeShip.value ? 0 : shippingPrice.value,
          discount: cart.value.discount,
          transfer_money: 0,
          total_weight: cart.value.weight,
          total_amount: cart.value.sub_total,
          actual_shipping_cost: isFreeShip.value ? 0 : shippingPrice.value,
          order_detail: cart.value.detail.map((x) => {
            return {
              retail_price: x.price_retail,
              discount: x.price_sale,
              quantity: x.quantity,
              product_id: Number(x.product_id),
              parent_id: Number(x.parent_id),
              sku: x.sku,
            };
          }),
        };
        isLoading.value = true;
        await axios.post(`https://tvtsolutions.com/orders/api/v1/website/add`, payload);
      } catch (err) {
        setError("Có lỗi xảy ra vui lòng thử lại!");
      } finally {
        isLoading.value = false;
      }

    };

    return {
      paymentMethod,
      isFreeShip,
      shippingPrice,
      freeShipingWhen,
      collection,
      cart,
      packList,
      voucherList,
      giftList,
      isLoading,
      isError,
      errorMessage,
      step,
      baseUrl,
      // Action
      onChangeStep,
      onHideError,
      addVoucher,
      addVoucherCode,
      addProductToCart,
      setLoading,
      setError,
      getCartInfo,
      setShippingFree,
      setPaymentMethod,
    };
  },
});
</script>

<template>
  <main class="main" id="main">
    <CartHeader :step="step" @onChangeStep="onChangeStep" />

    <CartInfo
      v-if="step === 1"
      :cart="cart"
      :baseUrl="baseUrl"
      :vouchers="voucherList"
      :packList="packList"
      :giftList="giftList"
      :collection="collection"
      :freeShipingWhen="freeShipingWhen"
      @addProductToCart="addProductToCart"
      @addVoucher="addVoucher"
      @setLoading="setLoading"
      @setError="setError"
      @getCartInfo="getCartInfo"
      @addVoucherCode="addVoucherCode"
    />
    <CartPay
      v-if="step === 2"
      :isFreeShip="isFreeShip"
      :baseUrl="baseUrl"
      :cart="cart"
      :paymentMethod="paymentMethod"
      @onChangeStep="onChangeStep"
      @setLoading="setLoading"
      @getCartInfo="getCartInfo"
      @setError="setError"
      @setShippingFree="setShippingFree"
      @setPaymentMethod="setPaymentMethod"
    />

    <!-- Cart Summary -->
    <CartTotalSumary
      :step="step"
      :cart="cart"
      :shippingPrice="shippingPrice"
      @onChangeStep="onChangeStep"
    />
  </main>

  <ErrorDialog
    :isOpen="isError"
    :message="errorMessage"
    :hideError="onHideError"
    title="Lỗi!"
  />

  <!-- LOADING MODAL -->
  <Loading :isLoading="isLoading"></Loading>
</template>
