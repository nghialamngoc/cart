<script>
import { computed, defineComponent } from "@vue/runtime-core";
import { useStore } from "vuex";
import { addOrder } from "../api";

export default defineComponent({
  setup() {
    // store
    const store = useStore();

    //state
    const isEdit = computed(() => store.state.isEdit);
    const cart = computed(() => store.state.cart);
    const note = computed(() => store.state.note);
    const step = computed(() => store.state.step);
    const shippingType = computed(() => store.state.shippingType);
    const quickShippingType = computed(() => store.state.quickShippingType);
    const billingAddress = computed(() => store.state.billingAddress);
    const shippingAddress = computed(() => store.state.shippingAddress);
    const isValidShippingAddress = computed(
      () => store.getters.isValidShippingAddress
    );
    const isFreeShip = computed(() => store.getters.isFreeShip);
    const shippingPrice = computed(() => store.getters.shippingPrice);
    const totalPrice = computed(() => store.getters.totalPrice);
    const subPrice = computed(() => store.getters.subPrice);
    const discount = computed(() => store.getters.discount);
    const bankCode = computed(() => store.state.bankCode);
    const paymentInfo = computed(() => store.getters.paymentInfo);
    const methodType = computed(() => store.getters.paymentMethodType);

    const onSubmit = async () => {
      if (step.value === 1) {
        store.dispatch("setStep", step.value + 1);
        return;
      }

      if (step.value === 2) {
        if (isValidShippingAddress.value && !isEdit.value) {
          if (
            shippingType.value == 0 ||
            (shippingType.value == 2 && quickShippingType.value == 0)
          ) {
            store.dispatch("setError", "Vui lòng chọn phương thức giao hàng");
            return;
          }
          await createOrder();
        } else {
          store.dispatch(
            "setError",
            "Vui lòng nhập đầy đủ và lưu thông tin nhận hàng!"
          );
        }
      }
    };

    const createOrder = async () => {
      const data = cart.value;
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
          delivery_type: shippingType.value === 1 ? 1 : quickShippingType.value,
          extend_code: "",
          bill_full_name: billingAddress.value.customer_id
            ? billingAddress.value.name
            : "",
          bill_phone_number: billingAddress.value.customer_id
            ? billingAddress.value.phone_number
            : "",
          shipping_full_name: shippingAddress.value.name,
          shipping_phone_number: shippingAddress.value.phone_number,
          shipping_address: shippingAddress.value.address,
          shipping_province_id: shippingAddress.value.province_id,
          shipping_province_name: shippingAddress.value.province_name,
          shipping_district_id: shippingAddress.value.district_id,
          shipping_district_name: shippingAddress.value.district_name,
          shipping_commune_id: shippingAddress.value.commune_id,
          shipping_commune_name: shippingAddress.value.commune_name,
          address_id: billingAddress.value.customer_id
            ? billingAddress.value.address_id
            : "0",
          customer_id: billingAddress.value.customer_id
            ? billingAddress.value.customer_id
            : "0",
          status: 1,
          payment_method_type: methodType.value,
          bank_code: bankCode.value,
          payment_info: paymentInfo.value,
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
  <div class="section py-30">
    <div class="container-fluid">
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
