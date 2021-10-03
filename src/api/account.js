import { baseUrl } from "../constant";
import {
  mappingDeliveryType,
  mappingPaymentMethod,
  mappingStatus,
} from "../helper/mapping";
import axios from "../service/axios";

export const logOut = async () => {
  try {
    await axios.post(`${baseUrl}/customer/api/v1/logout`);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getCustomerInfo = async () => {
  try {
    const { data } = await axios.post(`${baseUrl}/customer/api/v1/profile`);

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const orderCancel = async (payload) => {
  try {
    await axios.post(`${baseUrl}/orders/api/v1/order_cancel`, {
      ...payload,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getOrderDetail = async (id) => {
  try {
    const { data } = await axios.post(`${baseUrl}/orders/api/v1/order_detail`, {
      order_id: id,
    });

    if (data.order_id != 0) {
      const box = data.detail.find((x) => x.type === 3);
      return {
        order_id: data.order_id,
        statusText: mappingStatus(data.status),
        status: data.status,
        payed: false,
        total_price: data.total_price,
        create_at: data.create_at,
        isViewDetail: false,
        isViewAllProduct: false,
        shipping_address: data.shipping_address,
        shipping_phone: data.shipping_phone_number,
        shipping_name: data.shipping_full_name,
        delivery_type: mappingDeliveryType(data.delivery_type),
        payment_method: mappingPaymentMethod(data.payment_method_type),
        shipping_price: data.shipping_fee,
        discount: data.discount,
        order_source: 1,
        detail: data.detail.map((x) => {
          return {
            name: x.name,
            quantity: x.quantity,
            price: x.discount || x.retail_price,
            type: x.type,
            image: x.image,
            color: x.color,
            size: x.size,
          };
        }),
        box,
        order_extend: data.order_extend || [],
      };
    }

    return {};
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateCustomerInfo = async (payload) => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/customer/api/v1/profile/update`,
      payload
    );

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getNewOrderWebsite = async () => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/orders/api/v1/new_order_list`
    );

    if (Array.isArray(data) && data.length > 0) {
      return data.map((x) => {
        const box = x.detail.find((x) => x.type === 3);
        return {
          order_id: x.order_id,
          statusText: mappingStatus(x.status),
          status: x.status,
          payed: false,
          total_price: x.total_price,
          create_at: x.create_at,
          isViewDetail: false,
          isViewAllProduct: false,
          shipping_address: x.shipping_address,
          shipping_phone: x.shipping_phone_number,
          shipping_name: x.shipping_full_name,
          delivery_type: mappingDeliveryType(x.delivery_type),
          payment_method: mappingPaymentMethod(x.payment_method_type),
          shipping_price: x.shipping_fee,
          discount: x.discount,
          order_source: 1,
          detail: x.detail.map((x) => {
            return {
              name: x.name,
              quantity: x.quantity,
              price: x.discount || x.retail_price,
              type: x.type,
              image: x.image,
              color: x.color,
              size: x.size,
            };
          }),
          box,
          order_extend: x.order_extend || [],
        };
      });
    }

    return [];
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getDeliveredOrder = async () => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/orders/api/v1/delivered_order_list`
    );

    if (Array.isArray(data) && data.length > 0) {
      return data.map((x) => {
        return {
          order_id: x.order_id,
          statusText: mappingStatus(x.status),
          status: x.status,
          payed: false,
          total_price: x.total_price,
          create_at: x.create_at,
          isViewDetail: false,
          isViewAllProduct: false,
          shipping_address: x.shipping_address,
          shipping_phone: x.shipping_phone_number,
          shipping_name: x.shipping_full_name,
          delivery_type: mappingDeliveryType(x.delivery_type),
          payment_method: mappingPaymentMethod(x.payment_method_type),
          shipping_price: x.shipping_fee,
          discount: x.discount,
          order_source: 1,
          detail: x.detail.map((x) => {
            return {
              name: x.name,
              quantity: x.quantity,
              price: x.discount || x.retail_price,
              type: x.type,
              image: x.image,
            };
          }),
          order_extend: x.order_extend || [],
        };
      });
    }

    return [];
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getCancelOrder = async () => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/orders/api/v1/canceled_order_list`
    );

    if (Array.isArray(data) && data.length > 0) {
      return data.map((x) => {
        return {
          order_id: x.order_id,
          statusText: mappingStatus(x.status),
          status: x.status,
          payed: false,
          total_price: x.total_price,
          create_at: x.create_at,
          isViewDetail: false,
          isViewAllProduct: false,
          shipping_address: x.shipping_address,
          shipping_phone: x.shipping_phone_number,
          shipping_name: x.shipping_full_name,
          delivery_type: mappingDeliveryType(x.delivery_type),
          payment_method: mappingPaymentMethod(x.payment_method_type),
          shipping_price: x.shipping_fee,
          discount: x.discount,
          order_source: 1,
          detail: x.detail.map((x) => {
            return {
              name: x.name,
              quantity: x.quantity,
              price: x.discount || x.retail_price,
              type: x.type,
              image: x.image,
            };
          }),
          order_extend: x.order_extend || [],
        };
      });
    }

    return [];
  } catch (err) {
    return Promise.reject(err);
  }
};

export const uploadImage = async (file) => {
  try {
    var formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post(
      `${baseUrl}/image/api/v1/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data && data[0]) {
      await axios.post(`${baseUrl}/customer/api/v1/upload_image`, {
        photo_url: data[0],
      });
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const addCustomerAddress = async (payload) => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/customer/api/v1/address/add`,
      payload
    );
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateCustomerAddress = async (payload) => {
  try {
    await axios.post(`${baseUrl}/customer/api/v1/address/update`, payload);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteCustomerAddress = async (payload) => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/customer/api/v1/address/delete`,
      payload
    );

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};
