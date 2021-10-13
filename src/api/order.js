import { baseUrl } from "../constant";
import axios from "../service/axios";

export const getOrderInfo = async (payload) => {
  try {
    const { data } = await axios.post(`${baseUrl}/orders/api/v1/order_website`, payload);

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getSizeDetail = async (payload) => {
  try {
    const { data } = await axios.post(`${baseUrl}/size/api/v1/detail-size`);

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};