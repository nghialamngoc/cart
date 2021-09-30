<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  onUpdated,
  ref,
  watch,
} from "@vue/runtime-core";
import { useStore } from "vuex";
import { getProductDetail } from "../../api";
import { getSizeDetail } from "../../api/order";
export default defineComponent({
  props: ["data", "baseUrl", "productEditId", "isEdit"],
  emits: ["updateCart"],
  setup(props, { emit }) {
    // store
    const store = useStore();

    // computed
    const colorSelect = ref("");
    const sizeSelect = ref("");
    const sizeConfig = ref([]);
    const height = ref(0);
    const weight = ref(0);
    const variations = ref([]);
    const voucherList = computed(() => store.state.voucherList);

    watch(
      () => props.data,
      () => {
        const { isEdit, productEditId, data } = props;
        if (isEdit && data.variations) {
          variations.value = data.variations;
          const product = data.variations.find(
            (x) =>
              x.product_id === productEditId && x.actual_remain_quantity > 0
          );

          if (product) {
            colorSelect.value = product.attribute1_id;
            sizeSelect.value = product.attribute2_id;
          }
        }
      }
    );

    onBeforeMount(async () => {
      try {
        const data = await getSizeDetail();
        sizeConfig.value = data.config_size_child || [];
      } catch (err) {
        console.log(err);
      }
    });

    onUpdated(() => {
      setTimeout(() => {
        // create();
      }, 1000);
    });

    const recomment = computed(() => {
      const weightFormat = Number(weight.value);
      const heightFormat = Number(height.value);

      const size = sizeConfig.value.find((x) => {
        const weightFrom = Number(x.weight_from);
        const weightTo = Number(x.weight_to);
        const heightFrom = Number(x.height_from);
        const heightTo = Number(x.height_to);

        return (
          weightFrom <= weightFormat &&
          weightTo >= weightFormat &&
          heightFrom <= heightFormat &&
          heightTo >= heightFormat
        );
      });

      if (size) {
        return size.name;
      }

      return "";
    });

    const maxHeight = computed(() => {
      let result = 0;
      for (let index = 0; index < sizeConfig.value.length; index++) {
        const size = sizeConfig.value[index];
        if (size.height_to > result) {
          result = size.height_to;
        }
      }

      return result;
    });

    const minHeight = computed(() => {
      if (sizeConfig.value.length > 0) {
        let result = sizeConfig.value[0].height_from;
        for (let index = 0; index < sizeConfig.value.length; index++) {
          const size = sizeConfig.value[index];
          if (size.height_from < result) {
            result = size.height_from;
          }
        }

        height.value = result;

        return result;
      }

      return 0;
    });

    const maxWeight = computed(() => {
      let result = 0;
      for (let index = 0; index < sizeConfig.value.length; index++) {
        const size = sizeConfig.value[index];
        if (size.weight_to > result) {
          result = size.height_to;
        }
      }

      return result;
    });

    const minWeight = computed(() => {
      if (sizeConfig.value.length > 0) {
        let result = sizeConfig.value[0].weight_from;
        for (let index = 0; index < sizeConfig.value.length; index++) {
          const size = sizeConfig.value[index];
          if (size.weight_from < result) {
            result = size.weight_from;
          }
        }

        weight.value = result;

        return result;
      }

      return 0;
    });

    const hasVariation = computed(() => {
      return (
        props.data &&
        Array.isArray(props.data.variations) &&
        props.data.variations.length > 0
      );
    });

    const productSelect = computed(() => {
      if (!props.data) {
        return {};
      }

      if (!colorSelect.value && !sizeSelect.value && !props.data.variations) {
        return props.data;
      }

      const product = props.data.variations.find(
        (x) =>
          x.attribute1_id === colorSelect.value &&
          x.attribute2_id === sizeSelect.value &&
          x.actual_remain_quantity > 0
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

    const getDetail = async () => {
      try {
        const data = await getProductDetail(props.data.product_id);
        variations.value = data.variations || [];
      } catch (err) {
        //
      }
    };

    const checkState = (colorId, sizeId) => {
      if (!props.data) {
        return false;
      }

      if (!colorId || !sizeId) {
        return true;
      }

      const product = variations.value.find(
        (x) => x.attribute1_id === colorId && x.attribute2_id === sizeId
      );

      if (product) {
        return !!product.actual_remain_quantity;
      }

      return false;
    };

    const onColorChange = async (color) => {
      await getDetail();

      if (!checkState(color.id, sizeSelect.value)) {
        return;
      }

      colorSelect.value = color.id;
    };

    const onSizeChange = async (size) => {
      await getDetail();

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
      height,
      weight,
      minHeight,
      maxWeight,
      minWeight,
      recomment,
      maxHeight,
      sizeSelect,
      voucherList,
      colorSelect,
      hasVariation,
      productSelect,
      onColorChange,
      onSizeChange,
      checkState,
      onSubmit,
    };
  },
});
</script>

<template>
  <div class="modal fade modal-custom add-to-cart-modal" id="addToCartModal">
    <div class="modal-dialog modal-dialog-centered modal-dialog--937">
      <div class="modal-content">
        <div class="modal-body">
          <div class="fast-buy">
            <div class="fast-buy__left">
              <div class="fast-buy__favorite">
                <i class="far fa-heart"></i>
              </div>
              <div class="fast-buy__slider" id="product-image__swipper">
                <div class="swiper-action-wrap">
                  <div
                    class="swiper-button-prev"
                    :style="{
                      backgroundImage: `url(${baseUrl}/1111111111111111111/images/chevron-up.svg)`,
                    }"
                  ></div>
                  <div class="swiper-pagination"></div>
                  <div
                    class="swiper-button-next"
                    :style="{
                      backgroundImage: `url(${baseUrl}/1111111111111111111/images/chevron-down.svg)`,
                    }"
                  ></div>
                </div>
                <div class="swiper-container loading-overlay">
                  <div class="swiper-wrapper">
                    <div
                      class="swiper-slide"
                      v-for="(media, index) in data.product_media"
                      :key="index"
                    >
                      <div class="fast-buy__img">
                        <img :src="media" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="fast-buy__right">
              <div class="mb-55 text-end">
                <button
                  class="btn-close btn-close--14"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div class="d-none">
                <img
                  :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                  alt=""
                  class="add-to-cart-modal-img"
                />
              </div>
              <!-- SẢN PHẨM KHÔNG FLASH SALE -->
              <!--                        <div class="mb-12">-->
              <!--                            <div class="row gx-3">-->
              <!--                                <div class="col-10">-->
              <!--                                    <p class="pd-detail__title">Monogram Print Cotton Piqué Oversized Polo Shirt</p>-->
              <!--                                </div>-->
              <!--                                <div class="col-2 text-end">-->
              <!--                                    <div class="pd-badge">NEW</div>-->
              <!--                                </div>-->
              <!--                            </div>-->
              <!--                        </div>-->
              <!--                        <div class="py-12 mb-35 border-top border-bottom border-C0">-->
              <!--                            <div class="row align-items-center gx-3">-->
              <!--                                <div class="col-6">-->
              <!--                                    <div class="pd-detail__price">-->
              <!--                                        <p class="pd-detail__price__new"><span>500.000 đ</span> <span class="m-badge">-50%</span>-->
              <!--                                        </p>-->
              <!--                                        <p class="pd-detail__price__old">750.000 đ</p>-->
              <!--                                    </div>-->
              <!--                                </div>-->
              <!--                                <div class="col-6 text-end">-->
              <!--                                    <div class="pd-detail__rating">-->
              <!--                                        <div class="rating-stars">-->
              <!--                                            <div class="empty-stars">-->
              <!--                                                <i class="far fa-star"></i>-->
              <!--                                                <i class="far fa-star"></i>-->
              <!--                                                <i class="far fa-star"></i>-->
              <!--                                                <i class="far fa-star"></i>-->
              <!--                                                <i class="far fa-star"></i>-->
              <!--                                            </div>-->
              <!--                                            <div class="filled-stars" style="width: 80%;">-->
              <!--                                                <i class="far fa-star"></i>-->
              <!--                                                <i class="far fa-star"></i>-->
              <!--                                                <i class="far fa-star"></i>-->
              <!--                                                <i class="far fa-star"></i>-->
              <!--                                                <i class="far fa-star"></i>-->
              <!--                                            </div>-->
              <!--                                        </div>-->
              <!--                                        <span>4.5 (20 đánh giá)</span>-->
              <!--                                    </div>-->
              <!--                                    <div class="pd-detail__purchases">-->
              <!--                                        <i class="fas fa-shopping-cart"></i> 10 lượt mua &nbsp | &nbsp <span-->
              <!--                                            class="fw-semi">Còn hàng</span>-->
              <!--                                    </div>-->
              <!--                                </div>-->
              <!--                            </div>-->
              <!--                        </div>-->
              <!-- END SẢN PHẨM KHÔNG FLASH SALE -->

              <!-- SẢN PHẨM FLASH SALE -->
              <div class="mb-12">
                <div class="row gx-3">
                  <div class="col-10">
                    <p class="pd-detail__title">
                      Monogram Print Cotton Piqué Oversized Polo Shirt
                    </p>
                    <div
                      class="pd-detail__rating pd-detail__rating--flash-sale"
                    >
                      <div class="rating-stars">
                        <div class="empty-stars">
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                        </div>
                        <div
                          class="filled-stars"
                          :style="`width: ${(data.rating_start / 5) * 100}%`"
                        >
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                          <i class="far fa-star"></i>
                        </div>
                      </div>
                      <span
                        >{{ data.rating_start }} ({{ data.total_comment }} đánh
                        giá)</span
                      >
                    </div>
                  </div>
                  <div class="col-2 text-end">
                    <div class="pd-badge" v-if="data.is_new">NEW</div>
                    <div
                      class="pd-badge pd-badge--best-seller"
                      v-if="data.is_hot"
                    >
                      <div>BEST</div>
                      <div>SELLER</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flash-sale-box px-10 mb-35">
                <div class="flash-sale-box__left">
                  <div class="flash-sale-box__title">
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/light.svg`"
                      alt=""
                    />
                    FLASH SALE
                  </div>
                  <div class="flash-sale-box__price">
                    <p class="flash-sale-box__price__old">750.000 đ</p>
                    <p class="flash-sale-box__price__new">500.000 đ</p>
                    <span
                      class="
                        m-badge m-badge--white
                        flash-sale-box__price__badge
                      "
                      >-50%</span
                    >
                  </div>
                </div>
                <div class="flash-sale-box__right">
                  <div class="flash-sale-box__countdown">
                    <div class="flash-sale-box__countdown__title">
                      Kết thúc trong
                    </div>
                    <div class="flash-sale-box__countdown__content">
                      <div
                        class="countdown countdown--sm countdown--outline"
                        data-countdown="2021/09/30 23:00:00"
                      >
                        <div class="countdown__number countdown__hours">
                          <span>0</span>
                          <span>0</span>
                        </div>
                        :
                        <div class="countdown__number countdown__minutes">
                          <span>0</span>
                          <span>0</span>
                        </div>
                        :
                        <div class="countdown__number countdown__seconds">
                          <span>0</span>
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flash-sale-box__purchases">
                    <i class="fas fa-shopping-cart"></i> 10 lượt mua
                  </div>
                </div>
              </div>
              <!-- END SẢN PHẨM FLASH SALE -->
              <div class="mb-40">
                <p class="fz-12 fw-bold mb-12">VÌ SAO BẠN NÊN CHỌN</p>
                <ul class="reason-nav">
                  <li>
                    <div class="reason-img">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/reason-1.svg`"
                        alt=""
                      />
                    </div>
                    <div class="reason-title">
                      <strong>Chất vải CVC</strong> thoáng mát co dãn 4 chiều
                      tạo sự thoải mái
                    </div>
                  </li>
                  <li>
                    <div class="reason-img">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/reason-2.svg`"
                        alt=""
                      />
                    </div>
                    <div class="reason-title">
                      Công nghệ xử lý vải hàng đầu, nhanh khô, chống nhăn khi
                      giặt
                    </div>
                  </li>
                  <li>
                    <div class="reason-img">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/reason-3.svg`"
                        alt=""
                      />
                    </div>
                    <div class="reason-title">
                      <strong>Miễn phí giao hàng</strong> cho đơn hàng trên
                      <strong>500k</strong>
                    </div>
                  </li>
                  <li>
                    <div class="reason-img">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/reason-4.svg`"
                        alt=""
                      />
                    </div>
                    <div class="reason-title">
                      <strong>Đổi trả miễn phí</strong> trong 30 ngày nếu không
                      hài lòng
                    </div>
                  </li>
                </ul>
              </div>
              <div class="mb-20">
                <p class="fw-medium mb-2">Màu sắc:</p>
                <div class="row row-cols-auto gx-12 gy-2">
                  <div
                    class="col"
                    v-for="(color, index) in data.color_list"
                    :key="index"
                    @click="() => onColorChange(color)"
                  >
                    <label
                      :class="`custom-radio me-1  ${
                        !checkState(color.id, sizeSelect) ? 'out-of-stock' : ''
                      }`"
                    >
                      <span
                        class="checkmark"
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
              </div>
              <div class="mb-20">
                <div class="js-size">
                  <p class="fw-medium mb-2">Size:</p>
                  <div class="row gx-3 align-items-center">
                    <div class="col-7">
                      <div class="row row-cols-auto gx-3 gy-2">
                        <div
                          class="col"
                          v-for="(size, index) in data.size_list"
                          :key="index"
                          @click="() => onSizeChange(size)"
                        >
                          <label
                            :class="`custom-radio ${
                              !checkState(colorSelect, size.id)
                                ? 'out-of-stock'
                                : ''
                            }`"
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
                    </div>
                    <div class="col-5 text-end">
                      <div
                        class="fz-12 fw-medium text-decoration-underline"
                        data-bs-toggle="collapse"
                        data-bs-target="#size"
                      >
                        Tư vấn chọn size
                      </div>
                    </div>
                  </div>
                  <div id="size" class="js-size-content collapse">
                    <div class="js-size-content-inner">
                      <div class="mb-3">
                        <div
                          class="d-flex justify-content-between g-2 fw-medium"
                        >
                          <span>Chiều cao</span>
                          <span class="js-size-height-output"
                            >{{ height }}cm</span
                          >
                        </div>
                        <input
                          type="range"
                          class="form-range js-size-height-input"
                          :min="minHeight"
                          :max="maxHeight"
                          v-model="height"
                        />
                      </div>
                      <div class="mb-3">
                        <div class="d-flex justify-content-between fw-medium">
                          <span>Cân nặng</span>
                          <span class="js-size-weight-output"
                            >{{ weight }}kg</span
                          >
                        </div>
                        <input
                          type="range"
                          class="form-range js-size-weight-input"
                          :min="minWeight"
                          :max="maxWeight"
                          v-model="weight"
                        />
                      </div>
                      <div class="d-flex align-items-center">
                        <p class="fw-medium mb-0 me-4">POLOMAN gợi ý</p>
                        <input
                          type="text"
                          class="form-control js-size-result"
                          readonly
                          :value="recomment"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-2">
                <div class="swiper-vertical voucher-slider" id="voucher-slider">
                  <div class="swiper-container">
                    <div class="swiper-wrapper">
                      <div
                        class="swiper-slide"
                        v-for="(voucher, index) in voucherList"
                        :key="index"
                      >
                        <div class="voucher-item">
                          <div class="voucher-item__code">
                            <span>{{ voucher.code }}</span>
                          </div>
                          <div class="voucher-item__desc">
                            <img
                              class="voucher-item__desc__icon"
                              :src="`${baseUrl}/1111111111111111111/images/gift-37.svg`"
                              alt=""
                            />
                            <p class="voucher-item__desc__text">
                              {{ voucher.name }}
                              {{ voucher.content }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <button
                  type="button"
                  class="
                    btn btn-primary
                    fz-12
                    py-10
                    rounded-2
                    w-100
                    add-to-cart-modal-btn
                  "
                  :disabled="!productSelect.product_id || !hasVariation"
                  @click="onSubmit"
                >
                  {{
                    isEdit
                      ? !hasVariation
                        ? "ĐÃ CHỌN"
                        : "CẬP NHẬP"
                      : "THÊM VÀO GIỎ"
                  }}
                </button>
              </div>
              <div class="mb-25 text-center">
                <a
                  href="chi-tiet-san-pham.html"
                  class="fz-12 fw-medium text-decoration-underline"
                  >Xem chi tiết</a
                >
              </div>
            </div>
          </div>
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
