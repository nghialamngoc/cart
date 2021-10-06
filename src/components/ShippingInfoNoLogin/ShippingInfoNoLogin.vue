<script>
import { computed, defineComponent, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import { closeModal, openModal } from "../../helper/modal";

// Constant
import { baseUrl } from "../../constant";

// Components
import SelectCity from "../SelectCity.vue";
import SelectDistrict from "../SelectDistrict.vue";
import SelectCommune from "../SelectCommune.vue";
import { resolveErrorMessage } from "../../helper/resolveErrorMessage";
import { updateCartShippingAddress } from "../../api";

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
    const newShippingInfo = ref({
      type_send: 1,
    });
    const guestShippingInfo = computed(() => store.state.guestShippingInfo);
    const isEdit = ref(false);

    const onSelectProvince = ({ id, name }) => {
      newShippingInfo.value.province_id = id;
      newShippingInfo.value.province_name = name;

      resetDistrict();
      closeModal("cityModal");
      openModal("districtModal");
    };

    const onSelectDistrict = ({ id, name }) => {
      newShippingInfo.value.district_id = id;
      newShippingInfo.value.district_name = name;

      resetCommune();
      closeModal("districtModal");
      openModal("wardModal");
    };

    const onSelectCommune = ({ id, name }) => {
      newShippingInfo.value.commune_id = id;
      newShippingInfo.value.commune_name = name;

      closeModal("wardModal");
    };

    const resetDistrict = () => {
      newShippingInfo.value.district_id = "";
      newShippingInfo.value.district_name = "";
      newShippingInfo.value.commune_id = "";
      newShippingInfo.value.commune_name = "";
    };

    const resetCommune = () => {
      newShippingInfo.value.commune_id = "";
      newShippingInfo.value.commune_name = "";
    };

    const goBackSelectProvince = () => {
      closeModal("districtModal");
      openModal("cityModal");
    };

    const goBackSelectDistrict = () => {
      closeModal("wardModal");
      openModal("districtModal");
    };

    const validate = () => {
      const {
        bill_fullname,
        bill_phone,
        type_send = 1,
        fullname,
        phone,
        address,
        province_id,
        commune_id,
        district_id,
      } = newShippingInfo.value;
      if (
        !bill_fullname ||
        !bill_phone ||
        !address ||
        !province_id ||
        !commune_id ||
        !district_id ||
        !bill_fullname.trim() ||
        !bill_phone.trim() ||
        !address.trim()
      ) {
        store.commit("setError", "Vui lòng nhập đầy đủ thông tin nhận hàng!");
        return false;
      }

      let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
      if (vnf_regex.test(bill_phone) == false) {
        store.dispatch(
          "setError",
          "Số điện thoại của bạn không đúng định dạng!"
        );
        return false;
      }

      vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
      if (type_send === 2) {
        if (!fullname || !phone || !fullname.trim() || !phone.trim()) {
          store.commit("setError", "Vui lòng nhập đầy đủ thông tin nhận hàng!");
          return false;
        }

        if (vnf_regex.test(phone) == false) {
          store.dispatch(
            "setError",
            "Số điện thoại của bạn không đúng định dạng!"
          );
          return false;
        }
      }

      return true;
    };

    const onEditClick = (type) => {
      newShippingInfo.value = {
        ...guestShippingInfo.value,
        type_send: type,
      };
      isEdit.value = true;
      store.commit("setEdit", true);
      setTimeout(() => {
        const el = document.getElementById(`form-tab-${type}`);

        if (el) {
          el.click();
        }
      }, 0);
    };

    const onSubmit = async () => {
      const isValid = validate();

      if (isValid) {
        try {
          store.dispatch("setLoading", true);

          if (newShippingInfo.value.type_send === 1) {
            await updateCartShippingAddress({
              ...newShippingInfo.value,
              phone: "",
              full_name: "",
            });
          } else {
            await updateCartShippingAddress({
              ...newShippingInfo.value,
              full_name: newShippingInfo.value.fullname,
            });
          }

          await store.dispatch("getCartInfo");
          await store.dispatch("setGuestShippingInfo");

          isEdit.value = false;
          store.commit("setEdit", false);
        } catch (err) {
          store.dispatch("setError", resolveErrorMessage(err));
        } finally {
          store.dispatch("setLoading", false);
        }
      }
    };

    return {
      isEdit,
      baseUrl,
      newShippingInfo,
      guestShippingInfo,
      onSubmit,
      openModal,
      onEditClick,
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
    <div id="buyer-info" v-if="guestShippingInfo.bill_fullname && !isEdit">
      <div
        class="checkout__body__signed"
        v-if="guestShippingInfo.type_send === 1"
      >
        <div class="checkout__body__head">
          <div class="checkout__body__head__left">
            <p class="checkout__body__title d-flex align-items-center">
              {{ guestShippingInfo.bill_fullname }}
            </p>
          </div>
          <div class="checkout__body__head__right">
            <button
              class="btn btn-fit buyer-info__head__btn"
              @click="() => onEditClick(1)"
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
          <p class="mb-1">{{ guestShippingInfo.bill_phone }}</p>
          <p class="mb-0">
            {{ guestShippingInfo.address }}
          </p>
        </div>
      </div>
      <div class="checkout__body__signed" v-else>
        <div class="checkout__body__head">
          <div class="checkout__body__head__left">
            <div class="checkout__body__title">Thông tin người gữi</div>
            <p class="checkout__body__title d-flex align-items-center">
              {{ guestShippingInfo.bill_fullname }}
            </p>
          </div>
          <div class="checkout__body__head__right">
            <button
              class="btn btn-fit buyer-info__head__btn"
              @click="() => onEditClick(2)"
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
          <p class="mb-1">{{ guestShippingInfo.bill_phone }}</p>
        </div>
        <div class="checkout__body__head mt-3">
          <div class="checkout__body__head__left">
            <div class="checkout__body__title">Thông tin người nhận</div>
            <p class="checkout__body__title d-flex align-items-center">
              {{ guestShippingInfo.fullname }}
            </p>
          </div>
        </div>
        <div class="text-63 ls-20">
          <p class="mb-1">{{ guestShippingInfo.phone }}</p>
          <p class="mb-0">
            {{ guestShippingInfo.address }}
          </p>
        </div>
      </div>
    </div>
    <form action="" id="buyer-info-edit" v-if="isEdit">
      <div class="row row-cols-1 g-3">
        <div class="col">
          <label class="fw-medium">Họ và tên</label>
          <input
            type="text"
            class="form-control form-control--underline"
            placeholder="VD: Văn Nam"
            v-model="newShippingInfo.bill_fullname"
          />
          <div class="invalid-feedback"></div>
        </div>
        <div class="col">
          <label class="fw-medium">Số điện thoại</label>
          <input
            type="tel"
            class="form-control form-control--underline"
            placeholder="VD: 0905 555 000"
            v-model="newShippingInfo.bill_phone"
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
                  @click="() => (newShippingInfo.type_send = 1)"
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
                  @click="() => (newShippingInfo.type_send = 2)"
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
                      v-model="newShippingInfo.address"
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
                      v-model="newShippingInfo.province_name"
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
                      v-model="newShippingInfo.district_name"
                      :disabled="!newShippingInfo.province_name"
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
                      v-model="newShippingInfo.commune_name"
                      :disabled="!newShippingInfo.district_name"
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
                      v-model="newShippingInfo.fullname"
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
                      v-model="newShippingInfo.phone"
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
                      v-model="newShippingInfo.address"
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
                      v-model="newShippingInfo.province_name"
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
                      v-model="newShippingInfo.district_name"
                      :disabled="!newShippingInfo.province_name"
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
                      v-model="newShippingInfo.commune_name"
                      :disabled="!newShippingInfo.district_name"
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
            class="btn btn-outline-37-white fz-14 fw-semi w-100 py-2 ls-0"
            @click.prevent="onSubmit"
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
    :province_id="newShippingInfo.province_id"
    @onSelect="onSelectDistrict"
    @goBack="goBackSelectProvince"
  />

  <!-- Select commune_name -->
  <SelectCommune
    :district_id="newShippingInfo.district_id"
    @onSelect="onSelectCommune"
    @goBack="goBackSelectDistrict"
  />
</template>
