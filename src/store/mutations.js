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
    console.log(data);
    state.paymentMethods = data;
  },
};
