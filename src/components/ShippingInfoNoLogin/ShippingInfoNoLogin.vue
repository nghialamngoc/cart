<script>
import { computed, defineComponent, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { closeModal, openModal } from "../../helper/modal";
import { updateCustomerAddress } from "../../api/account";

// Constant
import { baseUrl } from "../../constant";

// Components
import SelectCity from "../SelectCity.vue";
import SelectDistrict from "../SelectDistrict.vue";
import SelectCommune from "../SelectCommune.vue";

export default defineComponent({
  components: {
    SelectCity,
    SelectDistrict,
    SelectCommune,
  },
  setup(props) {
    // store
    const store = useStore();

    // state
    const shippingInfo = ref({
      bill_fullname: "",
      bill_phone: "",
      type_send: 1,
      fullname: "",
      phone: "",
      full_address: "",
      province_id: "",
      province_name: "",
      commune_id: "",
      commune_name: "",
      district_id: "",
      district_name: "",
    });

    const onSelectProvince = ({ id, name }) => {
      shippingInfo.value.province_id = id;
      shippingInfo.value.province_name = name;

      resetDistrict();
      closeModal("cityModal");
      openModal("districtModal");
    };

    const onSelectDistrict = ({ id, name }) => {
      shippingInfo.value.district_id = id;
      shippingInfo.value.district_name = name;

      resetCommune();
      closeModal("districtModal");
      openModal("wardModal");
    };

    const onSelectCommune = ({ id, name }) => {
      shippingInfo.value.commune_id = id;
      shippingInfo.value.commune_name = name;

      closeModal("wardModal");
    };

    const resetDistrict = () => {
      shippingInfo.value.district_id = "";
      shippingInfo.value.district_name = "";
      shippingInfo.value.commune_id = "";
      shippingInfo.value.commune_name = "";
    };

    const resetCommune = () => {
      shippingInfo.value.commune_id = "";
      shippingInfo.value.commune_name = "";
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
      baseUrl,
      shippingInfo,
      openModal,
      onSelectCommune,
      onSelectDistrict,
      onSelectProvince,
      goBackSelectProvince,
      goBackSelectDistrict,
    };
  },
});
</script>

<template>
  <div class="checkout__body checkout__body--outside pt-2">
    <div id="buyer-info" class="d-none">
      <div class="checkout__body__signed">
        <div class="checkout__body__head">
          <div class="checkout__body__head__left">
            <p class="checkout__body__title d-flex align-items-center">
              Nguyễn Văn Nam
              <span class="badge badge-blue-custom badge-sm ms-10"
                >Mặc định</span
              >
            </p>
          </div>
          <div class="checkout__body__head__right">
            <button
              class="btn btn-fit buyer-info__head__btn"
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
          <p class="mb-1">0357 787 431</p>
          <p class="mb-0">
            Số 9 đường số 12, Phường 11, Quận Gò Vấp Thành phố Hồ Chí Minh
          </p>
        </div>
      </div>
    </div>
    <form action="" id="buyer-info-edit">
      {{ shippingInfo }}
      <div class="row row-cols-1 g-3">
        <div class="col">
          <label class="fw-medium">Họ và tên</label>
          <input
            type="text"
            class="form-control form-control--underline"
            placeholder="VD: Văn Nam"
            v-model="shippingInfo.bill_fullname"
          />
          <div class="invalid-feedback"></div>
        </div>
        <div class="col">
          <label class="fw-medium">Số điện thoại</label>
          <input
            type="tel"
            class="form-control form-control--underline"
            placeholder="VD: 0905 555 000"
            v-model="shippingInfo.bill_phone"
          />
          <div class="invalid-feedback"></div>
        </div>
        <div class="col">
          <div class="form-tab">
            <ul class="nav nav-tabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="form-tab-1"
                  data-bs-toggle="tab"
                  data-bs-target="#form-tab-1-content"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                  @click="() => shippingInfo.type_send = 1"
                >
                  <div></div>
                  Tôi là người nhận
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="form-tab-2"
                  data-bs-toggle="tab"
                  data-bs-target="#form-tab-2-content"
                  type="button"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                  @click="() => shippingInfo.type_send = 2"
                >
                  <div></div>
                  Tôi muốn gửi tặng
                </button>
              </li>
            </ul>
            <div class="tab-content">
              <div
                class="tab-pane fade show active"
                id="form-tab-1-content"
                role="tabpanel"
                aria-labelledby="form-tab-1"
              >
                <div class="row row-cols-1 g-3">
                  <div class="col">
                    <label class="fw-medium"
                      >Địa chỉ (gồm số nhà, tên đường)</label
                    >
                    <input
                      type="tel"
                      class="
                        form-control
                        form-control--underline
                        form-control--icon
                        form-control--icon-location
                      "
                      placeholder="VD: 20 Hai Bà Trưng"
                      v-model="shippingInfo.full_address"
                    />
                    <div class="invalid-feedback"></div>
                  </div>
                  <div class="col">
                    <label class="fw-medium">Tỉnh / thành phố</label>
                    <input
                      type="text"
                      class="
                        form-control
                        form-control--underline
                        form-control--icon
                        form-control--icon-dropdown
                      "
                      placeholder="VD : Hồ Chí Minh"
                      autocomplete="off"
                      style="background-color: white"
                      v-model="shippingInfo.province_name"
                      @click="() => openModal('cityModal')"
                    />
                    <div class="invalid-feedback"></div>
                  </div>
                  <div class="col-6">
                    <label class="fw-medium">Quận / huyện</label>
                    <input
                      type="text"
                      class="
                        form-control
                        form-control--underline
                        form-control--icon
                        form-control--icon-dropdown
                      "
                      placeholder="VD: quận Gò Vấp"
                      autocomplete="off"
                      readonly
                      style="background-color: white"
                      v-model="shippingInfo.district_name"
                      :disabled="!shippingInfo.province_name"
                      @click="() => openModal('districtModal')"
                    />
                    <div class="invalid-feedback"></div>
                  </div>
                  <div class="col-6">
                    <label class="fw-medium">Phường / xã</label>
                    <input
                      type="text"
                      name="phuong-xa"
                      data-rules="required"
                      class="
                        form-control
                        form-control--underline
                        form-control--icon
                        form-control--icon-dropdown
                      "
                      placeholder="VD: phường 11"
                      autocomplete="off"
                      style="background-color: white"
                      v-model="shippingInfo.commune_name"
                      :disabled="!shippingInfo.district_name"
                      readonly
                      @click="() => openModal('wardModal')"
                    />
                    <div class="invalid-feedback"></div>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="form-tab-2-content"
                role="tabpanel"
                aria-labelledby="form-tab-2"
              >
                <div class="row row-cols-1 g-3">
                  <div class="col">
                    <label class="fw-medium">Họ và tên người nhận</label>
                    <input
                      type="text"
                      class="
                        form-control
                        form-control--underline
                        form-control--icon
                        form-control--icon-location
                      "
                      placeholder="VD: Văn Nam"
                      v-model="shippingInfo.fullname"
                    />
                    <div class="invalid-feedback"></div>
                  </div>
                  <div class="col">
                    <label class="fw-medium">số điện thoại người nhận</label>
                    <input
                      type="tel"
                      class="
                        form-control
                        form-control--underline
                        form-control--icon
                        form-control--icon-location
                      "
                      placeholder="VD: 0905 555 000"
                      v-model="shippingInfo.phone"
                    />
                    <div class="invalid-feedback"></div>
                  </div>
                  <div class="col">
                    <label class="fw-medium"
                      >Địa chỉ người nhận (gồm số nhà, tên đường)</label
                    >
                    <input
                      type="text"
                      class="
                        form-control
                        form-control--underline
                        form-control--icon
                        form-control--icon-location
                      "
                      placeholder="VD: 20 Hai Bà Trưng"
                      v-model="shippingInfo.full_address"
                    />
                    <div class="invalid-feedback"></div>
                  </div>
                  <div class="col">
                    <label class="fw-medium">Tỉnh / thành phố</label>
                    <input
                      type="text"
                      class="
                        form-control
                        form-control--underline
                        form-control--icon
                        form-control--icon-dropdown
                      "
                      placeholder="VD : Hồ Chí Minh"
                      autocomplete="off"
                      style="background-color: white"
                      v-model="shippingInfo.province_name"
                      @click="() => openModal('cityModal')"
                    />
                    <div class="invalid-feedback"></div>
                  </div>
                  <div class="col-6">
                    <label class="fw-medium">Quận / huyện</label>
                    <input
                      type="text"
                      class="
                        form-control
                        form-control--underline
                        form-control--icon
                        form-control--icon-dropdown
                      "
                      placeholder="VD: quận Gò Vấp"
                      autocomplete="off"
                      readonly
                      style="background-color: white"
                      v-model="shippingInfo.district_name"
                      :disabled="!shippingInfo.province_name"
                      @click="() => openModal('districtModal')"
                    />
                    <div class="invalid-feedback"></div>
                  </div>
                  <div class="col-6">
                    <label class="fw-medium">Phường / xã</label>
                    <input
                      type="text"
                      name="phuong-xa"
                      data-rules="required"
                      class="
                        form-control
                        form-control--underline
                        form-control--icon
                        form-control--icon-dropdown
                      "
                      placeholder="VD: phường 11"
                      autocomplete="off"
                      style="background-color: white"
                      v-model="shippingInfo.commune_name"
                      :disabled="!shippingInfo.district_name"
                      readonly
                      @click="() => openModal('wardModal')"
                    />
                    <div class="invalid-feedback"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <button
            type="submit"
            class="btn btn-outline-37-white fz-14 fw-semi w-100 py-2 ls-0"
          >
            Lưu thông tin
          </button>
        </div>
      </div>
    </form>
  </div>

  <!-- Select city -->
  <SelectCity @onSelect="onSelectProvince" />

  <!-- Select district_name -->
  <SelectDistrict
    :province_id="shippingInfo.province_id"
    @onSelect="onSelectDistrict"
    @goBack="goBackSelectProvince"
  />

  <!-- Select commune_name -->
  <SelectCommune
    :district_id="shippingInfo.district_id"
    @onSelect="onSelectCommune"
    @goBack="goBackSelectDistrict"
  />
</template>
