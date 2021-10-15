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
        const check = state.giftList.find(x => x.gift_id === gift.gift_id)
        if (check) {
          return {
            ...check,
            ...gift,
          }
        }
        
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
      return [state.voucherList[0]];
    }

    return [];
  },

  totalPrice(state) {
    if (!state.cart.cart_id) {
      return 0;
    }

    return state.cart.total_price;
  },

  subPrice(state, getters) {
    if (!state.cart.cart_id) {
      return 0;
    }

    let result = state.cart.total_price;

    return result + getters.shippingPrice - state.cart.discount;
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

    const voucherFreeShip = state.voucherList.find((x) => x.type === 1);

    if (voucherFreeShip) {
      return voucherFreeShip.voucher_id === state.cart.discount_code;
    }

    return false;
  },

  isValidShippingAddress(state) {
    if (
      !state.guestShippingInfo.name ||
      !state.guestShippingInfo.address ||
      !state.guestShippingInfo.phone_number ||
      !state.guestShippingInfo.province_id ||
      !state.guestShippingInfo.district_id ||
      !state.guestShippingInfo.commune_id
    ) {
      return false;
    }

    return true;
  },

  isValidCustomerShippingAddress(state) {
    if (
      !state.customerShippingAddress.name ||
      !state.customerShippingAddress.address ||
      !state.customerShippingAddress.phone_number ||
      !state.customerShippingAddress.province_id ||
      !state.customerShippingAddress.district_id ||
      !state.customerShippingAddress.commune_id
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

  shippingAddressIsHCM(state, getters) {
    if (!getters.isValidCustomerShippingAddress && !getters.isValidShippingAddress) {
      return false;
    }

    return (
      state.customerShippingAddress.province_id === 1 ||
      state.guestShippingInfo.province_id === 1
    );
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

  paymentMethodType(state) {
    if (state.paymentMethod && state.paymentMethods) {
      const method = state.paymentMethods.find(
        (x) => x.payment_id === state.paymentMethod
      );
      if (method) {
        return method.type;
      }
    }

    return 0;
  },

  paymentInfo(state) {
    if (state.paymentMethod && state.paymentMethods) {
      const method = state.paymentMethods.find(
        (x) => x.payment_id === state.paymentMethod
      );
      if (method) {
        return `${method.name.trim()} - ${method.instruction.trim()}`;
      }
    }

    return "";
  },

  shippingPrice(state, getters) {
    let result = 0;
    if (state.shippingType == 1) {
      result = getters.isFreeShip ? 0 : state.shippingStandard.shipping_price;
    }

    if (state.shippingType == 2) {
      const selected = state.quickShippingList.find(
        (x) => x.carrier_id === state.quickShippingType
      );

      if (selected) {
        result = selected.total_price;
      }
    }

    return result;
  },

  customerId(state) {
    if (
      !state.cart.customer_id ||
      state.cart.customer_id === "0" ||
      state.cart.customer_id === ""
    ) {
      return "";
    }

    return state.cart.customer_id;
  },

  discountCodeDisplay(state) {
    if (state.cart.discount_code) {
      const voucher =  state.voucherList.find(x => x.voucher_id === state.cart.discount_code)

      if (voucher) {
        return voucher.code
      }
    }

    return ""
  },

  paymentSelected(state) {
    if (!Array.isArray(state.paymentMethods)) {
      return {}
    }

    const result = state.paymentMethods.find(
      (x) => x.payment_id === state.paymentMethod
    );

    if (result) {
      return result;
    }

    return {};
  },

  totalType1Price(state) {
    if (!Array.isArray(state.cart.detail)) {
      return 0
    }
  
    return state.cart.detail.reduce((previous, current) => {
      if (current.type === 2 || current.type === 3) {
        return previous
      }

      if (current.flash_sale != -1) {
        return previous = previous + (current.flash_sale * current.quantity)
      }

      if (current.price_sale >= 0) {
        return previous = previous + (current.price_sale * current.quantity)
      }

      return previous = previous + (current.price_retail * current.quantity)
    }, 0)
  }
};
