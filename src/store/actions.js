import {
  addProductToCart,
  addVoucher,
  addVoucherCode,
  getBoxList,
  getCartInfo,
  getCollection,
  getCustomerAddress,
  getFreeshipCondition,
  getGiftList,
  getShippingStandard,
  getVoucherList,
  replaceProductInCart,
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

  async getCart({ commit, dispatch }) {
    try {
      commit("setLoading", true);
      const data = await getCartInfo();
      commit("setCart", data);

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
      commit("setCollection", data);
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

  setDefaultShippingAddress({ commit, state }) {
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
    } = state.cart;

    if (
      phone != "" &&
      fullname != "" &&
      address != "" &&
      province_id != "" &&
      district_id != "" &&
      commune_id != ""
    ) {
      commit("setShippingAddress", {
        name: fullname,
        phone_number: phone,
        address: address,
        province_id: province_id,
        province_name: province_name,
        district_id: district_id,
        district_name: district_name,
        commune_id: commune_id,
        commune_name: commune_name,
      });
    }
  },

  async getBillingAddress({ commit, getters }, payload) {
    try {
      commit("setLoading", true);
      const data = await getCustomerAddress(payload);

      if (Array.isArray(data) && data.length > 0) {
        const defaultAddress =
          data.find((x) => x.is_default === true) || data[0];

        const address = {
          name: defaultAddress.name,
          phone_number: defaultAddress.phone_number,
          address: defaultAddress.address,
          province_id: defaultAddress.province_id,
          province_name: defaultAddress.province_name,
          district_id: defaultAddress.district_id,
          district_name: defaultAddress.district_name,
          commune_id: defaultAddress.commune_id,
          commune_name: defaultAddress.commune_name,
          address_id: defaultAddress.address_id,
          customer_id: defaultAddress.customer_id,
        };

        commit("setBillingAddress", address);

        if (!getters.isValidShippingAddress) {
          commit("setShippingAddress", address);
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
        province_id: state.shippingAddress.province_id
          ? state.shippingAddress.province_id.toString()
          : "0",
      });

      if (Array.isArray(data) && data.length > 0) {
        commit("setShippingStandard", data[0]);
        commit("setShippingType", 1);
      } else {
        commit("setShippingStandard", 2);
        commit("setShippingType", {});
      }
    } catch (err) {
      console.log(err);
    } finally {
      commit("setLoading", false);
    }
  },
};