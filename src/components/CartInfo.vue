<script>
import { computed, defineComponent, ref } from "@vue/runtime-core";
import axios from "axios";
import { closeModal, openModal } from "../helper/modal";
import { resolveErrorMessage } from "../helper/resolveErrorMessage";
import ProductModal from "./ProductModal.vue";

export default defineComponent({
  props: [
    "baseUrl",
    "cart",
    "vouchers",
    "packList",
    "giftList",
    "collection",
    "freeShipingWhen",
  ],
  emits: [
    "addProductToCart",
    "addVoucher",
    "setLoading",
    "setError",
    "getCartInfo",
    "addVoucherCode",
  ],
  components: {
    ProductModal,
  },
  setup({ cart, vouchers, baseUrl }, { emit }) {
    const voucherCode = ref("");
    const packDetail = ref({});
    const productDetail = ref({});
    const viewType = ref(1); // 1: product, 3: gift
    const isEdit = ref(false); // false: new, true: edit
    const productEditId = ref("");

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

    const giftSelected = computed(() => {
      if (!cart.value?.detail) {
        return "";
      }

      const pack = cart.value?.detail.find((x) => x.type === 2);
      if (pack) {
        return pack;
      }

      return {};
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
    const onQuantityChange = (product_id, quantity) => {
      emit("addProductToCart", {
        product_id,
        quantity,
        type: 1,
      });
    };

    const viewDetailPack = (pack) => {
      packDetail.value = pack;
    };

    const onPackChange = (id) => {
      if (id === packSelected.value) {
        return;
      }

      emit("addProductToCart", {
        product_id: id,
        quantity: 1,
        type: 3,
      });
    };

    const viewDetail = async (product, edit, type) => {
      try {
        isEdit.value = edit;
        viewType.value = type;

        if (isEdit) {
          productEditId.value = product.product_id;
        } else {
          productEditId.value = "";
        }

        emit("setLoading", true);
        const { data } = await axios.post(
          `${baseUrl}/product/api/v1/cart/detail`,
          {
            id: Number(product.parent_id)
              ? product.parent_id
              : product.product_id,
          }
        );

        productDetail.value = data.data;

        closeModal("giftListModal");
        openModal("addToCartModal");
      } catch (err) {
        console.log(err);
        //setError(resolveErrorMessage(err.response));
      } finally {
        emit("setLoading", false);
      }
    };

    const updateCart = async (newProductId) => {
      try {
        emit("setLoading", true);

        if (isEdit.value) {
          await axios.post(`${baseUrl}/cart/api/v1/replace`, {
            old_product_id: productEditId.value,
            new_product_id: newProductId,
            type: viewType.value,
          });
        } else {
          emit("addProductToCart", {
            product_id: newProductId,
            quantity: 1,
            type: viewType.value,
          });
        }

        emit("getCartInfo");
      } catch (err) {
        emit("setError", resolveErrorMessage(err.response));
      } finally {
        closeModal("addToCartModal");
        emit("setLoading", false);
      }
    };

    const applyVoucherCode = () => {
      emit("addVoucherCode", voucherCode.value);
    };

    const selectVoucher = (voucher) => {
      emit("addVoucher", voucher);
    };

    const buyMore = () => {
      document.getElementById('productForYou').scrollIntoView();
    };

    return {
      isEdit,
      productEditId,
      productDetail,
      giftSelected,
      validVoucher,
      products,
      packSelected,
      vouchersHot,
      vouchersSpecial,
      packDetail,
      voucherCode,
      viewDetailPack,
      onPackChange,
      selectVoucher,
      onQuantityChange,
      viewDetail,
      updateCart,
      applyVoucherCode,
      buyMore,
    };
  },
});
</script>

<template>
  <main class="main">
    <div class="section pt-15 pb-20">
      <div class="container-fluid">
        <div
          class="custom-alert mb-10"
          v-if="cart.value.customer_id == '0' || cart.value.customer_id == ''"
        >
          <div class="custom-alert__icon">
            <img :src="`${baseUrl}/1111111111111111111/images/sign-out.svg`" />
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
        <div
          class="row gx-2 align-items-center"
          v-if="freeShipingWhen.shipping_id"
        >
          <div class="col">
            <div class="d-flex align-items-center">
              <img
                class="flex-shrink-0 me-10"
                :src="`${baseUrl}/1111111111111111111/images/transport-37.svg`"
                alt=""
              />
              <div
                class="flex-grow-1"
                v-if="freeShipingWhen.range_from > cart.value.total_price"
              >
                <p class="mb-0">
                  Mua thêm
                  {{
                    Intl.NumberFormat("vi-VN").format(
                      freeShipingWhen.range_from - cart.value.total_price
                    )
                  }}đ để hưởng
                </p>
                <p class="mb-0 fw-semi">VẬN CHUYỂN MIỄN PHÍ</p>
              </div>
              <div class="flex-grow-1" v-else>
                <p class="mb-0">Đơn hàng của bạn được hưởng</p>
                <p class="mb-0 fw-semi">VẬN CHUYỂN MIỄN PHÍ</p>
              </div>
            </div>
          </div>
          <div class="col-auto">
            <div
              class="btn btn-icon-end btn-fit text-primary fw-semi"
              @click="buyMore"
            >
              Mua thêm <i class="fas fas fa-chevron-right"></i>
            </div>
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
              <button
                class="btn-close m-cart__delete"
                style="outline: none; box-shadow: none"
                @click="
                  () => onQuantityChange(product.product_id, -product.quantity)
                "
              ></button>
            </div>
            <div class="m-cart__info__center">
              <p class="m-cart__title">
                <a href="#">{{ product.title }}</a>
              </p>
              <p class="m-cart__price">
                {{ Intl.NumberFormat("vi-VN").format(product.price_sale) }}đ
                <del v-if="product.price_sale != product.price_retail"
                  >{{
                    Intl.NumberFormat("vi-VN").format(product.price_retail)
                  }}đ</del
                >
              </p>
            </div>
            <div class="m-cart__info__bottom">
              <div class="m-cart__edit">
                <div class="m-cart__edit__left">
                  <button
                    type="button"
                    class="btn m-cart__select m-cart__select--color"
                    @click="() => viewDetail(product, true, 1)"
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
                    @click="() => viewDetail(product, true, 1)"
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
                      @click="() => onQuantityChange(product.product_id, -1)"
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
                      @click="() => onQuantityChange(product.product_id, 1)"
                    >
                      <i class="fas fa-plus"></i>
                    </span>
                  </div>
                </div>
              </div>
              <p class="m-cart__note">
                (Chỉ còn {{ product.actual_remain_quantity }} trong kho - đặt
                hàng sớm)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="separate-line"></div>
    <section class="section py-30" v-if="giftSelected.product_id">
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
              data-bs-target="#giftListModal"
              style="font-size: 13px"
            >
              Chọn lại
            </button>
          </div>
        </div>
        <div class="g-body">
          <div class="m-cart">
            <div class="m-cart__img">
              <img :src="giftSelected.image" alt="" />
            </div>
            <div
              class="m-cart__info"
              @click="() => viewDetail(giftSelected, true, 2)"
            >
              <div class="m-cart__info__top"></div>
              <div class="m-cart__info__center">
                <p class="m-cart__title">
                  <a href="#">{{ giftSelected.title }}</a>
                </p>
                <p class="m-cart__price">
                  0đ
                  <del>{{ giftSelected.price_retail }}đ</del>
                </p>
                <div class="m-cart__edit">
                  <div class="m-cart__edit__left">
                    <button
                      type="button"
                      class="btn m-cart__select m-cart__select--color"
                    >
                      Màu
                      <span class="color-circle">
                        <span
                          :style="{
                            backgroundImage: `url(${giftSelected.attribute.color})`,
                          }"
                        ></span>
                      </span>
                    </button>
                    <button
                      type="button"
                      class="btn m-cart__select m-cart__select--size"
                    >
                      Size <strong>{{ giftSelected.attribute.size }}</strong>
                    </button>
                  </div>
                </div>
              </div>
              <div class="m-cart__info__bottom">
                <div class="m-cart__edit">
                  <div class="m-cart__edit__left">
                    <div class="m-cart__for">
                      Áp dụng <br />cho đơn hàng trên 600.000đ
                    </div>
                  </div>
                  <div class="m-cart__edit__right">
                    <label class="custom-checkbox m-cart__edit__btn">
                      <span class="checkmark-btn checkmark-btn--2">
                        Đã chọn
                      </span>
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
    </section>
    <div class="separate-line"></div>
    <section class="section pt-30 pb-35">
      <div class="container-fluid">
        <div class="heading d-flex align-items-center mb-3">
          <h2 class="heading__title flex-shrink-0">Chọn hộp đóng gói</h2>
          <div class="border-top border-C0 flex-grow-1 ms-3 opacity-0-5"></div>
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
            @click="applyVoucherCode"
          >
            Chọn mã
          </button>
        </div>
        <div class="row row-cols-2 gx-3 mb-10" v-if="vouchers.value.length > 0">
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
            <div
              class="vb-item__inner"
              :style="{
                backgroundImage:
                  voucher.type == 2
                    ? `url(${baseUrl}/1111111111111111111/images/limit-edition.svg)`
                    : '',
              }"
            >
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
                      @click="() => selectVoucher(voucher)"
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
    </section>
    <div class="separate-line"></div>
    <section
      class="section py-30"
      id="productForYou"
      v-if="collection.value.products && collection.value.products.length > 0"
    >
      <div class="container-fluid">
        <div class="heading">
          <h2 class="heading__title">ƯU ĐÃI RIÊNG CHO BẠN</h2>
        </div>
        <div class="row row-cols-1">
          <div class="col pe-0">
            <div class="swiper-init swiper-42vw shadow-item-slider">
              <div class="swiper-container">
                <div class="swiper-wrapper gx-10">
                  <div
                    class="swiper-slide"
                    v-for="(product, index) in collection.value.products"
                    :key="index"
                    @click="() => viewDetail(product, false, 1)"
                  >
                    <div class="pd-item pd-item--2">
                      <div class="pd-item__top">
                        <div class="pd-item__top__img ratio">
                          <img :src="product.url_media" alt="" />
                        </div>
                        <div
                          class="pd-item__top__icon pd-item__top__icon--heart"
                        >
                          <i class="far fa-heart"></i>
                        </div>
                        <div
                          class="pd-item__top__icon pd-item__top__icon--cart"
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
                            badge badge-green-custom badge-sm
                          "
                          >Giảm giá</span
                        >
                        <p class="pd-item__bottom__desc">
                          {{ product.product_title }}
                        </p>
                        <p class="pd-item__bottom__price">
                          <del class="pd-item__bottom__price__old"
                            >{{
                              Intl.NumberFormat("vi-VN").format(
                                product.price_retail
                              )
                            }}đ</del
                          >
                          <span class="pd-item__bottom__price__new">
                            {{
                              Intl.NumberFormat("vi-VN").format(
                                product.price_sale
                              )
                            }}đ
                            <span class="m-badge m-badge--sm m-badge--E5"
                              >-{{
                                Math.round(
                                  ((product.price_retail - product.price_sale) /
                                    product.price_retail) *
                                    100
                                )
                              }}%</span
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
                          @click="() => selectVoucher(voucher)"
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
                          @click="() => selectVoucher(voucher)"
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
  <div
    class="modal fade modal-bottom modal-bottom--fit gift-modal"
    id="giftListModal"
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
          <div
            class="m-cart"
            v-for="(gift, index) in giftList.value"
            :key="index"
          >
            <div class="m-cart__img">
              <img :src="gift.image" alt="" />
            </div>
            <div class="m-cart__info">
              <div class="m-cart__info__top"></div>
              <div class="m-cart__info__center">
                <p class="m-cart__title">
                  <a href="#">{{ gift.title }}</a>
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
                      Áp dụng <br />cho đơn hàng trên
                      {{
                        Intl.NumberFormat("vi-VN").format(
                          giftList.value[0].range_from
                        )
                      }}đ
                    </div>
                  </div>
                  <div class="m-cart__edit__right">
                    <label class="custom-checkbox m-cart__edit__btn">
                      <span
                        class="checkmark-btn checkmark-btn--2"
                        @click="() => viewDetail(gift, true, 2)"
                      >
                        Chọn
                      </span>
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
</template>

<style></style>
