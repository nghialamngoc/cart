<script>
import { computed, defineComponent, onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { resolveErrorMessage } from "../../helper/resolveErrorMessage";
import { closeModal, openModal } from "../../helper/modal";
import {
  createSwipper,
  createSwipper2,
  createSwipper3,
} from "../../helper/createSwipper";

// constants
import { baseUrl } from "../../constant";

// components
import ProductModal from "./ProductModal.vue";
import { getProductDetail } from "../../api";

export default defineComponent({
  components: {
    ProductModal,
  },
  setup() {
    // store
    const store = useStore();

    // state
    const cart = computed(() => store.state.cart);
    const boxList = computed(() => store.state.boxList);
    const giftList = computed(() => store.state.giftList);
    const collection = computed(() => store.state.collection);
    const productList = computed(() => store.getters.productList);
    const boxSelected = computed(() => store.getters.boxSelected);
    const giftSelected = computed(() => store.getters.giftSelected);
    const voucherList = computed(() => store.state.voucherList);
    const voucherHotList = computed(() => store.getters.voucherHotList);
    const voucherNormal = computed(() => store.getters.voucherNormal);
    const vouchersSpecialList = computed(
      () => store.getters.vouchersSpecialList
    );
    const validVoucherList = computed(() => store.getters.validVoucherList);
    const freeShipCondition = computed(() => store.state.freeShipCondition);
    const totalPrice = computed(() => store.getters.totalPrice);
    const discount = computed(() => store.getters.discount);
    const subPrice = computed(() => store.getters.subPrice);

    const voucherCode = ref("");
    const boxDetail = ref({
      videos: [],
      images: [],
    });
    const productDetail = ref({});
    const viewType = ref(1); // 1: product, 3: gift
    const isEdit = ref(false); // false: new, true: edit
    const productEditId = ref("");

    // swiper
    const packSwiper = ref(null);

    onMounted(() => {
      setTimeout(() => {
        const collectionSwipper = document.getElementById("collection-swipper");
        if (collectionSwipper && collection.value.length >= 3) {
          createSwipper3(collectionSwipper);
        }
      }, 1000);
    });

    // methods
    const onQuantityChange = (product_id, quantity) => {
      store.dispatch("addProductToCart", {
        product_id,
        quantity,
        type: 1,
      });
    };

    const viewDetailPack = (pack) => {
      pack.gallery = JSON.stringify([
        ...pack.videos.map((x) => {
          return {
            src: x,
            thumb: x,
            type: "video",
          };
        }),
        ...pack.images.map((x) => {
          return {
            src: x,
            thumb: x,
            type: "image",
          };
        }),
      ]);
      boxDetail.value = pack;
      openModal("packDetailModal");
      setTimeout(() => {
        if (packSwiper.value) {
          packSwiper.value.destroy();
        }

        const el = document.getElementById("pack-swipper");
        if (el) {
          packSwiper.value = createSwipper3(el);
        }
      }, 100);
    };

    const onPackChange = (id) => {
      if (id === boxSelected.value) {
        return;
      }
      store.dispatch("addProductToCart", {
        product_id: id,
        quantity: 1,
        type: 3,
      });
    };

    const getDetail = async (productId) => {
      try {
        const data = await getProductDetail(productId);
        productDetail.value = data;
      } catch (err) {
        //
      }
    };

    const viewDetail = async (product, edit, type, isOpenModal = true, editId) => {
      try {
        isEdit.value = edit;
        viewType.value = type;

        if (isEdit) {
          productEditId.value = editId;
        } else {
          productEditId.value = "";
        }

        store.dispatch("setLoading", true);
        productDetail.value = {}
        await getDetail(
          Number(product.parent_id) ? product.parent_id : product.product_id
        );

        closeModal("giftModal");

        // if (productDetail.value.product_id)

        if (isOpenModal) {
          openModal("addToCartModal");
        }
      } catch (err) {
        store.dispatch("setError", resolveErrorMessage(err));
      } finally {
        store.dispatch("setLoading", false);
      }
    };

    const updateCart = async (newProductId) => {
      try {
        if (isEdit.value) {
          await store.dispatch("replaceProductInCart", {
            old_product_id: productEditId.value,
            new_product_id: newProductId,
            type: viewType.value,
          });
        } else {
          await store.dispatch("addProductToCart", {
            product_id: newProductId,
            quantity: 1,
            type: viewType.value,
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        closeModal("addToCartModal");
      }
    };

    const updateGift = async (newProductId) => {
      try {
        if (isEdit.value) {
          await store.dispatch("replaceProductInCart", {
            old_product_id: giftSelected.value.product_id,
            new_product_id: newProductId,
            type: 2,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    const applyVoucherCode = async () => {
      if (!voucherCode.value) {
        return;
      }
      await store.dispatch("addVoucherCode", voucherCode.value);
    };

    const selectVoucher = async (voucher) => {
      if (cart.value.discount_code === voucher.voucher_id) {
        return;
      }

      if (voucher.discount_limit > cart.value.total_price) {
        store.dispatch("setError", "Bạn chưa đủ điều kiện áp dụng voucher này");
        return;
      }

      await store.dispatch("addVoucher", voucher.voucher_id);
    };

    const buyMore = () => {
      document.getElementById("productForYou").scrollIntoView();
    };

    return {
      cart,
      isEdit,
      boxList,
      baseUrl,
      subPrice,
      discount,
      giftList,
      boxDetail,
      totalPrice,
      collection,
      voucherCode,
      boxSelected,
      voucherList,
      productList,
      giftSelected,
      productDetail,
      productEditId,
      voucherNormal,
      voucherHotList,
      validVoucherList,
      freeShipCondition,
      vouchersSpecialList,
      buyMore,
      updateGift,
      updateCart,
      closeModal,
      viewDetail,
      onPackChange,
      selectVoucher,
      viewDetailPack,
      onQuantityChange,
      applyVoucherCode,
    };
  },
});
</script>

<template>
  <main class="main">
    <div class="section py-35">
      <div class="container-fluid container-fluid--ct5">
        <div class="woo-wrap">
          <div class="woo-left">
            <div class="pb-35">
              <div class="custom-alert mb-15">
                <div
                  class="custom-alert__icon"
                  v-if="cart.customer_id == '0' || cart.customer_id == ''"
                >
                  <img
                    :src="`${baseUrl}/1111111111111111111/images/sign-out.svg`"
                    alt=""
                  />
                </div>
                <div class="custom-alert__content ps-2">
                  <span class="d-inline-block me-2"
                    >Đăng nhập ngay để nhận ưu đãi</span
                  >
                  <button
                    type="button"
                    class="btn btn-fit fz-14 fw-semi"
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal"
                    style="margin-top: -1px"
                  >
                    Đăng nhập
                  </button>
                </div>
              </div>
              <div
                class="row gx-2 align-items-center"
                v-if="freeShipCondition.shipping_id"
              >
                <div class="col">
                  <div class="d-flex align-items-center">
                    <img
                      class="flex-shrink-0 me-2"
                      :src="`${baseUrl}/1111111111111111111/images/truck-37.svg`"
                      alt=""
                      width="25"
                    />
                    <div
                      class="flex-grow-1"
                      v-if="freeShipCondition.range_from > cart.total_price"
                    >
                      Mua thêm
                      {{
                        Intl.NumberFormat("vi-VN").format(
                          freeShipCondition.range_from - cart.total_price
                        )
                      }}đ để hưởng
                      <strong class="fw-semi">VẬN CHUYỂN MIỄN PHÍ</strong>
                    </div>
                  </div>
                </div>
                <div class="col-auto">
                  <div class="btn btn-icon-end btn-fit text-primary fz-12">
                    Xem thêm <i class="fas fas fa-chevron-right"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="pb-25 border-bottom border-C05">
              <h2 class="fz-18 fw-bold mb-0">
                GIỎ HÀNG CỦA BẠN
                <span class="fz-14 fw-medium"
                  >({{ productList.length }} sản phẩm)</span
                >
              </h2>
            </div>
            <div class="section pt-30 pb-50 border-bottom border-C05">
              <div
                class="m-cart"
                v-for="(product, index) in productList"
                :key="index"
              >
                <div class="m-cart__img">
                  <img :src="product.image" alt="" />
                </div>
                <div class="m-cart__info">
                  <div class="m-cart__info__row">
                    <div class="m-cart__info__row__left">
                      <p class="m-cart__title">
                        <a :href="`san-pham/${product.product_url}`">{{
                          product.title
                        }}</a>
                      </p>
                      <p class="m-cart__price" v-if="product.price_sale != 0">
                        <span class="m-cart__price__new">
                          {{
                            Intl.NumberFormat("vi-VN").format(
                              product.price_sale
                            )
                          }}đ
                        </span>
                        <del
                          v-if="product.price_sale != product.price_retail"
                          class="m-cart__price__old"
                          >{{
                            Intl.NumberFormat("vi-VN").format(
                              product.price_retail
                            )
                          }}đ</del
                        >
                      </p>
                      <p class="m-cart__price" v-else>
                        <span class="m-cart__price__new">
                          {{
                            Intl.NumberFormat("vi-VN").format(
                              product.price_retail
                            )
                          }}đ
                        </span>
                      </p>
                    </div>
                    <div class="m-cart__info__row__right">
                      <button
                        class="btn btn-fit m-cart__delete"
                        @click="
                          () =>
                            onQuantityChange(
                              product.product_id,
                              -product.quantity
                            )
                        "
                      >
                        <img
                          :src="`${baseUrl}/1111111111111111111/images/garbage-can.svg`"
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                  <div class="m-cart__info__row align-items-center">
                    <div
                      class="m-cart__info__row__left"
                      style="width: calc(100% - 150px)"
                    >
                      <div class="row g-2">
                        <div
                          class="col-auto"
                          @click="() => viewDetail(product, true, 1, true, product.product_id)"
                        >
                          <div class="row row-cols-2 gx-2">
                            <div class="col">
                              <button type="button" class="btn m-cart__select">
                                <span class="color-circle">
                                  <span
                                    :style="{
                                      backgroundImage: `url(${product.attribute.color})`,
                                    }"
                                  ></span>
                                </span>
                              </button>
                            </div>
                            <div class="col">
                              <button type="button" class="btn m-cart__select">
                                {{
                                  product.attribute.size === "Size"
                                    ? ""
                                    : product.attribute.size
                                }}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div class="col-auto">
                          <div
                            class="
                              quantity-picker quantity-picker-2
                              m-cart__quantity
                            "
                          >
                            <span
                              class="
                                quantity-picker__btn quantity-picker__btn__minus
                              "
                              @click="
                                () => onQuantityChange(product.product_id, -1)
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
                              class="
                                quantity-picker__btn quantity-picker__btn__plus
                              "
                              @click="
                                () => onQuantityChange(product.product_id, 1)
                              "
                            >
                              <i class="fas fa-plus"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="m-cart__info__row__right" style="width: 150px">
                      <p class="m-cart__note">
                        Chỉ còn {{ product.actual_remain_quantity }} trong kho
                        <br />Đặt hàng sớm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <section
                class="section py-30 border-bottom border-C05"
                v-if="giftSelected.product_id"
              >
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
                  <div class="m-cart m-cart--mark">
                    <div class="m-cart__img">
                      <img :src="giftSelected.image" alt="" />
                    </div>
                    <div class="m-cart__info">
                      <div class="m-cart__info__row">
                        <div class="m-cart__info__row__left">
                          <p class="m-cart__title">
                            <a href="#">{{ giftSelected.title }}</a>
                          </p>
                          <p class="m-cart__price">
                            <span class="m-cart__price__new">0đ</span>
                            <del class="m-cart__price__old"
                              >{{ giftSelected.price_retail }}đ</del
                            >
                          </p>
                        </div>
                      </div>
                      <div class="m-cart__info__row align-items-center">
                        <div class="m-cart__info__row__left">
                          <div class="row g-2">
                            <div class="col-auto">
                              <div class="row row-cols-2 gx-2">
                                <div class="col">
                                  <button
                                    type="button"
                                    class="btn m-cart__select"
                                  >
                                    <span class="color-circle">
                                      <span
                                        :style="{
                                          backgroundImage: `url(${giftSelected.attribute.color})`,
                                        }"
                                      ></span>
                                    </span>
                                  </button>
                                </div>
                                <div class="col">
                                  <button
                                    type="button"
                                    class="btn m-cart__select"
                                  >
                                    {{ giftSelected.attribute.size }}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="m-cart__info__row__right">
                          <span class="m-cart__selected">Đã chọn</span>
                        </div>
                      </div>
                    </div>
                    <div class="m-cart__bottom">
                      <div class="info-txt">
                        <img
                          :src="`${baseUrl}/1111111111111111111/images/info-C0.svg`"
                          alt=""
                        />
                        Sản phẩm khuyến mãi cuối cùng không thể trả lại
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section class="pt-45 pb-50 border-bottom border-C05">
                <h2 class="fz-18 fw-bold mb-30">
                  CHỌN HỘP ĐÓNG GÓI
                  <span class="fz-14 fw-medium"
                    >({{ boxList.length }} loại hộp có sẵn)</span
                  >
                </h2>
                <div class="pack-wrap">
                  <div
                    class="pack-item pack-item--default"
                    v-for="(box, index) in boxList"
                    :key="index"
                  >
                    <div class="pack-item__img">
                      <img :src="box.image" alt="" />
                    </div>
                    <div class="pack-item__info">
                      <div class="pack-item__info__row">
                        <div class="pack-item__info__row__left">
                          <p class="pack-item__title">{{ box.title }}</p>
                          <p class="pack-item__desc">{{ box.sub_title }}</p>
                        </div>
                        <div class="pack-item__info__row__right">
                          <div
                            class="btn btn-icon-start pack-item__detail"
                            @click="() => viewDetailPack(box)"
                          >
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/search-8E.svg`"
                              alt=""
                            />
                            Chi tiết
                          </div>
                        </div>
                      </div>
                      <div class="pack-item__info__row align-items-center">
                        <div class="pack-item__info__row__left">
                          <p class="pack-item__price">
                            <span class="pack-item__price__number"
                              >{{
                                Intl.NumberFormat("vi-VN").format(
                                  box.price_retail
                                )
                              }}đ</span
                            >
                            <span
                              class="pack-item__price__text"
                              v-if="box.price_retail === 0"
                              >(Miễn phí đóng gói)</span
                            >
                          </p>
                        </div>
                        <div class="pack-item__info__row__right">
                          <label
                            class="custom-checkbox pack-item__btn"
                            @click="() => onPackChange(box.product_id)"
                          >
                            <span
                              class="checkmark-btn"
                              :style="{
                                backgroundColor:
                                  box.product_id === boxSelected
                                    ? '#DCF0FF'
                                    : 'white',
                                borderColor:
                                  box.product_id === boxSelected
                                    ? '#DCF0FF'
                                    : '#004377',
                              }"
                            >
                              {{
                                box.product_id === boxSelected
                                  ? box.price_retail === 0
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
              </section>
              <section class="pt-45" v-if="collection && collection.length > 0">
                <h2 class="fz-18 fw-bold mb-25">ƯU ĐÃI RIÊNG CHO BẠN</h2>
                <div class="swiper-init" id="collection-swipper" data-loop="false">
                  <div class="swiper-container">
                    <div
                      class="
                        swiper-wrapper swiper-wrapper-3 swiper-wrapper-lg-3
                        gx-10
                      "
                    >
                      <div
                        class="swiper-slide"
                        v-for="(product, index) in collection"
                        :key="index"
                      >
                        <div class="pd-item pd-item--sm-2">
                          <div class="pd-item__top">
                            <div class="pd-item__top__img ratio">
                              <img :src="product.url_media" alt="" />
                            </div>
                            <div
                              class="pd-item__top__tag"
                              v-if="product.is_new"
                            >
                              New
                            </div>
                            <div
                              class="
                                pd-item__top__icon pd-item__top__icon--heart
                              "
                            >
                              <i class="far fa-heart"></i>
                            </div>
                            <div
                              class="
                                pd-item__top__icon pd-item__top__icon--cart
                              "
                              @click="() => viewDetail(product, false, 1)"
                            >
                              <img
                                :src="`${baseUrl}/1111111111111111111/images/pd-cart-icon.svg`"
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="pd-item__bottom">
                            <span
                              class="
                                pd-item__bottom__badge
                                badge badge-green-custom
                              "
                              >Giảm giá</span
                            >
                            <p class="pd-item__bottom__title">
                              <a :href="`san-pham/${product.slug}`">
                                {{ product.product_title }}</a
                              >
                            </p>
                            <p class="pd-item__bottom__desc">
                              {{ product.short_description }}
                            </p>
                            <p class="pd-item__bottom__price">
                              <del
                                class="pd-item__bottom__price__old"
                                v-if="product.price_sale != 0"
                                >{{
                                  Intl.NumberFormat("vi-VN").format(
                                    product.price_retail
                                  )
                                }}đ</del
                              >
                              <span
                                class="pd-item__bottom__price__new"
                                v-if="product.price_sale != 0"
                              >
                                {{
                                  Intl.NumberFormat("vi-VN").format(
                                    product.price_sale
                                  )
                                }}đ
                                <span class="m-badge m-badge--E5"
                                  >-{{
                                    Math.round(
                                      ((product.price_retail -
                                        product.price_sale) /
                                        product.price_retail) *
                                        100
                                    )
                                  }}%</span
                                ></span
                              >
                              <span class="pd-item__bottom__price__new" v-else>
                                {{
                                  Intl.NumberFormat("vi-VN").format(
                                    product.price_retail
                                  )
                                }}đ
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="swiper-pagination"></div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <aside class="woo-right">
            <div class="woo-sticky m-sticky-top">
              <div class="pb-25 border-bottom border-C05">
                <h2 class="fz-18 fw-bold mb-0">MÃ GIẢM GIÁ</h2>
              </div>
              <div class="pt-30 pb-35">
                <div class="apply-voucher mb-25">
                  <input
                    type="text"
                    class="form-control apply-voucher__input"
                    placeholder="Mã giảm giá"
                    v-model="voucherCode"
                  />
                  <button
                    type="button"
                    class="
                      btn btn-primary
                      apply-voucher__btn apply-voucher__btn--empty-value
                    "
                    @click="applyVoucherCode"
                  >
                    Chọn mã
                  </button>
                  <button
                    type="button"
                    class="btn apply-voucher__btn apply-voucher__btn--has-value"
                  >
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/delete-8E.svg`"
                      alt=""
                    />
                  </button>
                </div>
                <div
                  class="row row-cols-2 gx-2 mb-12"
                  v-if="voucherList.length > 0"
                >
                  <div class="col fw-semi fz-12">Voucher khả dụng</div>
                  <div class="col text-end">
                    <button
                      type="button"
                      class="btn btn-fit btn-icon-end fw-medium fz-12"
                      data-bs-toggle="modal"
                      data-bs-dismiss="modal"
                      data-bs-target="#voucherModal"
                      v-if="voucherList.length > 0"
                    >
                      Xem tất cả
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
                <div class="coupon-wrap" v-if="voucherList && voucherList[0]">
                  <div class="vb-item vb-item--E5">
                    <div class="vb-item__inner">
                      <div class="vb-item__icon">
                        <img
                          :src="`${baseUrl}/1111111111111111111/images/vb-2.svg`"
                          alt=""
                        />
                      </div>
                      <div class="vb-item__info">
                        <div class="vb-item__head">
                          <span class="vb-item__title">{{
                            voucherList[0].name
                          }}</span>
                        </div>
                        <p class="vb-item__desc">
                          {{ voucherList[0].content }}<br />Mã:
                          {{ voucherList[0].code }}
                        </p>
                        <div class="vb-item__footer">
                          <div class="vb-item__expiration">
                            Ngày hết hạn {{ voucherList[0].end_at }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="py-30 border-top border-bottom border-C05">
                <div class="row row-cols-2 gx-2 mb-2 align-items-center">
                  <div class="col fz-14 fw-medium">Tổng cộng</div>
                  <div class="col text-end fz-16 fw-semi">
                    {{ Intl.NumberFormat("vi-VN").format(totalPrice) }}đ
                  </div>
                </div>
                <div class="row row-cols-2 gx-2 align-items-center">
                  <div class="col fz-14 fw-medium">Ưu đãi</div>
                  <div class="col text-end fz-16 fw-semi">
                    {{ Intl.NumberFormat("vi-VN").format(discount) }}đ
                  </div>
                </div>
              </div>
              <div class="py-30">
                <div class="row row-cols-2 gx-2 align-items-center">
                  <div class="col fz-14 fw-medium">Tổng thanh toán</div>
                  <div class="col text-end fz-18 fw-semi text-primary">
                    {{ Intl.NumberFormat("vi-VN").format(subPrice) }}đ
                  </div>
                </div>
              </div>
              <div class="row row-cols-2 gx-10">
                <div class="col">
                  <button
                    type="button"
                    class="btn btn-outline-primary fz-14 rounded-3 w-100 py-10"
                  >
                    MUA THÊM
                  </button>
                </div>
                <div class="col">
                  <button
                    type="button"
                    class="btn btn-primary fz-14 rounded-3 w-100 py-10"
                  >
                    ĐẶT HÀNG
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </main>

  <!-- ADD TO CART MODAL -->
  <ProductModal
    :baseUrl="baseUrl"
    :data="productDetail"
    :productEditId="productEditId"
    :isEdit="isEdit"
    @updateCart="updateCart"
  />

  <!-- VOUCHER MODAL -->
  <div
    class="modal fade voucher-modal"
    id="voucherModal"
    tabindex="-1"
    aria-labelledby="voucherModalLabel"
    aria-hidden="true"
  >
    <div
      class="
        modal-dialog modal-dialog--430
        modal-dialog-centered modal-dialog-scrollable
      "
    >
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
        <div class="modal-body">
          <div class="vb-cate" v-if="voucherNormal.length > 0">
            <p class="vb-cate__title">Voucher</p>
            <div class="vb-cate__content">
              <div
                class="vb-item"
                v-for="(voucher, index) in voucherNormal"
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
                              cart.discount_code === voucher.voucher_id
                                ? '#C0C2CB'
                                : '#004377',
                          }"
                          @click="() => selectVoucher(voucher)"
                          >{{
                            cart.discount_code === voucher.voucher_id
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
          <div class="vb-cate" v-if="voucherHotList.length > 0">
            <p class="vb-cate__title">Voucher hot</p>
            <div class="vb-cate__content">
              <div
                class="vb-item"
                v-for="(voucher, index) in voucherHotList"
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
                              cart.discount_code === voucher.voucher_id
                                ? '#C0C2CB'
                                : '#004377',
                          }"
                          @click="() => selectVoucher(voucher)"
                          >{{
                            cart.discount_code === voucher.voucher_id
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
          <div class="vb-cate" v-if="vouchersSpecialList.length > 0">
            <p class="vb-cate__title">Voucher đặc biệt</p>
            <div class="vb-cate__content">
              <div
                class="vb-item vb-item--special"
                v-for="(voucher, index) in vouchersSpecialList"
                :key="index"
              >
                <div
                  class="vb-item__inner"
                  :style="{
                    backgroundImage: `url(${baseUrl}/1111111111111111111/images/limit-edition.svg)`,
                  }"
                >
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
                              (cart.total_price / voucher.discount_limit) * 100
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
                              cart.discount_code === voucher.voucher_id
                                ? '#C0C2CB'
                                : '#004377',
                          }"
                          @click="() => selectVoucher(voucher)"
                          >{{
                            cart.discount_code === voucher.voucher_id
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
  <div
    class="modal fade gift-modal"
    id="giftModal"
    tabindex="-1"
    aria-labelledby="giftModalLabel"
    aria-hidden="true"
  >
    <div
      class="
        modal-dialog modal-dialog--580
        modal-dialog-centered modal-dialog-scrollable
      "
    >
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
        <div class="modal-body">
          <div class="row row-cols-3 g-10">
            <div class="col" v-for="(gift, index) in giftList" :key="index">
              <div class="pd-item pd-item--gift pd-item--sm-2">
                <div class="pd-item__top">
                  <div class="pd-item__top__img ratio">
                    <img :src="gift.image" alt="" />
                  </div>
                  <div class="pd-item__top__tag" v-if="gift.id_new">New</div>
                  <div class="pd-item__top__icon pd-item__top__icon--heart">
                    <i class="far fa-heart"></i>
                  </div>
                </div>
                <div class="pd-item__bottom">
                  <p class="pd-item__bottom__title">
                    <a :href="`san-pham/${gift.product_url}`">{{
                      gift.title
                    }}</a>
                  </p>
                  <p class="pd-item__bottom__desc">{{ gift.sub_title }}</p>
                  <p class="pd-item__bottom__price">
                    <span class="pd-item__bottom__price__new">0đ</span>
                    <del class="pd-item__bottom__price__old"
                      ><del
                        >{{
                          Intl.NumberFormat("vi-VN").format(gift.price_retail)
                        }}đ</del
                      ></del
                    >
                  </p>
                  <p class="pd-item__bottom__note">
                    Áp dụng cho đơn hàng trên
                    {{ Intl.NumberFormat("vi-VN").format(gift.range_from) }}đ
                  </p>
                  <button
                    type="button"
                    class="pd-item__bottom__select btn btn-dark"
                    @click="() => viewDetail(gift, true, 2, true, giftSelected.product_id)"
                  >
                    Chọn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- PACK DETAIL MODAL -->
  <div
    class="modal fade pack-detail-modal"
    id="packDetailModal"
    tabindex="-1"
    aria-labelledby="packDetailModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title">HỘP GIFT BOX</p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" v-if="boxDetail">
          <div class="pack-detail">
            <div
              class="swiper-init pack-detail__slider js-gallery"
              id="pack-swipper"
              :data-thumb="boxDetail.gallery"
            >
              <div class="swiper-container" v-if="boxDetail.images">
                <div class="swiper-wrapper">
                  <div
                    class="swiper-slide"
                    v-for="(image, index) in boxDetail.images"
                    :key="index"
                  >
                    <div class="ratio js-gallery__item">
                      <img :src="image" alt="" />
                    </div>
                  </div>
                </div>
                <div
                  class="swiper-button-prev swiper-button-prev--2"
                  :style="{
                    backgroundImage: `url(${baseUrl}/1111111111111111111/images/long-arrow-prev.svg)`,
                  }"
                ></div>
                <div
                  class="swiper-button-next swiper-button-next--2"
                  :style="{
                    backgroundImage: `url(${baseUrl}/1111111111111111111/images/long-arrow-next.svg)`,
                  }"
                ></div>
              </div>
            </div>
            <p class="pack-detail__title">{{ boxDetail.title }}</p>
            <div class="pack-detail__price">
              {{ Intl.NumberFormat("vi-VN").format(boxDetail.price_retail) }}đ
            </div>
            <p class="pack-detail__desc">
              {{ boxDetail.sub_title }}
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary modal-footer__btn"
            @click.prevent="() => onPackChange(boxDetail.product_id)"
          >
            {{
              boxDetail.product_id === boxSelected ? "Đã chọn" : "Chọn hộp này"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
