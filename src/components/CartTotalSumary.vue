<script>
import { computed, defineComponent } from "@vue/runtime-core";
import { useStore } from "vuex";
import { addOrder } from "../api";

export default defineComponent({
  setup() {
    // store
    const store = useStore();

    //state
    const cart = computed(() => store.state.cart);
    const isEdit = computed(() => store.state.isEdit);
    const note = computed(() => store.state.note);
    const step = computed(() => store.state.step);
    const shippingType = computed(() => store.state.shippingType);
    const quickShippingType = computed(() => store.state.quickShippingType);
    const customerId = computed(() => store.getters.customerId);
    const guestShippingInfo = computed(() => store.state.guestShippingInfo);
    const isFreeShip = computed(() => store.getters.isFreeShip);
    const shippingPrice = computed(() => store.getters.shippingPrice);
    const totalPrice = computed(() => store.getters.totalPrice);
    const subPrice = computed(() => store.getters.subPrice);
    const discount = computed(() => store.getters.discount);
    const bankCode = computed(() => store.state.bankCode);
    const paymentInfo = computed(() => store.getters.paymentInfo);
    const methodType = computed(() => store.getters.paymentMethodType);
    const customerShippingAddress = computed(
      () => store.state.customerShippingAddress
    );
    const productList = computed(() => store.getters.productList);

    const onSubmit = async () => {
      if (step.value === 1) {
        store.dispatch("setStep", step.value + 1);
        return;
      }

      if (step.value === 2) {
        if (isEdit.value) {
          store.dispatch("setError", "Vui lòng lưu thông tin nhận hàng!");
          return;
        }

        if (customerId.value && !customerShippingAddress.value.address_id) {
          store.dispatch(
            "setError",
            "Vui lòng nhập đầy đủ và lưu thông tin nhận hàng!"
          );
          return;
        } else {
        }

        if (
          shippingType.value == 0 ||
          (shippingType.value == 2 && quickShippingType.value == 0)
        ) {
          store.dispatch("setError", "Vui lòng chọn phương thức giao hàng");
          return;
        }
        await createOrder();
      }
    };

    const createOrder = async () => {
      const data = cart.value;
      debugger
      try {
        const payload = {
          cash: 0,
          cod: data.total_price - data.discount,
          discount: data.discount,
          transfer_money: 0,
          total_price: data.total_price,
          total_weight: data.weight,
          is_free_shipping: isFreeShip.value,
          shipping_fee: shippingPrice.value,
          note: note.value,
          delivery_type: shippingType.value === 1 ? "1" : quickShippingType.value,
          extend_code: "",
          status: 1,
          payment_method_type: methodType.value,
          bank_code: bankCode.value,
          payment_info: paymentInfo.value,
          address_id: "0",
          order_detail: data.detail.map((x) => {
            return {
              name: x.title,
              retail_price: x.price_retail,
              discount: x.price_sale,
              quantity: x.quantity,
              product_id: x.product_id,
              parent_id: x.parent_id,
              sku: x.sku,
              type: x.type,
            };
          }),
        };

        if (customerId.value != "") {
          payload.address_id = customerShippingAddress.value.address_id;
        } else {
          if (guestShippingInfo.value.type_send === 1) {
            payload.guest_info = {
              ...guestShippingInfo.value,
              phone: "",
              fullname: "",
            };
          } else {
            payload.guest_info = {
              ...guestShippingInfo.value,
            };
          }
        }

        store.dispatch("setLoading", true);
        const { is_change, id, redirect } = await addOrder(payload);

        if (redirect) {
          location.replace(redirect);
          return;
        }

        if (is_change) {
          await store.dispatch("getCart");
          store.commit("setCartChange", true);
          return;
        }

        store.commit("setOrderId", id);
        store.commit("setStep", 3);
      } catch (err) {
        store.dispatch("setError", "Có lỗi xảy ra vui lòng thử lại!");
      } finally {
        store.dispatch("setLoading", false);
      }
    };

    return {
      step,
      cart,
      isEdit,
      productList,
      shippingPrice,
      discount,
      totalPrice,
      subPrice,
      onSubmit,
    };
  },
});
</script>

<template>
  <div class="section py-30" v-if="productList.length > 0">
    <div class="container-fluid" v-if="productList.length > 0">
      <div class="row row-cols-2 gx-2 mb-2 align-items-center">
        <div class="col fz-14 fw-medium">Tổng cộng</div>
        <div class="col text-end fz-16 fw-semi">
          {{ Intl.NumberFormat("vi-VN").format(totalPrice) }}đ
        </div>
      </div>
      <div class="row row-cols-2 gx-2 mb-2 align-items-center">
        <div class="col fz-14 fw-medium">Phí giao hàng</div>
        <div class="col text-end fz-16 fw-semi">
          {{ Intl.NumberFormat("vi-VN").format(shippingPrice) }}đ
        </div>
      </div>
      <div class="row row-cols-2 gx-2 align-items-center">
        <div class="col fz-14 fw-medium">Giảm giá</div>
        <div class="col text-end fz-16 fw-semi">
          {{ Intl.NumberFormat("vi-VN").format(discount) }}đ
        </div>
      </div>
    </div>
  </div>
  <div class="cart-sticky">
    <div class="container">
      <div class="cart-sticky__top">
        <div class="row row-cols-2 gx-2 align-items-center">
          <div class="col">
            <span class="fz-14 fw-medium ls-20">Tổng thanh toán</span>
          </div>
          <div class="col text-end">
            <span class="fz-16 fw-bold ls-20 text-primary"
              >{{ Intl.NumberFormat("vi-VN").format(subPrice) }}đ</span
            >
          </div>
        </div>
      </div>
      <div class="cart-sticky__bottom">
        <button
          @click="onSubmit"
          class="btn btn-primary fz-14 fw-semi p-2 w-100"
          :disabled="subPrice == 0"
        >
          {{ step == 1 ? "Mua hàng" : "Đặt hàng" }}
        </button>
      </div>
    </div>
  </div>
</template>
