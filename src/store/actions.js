import {
  addProductToCart,
  addVoucher,
  addVoucherCode,
  getAhamoShippingFee,
  getBoxList,
  getCartInfo,
  getCollection,
  getCustomerAddress,
  getFreeshipCondition,
  getGiftList,
  getProductWishedList,
  getQuickShippingList,
  getShippingStandard,
  getVoucherList,
  replaceProductInCart,
  setProductWished,
} from "../api";
import { resolveErrorMessage } from "../helper/resolveErrorMessage";

export default {
  async init({ commit, dispatch }) {
    try {
      commit("setLoading", true);
      const data = await getCartInfo();
      commit("setCart", data);

      // get box list
      dispatch("getBoxList");

      // get voucher list
      dispatch("getVoucherList");

      // get gift list
      dispatch("getGiftList");

      // get collection list
      dispatch("getCollection");

      // get collection list
      dispatch("getFreeshipCondition");
    } catch (err) {
      commit("setError", true);
    } finally {
      commit("setLoading", false);
    }
  },

  async getCartInfo({ commit }) {
    try {
      commit("setLoading", true);
      const data = await getCartInfo();
      commit("setCart", data);
    } catch (err) {
      commit("setError", true);
    } finally {
      commit("setLoading", false);
    }
  },

  async getCart({ commit, dispatch }) {
    try {
      commit("setLoading", true);
      const data = await getCartInfo();
      commit("setCart", data);

      if (data.total_price === 0) {
        commit("setStep", 1);
      }

      // get gift list
      await dispatch("getGiftList");
    } catch (err) {
      commit("setError", true);
    } finally {
      commit("setLoading", false);
    }
  },

  async getBoxList({ commit }) {
    try {
      commit("setLoading", true);
      const data = await getBoxList();
      commit("setBoxList", data);
    } catch (err) {
      console.log(err);
    } finally {
      commit("setLoading", false);
    }
  },

  async getVoucherList({ commit }) {
    try {
      commit("setLoading", true);
      const data = await getVoucherList();
      commit("setVoucherList", data);
    } catch (err) {
      console.log(err);
    } finally {
      commit("setLoading", false);
    }
  },

  async getGiftList({ commit, state }) {
    try {
      const totalPrice = state.cart.total_price;
      commit("setLoading", true);
      const data = await getGiftList(totalPrice);
      commit("setGiftList", data);
    } catch (err) {
      console.log(err);
    } finally {
      commit("setLoading", false);
    }
  },

  async getCollection({ commit }) {
    try {
      commit("setLoading", true);
      const data = await getCollection();
      const result = [];
      if (data && Object.keys(data).length > 0) {
        Object.keys(data).forEach((x) => {
          result.push({
            ...data[x],
            product_id: x,
          });
        });
      }
      commit("setCollection", result);
    } catch (err) {
      console.log(err);
    } finally {
      commit("setLoading", false);
    }
  },

  async getFreeshipCondition({ commit }) {
    try {
      commit("setLoading", true);
      const data = await getFreeshipCondition();
      commit("setFreeShipCondition", data);
    } catch (err) {
      console.log(err);
    } finally {
      commit("setLoading", false);
    }
  },

  setStep({ commit }, data) {
    commit("setStep", data);
    document.getElementById("main").scrollIntoView();
  },

  setError({ commit }, data) {
    commit("setError", data);
  },

  setLoading({ commit }, data) {
    commit("setLoading", data);
  },

  async addProductToCart({ commit, dispatch }, payload) {
    try {
      commit("setLoading", true);
      await addProductToCart(payload);

      // get cart info
      await dispatch("getCart");
    } catch (err) {
      console.log(err);
      commit("setError", resolveErrorMessage(err));
    } finally {
      commit("setLoading", false);
    }
  },

  async replaceProductInCart({ commit, dispatch }, payload) {
    try {
      commit("setLoading", true);
      await replaceProductInCart(payload);

      // get cart info
      await dispatch("getCart");
    } catch (err) {
      console.log(err);
    } finally {
      commit("setLoading", false);
    }
  },

  async addVoucher({ commit, dispatch }, payload) {
    try {
      commit("setLoading", true);
      await addVoucher(payload);

      // get cart info
      await dispatch("getCart");
    } catch (err) {
      commit("setError", resolveErrorMessage(err));
    } finally {
      commit("setLoading", false);
    }
  },

  async addVoucherCode({ commit, dispatch }, payload) {
    try {
      commit("setLoading", true);
      await addVoucherCode(payload);

      // get cart info
      await dispatch("getCart");
    } catch (err) {
      commit("setError", resolveErrorMessage(err));
    } finally {
      commit("setLoading", false);
    }
  },

  setCustomerAddress({ commit }, data) {
    commit("setCustomerAddress", data);
  },

  setGuestShippingInfo({ commit, state }) {
    const {
      fullname,
      phone,
      address,
      province_id,
      district_id,
      commune_id,
      province_name,
      district_name,
      commune_name,
      bill_fullname,
      bill_phone,
      type_send,
    } = state.cart;

    commit("setGuestShippingInfo", {
      fullname,
      phone,
      address,
      province_id,
      province_name,
      district_id,
      district_name,
      commune_id,
      commune_name,
      bill_fullname,
      bill_phone,
      type_send,
    });
  },

  async getCustomerAddressList({ state, commit, getters }, payload) {
    try {
      commit("setLoading", true);
      const data = await getCustomerAddress(payload);

      if (Array.isArray(data) && data.length > 0) {
        commit("setCustomerAddressList", data);

        if (!state.customerShippingAddress.address_id) {
          const defaultAddress =
            data.find((x) => x.is_default === true) || data[0];

          const address = {
            address_id: defaultAddress.address_id,
            name: defaultAddress.name,
            phone_number: defaultAddress.phone_number,
            address: defaultAddress.address,
            province_id: defaultAddress.province_id,
            province_name: defaultAddress.province_name,
            district_id: defaultAddress.district_id,
            district_name: defaultAddress.district_name,
            commune_id: defaultAddress.commune_id,
            commune_name: defaultAddress.commune_name,
            customer_id: defaultAddress.customer_id,
            is_default: defaultAddress.is_default,
          };

          commit("setCustomerShippingAddress", address);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      commit("setLoading", false);
    }
  },

  async getShippingStandard({ commit, state }) {
    try {
      commit("setLoading", true);

      const data = await getShippingStandard({
        total_price: state.cart.total_price,
        total_weight: state.cart.weight,
        province_id: state.guestShippingInfo.province_id
          ? state.guestShippingInfo.province_id.toString()
          : "0",
      });

      if (Array.isArray(data) && data.length > 0) {
        commit("setShippingStandard", data[0]);
        commit("setShippingType", 1);
      } else {
        commit("setShippingStandard", {});
        commit("setShippingType", 0);
      }
    } catch (err) {
      console.log(err);
    } finally {
      commit("setLoading", false);
    }
  },

  async ahamoveShippingFee({ commit, state, getters }) {
    let address = "";
    let province_name = "";
    let district_name = "";
    let commune_name = "";
    if (getters.customerId) {
      address = state.customerShippingAddress.address;
      province_name = state.customerShippingAddress.province_name;
      district_name = state.customerShippingAddress.district_name;
      commune_name = state.customerShippingAddress.commune_name;
    } else {
      address = state.guestShippingInfo.address;
      province_name = state.guestShippingInfo.province_name;
      district_name = state.guestShippingInfo.district_name;
      commune_name = state.guestShippingInfo.commune_name;
    }

    try {
      commit("setLoading", true);
      const { distance, total_price } = await getAhamoShippingFee({
        address: `${address}, ${province_name}, ${district_name}, ${commune_name}`,
        name: state.guestShippingInfo.name,
        remarks: "ahamove",
      });

      const newData = [...state.quickShippingList];
      const ahamove = newData.find((x) => x.carrier_code === "AHAMOVE");

      if (ahamove) {
        if (distance && total_price) {
          ahamove.distance = distance;
          ahamove.total_price = total_price;
        } else {
          ahamove.distance = null;
          ahamove.total_price = null;
        }

        commit("setQuickShippingList", newData);
      }
    } catch (err) {
      console.log(err);
      const newData = [...state.quickShippingList];
      const ahamove = newData.find((x) => x.carrier_code === "AHAMOVE");
      if (ahamove) {
        ahamove.distance = null;
        ahamove.total_price = null;
      }
      commit("setQuickShippingList", newData);
    } finally {
      commit("setLoading", false);
    }
  },

  async getQuickShippingList({ commit }) {
    try {
      commit("setLoading", true);
      const data = await getQuickShippingList();
      commit("setQuickShippingList", data);
    } catch (err) {
      console.log(err);
    } finally {
      commit("setLoading", false);
    }
  },

  async getProductWishedList({ commit }) {
    try {
      const data = await getProductWishedList();

      if (Array.isArray(data) && data.length > 0) {
        commit("setProdutWishedList", data);
      } else {
        commit("setProdutWishedList", []);
      }
    } catch (err) {
    } finally {
    }
  },

  async productWishedClick({ commit, dispatch }, payload) {
    try {
      commit("setLoading", true);
      await setProductWished(payload);

      // get box list
      dispatch("getProductWishedList");
    } catch (err) {
      console.log(err);
    } finally {
      commit("setLoading", false);
    }
  },
};
