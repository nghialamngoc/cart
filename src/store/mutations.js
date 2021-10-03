export default {
  setCart(state, data) {
    state.cart = data;
  },

  setLoading(state, data) {
    state.loading = data;
  },

  setBoxList(state, data) {
    state.boxList = data;
  },

  setError(state, data) {
    state.isError = data;
  },

  setVoucherList(state, data) {
    state.voucherList = data;
  },

  setGiftList(state, data) {
    state.giftList = data;
  },

  setCollection(state, data) {
    state.collection = data;
  },

  setFreeShipCondition(state, data) {
    state.freeShipCondition = data;
  },

  setStep(state, data) {
    state.step = data;
  },

  setShippingPrice(state, data) {
    state.shippingPrice = data;
  },

  setError(state, message = "") {
    if (message) {
      state.error = true;
    } else {
      state.error = false;
    }
    state.errorMessage = message;
  },

  setBillingAddress(state, data) {
    state.billingAddress = data;
  },

  setShippingAddress(state, data) {
    state.shippingAddress = data;
  },

  setShippingStandard(state, data) {
    state.shippingStandard = data;
  },

  setShippingType(state, data) {
    state.shippingType = data;
  },

  setQuickShippingType(state, data) {
    state.quickShippingType = data;
  },

  setPaymentMethod(state, data) {
    state.paymentMethod = data;
  },

  setNote(state, data) {
    state.note = data;
  },

  setOrderId(state, data) {
    state.orderId = data;
  },

  setOrderExperience(state, data) {
    state.orderExperience = data;
  },

  setCartChange(state, data) {
    state.cartChange = data;
  },

  setEdit(state, data) {
    state.isEdit = data;
  },

  setBankCode(state, data) {
    state.bankCode = data;
  },

  setPaymentMethods(state, data) {
    state.paymentMethods = data;
  },

  setAhamove(state, data) {
    state.ahamove = data;
  },

  setCustomerAddressList(state, data) {
    state.customerAddressList = data;
  },

  setCustomerShippingAddress(state, data) {
    state.customerShippingAddress = data;
  },

  setCustomerShippingAddressById(state, addressId) {
    const address = state.customerAddressList.find(
      (x) => x.address_id === addressId
    );

    if (address) {
      state.customerShippingAddress = {
        name: address.name,
        phone_number: address.phone_number,
        address: address.address,
        province_id: address.province_id,
        province_name: address.province_name,
        district_id: address.district_id,
        district_name: address.district_name,
        commune_id: address.commune_id,
        commune_name: address.commune_name,
        address_id: address.address_id,
        customer_id: address.customer_id,
        is_default: address.is_default,
      };
    }
  },
};
