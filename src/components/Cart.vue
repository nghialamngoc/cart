<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
  ref,
} from "@vue/runtime-core";
import axios from "axios";
import { resolveErrorMessage } from "../helper/resolveErrorMessage";
import ErrorDialog from "./ErrorDialog.vue";
import Loading from "./Loading.vue";

export default defineComponent({
  components: {
    ErrorDialog,
    Loading,
  },
  setup() {
    const baseUrl = !window.location.origin.includes("localhost")
      ? window.location.origin
      : "https://quang.tvtsolutions.com";

    const isError = ref(false);
    const isErrorVoucher = ref(false);
    const errorMessage = ref("");
    const voucherCode = ref("");
    const packDetail = ref({});
    const isLoading = ref(false);

    const packList = reactive({
      value: [],
    });

    const cart = reactive({
      value: {},
    });

    const vouchers = reactive({
      value: [],
    });

    onBeforeMount(async () => {
      await getCartInfo();
      await getProductPackList();
      await getVoucherList();
    });

    // computed
    const products = computed(() => {
      return cart.value?.detail
        ? cart.value.detail.filter((x) => x.type === 1)
        : [];
    });

    const packSelected = computed(() => {
      if (!cart.value?.detail) {
        return "";
      }

      const pack = cart.value?.detail.find((x) => x.type === 3);
      if (pack) {
        return pack.product_id;
      }

      return "";
    });

    const totalPrice = computed(() => {
      if (!cart) {
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
      if (!cart) {
        return 0;
      }

      return totalPrice.value - cart.value.discount;
    });

    const vouchersHot = computed(() => {
      return vouchers.value ? vouchers.value.filter((x) => x.level === 2) : [];
    });

    const vouchersSpecial = computed(() => {
      return vouchers.value ? vouchers.value.filter((x) => x.level === 3) : [];
    });

    const validVoucher = computed(() => {
      return vouchers.value
        ? vouchers.value.filter(
            (x) => x.discount_limit <= cart.value.total_price
          )
        : [];
    });

    // methods
    const getProductPackList = async () => {
      try {
        const { data } = await axios.post(
          `${baseUrl}/product/api/v1/pack/list`
        );

        packList.value = data.data;
      } catch (err) {
        console.log(err);
      }
    };

    const addProductToCart = async (payload) => {
      try {
        isLoading.value = true;
        await axios.post(`${baseUrl}/cart/api/v1/add`, payload);
        getCartInfo();
      } catch (err) {
        isError.value = true;
        errorMessage.value = resolveErrorMessage(err.response);
      } finally {
        isLoading.value = false;
      }
    };

    const getCartInfo = async () => {
      try {
        isLoading.value = true;
        const { data } = await axios.post(`${baseUrl}/cart/api/v1/info`);
        cart.value = data.data;
      } catch (err) {
        isError.value = true;
        errorMessage.value = resolveErrorMessage(err.response);
      } finally {
        isLoading.value = false;
      }
    };

    const getVoucherList = async () => {
      try {
        isLoading.value = true;
        const { data } = await axios.post(`${baseUrl}/voucher/api/v1/cartlist`);
        vouchers.value = data.data;
      } catch (err) {
        console.log(err);
        isError.value = true;
        errorMessage.value = resolveErrorMessage(err.response);
      } finally {
        isLoading.value = false;
      }
    };

    const addVoucherCode = async () => {
      try {
        isLoading.value = true;
        await axios.post(`${baseUrl}/cart/api/v1/add_voucher_code`, {
          voucher_code: voucherCode.value,
        });

        getCartInfo();
      } catch (err) {
        isError.value = true;
        errorMessage.value = resolveErrorMessage(err.response);
      } finally {
        isLoading.value = false;
      }
    };

    const addVoucher = async (voucher) => {
      if (cart.value.discount_code === voucher.voucher_id) {
        return;
      }

      if (voucher.discount_limit > cart.value.total_price) {
        isErrorVoucher.value = true;
        return;
      }

      try {
        isLoading.value = true;
        await axios.post(`${baseUrl}/cart/api/v1/add_voucher`, {
          voucher_id: voucher.voucher_id,
        });

        getCartInfo();
      } catch (err) {
        isError.value = true;
        errorMessage.value = resolveErrorMessage(err.response);
      } finally {
        isLoading.value = false;
      }
    };

    const showProductModal = () => {
      console.log("hello");
    };

    const onPackChange = (id) => {
      if (id === packSelected.value) {
        return;
      }

      addProductToCart({
        product_id: id,
        quantity: 1,
        type: 3,
      });
    };

    const onQuantityChange = (product_id, quantity) => {
      if (quantity < 0) {
        return;
      }

      addProductToCart({
        product_id,
        quantity,
        type: 1,
      });
    };

    const viewDetailPack = (pack) => {
      packDetail.value = pack;
    };

    const hideError = () => {
      isError.value = false;
    };

    const hideErrorVoucher = () => {
      isErrorVoucher.value = false;
    };

    return {
      packDetail,
      voucherCode,
      validVoucher,
      subPrice,
      totalPrice,
      errorMessage,
      isLoading,
      isError,
      isErrorVoucher,
      vouchers,
      vouchersHot,
      vouchersSpecial,
      packList,
      baseUrl,
      cart,
      products,
      packSelected,
      showProductModal,
      onQuantityChange,
      onPackChange,
      hideError,
      hideErrorVoucher,
      addVoucher,
      addVoucherCode,
      viewDetailPack,
    };
  },
});
</script>

<template>
  <div>
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
          <div class="header-step__item">
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
    <main class="main">
      <div class="section pt-15 pb-20">
        <div class="container-fluid">
          <div
            class="custom-alert mb-10"
            v-if="cart.value.customer_id == '0' || cart.value.customer_id == ''"
          >
            <div class="custom-alert__icon">
              <img
                :src="`${baseUrl}/1111111111111111111/images/sign-out.svg`"
              />
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
                  :src="`${baseUrl}/1111111111111111111/images/transport-37.svg`"
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
          <div class="m-cart" v-for="(product, index) in products" :key="index">
            <div class="m-cart__img">
              <img :src="product.image" alt="" />
            </div>
            <div class="m-cart__info">
              <div class="m-cart__info__top">
                <button class="btn-close m-cart__delete"></button>
              </div>
              <div class="m-cart__info__center">
                <p class="m-cart__title">
                  <a href="#">{{ product.title }}</a>
                </p>
                <p class="m-cart__price">
                  {{ product.price_sale }}đ
                  <del>{{ product.price_retail }}đ</del>
                </p>
              </div>
              <div class="m-cart__info__bottom">
                <div class="m-cart__edit">
                  <div class="m-cart__edit__left">
                    <button
                      type="button"
                      class="btn m-cart__select m-cart__select--color"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                    >
                      Màu
                      <span class="color-circle">
                        <span
                          :style="{
                            backgroundImage: `url(${product.attribute.color})`,
                          }"
                        ></span>
                      </span>
                    </button>
                    <button
                      type="button"
                      class="btn m-cart__select m-cart__select--size"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                    >
                      Size <strong>{{ product.attribute.size }}</strong>
                    </button>
                  </div>
                  <div class="m-cart__edit__right">
                    <div
                      class="quantity-picker quantity-picker-2 m-cart__quantity"
                    >
                      <span
                        class="quantity-picker__btn quantity-picker__btn__minus"
                        @click="
                          () =>
                            onQuantityChange(
                              product.product_id,
                              product.quantity - 1
                            )
                        "
                      >
                        <i class="fas fa-minus"></i>
                      </span>
                      <input
                        type="number"
                        class="quantity-picker__input"
                        v-model="product.quantity"
                      />
                      <span
                        class="quantity-picker__btn quantity-picker__btn__plus"
                        @click="
                          () =>
                            onQuantityChange(
                              product.product_id,
                              product.quantity + 1
                            )
                        "
                      >
                        <i class="fas fa-plus"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <p class="m-cart__note">(Chỉ còn 2 trong kho - đặt hàng sớm)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="separate-line"></div>
      <!-- <section class="section py-30">
        <div class="container-fluid">
          <div class="g-head">
            <div class="g-head__left">
              <h2 class="g-head__title">QUÀ TẶNG</h2>
              <p class="g-head__sub">Một món quà có thể chọn</p>
            </div>
            <div class="g-head__right">
              <button
                type="button"
                class="btn btn-dark g-head__btn"
                data-bs-toggle="modal"
                data-bs-target="#giftModal"
              >
                Chọn lại
              </button>
            </div>
          </div>
          <div class="g-body">
            <div class="m-cart">
              <div class="m-cart__img">
                <img
                  :src="`${baseUrl}/1111111111111111111/images/qua-tang.jpg`"
                  alt=""
                />
              </div>
              <div class="m-cart__info">
                <div class="m-cart__info__top"></div>
                <div class="m-cart__info__center">
                  <p class="m-cart__title">
                    <a href="#"
                      >Monogram Print Cotton Piqué Oversized Polo Shirt</a
                    >
                  </p>
                  <p class="m-cart__price">
                    0đ
                    <del>500.000đ</del>
                  </p>
                  <div class="m-cart__edit">
                    <div class="m-cart__edit__left">
                      <button
                        type="button"
                        class="btn m-cart__select m-cart__select--color"
                        data-bs-toggle="modal"
                        data-bs-target="#addToCartModal"
                      >
                        Màu
                        <span class="color-circle">
                          <span style="background-color: #2f3f75"></span>
                        </span>
                      </button>
                      <button
                        type="button"
                        class="btn m-cart__select m-cart__select--size"
                        data-bs-toggle="modal"
                        data-bs-target="#addToCartModal"
                      >
                        Size <strong>XL</strong>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="m-cart__info__bottom">
                  <div class="m-cart__edit">
                    <div class="m-cart__edit__left">
                      <div class="m-cart__for">
                        Áp dụng <br />cho đơn hàng trên 600k
                      </div>
                    </div>
                    <div class="m-cart__edit__right">
                      <label class="custom-checkbox m-cart__edit__btn">
                        <input type="radio" name="gift-selected" checked />
                        <span
                          class="checkmark-btn checkmark-btn--2"
                          data-text="Chọn"
                          data-text-selected="Đã chọn"
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="m-cart__note">
                <div class="info-txt">
                  <img
                    :src="`${baseUrl}/1111111111111111111/images/info.svg`"
                    alt=""
                  />
                  Sản phẩm khuyến mãi cuối cùng không thể trả lại
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> -->
      <div class="separate-line"></div>
      <section class="section pt-30 pb-35">
        <div class="container-fluid">
          <div class="heading d-flex align-items-center mb-3">
            <h2 class="heading__title flex-shrink-0">Chọn hộp đóng gói</h2>
            <div
              class="border-top border-C0 flex-grow-1 ms-3 opacity-0-5"
            ></div>
          </div>
          <div class="pack-wrap">
            <div
              v-for="(pack, index) in packList.value"
              :class="`pack-item`"
              :key="index"
            >
              <div class="pack-item__img">
                <img :src="pack.image" alt="" />
              </div>
              <div class="pack-item__info">
                <div class="pack-item__info__row pack-item__info__row--1">
                  <div class="pack-item__info__row__left">
                    <p class="pack-item__title">{{ pack.title }}</p>
                    <p class="pack-item__desc">{{ pack.sub_title }}</p>
                  </div>
                  <div class="pack-item__info__row__right">
                    <button
                      type="button"
                      class="btn btn-icon-start pack-item__detail"
                      data-bs-toggle="modal"
                      data-bs-target="#packDetailModal"
                      @click="() => viewDetailPack(pack)"
                    >
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/search-8E.svg`"
                        alt=""
                      />
                      Chi tiết
                    </button>
                  </div>
                </div>
                <div class="pack-item__info__row pack-item__info__row--2">
                  <div class="pack-item__info__row__left">
                    <p class="pack-item__price">
                      <span class="pack-item__price__number"
                        >{{
                          Intl.NumberFormat("vi-VN").format(pack.price_retail)
                        }}đ</span
                      >
                      <span
                        class="pack-item__price__text"
                        v-if="pack.price_retail === 0"
                        >(Miễn phí)</span
                      >
                    </p>
                  </div>
                  <div class="pack-item__info__row__right">
                    <label class="custom-checkbox pack-item__btn">
                      <input
                        type="radio"
                        :name="pack.product_id"
                        @click="() => onPackChange(pack.product_id)"
                      />
                      <span
                        class="checkmark-btn"
                        :style="{
                          backgroundColor:
                            pack.product_id === packSelected
                              ? '#DCF0FF'
                              : 'white',
                          borderColor:
                            pack.product_id === packSelected
                              ? '#DCF0FF'
                              : '#004377',
                        }"
                      >
                        {{
                          pack.product_id === packSelected
                            ? pack.price_retail === 0
                              ? "Mặc định"
                              : "Đã chọn"
                            : "Chọn hộp này"
                        }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="separate-line"></div>
      <section class="section pt-30 pb-35">
        <div class="container-fluid">
          <div class="heading">
            <h2 class="heading__title">Mã giảm giá</h2>
          </div>
          <div class="apply-voucher mb-25">
            <input
              type="text"
              class="form-control apply-voucher__input"
              placeholder="Mã giảm giá"
              v-model="voucherCode"
            />
            <button
              type="button"
              class="btn btn-primary apply-voucher__btn"
              @click="addVoucherCode"
            >
              Chọn mã
            </button>
          </div>
          <div
            class="row row-cols-2 gx-3 mb-10"
            v-if="vouchers.value.length > 0"
          >
            <div class="col fw-semi">Voucher khả dụng</div>
            <div class="col text-end">
              <button
                type="button"
                class="btn btn-fit btn-icon-end"
                data-bs-toggle="modal"
                data-bs-target="#voucherModal"
                v-if="vouchers.value.length > 1"
              >
                Xem tất cả
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div class="vb-cate__content">
            <div
              :class="`vb-item ${voucher.type == 2 && 'vb-item--special'}`"
              v-for="(voucher, index) in validVoucher"
              :key="index"
            >
              <div class="vb-item__inner">
                <div class="vb-item__icon">
                  <img
                    :src="
                      voucher.type === 0
                        ? `${baseUrl}/1111111111111111111/images/vb-1.svg`
                        : voucher.type === 1
                        ? `${baseUrl}/1111111111111111111/images/vb-2.svg`
                        : `${baseUrl}/1111111111111111111/images/vb-special.svg`
                    "
                    alt=""
                  />
                </div>
                <div class="vb-item__info">
                  <div class="vb-item__head">
                    <span class="vb-item__title">{{ voucher.name }}</span>
                  </div>
                  <p class="vb-item__desc">
                    {{ voucher.content }}<br />Mã: {{ voucher.code }}
                  </p>
                  <div class="vb-item__footer">
                    <div class="vb-item__expiration">
                      Ngày hết hạn {{ voucher.end_at }}
                    </div>
                    <label class="vb-item__apply text-toggle">
                      <input
                        type="checkbox"
                        value="POLOFREE"
                        name="vb"
                        class="text-toggle__input"
                        checked
                      />
                      <span
                        class="text-toggle__checkmark"
                        :style="{
                          color:
                            cart.value.discount_code === voucher.voucher_id
                              ? '#C0C2CB'
                              : '#004377',
                        }"
                        @click="() => addVoucher(voucher)"
                        >{{
                          cart.value.discount_code === voucher.voucher_id
                            ? "Đã áp dụng"
                            : "Áp dụng"
                        }}</span
                      >
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div
            class="coupon-wrap"
            v-for="(voucher, index) in validVoucher"
            :key="index"
          >
            <div class="vb-item vb-item--E5">
              <div class="vb-item__inner">
                <div class="vb-item__icon">
                  <img
                    :src="`${baseUrl}/1111111111111111111/images/vb-1.svg`"
                    alt=""
                  />
                </div>
                <div class="vb-item__info">
                  <div class="vb-item__head">
                    <span class="vb-item__title">{{ voucher.name }}</span>
                  </div>
                  <p class="vb-item__desc">
                    {{ voucher.content }}<br />Mã:
                    {{ voucher.code }}
                  </p>
                  <div class="vb-item__footer">
                    <div class="vb-item__expiration">
                      Ngày hết hạn {{ voucher.end_at }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </section>
      <div class="separate-line"></div>
      <section class="section py-30">
        <div class="container-fluid">
          <div class="heading">
            <h2 class="heading__title">ƯU ĐÃI RIÊNG CHO BẠN</h2>
          </div>
          <div class="row row-cols-1">
            <div class="col pe-0">
              <div class="swiper-init swiper-42vw shadow-item-slider">
                <div class="swiper-container">
                  <div class="swiper-wrapper gx-10">
                    <div class="swiper-slide">
                      <div class="pd-item pd-item--2">
                        <div class="pd-item__top">
                          <div class="pd-item__top__img ratio">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                              alt=""
                            />
                          </div>
                          <a
                            href="#"
                            class="pd-item__top__icon pd-item__top__icon--heart"
                          >
                            <i class="far fa-heart"></i>
                          </a>
                          <a
                            href="#"
                            class="pd-item__top__icon pd-item__top__icon--cart"
                            data-bs-toggle="modal"
                            data-bs-target="#addToCartModal"
                          >
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/pd-cart-icon.svg`"
                              alt=""
                            />
                          </a>
                        </div>
                        <div class="pd-item__bottom">
                          <span
                            class="
                              pd-item__bottom__badge
                              badge badge-green-custom badge-sm
                            "
                            >Giảm giá</span
                          >
                          <p class="pd-item__bottom__desc">
                            POLO SIPA Áo polo phối màu trơn
                          </p>
                          <p class="pd-item__bottom__price">
                            <del class="pd-item__bottom__price__old"
                              >700.000đ</del
                            >
                            <span class="pd-item__bottom__price__new">
                              500.000đ
                              <span class="m-badge m-badge--sm m-badge--E5"
                                >-50%</span
                              >
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="swiper-slide">
                      <div class="pd-item pd-item--2">
                        <div class="pd-item__top">
                          <div class="pd-item__top__img ratio">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/pd-2.jpg`"
                              alt=""
                            />
                          </div>
                          <a
                            href="#"
                            class="pd-item__top__icon pd-item__top__icon--heart"
                          >
                            <i class="far fa-heart"></i>
                          </a>
                          <a
                            href="#"
                            class="pd-item__top__icon pd-item__top__icon--cart"
                            data-bs-toggle="modal"
                            data-bs-target="#addToCartModal"
                          >
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/pd-cart-icon.svg`"
                              alt=""
                            />
                          </a>
                        </div>
                        <div class="pd-item__bottom">
                          <span
                            class="
                              pd-item__bottom__badge
                              badge badge-green-custom badge-sm
                            "
                            >Giảm giá</span
                          >
                          <p class="pd-item__bottom__desc">
                            POLO SIPA Áo polo phối màu trơn
                          </p>
                          <p class="pd-item__bottom__price">
                            <del class="pd-item__bottom__price__old"
                              >700.000đ</del
                            >
                            <span class="pd-item__bottom__price__new">
                              500.000đ
                              <span class="m-badge m-badge--sm m-badge--E5"
                                >-50%</span
                              >
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="swiper-slide">
                      <div class="pd-item pd-item--2">
                        <div class="pd-item__top">
                          <div class="pd-item__top__img ratio">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/pd-3.jpg`"
                              alt=""
                            />
                          </div>
                          <a
                            href="#"
                            class="pd-item__top__icon pd-item__top__icon--heart"
                          >
                            <i class="far fa-heart"></i>
                          </a>
                          <a
                            href="#"
                            class="pd-item__top__icon pd-item__top__icon--cart"
                            data-bs-toggle="modal"
                            data-bs-target="#addToCartModal"
                          >
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/pd-cart-icon.svg`"
                              alt=""
                            />
                          </a>
                        </div>
                        <div class="pd-item__bottom">
                          <span
                            class="
                              pd-item__bottom__badge
                              badge badge-green-custom badge-sm
                            "
                            >Giảm giá</span
                          >
                          <p class="pd-item__bottom__desc">
                            POLO SIPA Áo polo phối màu trơn
                          </p>
                          <p class="pd-item__bottom__price">
                            <del class="pd-item__bottom__price__old"
                              >700.000đ</del
                            >
                            <span class="pd-item__bottom__price__new">
                              500.000đ
                              <span class="m-badge m-badge--sm m-badge--E5"
                                >-50%</span
                              >
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="swiper-slide">
                      <div class="pd-item pd-item--2">
                        <div class="pd-item__top">
                          <div class="pd-item__top__img ratio">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/pd-4.jpg`"
                              alt=""
                            />
                          </div>
                          <a
                            href="#"
                            class="pd-item__top__icon pd-item__top__icon--heart"
                          >
                            <i class="far fa-heart"></i>
                          </a>
                          <a
                            href="#"
                            class="pd-item__top__icon pd-item__top__icon--cart"
                            data-bs-toggle="modal"
                            data-bs-target="#addToCartModal"
                          >
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/pd-cart-icon.svg`"
                              alt=""
                            />
                          </a>
                        </div>
                        <div class="pd-item__bottom">
                          <span
                            class="
                              pd-item__bottom__badge
                              badge badge-green-custom badge-sm
                            "
                            >Giảm giá</span
                          >
                          <p class="pd-item__bottom__desc">
                            POLO SIPA Áo polo phối màu trơn
                          </p>
                          <p class="pd-item__bottom__price">
                            <del class="pd-item__bottom__price__old"
                              >700.000đ</del
                            >
                            <span class="pd-item__bottom__price__new">
                              500.000đ
                              <span class="m-badge m-badge--sm m-badge--E5"
                                >-50%</span
                              >
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="separate-line"></div>
      <div class="section py-30">
        <div class="container-fluid">
          <div class="row row-cols-2 gx-2 mb-2 align-items-center">
            <div class="col fz-14 fw-medium">Tổng cộng</div>
            <div class="col text-end fz-16 fw-semi">
              {{ Intl.NumberFormat("vi-VN").format(totalPrice) }}
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
    </main>

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

  <!-- ADD TO CART MODAL -->
  <div
    class="
      modal modal-custom
      fade
      modal-bottom modal-bottom--fit
      add-to-cart-modal
    "
    id="addToCartModal"
    tabindex="-1"
    aria-labelledby="addToCartModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title">MUA NHANH SẢN PHẨM</p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="d-none">
            <img
              :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
              alt=""
              class="add-to-cart-modal-img"
            />
          </div>
          <div class="mb-3">
            <div class="row row-cols-1">
              <div class="col pe-0">
                <div
                  class="
                    scroll-snap scroll-snap--37vw
                    gx-2
                    add-to-cart-modal-slider
                    js-gallery-2
                  "
                  data-thumb='[{"src":"images/video.mp4","thumb":"images/detail-1.jpg", "type": "video"}, {"src":"images/detail-2.jpg","thumb":"images/detail-2.jpg", "type": "image"}, {"src":"images/detail-3.jpg","thumb":"images/detail-3.jpg", "type": "image"}, {"src":"images/detail-4.jpg","thumb":"images/detail-4.jpg", "type": "image"}, {"src":"images/detail-5.jpg","thumb":"images/detail-5.jpg", "type": "image"}, {"src":"images/detail-6.jpg","thumb":"images/detail-6.jpg", "type": "image"}, {"src":"images/detail-1.jpg","thumb":"images/detail-1.jpg", "type": "image"}, {"src":"images/detail-2.jpg","thumb":"images/detail-2.jpg", "type": "image"}, {"src":"images/detail-3.jpg","thumb":"images/detail-3.jpg", "type": "image"}, {"src":"images/detail-4.jpg","thumb":"images/detail-4.jpg", "type": "image"}, {"src":"images/detail-5.jpg","thumb":"images/detail-5.jpg", "type": "image"}, {"src":"images/detail-6.jpg","thumb":"images/detail-6.jpg", "type": "image"}]'
                >
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-2">
            <div class="row gx-3">
              <div class="col">
                <p class="pd-detail__title">
                  Monogram Print Cotton Piqué Oversized Polo Shirt
                </p>
              </div>
              <div class="col-auto">
                <img
                  :src="`${baseUrl}/1111111111111111111/images/hot-badge.svg`"
                  alt=""
                  class="pd-detail__badge"
                />
                <!--                                <img src="images/new-badge.svg" alt="" class="pd-detail__badge">-->
              </div>
            </div>
          </div>
          <div class="mb-3">
            <div class="row">
              <div class="bg-F2 py-2">
                <div class="row align-items-center gx-3">
                  <div class="col-6">
                    <div class="pd-detail__price">
                      <p class="pd-detail__price__new">
                        <span>500.000 đ</span> <span class="m-badge">-50%</span>
                      </p>
                      <p class="pd-detail__price__old">750.000 đ</p>
                    </div>
                  </div>
                  <div class="col-6 text-end">
                    <div class="pd-detail__rating">
                      <div class="rating-stars">
                        <div class="empty-stars">
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                        </div>
                        <div class="filled-stars" style="width: 80%">
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                        </div>
                      </div>
                      <span>4.5 (20 đánh giá)</span>
                    </div>
                    <div class="pd-detail__purchases">
                      <i class="fas fa-shopping-cart"></i> 10 lượt mua |
                      <span class="fw-semi">Còn hàng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <p class="fw-medium mb-1">Màu sắc:</p>
            <div class="d-flex flex-wrap">
              <label class="custom-radio me-2">
                <input type="radio" name="color" value="blue" checked />
                <span class="checkmark"
                  ><span
                    :style="{
                      backgroundImage: `url(${baseUrl}/1111111111111111111/images/color-1.png)`,
                    }"
                  ></span
                ></span>
              </label>
              <label class="custom-radio me-2">
                <input type="radio" name="color" value="red" />
                <span class="checkmark"
                  ><span
                    :style="{
                      backgroundImage: `url(${baseUrl}/1111111111111111111/images/color-2.png)`,
                    }"
                  ></span
                ></span>
              </label>
              <label class="custom-radio me-2">
                <input type="radio" name="color" value="yellow" />
                <span class="checkmark"
                  ><span
                    :style="{
                      backgroundImage: `url(${baseUrl}/1111111111111111111/images/color-3.png)`,
                    }"
                  ></span
                ></span>
              </label>
            </div>
          </div>
          <div class="js-size">
            <p class="fw-medium mb-1">Size:</p>
            <div class="row gx-3 align-items-center">
              <div class="col-7">
                <div class="d-flex flex-wrap">
                  <label class="custom-radio me-2">
                    <input type="radio" name="size-2" value="M" checked />
                    <span class="checkmark-2">M</span>
                  </label>
                  <label class="custom-radio me-2">
                    <input type="radio" name="size-2" value="L" />
                    <span class="checkmark-2">L</span>
                  </label>
                  <label class="custom-radio me-2">
                    <input type="radio" name="size-2" value="XL" />
                    <span class="checkmark-2">XL</span>
                  </label>
                  <label class="custom-radio me-2">
                    <input type="radio" name="size-2" value="XXL" />
                    <span class="checkmark-2">XXL</span>
                  </label>
                </div>
              </div>
              <div class="col-5 text-end">
                <button
                  type="button"
                  class="btn btn-fit btn-icon-end js-size-content-toggle"
                >
                  Tư vấn chọn size <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>
            <div class="js-size-content collapse show">
              <div class="js-size-content-inner">
                <div class="mb-3">
                  <div class="d-flex justify-content-between g-2 fw-medium">
                    <span>Chiều cao</span>
                    <span class="js-size-height-output">160cm</span>
                  </div>
                  <input
                    type="range"
                    class="form-range js-size-height-input"
                    min="0"
                    max="188"
                  />
                </div>
                <div class="mb-3">
                  <div class="d-flex justify-content-between fw-medium">
                    <span>Cân nặng</span>
                    <span class="js-size-weight-output">60kg</span>
                  </div>
                  <input
                    type="range"
                    class="form-range js-size-weight-input"
                    min="0"
                    max="88"
                  />
                </div>
                <div class="d-flex align-items-center">
                  <p class="fw-medium mb-0 me-10">POLOMAN gợi ý</p>
                  <input
                    type="text"
                    class="form-control js-size-result"
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="
              btn btn-primary
              fz-14
              w-100
              py-2
              d-flex
              align-items-center
              justify-content-center
              add-to-cart-modal-btn
            "
          >
            <img
              :src="`${baseUrl}/1111111111111111111/images/cart-white.svg`"
              alt=""
              class="me-2"
            />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ADD TO CART GIFT MODAL -->
  <div
    class="
      modal modal-custom
      fade
      modal-bottom modal-bottom--fit
      add-to-cart-modal
    "
    id="addToCartGiftModal"
    tabindex="-1"
    aria-labelledby="addToCartGiftModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title">MUA NHANH SẢN PHẨM</p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="d-none">
            <img
              :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
              alt=""
              class="add-to-cart-modal-img"
            />
          </div>
          <div class="mb-3">
            <div class="row row-cols-1">
              <div class="col pe-0">
                <div
                  class="
                    scroll-snap scroll-snap--37vw
                    gx-2
                    add-to-cart-modal-slider
                    js-gallery-2
                  "
                  data-thumb='[{"src":"images/video.mp4","thumb":"images/detail-1.jpg", "type": "video"}, {"src":"images/detail-2.jpg","thumb":"images/detail-2.jpg", "type": "image"}, {"src":"images/detail-3.jpg","thumb":"images/detail-3.jpg", "type": "image"}, {"src":"images/detail-4.jpg","thumb":"images/detail-4.jpg", "type": "image"}, {"src":"images/detail-5.jpg","thumb":"images/detail-5.jpg", "type": "image"}, {"src":"images/detail-6.jpg","thumb":"images/detail-6.jpg", "type": "image"}, {"src":"images/detail-1.jpg","thumb":"images/detail-1.jpg", "type": "image"}, {"src":"images/detail-2.jpg","thumb":"images/detail-2.jpg", "type": "image"}, {"src":"images/detail-3.jpg","thumb":"images/detail-3.jpg", "type": "image"}, {"src":"images/detail-4.jpg","thumb":"images/detail-4.jpg", "type": "image"}, {"src":"images/detail-5.jpg","thumb":"images/detail-5.jpg", "type": "image"}, {"src":"images/detail-6.jpg","thumb":"images/detail-6.jpg", "type": "image"}]'
                >
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="scroll-snap__item js-gallery__item">
                    <div class="ratio">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-2">
            <div class="row gx-3">
              <div class="col">
                <p class="pd-detail__title">
                  Monogram Print Cotton Piqué Oversized Polo Shirt
                </p>
              </div>
              <div class="col-auto">
                <img
                  :src="`${baseUrl}/1111111111111111111/images/hot-badge.svg`"
                  alt=""
                  class="pd-detail__badge"
                />
                <!--                                <img src="images/new-badge.svg" alt="" class="pd-detail__badge">-->
              </div>
            </div>
          </div>
          <div class="mb-3">
            <div class="row">
              <div class="bg-F2 py-2">
                <div class="row align-items-center gx-3">
                  <div class="col-6">
                    <div class="pd-detail__price">
                      <p class="pd-detail__price__new">
                        <span>500.000 đ</span> <span class="m-badge">-50%</span>
                      </p>
                      <p class="pd-detail__price__old">750.000 đ</p>
                    </div>
                  </div>
                  <div class="col-6 text-end">
                    <div class="pd-detail__rating">
                      <div class="rating-stars">
                        <div class="empty-stars">
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                        </div>
                        <div class="filled-stars" style="width: 80%">
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                        </div>
                      </div>
                      <span>4.5 (20 đánh giá)</span>
                    </div>
                    <div class="pd-detail__purchases">
                      <i class="fas fa-shopping-cart"></i> 10 lượt mua |
                      <span class="fw-semi">Còn hàng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <p class="fw-medium mb-1">Màu sắc:</p>
            <div class="d-flex flex-wrap">
              <label class="custom-radio me-2">
                <input type="radio" name="color" value="blue" checked />
                <span class="checkmark"
                  ><span
                    style="
                      background-image: url(1111111111111111111/images/color-1.png);
                    "
                  ></span
                ></span>
              </label>
              <label class="custom-radio me-2">
                <input type="radio" name="color" value="red" />
                <span class="checkmark"
                  ><span
                    style="
                      background-image: url(1111111111111111111/images/color-2.png);
                    "
                  ></span
                ></span>
              </label>
              <label class="custom-radio me-2">
                <input type="radio" name="color" value="yellow" />
                <span class="checkmark"
                  ><span
                    style="
                      background-image: url(1111111111111111111/images/color-3.png);
                    "
                  ></span
                ></span>
              </label>
            </div>
          </div>
          <div class="js-size">
            <p class="fw-medium mb-1">Size:</p>
            <div class="row gx-3 align-items-center">
              <div class="col-7">
                <div class="d-flex flex-wrap">
                  <label class="custom-radio me-2">
                    <input type="radio" name="size-3" value="M" checked />
                    <span class="checkmark-2">M</span>
                  </label>
                  <label class="custom-radio me-2">
                    <input type="radio" name="size-3" value="L" />
                    <span class="checkmark-2">L</span>
                  </label>
                  <label class="custom-radio me-2">
                    <input type="radio" name="size-3" value="XL" />
                    <span class="checkmark-2">XL</span>
                  </label>
                  <label class="custom-radio me-2">
                    <input type="radio" name="size-3" value="XXL" />
                    <span class="checkmark-2">XXL</span>
                  </label>
                </div>
              </div>
              <div class="col-5 text-end"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="
              btn btn-primary
              fz-14
              w-100
              py-2
              d-flex
              align-items-center
              justify-content-center
              add-to-cart-modal-btn
            "
          >
            <img
              :src="`${baseUrl}/1111111111111111111/images/cart-white.svg`"
              alt=""
              class="me-2"
            />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- VOUCHER MODAL -->
  <div
    class="modal fade modal-bottom modal-bottom--fit voucher-modal"
    id="voucherModal"
    tabindex="-1"
    aria-labelledby="voucherModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title">VOUCHER ƯU ĐÃI</p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body py-25">
          <div class="vb-cate" v-if="vouchersHot.length > 0">
            <p class="vb-cate__title">Voucher hot</p>
            <div class="vb-cate__content">
              <div
                class="vb-item"
                v-for="(voucher, index) in vouchersHot"
                :key="index"
              >
                <div class="vb-item__inner">
                  <div class="vb-item__icon">
                    <img
                      :src="
                        voucher.type === 0
                          ? `${baseUrl}/1111111111111111111/images/vb-1.svg`
                          : `${baseUrl}/1111111111111111111/images/vb-2.svg`
                      "
                      alt=""
                    />
                  </div>
                  <div class="vb-item__info">
                    <div class="vb-item__head">
                      <span class="vb-item__title">{{ voucher.name }}</span>
                    </div>
                    <p class="vb-item__desc">
                      {{ voucher.content }}<br />Mã: {{ voucher.code }}
                    </p>
                    <div class="vb-item__footer">
                      <div class="vb-item__expiration">
                        Ngày hết hạn {{ voucher.end_at }}
                      </div>
                      <label class="vb-item__apply text-toggle">
                        <input
                          type="checkbox"
                          value="POLOFREE"
                          name="vb"
                          class="text-toggle__input"
                          checked
                        />
                        <span
                          class="text-toggle__checkmark"
                          :style="{
                            color:
                              cart.value.discount_code === voucher.voucher_id
                                ? '#C0C2CB'
                                : '#004377',
                          }"
                          @click="() => addVoucher(voucher)"
                          >{{
                            cart.value.discount_code === voucher.voucher_id
                              ? "Đã áp dụng"
                              : "Áp dụng"
                          }}</span
                        >
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="vb-cate" v-if="vouchersSpecial.length > 0">
            <p class="vb-cate__title">Voucher đặc biệt</p>
            <div class="vb-cate__content">
              <div
                class="vb-item vb-item--special"
                v-for="(voucher, index) in vouchersSpecial"
                :key="index"
              >
                <div class="vb-item__inner">
                  <div class="vb-item__icon">
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/vb-special.svg`"
                      alt=""
                    />
                  </div>
                  <div class="vb-item__info">
                    <div class="vb-item__head">
                      <span class="vb-item__title">{{ voucher.name }}</span>
                      <span class="vb-item__tag">Số lượng có hạn</span>
                    </div>
                    <p class="vb-item__desc">
                      {{ voucher.content }}<br />Mã: {{ voucher.code }}
                    </p>
                    <div class="vb-item__progress">
                      <div class="progress">
                        <div
                          class="progress-bar"
                          role="progressbar"
                          :style="{
                            width: `${
                              (cart.value.total_price /
                                voucher.discount_limit) *
                              100
                            }%`,
                          }"
                          aria-valuenow="50.9"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div class="vb-item__footer">
                      <div class="vb-item__expiration">
                        Ngày hết hạn {{ voucher.end_at }}
                      </div>
                      <label class="vb-item__apply text-toggle">
                        <input
                          type="checkbox"
                          value="POLO100K"
                          name="vb"
                          class="text-toggle__input"
                        />
                        <span
                          class="text-toggle__checkmark"
                          :style="{
                            color:
                              cart.value.discount_code === voucher.voucher_id
                                ? '#C0C2CB'
                                : '#004377',
                          }"
                          @click="() => addVoucher(voucher)"
                          >{{
                            cart.value.discount_code === voucher.voucher_id
                              ? "Đã áp dụng"
                              : "Áp dụng"
                          }}</span
                        >
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- GIFT MODAL -->
  <!-- <div
    class="modal fade modal-bottom modal-bottom--fit gift-modal"
    id="giftModal"
    tabindex="-1"
    aria-labelledby="giftModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-fullscreen modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title">QUÀ TẶNG</p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body py-25">
          <div class="m-cart">
            <div class="m-cart__img">
              <img
                :src="`${baseUrl}/1111111111111111111/images/qua-tang.jpg`"
                alt=""
              />
            </div>
            <div class="m-cart__info">
              <div class="m-cart__info__top"></div>
              <div class="m-cart__info__center">
                <p class="m-cart__title">
                  <a href="#"
                    >Monogram Print Cotton Piqué Oversized Polo Shirt</a
                  >
                </p>
                <p class="m-cart__price">
                  0đ
                  <del>500.000đ</del>
                </p>
              </div>
              <div class="m-cart__info__bottom">
                <div class="m-cart__edit">
                  <div class="m-cart__edit__left">
                    <div class="m-cart__for">
                      Áp dụng <br />cho đơn hàng trên 600k
                    </div>
                  </div>
                  <div class="m-cart__edit__right">
                    <label class="custom-checkbox m-cart__edit__btn">
                      <input type="radio" name="gift" checked />
                      <span
                        class="checkmark-btn checkmark-btn--2"
                        data-text="Chọn"
                        data-text-selected="Đã chọn"
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="m-cart">
            <div class="m-cart__img">
              <img
                :src="`${baseUrl}/1111111111111111111/images/qua-tang-2.jpg`"
                alt=""
              />
            </div>
            <div class="m-cart__info">
              <div class="m-cart__info__top"></div>
              <div class="m-cart__info__center">
                <p class="m-cart__title">
                  <a href="#"
                    >Monogram Print Cotton Piqué Oversized Polo Shirt</a
                  >
                </p>
                <p class="m-cart__price">
                  0đ
                  <del>500.000đ</del>
                </p>
              </div>
              <div class="m-cart__info__bottom">
                <div class="m-cart__edit">
                  <div class="m-cart__edit__left">
                    <div class="m-cart__for">
                      Áp dụng <br />cho đơn hàng trên 600k
                    </div>
                  </div>
                  <div class="m-cart__edit__right">
                    <label class="custom-checkbox m-cart__edit__btn">
                      <input type="radio" name="gift" />
                      <span
                        class="checkmark-btn checkmark-btn--2"
                        data-text="Chọn"
                        data-text-selected="Đã chọn"
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="m-cart">
            <div class="m-cart__img">
              <img
                :src="`${baseUrl}/1111111111111111111/images/qua-tang-3.jpg`"
                alt=""
              />
            </div>
            <div class="m-cart__info">
              <div class="m-cart__info__top"></div>
              <div class="m-cart__info__center">
                <p class="m-cart__title">
                  <a href="#"
                    >Monogram Print Cotton Piqué Oversized Polo Shirt</a
                  >
                </p>
                <p class="m-cart__price">
                  0đ
                  <del>500.000đ</del>
                </p>
              </div>
              <div class="m-cart__info__bottom">
                <div class="m-cart__edit">
                  <div class="m-cart__edit__left">
                    <div class="m-cart__for">
                      Áp dụng <br />cho đơn hàng trên 600k
                    </div>
                  </div>
                  <div class="m-cart__edit__right">
                    <label class="custom-checkbox m-cart__edit__btn">
                      <input type="radio" name="gift" />
                      <span
                        class="checkmark-btn checkmark-btn--2"
                        data-text="Chọn"
                        data-text-selected="Đã chọn"
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->

  <!-- PACK DETAIL MODAL -->
  <div
    class="modal fade modal-bottom modal-bottom--fit pack-detail-modal"
    id="packDetailModal"
    tabindex="-1"
    aria-labelledby="packDetailModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <form action="" id="packDetailForm">
        <div class="modal-content">
          <div class="modal-header">
            <p class="modal-title">CHỌN HỘP ĐÓNG GÓI</p>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body pb-25">
            <div class="pack-detail">
              <div
                class="scroll-snap pack-detail__slider js-gallery-2"
                data-thumb='[{"src":"images/video.mp4","thumb":"images/detail-1.jpg", "type": "video"}, {"src":"images/detail-2.jpg","thumb":"images/detail-2.jpg", "type": "image"}, {"src":"images/detail-3.jpg","thumb":"images/detail-3.jpg", "type": "image"}, {"src":"images/detail-4.jpg","thumb":"images/detail-4.jpg", "type": "image"}, {"src":"images/detail-5.jpg","thumb":"images/detail-5.jpg", "type": "image"}, {"src":"images/detail-6.jpg","thumb":"images/detail-6.jpg", "type": "image"}, {"src":"images/detail-1.jpg","thumb":"images/detail-1.jpg", "type": "image"}, {"src":"images/detail-2.jpg","thumb":"images/detail-2.jpg", "type": "image"}, {"src":"images/detail-3.jpg","thumb":"images/detail-3.jpg", "type": "image"}, {"src":"images/detail-4.jpg","thumb":"images/detail-4.jpg", "type": "image"}, {"src":"images/detail-5.jpg","thumb":"images/detail-5.jpg", "type": "image"}, {"src":"images/detail-6.jpg","thumb":"images/detail-6.jpg", "type": "image"}]'
              >
                <div
                  class="scroll-snap__item js-gallery__item"
                  v-for="(image, index) in packDetail.images"
                  :key="index"
                >
                  <div class="ratio">
                    <img :src="image" alt="" />
                  </div>
                </div>
              </div>
              <p class="pack-detail__title">{{ packDetail.title }}</p>
              <div class="pack-detail__price">
                {{
                  Intl.NumberFormat("vi-VN").format(packDetail.price_retail)
                }}đ
              </div>
              <p class="pack-detail__desc">
                {{ packDetail.sub_title }}
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-primary"
              @click.prevent="() => onPackChange(packDetail.product_id)"
            >
              {{
                packDetail.product_id === packSelected
                  ? "Đã chọn"
                  : "Chọn hộp này"
              }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <ErrorDialog
    :isOpen="isError"
    :hideError="hideError"
    :message="errorMessage"
    title="Lỗi!"
  ></ErrorDialog>
  <ErrorDialog
    :isOpen="isErrorVoucher"
    :hideError="hideErrorVoucher"
    title="Lỗi!"
    message="Bạn chưa đủ điều kiện áp dụng voucher này"
  ></ErrorDialog>

  <!-- LOADING MODAL -->
  <Loading :isOpen="isLoading"></Loading>
</template>

<style></style>
