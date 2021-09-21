export default {
  productList(state) {
    if (state.cart.detail) {
      return state.cart.detail.filter((x) => x.type === 1);
    }

    return [];
  },

  boxSelected(state) {
    if (state.cart.detail) {
      const box = state.cart.detail.find((x) => x.type === 3);
      if (box) {
        return box.product_id;
      }

      return "";
    }

    return "";
  },

  giftSelected(state) {
    if (state.cart.detail) {
      const gift = state.cart.detail.find((x) => x.type === 2);
      if (gift) {
        return gift;
      }

      return {};
    }

    return {};
  },

  voucherNormal(state) {
    return state.voucherList.length
      ? state.voucherList.filter((x) => x.level === 1)
      : [];
  },

  voucherHotList(state) {
    return state.voucherList.length
      ? state.voucherList.filter((x) => x.level === 2)
      : [];
  },

  vouchersSpecialList(state) {
    return state.voucherList.length
      ? state.voucherList.filter((x) => x.level === 3)
      : [];
  },

  validVoucherList(state) {
    if (state.voucherList.length > 0) {
      return [state.voucherList[0]]
    }

    return [];
  },

  totalPrice(state) {
    if (!state.cart.cart_id) {
      return 0;
    }

    return state.cart.total_price;
  },

  subPrice(state) {
    if (!state.cart.cart_id) {
      return 0;
    }

    let result = state.cart.total_price;

    return result + state.shippingPrice - state.cart.discount;
  },

  discount(state) {
    if (!state.cart.cart_id) {
      return 0;
    }

    return state.cart.discount;
  },

  isFreeShip(state) {
    if (!state.cart.cart_id || state.voucherList.length <= 0) {
      return false;
    }

    const voucherFreeShip = state.voucherList.value.find((x) => x.type === 1);

    if (voucherFreeShip) {
      return (
        voucherFreeShip.voucher_id === cart.value.discount_code
      );
    }

    return false;
  },

  isValidShippingAddress(state) {
    if (
      !state.shippingAddress.name ||
      !state.shippingAddress.address ||
      !state.shippingAddress.phone_number ||
      !state.shippingAddress.province_id ||
      !state.shippingAddress.district_id ||
      !state.shippingAddress.commune_id
    ) {
      return false;
    }

    return true;
  },

  isValidBillingAddress(state) {
    if (
      !state.billingAddress.name ||
      !state.billingAddress.address ||
      !state.billingAddress.phone_number ||
      !state.billingAddress.province_id ||
      !state.billingAddress.district_id ||
      !state.billingAddress.commune_id
    ) {
      return false;
    }

    return true;
  },

  isFreeShip(state) {
    const voucherFreeShip = state.voucherList.find((x) => x.type === 0);

    if (voucherFreeShip) {
      return (
        voucherFreeShip.voucher_id === state.cart.discount_code &&
        voucherFreeShip.discount === 0
      );
    }

    return false;
  },

  boxName(state) {
    if (!state.cart || !state.cart.detail) {
      return "";
    }

    const box = state.cart.detail.find((x) => x.type === 3);
    if (box) {
      return box.title;
    }

    return "";
  },
};
