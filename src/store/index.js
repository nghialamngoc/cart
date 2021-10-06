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
    customerAddressList: [],
    customerShippingAddress: {},
    billingAddress: {},
    guestShippingInfo: {},
    shippingStandard: {},
    shippingType: 0,
    quickShippingList: [],
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
    productWishedList: [],
    bankList: [],
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
  ahamove: {},
  grap: {},
});

export default store;
