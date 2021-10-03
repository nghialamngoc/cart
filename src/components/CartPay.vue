<script>
import { computed, defineComponent, onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";

// Api
import { getPaymentMethodList, updateCartShippingAddress } from "../api";
import { resolveErrorMessage } from "../helper/resolveErrorMessage";

// Helper
import { closeModal, openModal } from "../helper/modal";
import { money, date } from "../helper/format";

// Constant
import { baseUrl } from "../constant";

// Component
import CustomerAddress from "./CustomerAddress/CustomerAddress.vue";
import CustomerNoAddress from "./CustomerAddress/CustomerNoAddress.vue";
import ShippingInfoNoLogin from "./ShippingInfoNoLogin/ShippingInfoNoLogin.vue";

export default defineComponent({
  components: {
    CustomerAddress,
    CustomerNoAddress,
    ShippingInfoNoLogin,
  },
  setup(props, { emit }) {
    // store
    const store = useStore();

    // state
    const isEdit = computed(() => store.state.isEdit);
    const bankCode = computed(() => store.state.bankCode);
    const cart = computed(() => store.state.cart);
    const customerShippingAddress = computed(
      () => store.state.customerShippingAddress
    );
    const isValidCustomerShippingAddress = computed(
      () => store.getters.isValidCustomerShippingAddress
    );
    const shippingStandard = computed(() => store.state.shippingStandard);
    const shippingType = computed(() => store.state.shippingType);
    const quickShippingType = computed(() => store.state.quickShippingType);
    const isFreeShip = computed(() => store.getters.isFreeShip);
    const paymentMethod = computed(() => store.state.paymentMethod);
    const note = computed(() => store.state.note);
    const boxName = computed(() => store.getters.boxName);
    const customerId = computed(() => store.getters.customerId);
    const paymentMethods = computed(() => store.state.paymentMethods);
    const methodType = computed(() => store.getters.paymentMethodType);
    const ahamove = computed(() => store.state.ahamove);
    const grap = computed(() => store.state.grap);

    // life
    onMounted(async () => {
      //await getShippingSetting();

      if (customerId.value != "") {
        await store.dispatch("getCustomerAddressList");
      }
      await store.dispatch("setDefaultShippingAddress");
      store.dispatch("getShippingStandard");
      getPaymentMethod();

      if (!isValidCustomerShippingAddress.value) {
        store.commit("setEdit", true);
      }
    });

    const getPaymentMethod = async () => {
      try {
        const data = await getPaymentMethodList();

        if (Array.isArray(data) && data.length > 0) {
          store.commit("setPaymentMethods", data);
          store.commit("setPaymentMethod", data[0].payment_id);
        }
      } catch (err) {
        //
      }
    };

    const changeShippingType = async (value) => {
      store.commit("setShippingType", value);

      if (value == 2) {
        await store.dispatch("ahomoveShippingFee");
      }
    };

    const changeQuickShippingType = (value) => {
      if (value === 2) {
        if (!grap.value || !grap.value.distance || !grap.value.total_price) {
          store.commit(
            "setError",
            "Phương thức giao hàng không khả dụng. Bạn vui lòng chọn phương thức khác hoặc nhập chính xác thông tin nhận hàng!"
          );

          return;
        }
      }

      if (value === 3) {
        if (
          !ahamove.value ||
          !ahamove.value.distance ||
          !ahamove.value.total_price
        ) {
          store.commit(
            "setError",
            "Phương thức giao hàng không khả dụng. Bạn vui lòng chọn phương thức khác hoặc nhập chính xác thông tin nhận hàng!"
          );

          return;
        }
      }

      store.commit("setQuickShippingType", value);
    };

    const changePaymentMethod = (value) => {
      store.commit("setPaymentMethod", value);
    };

    const changeNote = (value) => {
      store.commit("setNote", value);
    };

    const onBankChange = (value) => {
      store.commit("setBankCode", value);
    };

    return {
      grap,
      cart,
      note,
      isEdit,
      baseUrl,
      boxName,
      ahamove,
      bankCode,
      customerId,
      methodType,
      isFreeShip,
      shippingType,
      paymentMethod,
      paymentMethods,
      customerShippingAddress,
      shippingStandard,
      quickShippingType,

      date,
      money,
      openModal,
      changeNote,
      onBankChange,
      changeShippingType,
      changePaymentMethod,

      changeQuickShippingType,
    };
  },
});
</script>

<template>
  <main class="main">
    <div class="section py-30">
      <div class="container-fluid">
        <section class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-1.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h2 class="checkout__head__title">THÔNG TIN NHẬN HÀNG</h2>
          </div>
          <div class="checkout__body checkout__body--outside pt-2">
            <template v-if="customerId">
              <div id="buyer-info" v-if="!isEdit">
                <div class="checkout__body__signed">
                  <div class="checkout__body__head">
                    <div class="checkout__body__head__left">
                      <p
                        class="checkout__body__title d-flex align-items-center"
                      >
                        {{ customerShippingAddress.name }}
                        <span
                          class="badge badge-blue-custom badge-sm ms-10"
                          v-if="customerShippingAddress.is_default"
                          >Mặc định</span
                        >
                      </p>
                    </div>
                    <div class="checkout__body__head__right">
                      <button
                        class="btn btn-fit"
                        data-bs-toggle="modal"
                        data-bs-target="#locationModal"
                      >
                        <img
                          :src="`${baseUrl}/1111111111111111111/images/edit-37.svg`"
                          alt=""
                          width="18"
                        />
                      </button>
                    </div>
                  </div>
                  <div class="text-63 ls-20">
                    <p class="mb-1">
                      {{ customerShippingAddress.phone_number }}
                    </p>
                    <p class="mb-0">
                      {{ customerShippingAddress.address }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else>
                <CustomerNoAddress></CustomerNoAddress>
              </div>
            </template>
            <template v-else>
              <shipping-info-no-login></shipping-info-no-login>
            </template>
          </div>
        </section>
      </div>
    </div>
    <div class="separate-line separate-line--gradient"></div>
    <div class="section pt-30 pb-35">
      <div class="container-fluid">
        <section class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-2.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h2 class="checkout__head__title">PHƯƠNG THỨC GIAO HÀNG</h2>
          </div>

          <div class="checkout__body checkout__body--outside">
            <label class="box-picker" v-if="shippingStandard.shipping_id">
              <input
                type="radio"
                class="box-picker__input"
                :checked="shippingType === 1"
                @click="() => changeShippingType(1)"
              />
              <div class="box-picker__checkmark">
                <div class="row gx-2 align-items-center">
                  <div class="col-10">
                    <div class="row gx-10 align-items-center">
                      <div class="col-1">
                        <div class="box-picker__checkmark__icon"></div>
                      </div>
                      <div class="col-11">
                        <p class="box-picker__checkmark__title">
                          Giao hàng tiêu chuẩn
                        </p>
                      </div>
                    </div>
                    <div class="row gx-10">
                      <div class="col-11 offset-1">
                        <div class="box-picker__checkmark__desc">
                          <div class="row row-cols-2 gx-2">
                            <div class="col">
                              <p class="mb-0">Thời gian dự kiến</p>
                              <p class="mb-0 fw-bold">
                                {{
                                  date(
                                    new Date(Date.now() + 3600 * 1000 * 24),
                                    "dd/MM"
                                  )
                                }}
                                -
                                {{
                                  date(
                                    new Date(Date.now() + 3600 * 1000 * 24 * 4),
                                    "dd/MM"
                                  )
                                }}
                              </p>
                            </div>
                            <div class="col">
                              <p class="mb-0">Phí ship</p>
                              <p class="mb-0 fw-bold">
                                {{
                                  isFreeShip
                                    ? 0
                                    : Intl.NumberFormat("vi-VN").format(
                                        shippingStandard.shipping_price
                                      )
                                }}đ
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </label>
            <label class="box-picker">
              <input
                type="radio"
                class="box-picker__input"
                :checked="shippingType === 2"
                @click="() => changeShippingType(2)"
              />
              <div class="box-picker__checkmark">
                <div class="row gx-2 align-items-center">
                  <div class="col-10">
                    <div class="row gx-10 align-items-center">
                      <div class="col-1">
                        <div class="box-picker__checkmark__icon"></div>
                      </div>
                      <div class="col-11">
                        <p class="box-picker__checkmark__title">
                          Giao nhanh 2h
                        </p>
                      </div>
                    </div>
                    <div class="row gx-10">
                      <div class="col-11 offset-1">
                        <p class="box-picker__checkmark__desc">
                          Giao hàng 24/7 kể cả ngày lễ. Vui lòng kiếm tra tình
                          trạng sp trước khi thanh toán.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="col-2 text-end">
                    <span
                      class="btn box-picker__checkmark__toggle"
                      :style="{
                        backgroundImage: `url(${baseUrl}/1111111111111111111/images/toggle-plus.svg)`,
                      }"
                    ></span>
                  </div>
                </div>
                <div class="select-transport-unit">
                  <label
                    class="box-picker box-picker--2"
                    @click="() => changeQuickShippingType(2)"
                  >
                    <div class="box-picker__checkmark">
                      <div class="row gx-2 align-items-center">
                        <div
                          :class="
                            grap && grap.distance && grap.total_price
                              ? 'col-7'
                              : 'col-12'
                          "
                        >
                          <div class="unit-item">
                            <div class="unit-item__logo">
                              <img
                                :src="`${baseUrl}/1111111111111111111/images/grab.png`"
                                alt=""
                              />
                            </div>
                            <div class="unit-item__info">
                              <p class="unit-item__title">Grab</p>
                              <p
                                class="unit-item__desc"
                                v-if="grap && grap.distance && grap.total_price"
                              >
                                Phí ship:
                                <span class="fw-semi">{{
                                  money(grap.total_price)
                                }}</span>
                              </p>
                              <p class="unit-item__desc" v-else>
                                Phương thức vận chuyển chưa khả dụng với thông
                                tin nhận hàng
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          class="col-4"
                          v-if="grap && grap.distance && grap.total_price"
                        >
                          <div class="distance">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/distance.svg`"
                              alt=""
                            />
                            {{ grap.distance }}km
                          </div>
                        </div>
                        <div class="col-1 text-end">
                          <div v-if="quickShippingType === 2">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/check-green.svg`"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                  <label
                    class="box-picker box-picker--2"
                    @click="() => changeQuickShippingType(3)"
                  >
                    <div class="box-picker__checkmark">
                      <div class="row gx-2 align-items-center">
                        <div
                          :class="
                            ahamove && ahamove.distance && ahamove.total_price
                              ? 'col-7'
                              : 'col-12'
                          "
                        >
                          <div class="unit-item">
                            <div class="unit-item__logo">
                              <img
                                :src="`${baseUrl}/1111111111111111111/images/ahamove.png`"
                                alt=""
                              />
                            </div>
                            <div class="unit-item__info">
                              <p class="unit-item__title">Ahamove</p>
                              <p
                                class="unit-item__desc"
                                v-if="
                                  ahamove &&
                                  ahamove.distance &&
                                  ahamove.total_price
                                "
                              >
                                Phí ship:
                                <span class="fw-semi">{{
                                  money(ahamove.total_price)
                                }}</span>
                              </p>
                              <p class="unit-item__desc" v-else>
                                Phương thức vận chuyển chưa khả dụng với thông
                                tin nhận hàng
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          class="col-4"
                          v-if="
                            ahamove && ahamove.distance && ahamove.total_price
                          "
                        >
                          <div class="distance">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/distance.svg`"
                              alt=""
                            />
                            {{ ahamove.distance }}km
                          </div>
                        </div>
                        <div class="col-1 text-end">
                          <div v-if="quickShippingType === 3">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/check-green.svg`"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </label>
          </div>
        </section>
      </div>
    </div>
    <div class="separate-line"></div>
    <div class="section py-30">
      <div class="container-fluid">
        <section class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-3.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h2 class="checkout__head__title">PHƯƠNG THỨC THANH TOÁN</h2>
          </div>
          <div class="checkout__body checkout__body--outside pt-2">
            <div class="box-picker-wrap">
              <label
                class="box-picker"
                v-for="(method, index) in paymentMethods"
                :key="index"
              >
                <input
                  type="radio"
                  class="box-picker__input"
                  :checked="paymentMethod === method.payment_id"
                  @click="() => changePaymentMethod(method.payment_id)"
                />
                <div class="box-picker__checkmark">
                  <div class="row gx-2 align-items-center">
                    <div class="col-1">
                      <div class="box-picker__checkmark__icon"></div>
                    </div>
                    <div class="col-10">
                      <div class="unit-item unit-item--lg">
                        <div class="unit-item__logo">
                          <img :src="method.image" alt="" />
                        </div>
                        <div class="unit-item__info">
                          <p class="unit-item__title">{{ method.name }}</p>
                          <p class="unit-item__desc">
                            {{ method.instruction }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="col-1 text-end">
                      <div class="box-picker__checkmark__check">
                        <img
                          :src="`${baseUrl}/1111111111111111111/images/check-green.svg`"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </label>
              <template v-if="methodType === 3">
                <select
                  :value="bankCode"
                  @change="(e) => onBankChange(e.target.value)"
                >
                  <option value="NCB">Ngan hang NCB</option>
                  <option value="AGRIBANK">Ngan hang Agribank</option>
                  <option value="SCB">Ngan hang SCB</option>
                  <option value="SACOMBANK">Ngan hang SacomBank</option>
                  <option value="EXIMBANK">Ngan hang EximBank</option>
                  <option value="MSBANK">Ngan hang MSBANK</option>
                  <option value="NAMABANK">Ngan hang NamABank</option>
                  <option value="VNMART">Vi dien tu VnMart</option>
                  <option value="VIETINBANK">Ngan hang Vietinbank</option>
                  <option value="VIETCOMBANK">Ngan hang VCB</option>
                  <option value="HDBANK">Ngan hang HDBank</option>
                  <option value="DONGABANK">Ngan hang Dong A</option>
                  <option value="TPBANK">Ngân hàng TPBank</option>
                  <option value="OJB">Ngân hàng OceanBank</option>
                  <option value="BIDV">Ngân hàng BIDV</option>
                  <option value="TECHCOMBANK">Ngân hàng Techcombank</option>
                  <option value="VPBANK">Ngan hang VPBank</option>
                  <option value="MBBANK">Ngan hang MBBank</option>
                  <option value="ACB">Ngan hang ACB</option>
                  <option value="OCB">Ngan hang OCB</option>
                  <option value="IVB">Ngan hang IVB</option>
                  <option value="VISA">Thanh toan qua VISA/MASTER</option>
                </select>
              </template>
            </div>
            <div class="ls-20 mt-3">
              <strong class="fw-600">Tiền mặt:</strong> Bạn sẽ thanh toán bằng
              tiền mặt cho nhân viên giao hàng khi thanh toán. Vui lòng kiểm tra
              tình trạng sản phẩm và hóa đơn khi thanh toán.
            </div>
          </div>
        </section>
      </div>
    </div>
    <div class="separate-line"></div>
    <div class="section pt-30 pb-35">
      <div class="container-fluid">
        <section class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-4.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h2 class="checkout__head__title checkout__head__title--2">
              DỊCH VỤ KÈM THEO
            </h2>
          </div>
          <div class="checkout__body checkout__body--outside">
            <p class="checkout__body__title checkout__body__title--2">
              Gói quà - kèm theo lời chúc
            </p>
            <textarea
              class="checkout__body__textarea form-control"
              placeholder="Lời nhắn của bạn"
              :value="note"
              @change="(e) => changeNote(e.target.value)"
            ></textarea>
          </div>
        </section>
      </div>
    </div>
    <div class="separate-line"></div>
    <div class="section pt-30 pb-35">
      <div class="container-fluid">
        <section class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-5.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h2 class="checkout__head__title checkout__head__title--2">
              THÔNG TIN ĐƠN HÀNG
            </h2>
          </div>
          <div class="checkout__body checkout__body--outside pt-2">
            <div
              class="checkout-pd"
              v-for="(product, index) in cart.detail"
              :key="index"
            >
              <div class="checkout-pd__img">
                <img :src="product.image" alt="" />
              </div>
              <div class="checkout-pd__info">
                <p class="checkout-pd__title">
                  {{ product.title }}
                  {{ product.attribute.size }}
                  <br />
                  <span class="fw-semi" v-if="boxName">({{ boxName }})</span>
                </p>
                <p class="checkout-pd__price">
                  {{ product.quantity }} <span class="fz-10 mx-2">X</span>
                  {{
                    product.type === 2
                      ? "0đ (Quà tặng)"
                      : `${Intl.NumberFormat("vi-VN").format(
                          product.price_sale
                        )}đ`
                  }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <div class="separate-line"></div>
  </main>

  <CustomerAddress></CustomerAddress>
</template>

<style></style>
