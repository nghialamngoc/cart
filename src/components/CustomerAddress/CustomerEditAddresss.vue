<script>
import { computed, defineComponent, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import { closeModal, openModal } from "../../helper/modal";

// Constant
import { baseUrl } from "../../constant";
import { addCustomerAddress, updateCustomerAddress } from "../../api/account";

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
  props: ["data"],
  setup(props) {
    const store = useStore();

    // state
    const form = ref(props.data || {});

    watch(
      () => props.data,
      () => {
        form.value = props.data;
      }
    );

    const isDisable = computed(() => {
      const {
        name,
        phone_number,
        address,
        province_id,
        district_id,
        commune_id,
      } = form.value;
      if (
        !name ||
        !phone_number ||
        !address ||
        !province_id ||
        !district_id ||
        !commune_id ||
        !name.trim() ||
        !address.trim()
      ) {
        return true;
      }

      return false;
    });

    const onSelectProvince = ({ id, name }) => {
      form.value.province_id = id;
      form.value.province_name = name;

      resetDistrict();
      closeModal("cityModal");
      openModal("districtModal");
    };

    const onSelectDistrict = ({ id, name }) => {
      form.value.district_id = id;
      form.value.district_name = name;

      resetCommune();
      closeModal("districtModal");
      openModal("wardModal");
    };

    const onSelectCommune = ({ id, name }) => {
      form.value.commune_id = id;
      form.value.commune_name = name;

      closeModal("wardModal");
    };

    const resetDistrict = () => {
      form.value.district_id = "";
      form.value.district_name = "";
      form.value.commune_id = "";
      form.value.commune_name = "";
    };

    const resetCommune = () => {
      form.value.commune_id = "";
      form.value.commune_name = "";
    };

    const goBackSelectProvince = () => {
      closeModal("districtModal");
      openModal("cityModal");
    };

    const goBackSelectDistrict = () => {
      closeModal("wardModal");
      openModal("districtModal");
    };

    const onSubmit = async () => {
      var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
      if (vnf_regex.test(form.value.phone_number) == false) {
        store.dispatch(
          "setError",
          "Số điện thoại của bạn không đúng định dạng!"
        );
        return;
      }

      try {
        store.dispatch("setLoading", true);
        let newId = form.value.address_id;
        if (!form.value.address_id) {
          newId = await addCustomerAddress({
            ...form.value,
            phone_number: form.value.phone_number,
            full_address: form.value.address,
          });
        } else {
          await updateCustomerAddress({
            ...form.value,
            phone_number: form.value.phone_number,
            full_address: form.value.address,
          });
        }

        await store.dispatch("getCustomerAddressList");
        await store.commit("setCustomerShippingAddressById", newId);
        closeModal("addLocationModal");
      } catch (err) {
        console.log(err);
        store.dispatch("setError", "Có lỗi xảy ra vui lòng thử lại!");
      } finally {
        store.dispatch("setLoading", false);
      }
    };

    return {
      form,
      baseUrl,
      isDisable,

      onSubmit,
      openModal,
      onSelectCommune,
      onSelectProvince,
      onSelectDistrict,
      goBackSelectProvince,
      goBackSelectDistrict,
    };
  },
});
</script>

<template>
  <!-- ADD LOCATION MODAL -->
  <div
    class="modal fade modal-bottom add-location-modal"
    id="addLocationModal"
    tabindex="-1"
    aria-labelledby="addLocationModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <form action="" id="addLocationForm">
        <div class="modal-content">
          <div class="modal-header">
            <p class="modal-title" data-bs-dismiss="modal">
              <i class="fas fa-chevron-left"></i>
              ĐỊA CHỈ NGƯỜI NHẬN
            </p>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="fw-medium">Họ và tên</label>
              <input
                type="text"
                class="form-control form-control--underline"
                placeholder="VD: Văn Nam"
                v-model="form.name"
              />
              <div class="invalid-feedback"></div>
            </div>
            <div class="mb-3">
              <label class="fw-medium">Số điện thoại</label>
              <input
                type="text"
                class="form-control form-control--underline"
                placeholder="VD: 0905 555 000"
                v-model="form.phone_number"
              />
              <div class="invalid-feedback"></div>
            </div>
            <div class="mb-3">
              <label class="fw-medium">Địa chỉ (gồm số nhà, tên đường)</label>
              <input
                type="text"
                class="form-control form-control--underline form-control--icon"
                placeholder="VD: 20 Hai Bà Trưng"
                v-model="form.address"
              />
              <div class="invalid-feedback"></div>
            </div>
            <div class="mb-3">
              <label class="fw-medium">Tỉnh / thành phố</label>
              <input
                type="text"
                class="form-control form-control--underline form-control--icon"
                placeholder="VD : Hồ Chí Minh"
                readonly
                v-model="form.province_name"
                style="background-color: white"
                @click="() => openModal('cityModal')"
              />
              <div class="invalid-feedback"></div>
            </div>
            <div class="mb-3">
              <label class="fw-medium">Quận / huyện</label>
              <input
                type="text"
                class="form-control form-control--underline form-control--icon"
                placeholder="VD: quận Gò Vấp"
                id="districtInput"
                v-model="form.district_name"
                :disabled="!form.province_name"
                readonly
                style="background-color: white"
                @click="() => openModal('districtModal')"
              />
              <div class="invalid-feedback"></div>
            </div>
            <div class="mb-3">
              <label class="fw-medium">Phường / xã</label>
              <input
                type="text"
                class="form-control form-control--underline form-control--icon"
                placeholder="VD: phường 11"
                v-model="form.commune_name"
                :disabled="!form.district_name"
                readonly
                style="background-color: white"
                @click="() => openModal('wardModal')"
              />
              <div class="invalid-feedback"></div>
            </div>
            <div class="mb-3 d-flex">
              <input
                type="checkbox"
                class="text-toggle__input d-inline"
                v-model="form.is_default"
              />
              <p style="margin-left: 5px">Mặc định</p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-primary"
              :disabled="isDisable"
              @click.prevent="onSubmit"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Select city -->
  <SelectCity @onSelect="onSelectProvince" />

  <!-- Select district_name -->
  <SelectDistrict
    :province_id="form.province_id"
    @onSelect="onSelectDistrict"
    @goBack="goBackSelectProvince"
  />

  <!-- Select commune_name -->
  <SelectCommune
    :district_id="form.district_id"
    @onSelect="onSelectCommune"
    @goBack="goBackSelectDistrict"
  />
</template>
