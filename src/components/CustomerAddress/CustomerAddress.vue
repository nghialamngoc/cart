<script>
import { computed, defineComponent, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { updateCustomerAddress } from "../../api/account";

// Constant
import { baseUrl } from "../../constant";
import { openModal } from "../../helper/modal";

// Components
import CustomerEditAddress from "./CustomerEditAddresss.vue";

export default defineComponent({
  components: {
    CustomerEditAddress,
  },
  setup(props) {
    // store
    const store = useStore();

    // state
    const customerAddressList = computed(() => store.state.customerAddressList);
    const customerShippingAddress = computed(
      () => store.state.customerShippingAddress
    );
    const editCustomerAddress = ref({});

    const changeShippingAddress = (addressId) => {
      store.commit("setCustomerShippingAddressById", addressId);
    };

    const editShippingAddress = (address) => {
      editCustomerAddress.value = address;
      openModal("addLocationModal");
    };

    const setDefault = async (address) => {
      try {
        store.dispatch("setLoading", true);
        await updateCustomerAddress({
          ...address,
          is_default: true,
        });

        await store.dispatch("getCustomerAddressList");
        await store.commit(
          "setCustomerShippingAddressById",
          address.address_id
        );
      } catch (err) {
        store.dispatch("setError", "Có lỗi xảy ra vui lòng thử lại!");
      } finally {
        store.dispatch("setLoading", false);
      }
    };

    const addCustomer = () => {
      editCustomerAddress.value = {}
      openModal("addLocationModal");
    }

    return {
      baseUrl,
      editCustomerAddress,
      customerAddressList,
      customerShippingAddress,
      setDefault,
      addCustomer,
      editShippingAddress,
      changeShippingAddress,
    };
  },
});
</script>

<template>
  <!--LOCATION MODAL-->
  <div
    class="modal fade modal-bottom location-modal"
    id="locationModal"
    tabindex="-1"
    aria-labelledby="locationModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
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
          <div class="box-picker-wrap">
            <label
              class="box-picker box-picker--location"
              v-for="(address, index) in customerAddressList"
              :key="index"
              @click.stop="() => changeShippingAddress(address.address_id)"
            >
              <div
                :class="`box-picker__checkmark ${
                  customerShippingAddress.address_id === address.address_id
                    ? 'address_selected'
                    : ''
                }`"
              >
                <div class="row gx-2 align-items-center title">
                  <div class="col-9">
                    <p class="box-picker__checkmark__title">
                      {{ address.name }} | {{ address.phone_number }}
                    </p>
                  </div>
                  <div class="col-3 text-end">
                    <div
                      type="button"
                      class="btn box-picker__checkmark__edit"
                      @click.stop="() => editShippingAddress(address)"
                    >
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/pen-white.svg`"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div class="box-picker__checkmark__desc">
                  {{ address.address }}
                </div>
                <span
                  class="badge badge-blue-custom box-picker__checkmark__default"
                  v-if="address.is_default"
                  >Mặc định</span
                >
                <label
                  class="custom-checkbox box-picker__checkmark__set-default"
                >
                  <span
                    class="checkmark-btn customer_default"
                    v-if="address.is_default"
                    >Mặc định</span
                  >
                  <span
                    class="checkmark-btn"
                    v-else
                    @click.stop="() => setDefault(address)"
                  >
                    Đặt làm mặc định
                  </span>
                </label>
              </div>
            </label>
          </div>
          <button class="btn add-more-btn mt-12" @click="addCustomer">
            <img
              :src="`${baseUrl}/1111111111111111111/images/plus-37.svg`"
              alt=""
            />
            Thêm địa chỉ
          </button>
        </div>
      </div>
    </div>
  </div>

  <CustomerEditAddress :data="editCustomerAddress"></CustomerEditAddress>
</template>
