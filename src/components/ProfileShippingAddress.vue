<script>
import { defineComponent, onMounted, ref, computed } from "@vue/runtime-core";
import { baseUrl } from "../constant";

import Loading from "./Loading.vue";
import ErrorDialog from "./ErrorDialog.vue";
import {
  addCustomerAddress,
  deleteCustomerAddress,
  getCustomerInfo,
  updateCustomerAddress,
  uploadImage,
} from "../api/account";
import { closeModal, openModal } from "../helper/modal";
import SelectCity from "./SelectCity.vue";
import SelectDistrict from "./SelectDistrict.vue";
import SelectCommune from "./SelectCommune.vue";

export default defineComponent({
  components: {
    Loading,
    ErrorDialog,
    SelectCity,
    SelectDistrict,
    SelectCommune,
  },
  setup() {
    const isLoading = ref(false);
    const isError = ref(false);
    const customerInfo = ref({});
    const form = ref({});

    onMounted(async () => {
      await customerInfoApi();
    });

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

    const customerInfoApi = async () => {
      try {
        isLoading.value = true;
        const data = await getCustomerInfo();
        customerInfo.value = data;
      } catch (err) {
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    const onHideError = () => {
      isError.value = false;
    };

    const onUploadFile = () => {
      const el = document.getElementById("upload_image");

      if (el) {
        el.click();
      }
    };

    const onUploadImage = async (e) => {
      try {
        isLoading.value = true;
        await uploadImage(e.target.files[0]);

        await customerInfoApi();
      } catch (err) {
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    };

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

    const openEditModal = (address) => {
      form.value = {
        ...address,
      };
      openModal("addLocationModal");
    };

    const onAddAddress = () => {
      form.value = {
        name: "",
        phone_number: "",
        address: "",
        province_id: 0,
        commune_id: 0,
        district_id: 0,
        is_default: false,
      };
      openModal("addLocationModal");
    };

    const onSubmit = async () => {
      try {
        isLoading.value = true;
        if (!form.value.address_id) {
          await addCustomerAddress({
            ...form.value,
            phone_number: form.value.phone_number.toString(),
            full_address: form.value.address,
          });
        } else {
          await updateCustomerAddress({
            ...form.value,
            phone_number: form.value.phone_number.toString(),
            full_address: form.value.address,
          });
        }

        await customerInfoApi();
        closeModal("addLocationModal");
      } catch (err) {
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    const removeCustomerAddress = async (id) => {
      try {
        isLoading.value = true;
        await deleteCustomerAddress({
          address_id: id,
        });

        await customerInfoApi();
      } catch (err) {
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      form,
      baseUrl,
      isError,
      isLoading,
      isDisable,
      customerInfo,

      onSubmit,
      openModal,
      onHideError,
      onAddAddress,
      onUploadFile,
      openEditModal,
      onUploadImage,
      onSelectCommune,
      onSelectProvince,
      onSelectDistrict,
      goBackSelectProvince,
      goBackSelectDistrict,
      removeCustomerAddress,
    };
  },
});
</script>

<template>
  <header id="header" class="header">
    <div class="container-fluid">
      <h1 class="header__logo">
        <a :href="baseUrl">
          <img
            :src="`${baseUrl}/1111111111111111111/images/logo.svg`"
            alt="POLOMAN"
          />
        </a>
        <span class="hide-text">POLOMAN</span>
      </h1>
      <div class="header__right">
        <a
          href="#"
          class="header__icon js-toggle-btn"
          data-target="#aside-search"
        >
          <img
            :src="`${baseUrl}/1111111111111111111/images/search.svg`"
            alt=""
          />
        </a>
        <a href="gio-hang.html" class="header__icon" id="hd-cart">
          <span>2</span>
          <img :src="`${baseUrl}/1111111111111111111/images/cart.svg`" alt="" />
        </a>
        <a
          href="#"
          class="header__icon js-toggle-btn"
          data-target="#aside-menu"
        >
          <img
            :src="`${baseUrl}/1111111111111111111/images/hamburger.svg`"
            alt=""
          />
        </a>
      </div>
    </div>
  </header>
  <main class="main">
    <div class="section pt-30">
      <div class="container-fluid">
        <div class="row gx-3 mb-10 align-items-end">
          <div class="col-3"></div>
          <div class="col-6">
            <div class="user-avatar" @click="onUploadFile">
              <div class="user-avatar__img ratio ratio-1x1">
                <img :src="customerInfo.photo_url" alt="" />
              </div>
              <div class="user-avatar__heraldic">
                <input
                  type="file"
                  id="upload_image"
                  name="img"
                  accept="image/*"
                  class="d-none"
                  @change="onUploadImage"
                />
                <img
                  :src="`${baseUrl}/1111111111111111111/images/heraldic.svg`"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="col-3"></div>
        </div>
        <p class="text-8E fz-10 mb-2 ls-20 opacity-0">Thông tin khách hàng</p>
      </div>
    </div>
    <div class="separate-line"></div>
    <section class="section py-4">
      <div class="container-fluid">
        <div
          class="box-picker-wrap"
          v-if="
            customerInfo.customer_addresses &&
            customerInfo.customer_addresses.length > 0
          "
        >
          <label
            class="box-picker box-picker--3"
            v-for="(address, index) in customerInfo.customer_addresses"
            :key="index"
          >
            <input
              type="radio"
              class="box-picker__input"
              name="diachi"
              value="diachi-1"
              checked
            />
            <div class="box-picker__checkmark">
              <div class="row gx-2 align-items-center">
                <div class="col-9">
                  <p class="box-picker__checkmark__title">{{ address.name }}</p>
                </div>
                <div class="col-3 text-end">
                  <button
                    type="button"
                    class="btn box-picker__checkmark__edit"
                    @click="() => openEditModal(address)"
                  >
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/edit-8E.svg`"
                      alt=""
                    />
                  </button>
                  <button
                    type="button"
                    class="btn box-picker__checkmark__edit"
                    @click="() => removeCustomerAddress(address.address_id)"
                  >
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/remove-8E.svg`"
                      alt=""
                    />
                  </button>
                </div>
              </div>
              <div class="row gx-2">
                <div class="col-9">
                  <p class="box-picker__checkmark__desc">
                    {{ address.phone_number }} <br />
                    {{ address.address }}
                  </p>
                </div>
                <div class="col-3">
                  <span
                    class="box-picker__checkmark__tag badge badge-blue-custom"
                    v-if="address.is_default"
                    >Mặc định</span
                  >
                </div>
              </div>
            </div>
          </label>
        </div>
        <button class="btn add-more-btn mt-12" @click="onAddAddress">
          <img
            :src="`${baseUrl}/1111111111111111111/images/plus-37.svg`"
            alt=""
          />
          Thêm địa chỉ
        </button>
      </div>
    </section>
  </main>

  <!-- LOADING MODAL -->
  <Loading :isLoading="isLoading"></Loading>

  <ErrorDialog
    :isOpen="isError"
    message="Có lỗi xảy ra. Vui lòng thử lại!"
    :hideError="onHideError"
    title="Lỗi!"
  />

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
                type="number"
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
