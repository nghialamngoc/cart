<script>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "@vue/runtime-core";
import SelectCity from "./SelectCity.vue";
import SelectDistrict from "./SelectDistrict.vue";
import SelectCommune from "./SelectCommune.vue";
import CartHeader from "./CartHeader.vue";
import { date } from "../helper/format";
import { closeModal, openModal } from "../helper/modal";
import axios from "axios";

export default defineComponent({
  components: {
    SelectCity,
    SelectDistrict,
    SelectCommune,
    CartHeader,
  },
  props: ["baseUrl", "cart", "isFreeShip", "paymentMethod"],
  emits: [
    "onChangeStep",
    "setLoading",
    "getCartInfo",
    "setError",
    "setShippingFree",
    "setPaymentMethod"
  ],
  setup(props, { emit }) {
    const isEdit = ref(false);
    const customerAddress = reactive({
      name: "",
      phone_number: "",
      address: "",
      province_name: "",
      province_id: "",
      district_name: "",
      district_id: "",
      commune_name: "",
      commune_id: "",
      address_id: "",
    });

    const note = ref("");
    const shippingType = ref(1);
    const quickShippingType = ref(1);
    const shipingStandard = reactive({
      value: {},
    });

    const setEdit = () => {
      isEdit.value = true;
    };

    // life
    onMounted(async () => {
      await getShippingSetting();
      await getCustomerAddress();

      if (
        !props.cart.value ||
        !props.cart.value.address ||
        !props.cart.value.phone
      ) {
        isEdit.value = true;
      }
    });

    // computed
    const boxName = computed(() => {
      if (!props.cart || !props.cart.value) {
        return "";
      }

      const box = props.cart.value.detail.filter((x) => x.type === 3);
      return box.length > 0 ? box[0].title : "";
    });

    const paymentMethodModel = computed({
      get() {
        return props.paymentMethod
      },
      set(newValue) {
        emit("setPaymentMethod", newValue)
      }
    })

    // watch
    watch([shippingType, quickShippingType], () => {
      let result = 0;
      if (shippingType.value == 1) {
        result = shipingStandard.value.shipping_price || 0;
      }

      if (shippingType.value == 2) {
        if (quickShippingType.value == 1) {
          result = 25000;
        }

        if (quickShippingType.value == 2) {
          result = 30000;
        }
      }

      emit("setShippingFree", result);
    });

    // service
    const getShippingSetting = async () => {
      try {
        emit("setLoading", true);
        const { total_price, weight } = props.cart.value;
        const { data } = await axios.post(
          `${props.baseUrl}/shipping/api/v1/shipping_standard`,
          {
            total_price,
            total_weight: weight,
            province_id: "0",
          }
        );

        if (Array.isArray(data.data) && data.data.length > 0) {
          shipingStandard.value = data.data[0];
          shippingType.value = 1;
        } else {
          shippingType.value = 2;
          shipingStandard.value = {};
        }
      } catch (err) {
        console.log(err);
      } finally {
        emit("setLoading", false);
      }
    };

    const getCustomerAddress = async () => {
      try {
        emit("setLoading", true);
        const { data } = await axios.post(
          `${props.baseUrl}/customer/api/v1/address/list`
        );

        if (Array.isArray(data.data) && data.data.length > 0) {
          const defaultAddress =
            data.data.find((x) => x.is_default === true) || data.data[0];

          const {
            name,
            phone_number,
            address,
            province_id,
            province_name,
            district_id,
            district_name,
            commune_id,
            commune_name,
            address_id,
            customer_id,
          } = defaultAddress;

          customerAddress.name = name;
          customerAddress.phone_number = phone_number;
          customerAddress.address = address;
          customerAddress.province_id = province_id;
          customerAddress.province_name = province_name;
          customerAddress.district_id = district_id;
          customerAddress.district_name = district_name;
          customerAddress.commune_id = commune_id;
          customerAddress.commune_name = commune_name;
          customerAddress.address_id = address_id;
          customerAddress.customer_id = customer_id;
        }
      } catch (err) {
        const {
          fullname,
          phone,
          address,
          province_id,
          district_id,
          commune_id,
          province_name,
          district_name,
          commune_name,
        } = props.cart.value;

        if (phone != "" && fullname != "" && address != "") {
          customerAddress.name = fullname;
          customerAddress.phone_number = phone;
          customerAddress.address = address;
          customerAddress.province_id = province_id;
          customerAddress.district_id = district_id;
          customerAddress.commune_id = commune_id;
          customerAddress.province_name = province_name;
          customerAddress.district_name = district_name;
          customerAddress.commune_name = commune_name;
        } else {
          setEdit.value = true;
        }
      } finally {
        emit("setLoading", false);
      }
    };

    const changeAddress = async () => {
      if (
        !customerAddress.name ||
        !customerAddress.address ||
        !customerAddress.phone_number ||
        !customerAddress.province_id ||
        !customerAddress.district_id ||
        !customerAddress.commune_id
      ) {
        emit("setError", "Vui lòng điền đầy đủ thông tin!");
        return;
      }
      try {
        emit("setLoading", true);
        if (customerAddress.address_id != "") {
          await axios.post(`${props.baseUrl}/customer/api/v1/address/update`, {
            ...customerAddress,
            full_address: customerAddress.address,
          });
          getCustomerAddress();
        } else {
          await axios.post(`${props.baseUrl}/cart/api/v1/update_address`, {
            full_name: customerAddress.name,
            address: customerAddress.address,
            phone: customerAddress.phone_number,
            province_id: customerAddress.province_id,
            district_id: customerAddress.district_id,
            commune_id: customerAddress.commune_id,
          });
          emit("getCartInfo", true);
        }
        isEdit.value = false;
        getShippingSetting();
      } catch (err) {
        console.log(err);
      } finally {
        emit("setLoading", false);
      }
    };

    const onSelectProvince = ({ id, name }) => {
      customerAddress.province_id = id;
      customerAddress.province_name = name;
      resetDistrict();
      resetCommune();
      closeModal("cityModal");
      openModal("districtModal");
    };

    const onSelectDistrict = ({ id, name }) => {
      customerAddress.district_id = id;
      customerAddress.district_name = name;
      resetCommune();
      closeModal("districtModal");
      openModal("wardModal");
    };

    const onSelectCommune = ({ id, name }) => {
      customerAddress.commune_id = id;
      customerAddress.commune_name = name;
      closeModal("wardModal");
    };

    const resetDistrict = () => {
      customerAddress.district_id = "";
      customerAddress.district_name = "";
    };

    const resetCommune = () => {
      customerAddress.commune_name = "";
      customerAddress.commune_id = "";
    };

    const goBackSelectProvince = () => {
      closeModal("districtModal");
      openModal("cityModal");
    };

    const goBackSelectDistrict = () => {
      closeModal("wardModal");
      openModal("districtModal");
    };

    return {
      paymentMethodModel,
      quickShippingType,
      boxName,
      shipingStandard,
      note,
      shippingType,
      customerAddress,
      isEdit,
      setEdit,
      openModal,
      onSelectProvince,
      onSelectDistrict,
      onSelectCommune,
      goBackSelectProvince,
      goBackSelectDistrict,
      date,
      changeAddress,
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
            <div id="buyer-info" v-if="!isEdit">
              <div class="checkout__body__signed">
                <div class="checkout__body__head">
                  <div class="checkout__body__head__left">
                    <p class="checkout__body__title d-flex align-items-center">
                      {{ customerAddress.name }}
                      <span
                        class="badge badge-blue-custom badge-sm ms-10"
                        v-if="customerAddress.is_default"
                        >Mặc định</span
                      >
                    </p>
                  </div>
                  <div class="checkout__body__head__right">
                    <button class="btn btn-fit" @click="setEdit">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/edit-37.svg`"
                        alt=""
                        width="18"
                      />
                    </button>
                  </div>
                </div>
                <div class="text-63 ls-20">
                  <p class="mb-1">{{ customerAddress.phone_number }}</p>
                  <p class="mb-0">
                    {{ customerAddress.address }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="mb-3">
                <label class="fw-medium">Họ và tên</label>
                <input
                  type="text"
                  class="form-control form-control--underline"
                  placeholder="VD: Văn Nam"
                  v-model="customerAddress.name"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-3">
                <label class="fw-medium">Số điện thoại</label>
                <input
                  type="text"
                  class="form-control form-control--underline"
                  placeholder="VD: 0905 555 000"
                  v-model="customerAddress.phone_number"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-3" style="position: relative">
                <label class="fw-medium">Địa chỉ (gồm số nhà, tên đường)</label>
                <input
                  type="text"
                  class="
                    form-control form-control--underline form-control--icon
                  "
                  placeholder="VD: 20 Hai Bà Trưng"
                  v-model="customerAddress.address"
                />
                <img
                  :src="`${baseUrl}/1111111111111111111/images/icon-location-2.svg`"
                  :style="{ position: 'absolute', right: '0', bottom: '10px' }"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-3" style="position: relative">
                <label class="fw-medium">Tỉnh / thành phố</label>
                <input
                  type="text"
                  class="
                    form-control form-control--underline form-control--icon
                  "
                  placeholder="VD : Hồ Chí Minh"
                  readonly
                  v-model="customerAddress.province_name"
                  style="background-color: white"
                  @click="() => openModal('cityModal')"
                />
                <img
                  :src="`${baseUrl}/1111111111111111111/images/icon-dropdown.svg`"
                  :style="{ position: 'absolute', right: '0', bottom: '10px' }"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-3" style="position: relative">
                <label class="fw-medium">Quận / huyện</label>
                <input
                  type="text"
                  class="
                    form-control form-control--underline form-control--icon
                  "
                  placeholder="VD: quận Gò Vấp"
                  id="districtInput"
                  v-model="customerAddress.district_name"
                  :disabled="!customerAddress.province_name"
                  readonly
                  style="background-color: white"
                  @click="() => openModal('districtModal')"
                />
                <img
                  :src="`${baseUrl}/1111111111111111111/images/icon-dropdown.svg`"
                  :style="{
                    position: 'absolute',
                    right: '0',
                    bottom: '10px',
                    opacity: !customerAddress.province_name ? '0.5' : '1',
                  }"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-3" style="position: relative">
                <label class="fw-medium">Phường / xã</label>
                <input
                  type="text"
                  class="
                    form-control form-control--underline form-control--icon
                  "
                  placeholder="VD: phường 11"
                  v-model="customerAddress.commune_name"
                  :disabled="!customerAddress.district_name"
                  readonly
                  style="background-color: white"
                  @click="() => openModal('wardModal')"
                />
                <img
                  :src="`${baseUrl}/1111111111111111111/images/icon-dropdown.svg`"
                  :style="{
                    position: 'absolute',
                    right: '0',
                    bottom: '10px',
                    opacity: !customerAddress.district_name ? '0.5' : '1',
                  }"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-0">
                <button
                  class="btn btn-outline-37-white fz-14 fw-semi w-100 py-2 ls-0"
                  @click="changeAddress"
                >
                  Lưu thông tin
                </button>
              </div>
            </div>
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
            <label
              class="box-picker"
              v-if="Object.keys(shipingStandard.value).length > 0"
            >
              <input
                type="radio"
                class="box-picker__input"
                v-model="shippingType"
                value="1"
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
                                        shipingStandard.value.shipping_price
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
                v-model="shippingType"
                value="2"
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
                  <label class="box-picker box-picker--2">
                    <input
                      type="radio"
                      class="box-picker__input"
                      value="1"
                      v-model="quickShippingType"
                    />
                    <div class="box-picker__checkmark">
                      <div class="row gx-2 align-items-center">
                        <div class="col-7">
                          <div class="unit-item">
                            <div class="unit-item__logo">
                              <img
                                :src="`${baseUrl}/1111111111111111111/images/grab.png`"
                                alt=""
                              />
                            </div>
                            <div class="unit-item__info">
                              <p class="unit-item__title">Grab</p>
                              <p class="unit-item__desc">
                                Phí ship: <span class="fw-semi">25.000</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="distance">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/distance.svg`"
                              alt=""
                            />
                            20km
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
                  <label class="box-picker box-picker--2">
                    <input
                      type="radio"
                      class="box-picker__input"
                      value="2"
                      v-model="quickShippingType"
                    />
                    <div class="box-picker__checkmark">
                      <div class="row gx-2 align-items-center">
                        <div class="col-7">
                          <div class="unit-item">
                            <div class="unit-item__logo">
                              <img
                                :src="`${baseUrl}/1111111111111111111/images/ahamove.png`"
                                alt=""
                              />
                            </div>
                            <div class="unit-item__info">
                              <p class="unit-item__title">Grab</p>
                              <p class="unit-item__desc">
                                Phí ship: <span class="fw-semi">25.000</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="distance">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/distance.svg`"
                              alt=""
                            />
                            20km
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
              <label class="box-picker">
                <input
                  type="radio"
                  class="box-picker__input"
                  value="0"
                  v-model="paymentMethodModel"
                />
                <div class="box-picker__checkmark">
                  <div class="row gx-2 align-items-center">
                    <div class="col-1">
                      <div class="box-picker__checkmark__icon"></div>
                    </div>
                    <div class="col-10">
                      <div class="unit-item unit-item--lg">
                        <div class="unit-item__logo">
                          <img
                            :src="`${baseUrl}/1111111111111111111/images/money.svg`"
                            alt=""
                          />
                        </div>
                        <div class="unit-item__info">
                          <p class="unit-item__title">Tiền mặt</p>
                          <p class="unit-item__desc">
                            Thanh toán khi nhận hàng
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
              <label class="box-picker">
                <input
                  type="radio"
                  class="box-picker__input"
                  value="1"
                  v-model="paymentMethodModel"
                />
                <div class="box-picker__checkmark">
                  <div class="row gx-2 align-items-center">
                    <div class="col-1">
                      <div class="box-picker__checkmark__icon"></div>
                    </div>
                    <div class="col-10">
                      <div class="unit-item unit-item--lg">
                        <div class="unit-item__logo">
                          <img
                            :src="`${baseUrl}/1111111111111111111/images/momo.png`"
                            alt=""
                          />
                        </div>
                        <div class="unit-item__info">
                          <p class="unit-item__title">Thanh toán MOMO</p>
                          <p class="unit-item__desc">Quét mã để thanh toán</p>
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
              <label class="box-picker">
                <input
                  type="radio"
                  class="box-picker__input"
                  value="2"
                  v-model="paymentMethodModel"
                />
                <div class="box-picker__checkmark">
                  <div class="row gx-2 align-items-center">
                    <div class="col-1">
                      <div class="box-picker__checkmark__icon"></div>
                    </div>
                    <div class="col-10">
                      <div class="unit-item unit-item--lg">
                        <div class="unit-item__logo">
                          <img
                            :src="`${baseUrl}/1111111111111111111/images/vnpay.png`"
                            alt=""
                          />
                        </div>
                        <div class="unit-item__info">
                          <p class="unit-item__title">Thanh toán VNPAY</p>
                          <p class="unit-item__desc">Qua ứng dụng VNPAY</p>
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
              v-model="note"
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
              v-for="(product, index) in cart.value.detail"
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
                  <span class="fw-semi">({{ boxName }})</span>
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

  <!-- Select city -->
  <SelectCity @onSelect="onSelectProvince" />

  <!-- Select district_name -->
  <SelectDistrict
    :province_id="customerAddress.province_id"
    @onSelect="onSelectDistrict"
    @goBack="goBackSelectProvince"
  />

  <!-- Select commune_name -->
  <SelectCommune
    :district_id="customerAddress.district_id"
    @onSelect="onSelectCommune"
    @goBack="goBackSelectDistrict"
  />
</template>

<style></style>
