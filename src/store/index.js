import { createStore } from "vuex";
import { baseUrl } from "../constant";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const store = createStore({
  state: {
    baseUrl: baseUrl,
    loading: false,
    error: false,
    errorMessage: "",
    step: 1,
    cart: {},
    boxList: [],
    voucherList: [],
    giftList: [],
    collection: {},
    freeShipCondition: {},
    billingAddress: {},
    shippingAddress: {},
    shippingStandard: {},
    shippingType: 0,
    quickShippingType: 0,
    paymentMethod: 1,
    note: "",
    orderId: "",
    orderExperience: {
      rate: "",
      note: "",
    },
    cartChange: false,
    isEdit: false,
    bankCode: "VIETCOMBANK",
    paymentMethods: [],
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
  ahamove: {},
  grap: {},
});

export default store;
