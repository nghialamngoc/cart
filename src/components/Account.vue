<script>
import { computed, defineComponent, onMounted, ref } from "@vue/runtime-core";
import { baseUrl } from "../constant";
import { getCancelOrder, getDeliveredOrder, getNewOrder, getCustomerInfo } from "../api/account";
import { money, date } from "../helper/format";

export default defineComponent({
  setup() {
    const newOrderAll = ref([]);
    const deliveredOrderAll = ref([]);
    const canceledOrderAll = ref([]);
    const customerInfo = ref({});

    // life
    onMounted(async () => {
      await customerInfoApi();
      await newOrder();
    });

    // computed
    const newOrderList = computed(() => {
      if (newOrderAll.value.length > 0) {
        return [
          {
            title: "POLOMAN WEBSITE",
            image: `${baseUrl}/1111111111111111111/images/channel-polo.svg`,
            data: newOrderAll.value.filter((x) => x.order_source === 1),
          },
          {
            title: "POLOMAN FANPAGE",
            image: `${baseUrl}/1111111111111111111/images/channel-facebook.svg`,
            data: newOrderAll.value.filter((x) => x.order_source === 2),
          },
          {
            title: "POLOMAN LAZADA STORE",
            image: `${baseUrl}/1111111111111111111/images/channel-lazada.svg`,
            data: newOrderAll.value.filter((x) => x.order_source === 3),
          },
          {
            title: "POLOMAN SHOPPE STORE",
            image: `${baseUrl}/1111111111111111111/images/channel-shoppe.svg`,
            data: newOrderAll.value.filter((x) => x.order_source === 4),
          },
        ];
      }

      return [];
    });

    const deliveredOrderList = computed(() => {
      if (deliveredOrderAll.value.length > 0) {
        return [
          {
            title: "POLOMAN WEBSITE",
            image: `${baseUrl}/1111111111111111111/images/channel-polo.svg`,
            data: deliveredOrderAll.value.filter((x) => x.order_source === 1),
          },
          {
            title: "POLOMAN FANPAGE",
            image: `${baseUrl}/1111111111111111111/images/channel-facebook.svg`,
            data: deliveredOrderAll.value.filter((x) => x.order_source === 2),
          },
          {
            title: "POLOMAN LAZADA STORE",
            image: `${baseUrl}/1111111111111111111/images/channel-lazada.svg`,
            data: deliveredOrderAll.value.filter((x) => x.order_source === 3),
          },
          {
            title: "POLOMAN SHOPPE STORE",
            image: `${baseUrl}/1111111111111111111/images/channel-shoppe.svg`,
            data: deliveredOrderAll.value.filter((x) => x.order_source === 4),
          },
        ];
      }

      return [];
    });

    const canceledOrderList = computed(() => {
      if (canceledOrderAll.value.length > 0) {
        return [
          {
            title: "POLOMAN WEBSITE",
            image: `${baseUrl}/1111111111111111111/images/channel-polo.svg`,
            data: canceledOrderAll.value.filter((x) => x.order_source === 1),
          },
          {
            title: "POLOMAN FANPAGE",
            image: `${baseUrl}/1111111111111111111/images/channel-facebook.svg`,
            data: canceledOrderAll.value.filter((x) => x.order_source === 2),
          },
          {
            title: "POLOMAN LAZADA STORE",
            image: `${baseUrl}/1111111111111111111/images/channel-lazada.svg`,
            data: canceledOrderAll.value.filter((x) => x.order_source === 3),
          },
          {
            title: "POLOMAN SHOPPE STORE",
            image: `${baseUrl}/1111111111111111111/images/channel-shoppe.svg`,
            data: canceledOrderAll.value.filter((x) => x.order_source === 4),
          },
        ];
      }

      return [];
    });

    // Method
    const newOrder = async () => {
      try {
        const data = await getNewOrder();
        newOrderAll.value = data;
      } catch (err) {
        //
      } finally {
      }
    };

    const deliveredOrder = async () => {
      try {
        const data = await getDeliveredOrder();
        deliveredOrderAll.value = data;
      } catch (err) {
        //
      } finally {
      }
    };

    const canceledOrder = async () => {
      try {
        const data = await getCancelOrder();
        canceledOrderAll.value = data;
      } catch (err) {
        //
      } finally {
      }
    };

    const activeNewOrder = async () => {
      await newOrder();
    };

    const activeDeliveredOrder = async () => {
      await deliveredOrder();
    };

    const activeCanceledOrder = async () => {
      await canceledOrder();
    };

    const customerInfoApi = async () => {
      try {
        const data = await getCustomerInfo();
        customerInfo.value = data;
      } catch (err) {
        //
      } finally {
      }
    };

    return {
      baseUrl,
      customerInfo,
      newOrderList,
      canceledOrderList,
      deliveredOrderList,
      date,
      money,
      activeNewOrder,
      activeDeliveredOrder,
      activeCanceledOrder,
    };
  },
});
</script>

