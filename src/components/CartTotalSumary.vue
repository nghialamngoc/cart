<script>
import { computed, defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: ["cart", "step", "shippingPrice"],
  emits: ["onChangeStep"],
  setup(props, { emit }) {
    const totalPrice = computed(() => {
      const { cart } = props
      if (!cart.value) {
        return 0;
      }

      let result = cart.value.total_price;

      if (cart.value.detail) {
        const pack = cart.value.detail.find((x) => x.type === 3);
        if (pack) {
          result += pack.price_retail;
        }
      }

      return result;
    });

    const subPrice = computed(() => {
      const {cart, shippingPrice} = props

      if (!cart.value) {
        return 0;
      }

      return totalPrice.value + shippingPrice - cart.value.discount;
    });

    const onSubmit = () => {
      emit("onChangeStep", props.step + 1);
    };

    return {
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
          {{ Intl.NumberFormat("vi-VN").format(cart.value.discount) }}đ
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
        >
          Đặt hàng
        </button>
      </div>
    </div>
  </div>
</template>
