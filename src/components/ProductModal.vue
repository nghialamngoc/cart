<script>
import { computed, defineComponent, ref, watch } from "@vue/runtime-core";

export default defineComponent({
  props: ["data", "baseUrl", "productEditId", "isEdit"],
  emits: ["updateCart"],
  setup(props, { emit }) {
    // computed
    const colorSelect = ref("");
    const sizeSelect = ref("");

    watch(
      () => props.data,
      () => {
        const { isEdit, productEditId, data } = props;
        if (isEdit && data.variations) {
          const product = data.variations.find(
            (x) => x.product_id === productEditId
          );

          if (product) {
            colorSelect.value = product.attribute1_id;
            sizeSelect.value = product.attribute2_id;
          }
        }
      }
    );

    const productSelect = computed(() => {
      if (!colorSelect.value || !sizeSelect.value || !props.data) {
        return "";
      }

      const product = props.data.variations.find(
        (x) =>
          x.attribute1_id === colorSelect.value &&
          x.attribute2_id === sizeSelect.value
      );

      if (product) {
        return product;
      }

      return {};
    });

    const price = computed(() => {
      if (productSelect.value && productSelect.value.product_id) {
        return productSelect.value;
      }

      return {
        price_retail: props.data.price_retail,
        price_sale: props.data.price_sale,
      };
    });

    const checkState = (colorId, sizeId) => {
      if (!props.data) {
        return false;
      }

      if (!colorId || !sizeId) {
        return true;
      }

      const product = props.data.variations.find(
        (x) => x.attribute1_id === colorId && x.attribute2_id === sizeId
      );

      if (product) {
        return !!product.actual_remain_quantity;
      }

      return false;
    };

    const onColorChange = (color) => {
      if (!checkState(color.id, sizeSelect.value)) {
        return;
      }

      colorSelect.value = color.id;
    };

    const onSizeChange = (size) => {
      if (!checkState(colorSelect.value, size.id)) {
        return;
      }

      sizeSelect.value = size.id;
    };

    const onSubmit = () => {
      emit("updateCart", productSelect.value.product_id);
    };

    return {
      price,
      productSelect,
      colorSelect,
      sizeSelect,
      onColorChange,
      onSizeChange,
      checkState,
      onSubmit,
    };
  },
});
</script>

<template>
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
                  <div
                    class="scroll-snap__item js-gallery__item"
                    v-for="(media, index) in data.product_media"
                    :key="index"
                  >
                    <div class="ratio">
                      <img :src="media" alt="" />
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
                  {{
                    data && data.product_lang ? data.product_lang[0].title : ""
                  }}
                </p>
              </div>
              <div class="col-auto" v-if="data.is_hot">
                <img
                  :src="`${baseUrl}/1111111111111111111/images/hot-badge.svg`"
                  alt=""
                  class="pd-detail__badge"
                />
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
                        <span
                          >{{
                            Intl.NumberFormat("vi-VN").format(
                              price.price_sale || price.price_retail
                            )
                          }}đ</span
                        >
                        <span class="m-badge" v-if="price.price_sale"
                          >-{{
                            Math.round(
                              ((price.price_retail - price.price_sale) /
                                price.price_retail) *
                                100
                            )
                          }}%</span
                        >
                      </p>
                      <p class="pd-detail__price__old" v-if="price.price_sale">
                        {{
                          Intl.NumberFormat("vi-VN").format(price.price_retail)
                        }}đ
                      </p>
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
                      <i class="fas fa-shopping-cart"></i>
                      {{
                        Intl.NumberFormat("vi-VN").format(data.total_qty_export)
                      }}
                      lượt mua |
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
              <label
                :class="`custom-radio me-2 attr-wrapper ${
                  !checkState(color.id, sizeSelect) ? 'out-of-stock' : ''
                }`"
                v-for="(color, index) in data.color_list"
                :key="index"
                @click="() => onColorChange(color)"
              >
                <span
                  :class="`checkmark ${
                    color.id === colorSelect && 'attr-color__check'
                  }`"
                  ><span
                    :style="{
                      backgroundImage: `url(${color.value})`,
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
                  <label
                    v-for="(size, index) in data.size_list"
                    :class="`custom-radio me-2 attr-wrapper ${
                      !checkState(colorSelect, size.id) ? 'out-of-stock' : ''
                    }`"
                    :key="index"
                    @click="() => onSizeChange(size)"
                  >
                    <span
                      :class="`checkmark-2 ${
                        size.id === sizeSelect && 'attr-check'
                      }`"
                      >{{ size.value }}</span
                    >
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
            :disabled="!productSelect.product_id"
            @click="onSubmit"
          >
            <img
              :src="`${baseUrl}/1111111111111111111/images/cart-white.svg`"
              alt=""
              class="me-2"
            />
            {{ isEdit ? "Cập nhập" : "Thêm vào giỏ" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.out-of-stock {
  cursor: no-drop;
  opacity: 0.5;
}

.attr-check {
  background-color: #373737 !important;
  color: white !important;
}

.attr-color__check {
  border-color: #373737 !important;
}
</style>
