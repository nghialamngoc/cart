<script>
import { defineComponent, onMounted, ref } from "@vue/runtime-core";
import { baseUrl, cancelReason } from "../constant";

import { money, date } from "../helper/format";
import Loading from "./Loading.vue";
import ErrorDialog from "./ErrorDialog.vue";
import { getCustomerInfo, getOrderDetail, orderCancel } from "../api/account";
import { openModal } from "../helper/modal";

export default defineComponent({
  components: {
    Loading,
    ErrorDialog,
  },
  setup() {
    const isLoading = ref(false);
    const isError = ref(false);
    const orderDetail = ref({});
    const reason = ref("");

    onMounted(async () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const { id } = Object.fromEntries(urlSearchParams.entries());

      if (id) {
        await orderDetailApi(id);
      } else {
        location.replace('http://google.com/');
      }

    });

    const orderDetailApi = async (id) => {
      try {
        isLoading.value = true;
        const data = await getOrderDetail(id);
        orderDetail.value = data;
      } catch (err) {
        console.log(err);
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    const onHideError = () => {
      isError.value = false;
    };

    const setReason = (value) => {
      reason.value = value;
    };

    const cancelOrder = async () => {
      try {
        isLoading.value = true;
        await orderCancel({
          order_id: orderDetail.value.order_id,
          reason: reason.value,
        });
        location.reload();
      } catch (err) {
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      baseUrl,
      isError,
      setReason,
      isLoading,
      orderDetail,
      cancelReason,
      date,
      money,
      cancelOrder,
      onHideError,
    };
  },
});
</script>

<template>
  <header id="header" class="header">
    <div class="container-fluid">
      <h1 class="header__logo">
        <a href="trang-chu.html">
          <img
            :src="`${baseUrl}/1111111111111111111/images/logo.svg`"
            alt="POLOMAN"
          />
        </a>
        <span class="hide-text">POLOMAN</span>
      </h1>
      <div class="header__right">
        <a
          href="#"
          class="header__icon js-toggle-btn"
          data-target="#aside-search"
        >
          <img
            :src="`${baseUrl}/1111111111111111111/images/search.svg`"
            alt=""
          />
        </a>
        <a href="gio-hang.html" class="header__icon" id="hd-cart">
          <span>2</span>
          <img :src="`${baseUrl}/1111111111111111111/images/cart.svg`" alt="" />
        </a>
        <a
          href="#"
          class="header__icon js-toggle-btn"
          data-target="#aside-menu"
        >
          <img
            :src="`${baseUrl}/1111111111111111111/images/hamburger.svg`"
            alt=""
          />
        </a>
      </div>
    </div>
  </header>
  <main class="main">
    <div class="section py-15 border-bottom border-C0">
      <div class="container-fluid">
        <h2 class="mb-0 fz-16 fw-medium">Thông tin đơn hàng</h2>
      </div>
    </div>
    <div class="section py-30">
      <div class="container-fluid">
        <div class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-0.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h3 class="checkout__head__title">
              MÃ ĐƠN HÀNG:
              <span class="text-primary">{{ orderDetail.order_id }}</span>
            </h3>
            <!-- <button
              class="btn p-0 checkout__head__edit js-btn-copy"
              data-value="0000000"
            >
              <img :src="`${baseUrl}/1111111111111111111/images/copy.svg`" alt="" />
            </button> -->
          </div>
          <div class="checkout__body checkout__body--outside">
            <p class="text-63 mb-1">
              Ngày đặt hàng:
              {{ date(orderDetail.create_at, "hh:mm") }} ngày
              {{ date(orderDetail.create_at, "dd/MM/yyyy") }}
            </p>
            <div class="row row-cols-auto g-1">
              <div class="col">
                <span
                  :class="`badge badge-warning-custom ${
                    orderDetail.status === 19 && `badge-danger-custom`
                  }`"
                  >{{ orderDetail.statusText }}</span
                >
              </div>
              <!-- <div class="col">
                <span class="badge badge-warning-custom">Chưa thanh toán</span>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="separate-line"></div>
    <div class="section py-30">
      <div class="container-fluid">
        <div class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-1.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h3 class="checkout__head__title">ĐỊA CHỈ NHẬN HÀNG</h3>
          </div>
          <div class="checkout__body checkout__body--outside">
            <p class="checkout__body__title">{{ orderDetail.shipping_name }}</p>
            <div class="text-63 ls-20">
              <p class="mb-1">{{ orderDetail.shipping_phone }}</p>
              <p class="mb-0">
                {{ orderDetail.shipping_address }}
              </p>
            </div>
          </div>
        </div>
        <div class="separate-line separate-line--gradient my-30"></div>
        <div class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-3.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h3 class="checkout__head__title">PHƯƠNG THỨC THANH TOÁN</h3>
          </div>
          <div class="checkout__body checkout__body--outside">
            <p class="checkout__body__title">
              {{ orderDetail.payment_method }}
            </p>
            <div class="row gx-3">
              <div class="col-5">
                <p class="mb-1">Thời gian dự kiến</p>
                <p class="mb-0 fw-semi">
                  {{
                    date(
                      new Date(
                        new Date(orderDetail.create_at).getTime() +
                          3600 * 1000 * 24
                      ),
                      "dd/MM"
                    )
                  }}
                  -
                  {{
                    date(
                      new Date(
                        new Date(orderDetail.create_at).getTime() +
                          3600 * 1000 * 24 * 4
                      ),
                      "dd/MM"
                    )
                  }}
                </p>
              </div>
              <div class="col-7">
                <p class="mb-1">Phí ship:</p>
                <p class="mb-0 fw-semi">
                  {{ money(orderDetail.shipping_price) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="border-top border-C0 my-20"></div>
        <div class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-2.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h3 class="checkout__head__title">PHƯƠNG THỨC GIAO HÀNG</h3>
          </div>
          <div class="checkout__body checkout__body--outside">
            <p class="checkout__body__title">
              {{
                orderDetail.delivery_type ? orderDetail.delivery_type.title : ""
              }}
            </p>
            <p class="text-63 mb-0">
              {{
                orderDetail.delivery_type
                  ? orderDetail.delivery_type.detail
                  : ""
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="separate-line"></div>
    <div class="section py-30">
      <div class="container-fluid">
        <div class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-5.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h2 class="checkout__head__title checkout__head__title--2">
              THÔNG TIN ĐƠN HÀNG
            </h2>
          </div>
          <div class="checkout__body checkout__body--outside pt-2">
            <div
              class="checkout-pd"
              v-for="(product, index) in orderDetail.detail"
              :key="index"
            >
              <div class="checkout-pd__img">
                <img :src="product.image" alt="" />
              </div>
              <div class="checkout-pd__info">
                <p class="checkout-pd__title">
                  {{ product.name }} {{ product.color }} <br />
                  {{ product.size ? `Size ${product.size}` : "" }}
                  {{
                    orderDetail.box && product.type !== 3
                      ? `(${orderDetail.box.name})`
                      : ""
                  }}
                </p>
                <p class="checkout-pd__price">
                  {{ product.quantity }}
                  <span class="fz-10 mx-2">X</span>
                  {{ money(product.price) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="separate-line"></div>
    <div class="section py-4">
      <div class="container-fluid">
        <div class="row row-cols-2 gx-2 mb-2 align-items-center ls-20">
          <div class="col fz-14 fw-medium">Tổng cộng</div>
          <div class="col text-end fz-16 fw-semi">
            {{ money(orderDetail.total_price) }}
          </div>
        </div>
        <div class="row row-cols-2 gx-2 mb-2 align-items-center">
          <div class="col fz-14 fw-medium">Phí ship</div>
          <div class="col text-end fz-16 fw-semi">
            {{ money(orderDetail.shipping_price) }}
          </div>
        </div>
        <div class="row row-cols-2 gx-2 align-items-center">
          <div class="col fz-14 fw-medium">Ưu đãi</div>
          <div class="col text-end fz-16 fw-semi">
            {{ money(orderDetail.discount) }}
          </div>
        </div>
        <div class="border-top border-C0 my-3"></div>
        <div class="row row-cols-2 gx-2 align-items-center">
          <div class="col fz-14 fw-medium">Tổng thanh toán</div>
          <div class="col text-end fz-16 fw-bold text-primary">
            {{
              money(
                orderDetail.total_price +
                  orderDetail.shipping_price -
                  orderDetail.discount
              )
            }}
          </div>
        </div>
        <div class="mt-4">
          <button
            type="button"
            class="btn btn-outline-primary-F6 fz-14 fw-semi p-2 w-100"
            data-bs-dismiss="modal"
            data-bs-toggle="modal"
            data-bs-target="#cancelOrderModal"
            v-if="orderDetail.status < 6"
          >
            Hủy đơn hàng
          </button>

          <a
            :href="`${baseUrl}`"
            v-if="orderDetail.status === 19"
            class="btn btn-outline-primary-F6 fz-14 fw-semi p-2 w-100"
            >Tiếp tục mua sắm</a
          >
        </div>
      </div>
    </div>
  </main>

  <div
    class="modal fade modal-bottom cancel-order-modal"
    id="cancelOrderModal"
    tabindex="-1"
    aria-labelledby="transportModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title">HỦY ĐƠN HÀNG</p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body d-flex flex-column overflow-hidden">
          <div class="mb-4 flex-shrink-0 ls-20 fw-medium text-48">
            <p class="mb-0">Bạn có chắc chắn muốn hủy đơn hàng ?</p>
            <p class="mb-0">Bạn muốn hủy đơn hàng vì:</p>
          </div>
          <div class="flex-grow-1 overflow-y-auto">
            <ul class="dividers-nav fw-medium ls-20">
              <li
                v-for="(reason, index) in cancelReason"
                :key="index"
                @click="() => setReason(reason.label)"
              >
                <label class="custom-checkbox">
                  <input type="radio" name="reason" :value="reason.value" />
                  <span class="checkmark"></span>
                  {{ reason.label }}
                </label>
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <div class="w-100">
            <div class="row row-cols-2 gx-2">
              <div class="col">
                <button
                  type="button"
                  class="btn btn-outline-primary-F6 w-100 fz-14 fw-semi p-2 m-0"
                  @click="cancelOrder"
                >
                  Hủy đơn hàng
                </button>
              </div>
              <div class="col">
                <button
                  type="button"
                  class="btn btn-primary w-100 fz-14 fw-semi p-2 m-0"
                  data-bs-dismiss="modal"
                >
                  Giữ lại đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- LOADING MODAL -->
  <Loading :isLoading="isLoading"></Loading>

  <ErrorDialog
    :isOpen="isError"
    message="Có lỗi xảy ra. Vui lòng thử lại!"
    :hideError="onHideError"
    title="Lỗi!"
  />
</template>
