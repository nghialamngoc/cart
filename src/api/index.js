import { baseUrl } from "../constant";
import axios from "../service/axios";

export const getCartInfo = async () => {
  try {
    const { data } = await axios.post(`${baseUrl}/cart/api/v1/info`);

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getBoxList = async () => {
  try {
    const { data } = await axios.post(`${baseUrl}/product/api/v1/pack/list`);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getVoucherList = async () => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/voucher/api/v1/voucher_for_cart`
    );
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getGiftList = async (totalPrice) => {
  try {
    const { data } = await axios.post(`${baseUrl}/product/api/v1/gift/list`, {
      total_price: totalPrice,
    });
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getCollection = async () => {
  try {
    const { data } = await axios.post(`${baseUrl}/cart/api/v1/collection`);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getFreeshipCondition = async () => {
  try {
    const { data } = await axios.post(`${baseUrl}/shipping/api/v1/free`);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const addProductToCart = async (payload) => {
  try {
    await axios.post(`${baseUrl}/cart/api/v1/add`, payload);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const replaceProductInCart = async (payload) => {
  try {
    await axios.post(`${baseUrl}/cart/api/v1/replace`, payload);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const addVoucher = async (voucher_id) => {
  try {
    await axios.post(`${baseUrl}/cart/api/v1/add_voucher`, {
      voucher_id,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const addVoucherCode = async (voucher_code) => {
  try {
    await axios.post(`${baseUrl}/cart/api/v1/add_voucher_code`, {
      voucher_code,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getProductDetail = async (id) => {
  try {
    const { data } = await axios.post(`${baseUrl}/product/api/v1/cart/detail`, {
      id,
    });

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getCustomerAddress = async () => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/customer/api/v1/address/list`
    );

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateCartShippingAddress = async (payload) => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/cart/api/v1/update_address`,
      payload
    );

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getShippingStandard = async (payload) => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/shipping/api/v1/shipping_standard`,
      payload
    );

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const addOrder = async (payload) => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/cart/api/v1/order_add`,
      payload
    );

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const addOrderExperience = async (payload) => {
  try {
    await axios.post(
      `${baseUrl}/cart/api/v1/order_experience_add`,
      payload
    );
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getPaymentMethodList = async (id) => {
  try {
    const { data } = await axios.post(`${baseUrl}/cart/api/v1/payment_methods`, {
      id,
    });

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};
