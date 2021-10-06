<script>
import { defineComponent, onMounted, ref, computed } from "@vue/runtime-core";
import { baseUrl } from "../constant";

import { date } from "../helper/format";
import Loading from "./Loading.vue";
import ErrorDialog from "./ErrorDialog.vue";
import { getCustomerInfo, updateCustomerInfo, uploadImage } from "../api/account";
import { closeModal, openModal } from "../helper/modal";

export default defineComponent({
  components: {
    Loading,
    ErrorDialog,
  },
  setup() {
    const isLoading = ref(false);
    const isError = ref(false);
    const customerInfo = ref({});
    const updateInfo = ref({});

    onMounted(async () => {
      await customerInfoApi();
    });

    const isDisable = computed(() => {
      const { full_name, phone_number, email, date_of_birth } =
        updateInfo.value;
      if (
        !full_name ||
        !phone_number ||
        !email ||
        !date_of_birth ||
        !full_name.trim() ||
        !phone_number.trim() ||
        !email.trim()
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

    const openUpdateDialog = () => {
      openModal("updateInfoModal");
      updateInfo.value = {
        ...customerInfo.value,
      };
    };

    const onHideError = () => {
      isError.value = false;
    };

    const updateCustomer = async () => {
      try {
        isLoading.value = true;
        const { full_name, phone_number, gender, email, date_of_birth } =
          updateInfo.value;

        if (
          full_name === customerInfo.value.full_name &&
          phone_number === customerInfo.value.phone_number &&
          gender === customerInfo.value.gender &&
          email === customerInfo.value.email &&
          date_of_birth === customerInfo.value.date_of_birth
        ) {
          return;
        }

        await updateCustomerInfo({
          full_name,
          phone_number,
          gender,
          email,
          date_of_birth: date(date_of_birth, "yyyy-MM-dd"),
        });

        await customerInfoApi();

        closeModal("updateInfoModal");
      } catch (err) {
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
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

    return {
      baseUrl,
      isError,
      isLoading,
      isDisable,
      updateInfo,
      customerInfo,
      date,
      onHideError,
      onUploadFile,
      onUploadImage,
      updateCustomer,
      openUpdateDialog,
    };
  },
});
</script>

<template>
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
    <div class="section py-20">
      <div class="container-fluid">
        <ul class="info-menu-nav">
          <li>
            <span class="tt-1"> Số điện thoại <br /> </span>
            <span class="tt-2">{{ customerInfo.phone_number }}</span>
          </li>
        </ul>
        <ul class="info-menu-nav mt-1">
          <li>
            <span class="badge badge-success-custom"
              ><img
                :src="`${baseUrl}/1111111111111111111/images/check-green.svg`"
                alt=""
              />
              Đã xác thực</span
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="separate-line"></div>
    <section class="section py-25">
      <div class="container-fluid">
        <div
          class="
            heading
            d-flex
            justify-content-between
            align-items-center
            mb-20
          "
        >
          <h2 class="heading__title fz-14">THÔNG TIN</h2>
          <button type="button" class="btn edit-btn" @click="openUpdateDialog">
            <img
              :src="`${baseUrl}/1111111111111111111/images/edit-37.svg`"
              alt=""
            />
            Cập nhật
          </button>
        </div>
        <ul class="info-menu-nav">
          <li>
            <span class="tt-1">Họ và tên</span>
            <span class="tt-2">{{ customerInfo.full_name }}</span>
          </li>
          <li>
            <span class="tt-1">Email</span>
            <span class="tt-2">{{ customerInfo.email }}</span>
          </li>
          <li>
            <span class="tt-1">Sinh nhật</span>
            <span class="tt-2">{{
              !customerInfo.date_of_birth
                ? ""
                : date(customerInfo.date_of_birth, "dd/MM/yyyy")
            }}</span>
          </li>
          <li>
            <span class="tt-1">Giới tính</span>
            <span class="tt-2">{{
              customerInfo.gender === 0 ? "Nam" : "Nữ"
            }}</span>
          </li>
        </ul>
      </div>
    </section>
    <div class="separate-line"></div>
    <section class="section py-4">
      <div class="container-fluid">
        <div class="heading mb-3">
          <h2 class="heading__title">Kết nối</h2>
        </div>
        <div class="social-btn-wrap">
          <a href="#" class="social-btn">
            <img
              :src="`${baseUrl}/1111111111111111111/images/social-google.svg`"
              alt=""
              class="social-btn__icon"
            />
            <span class="social-btn__title">Facebook</span>
            <span class="social-btn__sub"
              >Kết nối <i class="fas fa-chevron-right"></i
            ></span>
          </a>
          <a href="#" class="social-btn">
            <img
              :src="`${baseUrl}/1111111111111111111/images/social-facebook.svg`"
              alt=""
              class="social-btn__icon"
            />
            <span class="social-btn__title">Google</span>
            <span class="social-btn__sub"
              >Kết nối <i class="fas fa-chevron-right"></i
            ></span>
          </a>
        </div>
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

  <!-- UPDATE INFO MODAL -->
  <div
    class="modal fade modal-bottom modal-bottom--fit login-modal"
    id="updateInfoModal"
    tabindex="-1"
    aria-labelledby="updateInfoModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <form action="" id="updateInfoForm" novalidate>
        <div class="modal-content">
          <div class="modal-header">
            <p class="modal-title">CẬP NHẬT THÔNG TIN</p>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body pt-30 pb-3">
            <div class="row row-cols-1 g-3">
              <div class="col">
                <label class="form-label mb-0">Họ và tên</label>
                <input
                  type="text"
                  class="form-control form-control--underline"
                  v-model="updateInfo.full_name"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="col">
                <label class="form-label">Giới tính</label>
                <select
                  name="gioi-tinh"
                  class="form-select form-select--bg-white fw-semi ps-12"
                  v-model="updateInfo.gender"
                >
                  <option value="0">Nam</option>
                  <option value="1">Nữ</option>
                </select>
                <div class="invalid-feedback"></div>
              </div>
              <div class="col">
                <label class="form-label mb-0">Email</label>
                <input
                  type="email"
                  class="form-control form-control--underline"
                  v-model="updateInfo.email"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="col">
                <label class="form-label mb-0">Sinh nhật</label>
                <input
                  type="date"
                  class="form-control form-control--underline"
                  v-model="updateInfo.date_of_birth"
                />
                <div class="invalid-feedback"></div>
              </div>
            </div>
          </div>
          <div class="modal-footer after-0">
            <button
              class="btn btn-primary"
              :disabled="isDisable"
              @click.prevent="updateCustomer"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
