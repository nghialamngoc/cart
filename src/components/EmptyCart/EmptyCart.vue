<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  setup() {},
});
</script>

<template>
  <div class="d-flex">
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
              <img src="images/pg-1.svg" alt="" />
            </div>
          </div>
          <div class="header-step__item">
            <div class="header-step__item__icon">
              <img src="images/pg-2.svg" alt="" />
            </div>
          </div>
          <div class="header-step__item">
            <div class="header-step__item__icon">
              <img src="images/pg-3.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="main">
      <div class="section pt-15 pb-20">
        <div class="container-fluid">
          <div class="custom-alert mb-10">
            <div class="custom-alert__icon">
              <img src="images/sign-out.svg" alt="" />
            </div>
            <div class="custom-alert__content ps-2">
              <div class="d-flex align-items-center justify-content-between">
                <span class="d-inline-block me-2"
                  >Đăng nhập ngay để nhận ưu đãi</span
                >
                <button
                  type="button"
                  class="btn btn-fit fz-14 fw-semi"
                  data-bs-toggle="modal"
                  data-bs-target="#loginModal"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
          <div class="row gx-2 align-items-center">
            <div class="col">
              <div class="d-flex align-items-center">
                <img
                  class="flex-shrink-0 me-10"
                  src="images/transport-37.svg"
                  alt=""
                />
                <div class="flex-grow-1">
                  <p class="mb-0">Mua thêm 200.000đ để hưởng</p>
                  <p class="mb-0 fw-semi">VẬN CHUYỂN MIỄN PHÍ</p>
                </div>
              </div>
            </div>
            <div class="col-auto">
              <a href="#" class="btn btn-icon-end btn-fit text-primary fw-semi"
                >Xem thêm <i class="fas fas fa-chevron-right"></i
              ></a>
            </div>
          </div>
        </div>
      </div>
      <div class="separate-line"></div>
      <div class="section py-30">
        <div class="container-fluid">
          <div class="empty-cart">
            <div class="empty-cart__icon">
              <img src="images/empty-cart.svg" alt="" />
            </div>
            <p class="empty-cart__title">Giỏ hàng của bạn đang trống</p>
          </div>
        </div>
      </div>
    </main>

    <div class="cart-sticky">
      <div class="container">
        <div class="cart-sticky__top">
          <div class="row row-cols-2 gx-2 align-items-center">
            <div class="col">
              <span class="fz-14 fw-medium ls-20">Tổng thanh toán</span>
            </div>
            <div class="col text-end">
              <span class="fz-16 fw-bold ls-20 text-primary">0đ</span>
            </div>
          </div>
        </div>
        <div class="cart-sticky__bottom">
          <a
            href="#"
            class="btn btn-primary fz-14 fw-semi p-2 w-100"
            data-bs-toggle="modal"
            data-bs-target="#addToCartModal"
            >Đặt hàng</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
