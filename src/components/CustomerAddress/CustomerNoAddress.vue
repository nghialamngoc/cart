<script>
import { defineComponent, ref } from "@vue/runtime-core";

// Constant
import { baseUrl } from "../../constant";
import { closeModal, openModal } from "../../helper/modal";
import { useStore } from "vuex";

// Components
import SelectCity from "../SelectCity.vue";
import SelectDistrict from "../SelectDistrict.vue";
import SelectCommune from "../SelectCommune.vue";
import { addCustomerAddress } from "../../api/account";

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
    const newCustomerAddress = ref({});

    const onSelectProvince = ({ id, name }) => {
      newCustomerAddress.value.province_id = id;
      newCustomerAddress.value.province_name = name;

      resetDistrict();
      closeModal("cityModal");
      openModal("districtModal");
    };

    const onSelectDistrict = ({ id, name }) => {
      newCustomerAddress.value.district_id = id;
      newCustomerAddress.value.district_name = name;

      resetCommune();
      closeModal("districtModal");
      openModal("wardModal");
    };

    const onSelectCommune = ({ id, name }) => {
      newCustomerAddress.value.commune_id = id;
      newCustomerAddress.value.commune_name = name;

      closeModal("wardModal");
    };

    const resetDistrict = () => {
      newCustomerAddress.value.district_id = "";
      newCustomerAddress.value.district_name = "";
      newCustomerAddress.value.commune_id = "";
      newCustomerAddress.value.commune_name = "";
    };

    const resetCommune = () => {
      newCustomerAddress.value.commune_id = "";
      newCustomerAddress.value.commune_name = "";
    };

    const goBackSelectProvince = () => {
      closeModal("districtModal");
      openModal("cityModal");
    };

    const goBackSelectDistrict = () => {
      closeModal("wardModal");
      openModal("districtModal");
    };

    const addNew = async () => {
      var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
      if (vnf_regex.test(newCustomerAddress.value.phone_number) == false) {
        store.dispatch(
          "setError",
          "Số điện thoại của bạn không đúng định dạng!"
        );
        return;
      }

      try {
        store.dispatch("setLoading", true);
        let newId = newCustomerAddress.value.address_id;
        newId = await addCustomerAddress({
          ...newCustomerAddress.value,
        });

        await store.dispatch("getCustomerAddressList");
        await store.commit("setCustomerShippingAddressById", newId);
        store.commit("setEdit", false);
      } catch (err) {
        console.log(err);
        store.dispatch("setError", "Có lỗi xảy ra vui lòng thử lại!");
      } finally {
        store.dispatch("setLoading", false);
      }
    };

    return {
      baseUrl,
      newCustomerAddress,
      addNew,
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
  <!--LOCATION MODAL-->
  <div class="mb-3">
    <label class="fw-medium">Họ và tên</label>
    <input
      type="text"
      class="form-control form-control--underline"
      placeholder="VD: Văn Nam"
      v-model="newCustomerAddress.name"
    />
    <div class="invalid-feedback"></div>
  </div>
  <div class="mb-3">
    <label class="fw-medium">Số điện thoại</label>
    <input
      type="text"
      class="form-control form-control--underline"
      placeholder="VD: 0905 555 000"
      v-model="newCustomerAddress.phone_number"
    />
    <div class="invalid-feedback"></div>
  </div>
  <div class="mb-3" style="position: relative">
    <label class="fw-medium">Địa chỉ (gồm số nhà, tên đường)</label>
    <input
      type="text"
      class="form-control form-control--underline form-control--icon"
      placeholder="VD: 20 Hai Bà Trưng"
      v-model="newCustomerAddress.full_address"
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
      class="form-control form-control--underline form-control--icon"
      placeholder="VD : Hồ Chí Minh"
      readonly
      style="background-color: white"
      v-model="newCustomerAddress.province_name"
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
      class="form-control form-control--underline form-control--icon"
      placeholder="VD: quận Gò Vấp"
      id="districtInput"
      style="background-color: white"
      readonly
      v-model="newCustomerAddress.district_name"
      :disabled="!newCustomerAddress.province_name"
      @click="() => openModal('districtModal')"
    />
    <img
      :src="`${baseUrl}/1111111111111111111/images/icon-dropdown.svg`"
      :style="{
        position: 'absolute',
        right: '0',
        bottom: '10px',
        opacity: !newCustomerAddress.province_name ? '0.5' : '1',
      }"
    />
    <div class="invalid-feedback"></div>
  </div>
  <div class="mb-3" style="position: relative">
    <label class="fw-medium">Phường / xã</label>
    <input
      type="text"
      class="form-control form-control--underline form-control--icon"
      placeholder="VD: phường 11"
      style="background-color: white"
      v-model="newCustomerAddress.commune_name"
      :disabled="!newCustomerAddress.district_name"
      readonly
      @click="() => openModal('wardModal')"
    />
    <img
      :src="`${baseUrl}/1111111111111111111/images/icon-dropdown.svg`"
      :style="{
        position: 'absolute',
        right: '0',
        bottom: '10px',
        opacity: !newCustomerAddress.district_name ? '0.5' : '1',
      }"
    />
    <div class="invalid-feedback"></div>
  </div>
  <div class="mb-0">
    <button
      class="btn btn-outline-37-white fz-14 fw-semi w-100 py-2 ls-0"
      @click="addNew"
    >
      Lưu thông tin
    </button>
  </div>

  <!-- Select city -->
  <SelectCity @onSelect="onSelectProvince" />

  <!-- Select district_name -->
  <SelectDistrict
    :province_id="newCustomerAddress.province_id"
    @onSelect="onSelectDistrict"
    @goBack="goBackSelectProvince"
  />

  <!-- Select commune_name -->
  <SelectCommune
    :district_id="newCustomerAddress.district_id"
    @onSelect="onSelectCommune"
    @goBack="goBackSelectDistrict"
  />
</template>