<template>
  <main class="main">
    <div class="section pt-30 pb-2">
      <div class="container-fluid">
        <div class="user-avatar">
          <div class="user-avatar__img ratio ratio-1x1">
            <img
              :src="customerInfo.image"
              alt=""
            />
          </div>
          <div class="user-avatar__heraldic">
            <img
              :src="`${baseUrl}/1111111111111111111/images/heraldic.svg`"
              alt=""
            />
          </div>
        </div>
        <p class="text-8E fz-10 mt-2 mb-0 ls-20">Thông tin khách hàng</p>
      </div>
    </div>
    <div class="section user-overview-section">
      <div class="container-fluid">
        <div class="user-overview">
          <div class="user-overview__left">
            <p class="user-overview__name">{{customerInfo.fullname}}</p>
            <p class="user-overview__tel">{{customerInfo.phone}}</p>
            <p class="user-overview__rank">
              {{customerInfo.range}}
              <img
                :src="`${baseUrl}/1111111111111111111/images/hc.svg`"
                alt=""
                class="ms-2"
              />
            </p>
          </div>
          <div class="user-overview__right">
            <a
              href="thong-tin-tai-khoan.html"
              class="btn btn-fit user-overview__edit"
            >
              <img
                :src="`${baseUrl}/1111111111111111111/images/edit-8E.svg`"
                alt=""
                class="d-block"
                width="20"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="section pt-20">
      <div class="container-fluid">
        <ul
          class="
            nav nav-tabs
            main-nav main-nav--3 main-nav--fz12
            row row-cols-3
            gx-2
            mb-0
          "
          id="userTabNav"
          role="tablist"
        >
          <li class="nav-item" role="presentation" @click="activeNewOrder">
            <button
              class="nav-link active"
              id="userTabNav1"
              data-bs-toggle="tab"
              data-bs-target="#userTabContent1"
              type="button"
              role="tab"
              aria-controls="userTabContent1"
              aria-selected="true"
            >
              Đơn mới
            </button>
          </li>
          <li
            class="nav-item"
            role="presentation"
            @click="activeDeliveredOrder"
          >
            <button
              class="nav-link"
              id="userTabNav2"
              data-bs-toggle="tab"
              data-bs-target="#userTabContent2"
              type="button"
              role="tab"
              aria-controls="userTabContent2"
              aria-selected="true"
            >
              Đơn đã nhận
            </button>
          </li>
          <li class="nav-item" role="presentation" @click="activeCanceledOrder">
            <button
              class="nav-link"
              id="userTabNav3"
              data-bs-toggle="tab"
              data-bs-target="#userTabContent3"
              type="button"
              role="tab"
              aria-controls="userTabContent3"
              aria-selected="true"
            >
              Đơn đã hủy
            </button>
          </li>
        </ul>
      </div>
      <div class="separate-line"></div>
      <div class="tab-content" id="userTabContent">
        <div
          class="tab-pane fade show active"
          id="userTabContent1"
          role="tabpanel"
          aria-labelledby="userTabNav1"
        >
          <template v-for="(channel, index) in newOrderList" :key="index">
            <div class="kbh-item">
              <div class="container-fluid">
                <div class="kbh-item__header">
                  <img :src="channel.image" alt="" />
                  {{ channel.title }}
                </div>
                <div class="kbh-item__body">
                  <div
                    class="order-channel"
                    v-for="(order, index) in channel.data"
                    :key="index"
                  >
                    <div class="order-channel__body">
                      <div class="order-channel__status">
                        <div class="order-channel__status__left">
                          <p class="order-channel__status__code">
                            Mã đơn hàng: <strong>{{ order.order_id }}</strong>
                          </p>
                          <div class="order-channel__status__tags">
                            <span class="badge badge-warning-custom">
                              {{ order.status }}
                            </span>
                            <span class="badge badge-warning-custom">{{
                              order.payed ? "Đã thanh toán" : "Chưa thanh toán"
                            }}</span>
                          </div>
                        </div>
                        <div class="order-channel__status__right"></div>
                      </div>
                      <div class="order-channel__items">
                        <div class="checkout-pd-wrap">
                          <div class="checkout-pd">
                            <div class="checkout-pd__img">
                              <img :src="order.detail[0].image" alt="" />
                            </div>
                            <div class="checkout-pd__info">
                              <p class="checkout-pd__title">
                                {{ order.detail[0].name }}
                              </p>
                              <p class="checkout-pd__price">
                                {{ order.detail[0].quantity }}
                                <span class="fz-10 mx-2">X</span>
                                {{ money(order.detail[0].price) }}
                              </p>
                            </div>
                          </div>
                          <template v-if="order.isViewAllProduct">
                            <div
                              class="checkout-pd"
                              v-for="(product, index) in order.detail.slice(1)"
                              :key="index"
                            >
                              <div class="checkout-pd__img">
                                <img
                                  :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                                  alt=""
                                />
                              </div>
                              <div class="checkout-pd__info">
                                <p class="checkout-pd__title">
                                  {{ product.name }}
                                </p>
                                <p class="checkout-pd__price">
                                  {{ product.quantity }}
                                  <span class="fz-10 mx-2">X</span>
                                  {{ money(product.price) }}
                                </p>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div
                        class="order-channel__toggle d-block"
                        v-if="order.detail.length >= 1"
                        @click="
                          () =>
                            (order.isViewAllProduct = !order.isViewAllProduct)
                        "
                      >
                        {{ order.isViewAllProduct ? "Ẩn" : "Xem thêm" }}
                        {{ order.detail.length - 1 }} sản phẩm
                      </div>
                    </div>
                    <div
                      class="order-channel__collapse d-block"
                      v-if="order.isViewDetail"
                    >
                      <div class="order-detail">
                        <div class="order-detail__title">
                          THÔNG TIN GIAO HÀNG
                          <span class="badge badge-blue-custom">Mặc định</span>
                        </div>
                        <div class="order-detail__content">
                          <p class="order-detail__content__title">
                            {{ order.shipping_name }}
                          </p>
                          <div class="order-detail__content__desc">
                            <p class="mb-0">{{ order.shipping_phone }}</p>
                            <p class="mb-0">
                              {{ order.shipping_address }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="order-detail">
                        <div class="order-detail__title">
                          PHƯƠNG THỨC THANH TOÁN
                        </div>
                        <div class="order-detail__content">
                          <p class="order-detail__content__title">
                            {{ order.payment_method }}
                          </p>
                          <div class="order-detail__content__desc">
                            <div class="row gx-3">
                              <div class="col-5">
                                <p class="mb-1">Thời gian dự kiến</p>
                                <p class="mb-0 fw-semi">
                                  {{
                                    date(
                                      new Date(Date.now() + 3600 * 1000 * 24),
                                      "dd/MM"
                                    )
                                  }}
                                  -
                                  {{
                                    date(
                                      new Date(
                                        Date.now() + 3600 * 1000 * 24 * 4
                                      ),
                                      "dd/MM"
                                    )
                                  }}
                                </p>
                              </div>
                              <div class="col-7">
                                <p class="mb-1">Phí ship:</p>
                                <p class="mb-0 fw-semi">
                                  {{ money(order.shipping_price) }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="order-detail">
                        <div class="order-detail__title">
                          PHƯƠNG THỨC GIAO HÀNG
                        </div>
                        <div class="order-detail__content">
                          <p class="order-detail__content__title">
                            {{ order.delivery_type.title }}
                          </p>
                          <div class="order-detail__content__desc">
                            {{ order.delivery_type.detail }}
                          </div>
                        </div>
                      </div>
                      <div
                        class="order-detail"
                        v-if="
                          order.order_extend && order.order_extend.length > 0
                        "
                      >
                        <div class="order-detail__title">
                          LỘ TRÌNH GIAO HÀNG
                        </div>
                        <div class="order-detail__content">
                          <div class="st-wrap">
                            <div
                              :class="`st-item ${index === 0 ? 'active' : ''}`"
                              v-for="(extend, index) in order.order_extend"
                              :key="index"
                            >
                              <div class="st-item__left">
                                <p class="mb-0">
                                  {{ date(extend.update_at, "dd-MM") }}
                                </p>
                                <p class="mb-0">
                                  {{ date(extend.update_at, "hh") }}h{{
                                    date(extend.update_at, "mm")
                                  }}
                                </p>
                              </div>
                              <div class="st-item__dot">
                                <div></div>
                              </div>
                              <div class="st-item__right">
                                {{ extend.note }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="order-channel__footer">
                      <div class="order-channel__footer__left">
                        <p class="order-channel__footer__txt">
                          Tổng thanh toán
                          <strong>{{ money(order.total_price) }}</strong>
                        </p>
                        <p class="order-channel__footer__txt">
                          Ngày mua hàng: {{ order.create_at }}
                        </p>
                      </div>
                      <div class="order-channel__footer__right">
                        <span
                          type="button"
                          class="order-channel__footer__count"
                        ></span>
                        <button
                          type="button"
                          class="btn btn-fit btn-icon-end"
                          @click="
                            () => (order.isViewDetail = !order.isViewDetail)
                          "
                        >
                          {{ order.isViewDetail ? "Ẩn" : "Xem" }} chi tiết
                          <i
                            :class="
                              order.isViewDetail
                                ? 'fas fa-chevron-up'
                                : 'fas fa-chevron-down'
                            "
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="separate-line"
              v-if="index < newOrderList.length - 1"
            ></div>
          </template>
        </div>
        <div
          class="tab-pane fade"
          id="userTabContent2"
          role="tabpanel"
          aria-labelledby="userTabNav2"
        >
          <template v-for="(channel, index) in deliveredOrderList" :key="index">
            <div class="kbh-item">
              <div class="container-fluid">
                <div class="kbh-item__header">
                  <img :src="channel.image" alt="" />
                  {{ channel.title }}
                </div>
                <div class="kbh-item__body">
                  <div
                    class="order-channel"
                    v-for="(order, index) in channel.data"
                    :key="index"
                  >
                    <div class="order-channel__body">
                      <div class="order-channel__status">
                        <div class="order-channel__status__left">
                          <p class="order-channel__status__code">
                            Mã đơn hàng: <strong>{{ order.order_id }}</strong>
                          </p>
                          <div class="order-channel__status__tags">
                            <span class="badge badge-success-custom"
                              >Đã nhận hàng ({{ order.update_at }})</span
                            >
                          </div>
                        </div>
                        <div class="order-channel__status__right"></div>
                      </div>
                      <div class="order-channel__items">
                        <div class="checkout-pd-wrap">
                          <div class="checkout-pd">
                            <div class="checkout-pd__img">
                              <img :src="order.detail[0].image" alt="" />
                            </div>
                            <div class="checkout-pd__info">
                              <p class="checkout-pd__title">
                                {{ order.detail[0].name }}
                              </p>
                              <p class="checkout-pd__price">
                                {{ order.detail[0].quantity }}
                                <span class="fz-10 mx-2">X</span>
                                {{ money(order.detail[0].price) }}
                              </p>
                            </div>
                          </div>
                          <template v-if="order.isViewAllProduct">
                            <div
                              class="checkout-pd"
                              v-for="(product, index) in order.detail.slice(1)"
                              :key="index"
                            >
                              <div class="checkout-pd__img">
                                <img
                                  :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                                  alt=""
                                />
                              </div>
                              <div class="checkout-pd__info">
                                <p class="checkout-pd__title">
                                  {{ product.name }}
                                </p>
                                <p class="checkout-pd__price">
                                  {{ product.quantity }}
                                  <span class="fz-10 mx-2">X</span>
                                  {{ money(product.price) }}
                                </p>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div
                        class="order-channel__toggle d-block"
                        v-if="order.detail.length >= 1"
                        @click="
                          () =>
                            (order.isViewAllProduct = !order.isViewAllProduct)
                        "
                      >
                        {{ order.isViewAllProduct ? "Ẩn" : "Xem thêm" }}
                        {{ order.detail.length - 1 }} sản phẩm
                      </div>
                    </div>
                    <div
                      class="order-channel__collapse d-block"
                      v-if="order.isViewDetail"
                    >
                      <div class="order-detail">
                        <div class="order-detail__title">
                          THÔNG TIN GIAO HÀNG
                          <span class="badge badge-blue-custom">Mặc định</span>
                        </div>
                        <div class="order-detail__content">
                          <p class="order-detail__content__title">
                            {{ order.shipping_name }}
                          </p>
                          <div class="order-detail__content__desc">
                            <p class="mb-0">{{ order.shipping_phone }}</p>
                            <p class="mb-0">
                              {{ order.shipping_address }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="order-detail">
                        <div class="order-detail__title">
                          PHƯƠNG THỨC THANH TOÁN
                        </div>
                        <div class="order-detail__content">
                          <p class="order-detail__content__title">
                            {{ order.payment_method }}
                          </p>
                          <div class="order-detail__content__desc">
                            <div class="row gx-3">
                              <div class="col-5">
                                <p class="mb-1">Thời gian dự kiến</p>
                                <p class="mb-0 fw-semi">
                                  {{
                                    date(
                                      new Date(Date.now() + 3600 * 1000 * 24),
                                      "dd/MM"
                                    )
                                  }}
                                  -
                                  {{
                                    date(
                                      new Date(
                                        Date.now() + 3600 * 1000 * 24 * 4
                                      ),
                                      "dd/MM"
                                    )
                                  }}
                                </p>
                              </div>
                              <div class="col-7">
                                <p class="mb-1">Phí ship:</p>
                                <p class="mb-0 fw-semi">
                                  {{ money(order.shipping_price) }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="order-detail">
                        <div class="order-detail__title">
                          PHƯƠNG THỨC GIAO HÀNG
                        </div>
                        <div class="order-detail__content">
                          <p class="order-detail__content__title">
                            {{ order.delivery_type.title }}
                          </p>
                          <div class="order-detail__content__desc">
                            {{ order.delivery_type.detail }}
                          </div>
                        </div>
                      </div>
                      <div
                        class="order-detail"
                        v-if="
                          order.order_extend && order.order_extend.length > 0
                        "
                      >
                        <div class="order-detail__title">
                          LỘ TRÌNH GIAO HÀNG
                        </div>
                        <div class="order-detail__content">
                          <div class="st-wrap">
                            <div
                              :class="`st-item ${index === 0 ? 'active' : ''}`"
                              v-for="(extend, index) in order.order_extend"
                              :key="index"
                            >
                              <div class="st-item__left">
                                <p class="mb-0">
                                  {{ date(extend.update_at, "dd-MM") }}
                                </p>
                                <p class="mb-0">
                                  {{ date(extend.update_at, "hh") }}h{{
                                    date(extend.update_at, "mm")
                                  }}
                                </p>
                              </div>
                              <div class="st-item__dot">
                                <div></div>
                              </div>
                              <div class="st-item__right">
                                {{ extend.note }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="order-channel__footer">
                      <div class="order-channel__footer__left">
                        <p class="order-channel__footer__txt">
                          Tổng thanh toán
                          <strong>{{ money(order.total_price) }}</strong>
                        </p>
                        <p class="order-channel__footer__txt">
                          Ngày mua hàng: {{ order.create_at }}
                        </p>
                      </div>
                      <div class="order-channel__footer__right">
                        <span
                          type="button"
                          class="order-channel__footer__count"
                        ></span>
                        <button
                          type="button"
                          class="btn btn-fit btn-icon-end"
                          @click="
                            () => (order.isViewDetail = !order.isViewDetail)
                          "
                        >
                          {{ order.isViewDetail ? "Ẩn" : "Xem" }} chi tiết
                          <i
                            :class="
                              order.isViewDetail
                                ? 'fas fa-chevron-up'
                                : 'fas fa-chevron-down'
                            "
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="separate-line"
              v-if="index < newOrderList.length - 1"
            ></div>
          </template>
        </div>
        <div
          class="tab-pane fade"
          id="userTabContent3"
          role="tabpanel"
          aria-labelledby="userTabNav3"
        >
          <template v-for="(channel, index) in canceledOrderList" :key="index">
            <div class="kbh-item">
              <div class="container-fluid">
                <div class="kbh-item__header">
                  <img :src="channel.image" alt="" />
                  {{ channel.title }}
                </div>
                <div class="kbh-item__body">
                  <div
                    class="order-channel"
                    v-for="(order, index) in channel.data"
                    :key="index"
                  >
                    <div class="order-channel__body">
                      <div class="order-channel__status">
                        <div class="order-channel__status__left">
                          <p class="order-channel__status__code">
                            Mã đơn hàng: <strong>{{ order.order_id }}</strong>
                          </p>
                          <div class="order-channel__status__tags">
                            <span class="badge badge-danger-custom"
                              >Đã hủy</span
                            >
                          </div>
                        </div>
                        <div class="order-channel__status__right"></div>
                      </div>
                      <div class="order-channel__items">
                        <div class="checkout-pd-wrap">
                          <div class="checkout-pd">
                            <div class="checkout-pd__img">
                              <img :src="order.detail[0].image" alt="" />
                            </div>
                            <div class="checkout-pd__info">
                              <p class="checkout-pd__title">
                                {{ order.detail[0].name }}
                              </p>
                              <p class="checkout-pd__price">
                                {{ order.detail[0].quantity }}
                                <span class="fz-10 mx-2">X</span>
                                {{ money(order.detail[0].price) }}
                              </p>
                            </div>
                          </div>
                          <template v-if="order.isViewAllProduct">
                            <div
                              class="checkout-pd"
                              v-for="(product, index) in order.detail.slice(1)"
                              :key="index"
                            >
                              <div class="checkout-pd__img">
                                <img
                                  :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                                  alt=""
                                />
                              </div>
                              <div class="checkout-pd__info">
                                <p class="checkout-pd__title">
                                  {{ product.name }}
                                </p>
                                <p class="checkout-pd__price">
                                  {{ product.quantity }}
                                  <span class="fz-10 mx-2">X</span>
                                  {{ money(product.price) }}
                                </p>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div
                        class="order-channel__toggle d-block"
                        v-if="order.detail.length >= 1"
                        @click="
                          () =>
                            (order.isViewAllProduct = !order.isViewAllProduct)
                        "
                      >
                        {{ order.isViewAllProduct ? "Ẩn" : "Xem thêm" }}
                        {{ order.detail.length - 1 }} sản phẩm
                      </div>
                    </div>
                    <div
                      class="order-channel__collapse d-block"
                      v-if="order.isViewDetail"
                    >
                      <div class="order-detail">
                        <div class="order-detail__title">
                          THÔNG TIN GIAO HÀNG
                          <span class="badge badge-blue-custom">Mặc định</span>
                        </div>
                        <div class="order-detail__content">
                          <p class="order-detail__content__title">
                            {{ order.shipping_name }}
                          </p>
                          <div class="order-detail__content__desc">
                            <p class="mb-0">{{ order.shipping_phone }}</p>
                            <p class="mb-0">
                              {{ order.shipping_address }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="order-detail">
                        <div class="order-detail__title">
                          PHƯƠNG THỨC THANH TOÁN
                        </div>
                        <div class="order-detail__content">
                          <p class="order-detail__content__title">
                            {{ order.payment_method }}
                          </p>
                          <div class="order-detail__content__desc">
                            <div class="row gx-3">
                              <div class="col-5">
                                <p class="mb-1">Thời gian dự kiến</p>
                                <p class="mb-0 fw-semi">
                                  {{
                                    date(
                                      new Date(Date.now() + 3600 * 1000 * 24),
                                      "dd/MM"
                                    )
                                  }}
                                  -
                                  {{
                                    date(
                                      new Date(
                                        Date.now() + 3600 * 1000 * 24 * 4
                                      ),
                                      "dd/MM"
                                    )
                                  }}
                                </p>
                              </div>
                              <div class="col-7">
                                <p class="mb-1">Phí ship:</p>
                                <p class="mb-0 fw-semi">
                                  {{ money(order.shipping_price) }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="order-detail">
                        <div class="order-detail__title">
                          PHƯƠNG THỨC GIAO HÀNG
                        </div>
                        <div class="order-detail__content">
                          <p class="order-detail__content__title">
                            {{ order.delivery_type.title }}
                          </p>
                          <div class="order-detail__content__desc">
                            {{ order.delivery_type.detail }}
                          </div>
                        </div>
                      </div>
                      <div
                        class="order-detail"
                        v-if="
                          order.order_extend && order.order_extend.length > 0
                        "
                      >
                        <div class="order-detail__title">
                          LỘ TRÌNH GIAO HÀNG
                        </div>
                        <div class="order-detail__content">
                          <div class="st-wrap">
                            <div
                              :class="`st-item ${index === 0 ? 'active' : ''}`"
                              v-for="(extend, index) in order.order_extend"
                              :key="index"
                            >
                              <div class="st-item__left">
                                <p class="mb-0">
                                  {{ date(extend.update_at, "dd-MM") }}
                                </p>
                                <p class="mb-0">
                                  {{ date(extend.update_at, "hh") }}h{{
                                    date(extend.update_at, "mm")
                                  }}
                                </p>
                              </div>
                              <div class="st-item__dot">
                                <div></div>
                              </div>
                              <div class="st-item__right">
                                {{ extend.note }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="order-channel__footer">
                      <div class="order-channel__footer__left">
                        <p class="order-channel__footer__txt">
                          Tổng thanh toán
                          <strong>{{ money(order.total_price) }}</strong>
                        </p>
                        <p class="order-channel__footer__txt">
                          Ngày mua hàng: {{ order.create_at }}
                        </p>
                      </div>
                      <div class="order-channel__footer__right">
                        <span
                          type="button"
                          class="order-channel__footer__count"
                        ></span>
                        <button
                          type="button"
                          class="btn btn-fit btn-icon-end"
                          @click="
                            () => (order.isViewDetail = !order.isViewDetail)
                          "
                        >
                          {{ order.isViewDetail ? "Ẩn" : "Xem" }} chi tiết
                          <i
                            :class="
                              order.isViewDetail
                                ? 'fas fa-chevron-up'
                                : 'fas fa-chevron-down'
                            "
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="separate-line"
              v-if="index < newOrderList.length - 1"
            ></div>
          </template>
        </div>
      </div>
    </div>
    <div class="separate-line"></div>
    <div class="section py-30">
      <div class="container-fluid">
        <div class="user-box-wrap">
          <div class="user-box">
            <h3 class="user-box__title">Sản phẩm</h3>
            <div class="user-box__content">
              <ul class="icon-menu-nav">
                <li>
                  <a href="#">
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/icon-voucher.svg`"
                      alt=""
                    />
                    Mã giảm giá
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/icon-eye.svg`"
                      alt=""
                    />
                    Sản phẩm đã xem
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/icon-heart.svg`"
                      alt=""
                    />
                    Sản phẩm yêu thích
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/icon-time.svg`"
                      alt=""
                    />
                    Sản phẩm chờ hàng về
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/icon-favorite.svg`"
                      alt=""
                    />
                    Sản phẩm đã đánh giá
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="user-box">
            <h3 class="user-box__title">Tài khoản khách hàng</h3>
            <div class="user-box__content">
              <ul class="icon-menu-nav">
                <li>
                  <a href="#">
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/icon-user-group.svg`"
                      alt=""
                    />
                    Giới thiệu bạn bè
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/icon-user.svg`"
                      alt=""
                    />
                    Chỉnh sửa thông tin cá nhân
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/icon-location.svg`"
                      alt=""
                    />
                    Địa chỉ giao hàng
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img
                      :src="`${baseUrl}/1111111111111111111/images/icon-phone.svg`"
                      alt=""
                    />
                    Hotline: 0905 000 555
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mt-35">
          <button
            type="button"
            class="
              btn btn-icon-start btn-outline-37-white
              fz-14
              fw-semi
              w-100
              p-2
            "
          >
            <img
              :src="`${baseUrl}/1111111111111111111/images/sign-out-37.svg`"
              alt=""
              width="18"
            />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
