import { baseUrl } from "../constant";
import {
  mappingDeliveryType,
  mappingPaymentMethod,
  mappingStatus,
} from "../helper/mapping";
import axios from "../service/axios";

export const getCustomerInfo = async() => {
  try {
    return {
      image: "",
      fullname: "Nguyễn Văn Nam",
      phone: "+84 918 556 116",
      range: "Silver rank"
    }
  } catch(err) {
    Promise.reject(err)
  }
}

export const getNewOrder = async () => {
  try {
    return [
      {
        order_id: 84167655,
        status: mappingStatus(1),
        payed: false,
        total_price: 800000,
        create_at: "22/10/2021",
        isViewDetail: false,
        isViewAllProduct: false,
        shipping_address:
          "Số 9 đường số 12, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh",
        shipping_phone: "0357 787 43",
        shipping_name: "Nguyễn Văn Nam 1",
        delivery_type: mappingDeliveryType(2),
        payment_method: mappingPaymentMethod(1),
        shipping_price: 30000,
        order_source: 1,
        detail: [
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 3,
            price: 400000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
        ],
        order_extend: [
          {
            note: "Đơn hàng đã xác nhận",
            update_at: "2021-08-15 10:50:13",
          },
          {
            note: "Lấy hàng thành công",
            update_at: "2021-08-16 10:50:13",
          },
          {
            note: "Đơn hàng đến kho HN SOC",
            update_at: "2021-08-17 10:50:13",
          },
        ].sort((a, b) => {
          return new Date(b.update_at) - new Date(a.update_at);
        }),
      },
      {
        order_id: 84167655,
        status: mappingStatus(1),
        payed: false,
        total_price: 800000,
        create_at: "22/10/2021",
        isViewDetail: false,
        isViewAllProduct: false,
        shipping_address:
          "Số 9 đường số 12, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh",
        shipping_phone: "0357 787 43",
        shipping_name: "Nguyễn Văn Nam",
        delivery_type: mappingDeliveryType(3),
        payment_method: mappingPaymentMethod(2),
        shipping_price: 30000,
        order_source: 2,
        detail: [
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 3,
            price: 400000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
        ],
      },
      {
        order_id: 84167655,
        status: mappingStatus(1),
        payed: false,
        total_price: 800000,
        create_at: "22/10/2021",
        isViewDetail: false,
        isViewAllProduct: false,
        shipping_address:
          "Số 9 đường số 12, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh",
        shipping_phone: "0357 787 43",
        shipping_name: "Nguyễn Văn Nam",
        delivery_type: mappingDeliveryType(1),
        payment_method: mappingPaymentMethod(1),
        shipping_price: 30000,
        order_source: 3,
        detail: [
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 3,
            price: 400000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
        ],
      },
      {
        order_id: 84167655,
        status: mappingStatus(1),
        payed: false,
        total_price: 800000,
        create_at: "22/10/2021",
        isViewDetail: false,
        isViewAllProduct: false,
        shipping_address:
          "Số 9 đường số 12, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh",
        shipping_phone: "0357 787 43",
        shipping_name: "Nguyễn Văn Nam",
        delivery_type: mappingDeliveryType(1),
        payment_method: mappingPaymentMethod(3),
        shipping_price: 30000,
        order_source: 4,
        detail: [
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 3,
            price: 400000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
        ],
      },
    ];
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getDeliveredOrder = async () => {
  try {
    return [
      {
        order_id: 84167655,
        status: mappingStatus(1),
        payed: false,
        total_price: 800000,
        create_at: "22/10/2021",
        update_at: "22/10/2021",
        isViewDetail: false,
        isViewAllProduct: false,
        shipping_address:
          "Số 9 đường số 12, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh",
        shipping_phone: "0357 787 43",
        shipping_name: "Nguyễn Văn Nam 1",
        delivery_type: mappingDeliveryType(2),
        payment_method: mappingPaymentMethod(1),
        shipping_price: 30000,
        order_source: 1,
        detail: [
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 3,
            price: 400000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
        ],
        order_extend: [
          {
            note: "Đơn hàng đã xác nhận",
            update_at: "2021-08-15 10:50:13",
          },
          {
            note: "Lấy hàng thành công",
            update_at: "2021-08-16 10:50:13",
          },
          {
            note: "Đơn hàng đến kho HN SOC",
            update_at: "2021-08-17 10:50:13",
          },
        ].sort((a, b) => {
          return new Date(b.update_at) - new Date(a.update_at);
        }),
      },
    ];
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getCancelOrder = async () => {
  try {
    return [
      {
        order_id: 84167655,
        status: mappingStatus(1),
        payed: false,
        total_price: 800000,
        create_at: "22/10/2021",
        update_at: "22/10/2021",
        isViewDetail: false,
        isViewAllProduct: false,
        shipping_address:
          "Số 9 đường số 12, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh",
        shipping_phone: "0357 787 43",
        shipping_name: "Nguyễn Văn Nam 1",
        delivery_type: mappingDeliveryType(2),
        payment_method: mappingPaymentMethod(1),
        shipping_price: 30000,
        order_source: 1,
        detail: [
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 3,
            price: 400000,
            type: 1,
            image: "",
          },
          {
            name: "Monogram Print Cotton Piqué Oversized Polo Shirt",
            quantity: 2,
            price: 500000,
            type: 1,
            image: "",
          },
        ],
        order_extend: [
          {
            note: "Đơn hàng đã xác nhận",
            update_at: "2021-08-15 10:50:13",
          },
          {
            note: "Lấy hàng thành công",
            update_at: "2021-08-16 10:50:13",
          },
          {
            note: "Đơn hàng đến kho HN SOC",
            update_at: "2021-08-17 10:50:13",
          },
        ].sort((a, b) => {
          return new Date(b.update_at) - new Date(a.update_at);
        }),
      },
    ];
  } catch (err) {
    return Promise.reject(err);
  }
};
