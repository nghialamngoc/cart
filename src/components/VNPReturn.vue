<script>
import { computed, defineComponent, onMounted, ref } from "@vue/runtime-core";
import { addOrderExperience } from "../api";
import { baseUrl } from "../constant";
import { closeModal, openModal } from "../helper/modal";
import { money } from "../helper/format";
import Loading from "./Loading.vue";
import { getOrderInfo } from "../api/order";

export default defineComponent({
  components: {
    Loading,
  },
  setup() {
    //state
    const isLoading = ref(false);
    const note = ref("");
    const order = ref({
      phone_number: "",
      name: "",
      total_price: "",
    });
    const rate = ref("");

    onMounted(async () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const { id } = Object.fromEntries(urlSearchParams.entries());

      if (!id) {
        //location.replace(baseUrl);
      }

      await getOrder(id);

      setTimeout(() => {
        openModal("experienceModal");
      }, 2000);
    });

    const isDisable = computed(() => {
      if (rate.value === "" || note.value.trim() === "") {
        return true;
      }

      return false;
    });

    const getOrder = async (orderId) => {
      try {
        isLoading.value = true;
        const data = await getOrderInfo({
          order_id: orderId,
        });

        order.value = data;
      } catch (err) {
        //location.replace(baseUrl);
      } finally {
        isLoading.value = false;
      }
    };

    const setReport = (data) => {
      rate.value = data;
    };

    const addReport = async () => {
      try {
        isLoading.value = true;
        const payload = {
          rate: rate.value,
          note: note.value,
          phone: order.value.shipping_phone_number,
          name: order.value.shipping_full_name,
          order_id: order.value.order_id,
        };

        await addOrderExperience(payload);
      } catch (err) {
        console.log(err);
      } finally {
        openModal("thankModal");
        closeModal("experienceModal");
        isLoading.value = false;
      }
    };

    const goToProfilePage = () => {
      location.replace(`${baseUrl}/profile`);
    };

    const goToHomePage = () => {
      location.replace(`${baseUrl}`);
    };

    return {
      note,
      rate,
      order,
      baseUrl,
      isLoading,
      isDisable,
      money,
      setReport,
      addReport,
      goToProfilePage,
      goToHomePage,
    };
  },
});
</script>

<template>
  <main class="main">
    <section class="section section-success-bg py-65">
      <div class="container-fluid">
        <div class="order-success__head">
          <div class="order-success__head__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/success.svg`"
              alt=""
            />
          </div>
          <h2 class="order-success__head__title">ĐẶT HÀNG THÀNH CÔNG !!</h2>
        </div>
        <div class="order-success__body">
          <h3 class="fz-14 mb-12 fw-medium">Thông tin đơn hàng</h3>
          <div class="border border-C0 px-12 py-20 rounded-3 ls-20">
            <div class="row gx-3 align-items-center mb-12">
              <div class="col-4">Mã đặt hàng:</div>
              <div class="col-4 fw-semi text-primary">
                <span class="text-primary fw-bold fz-14">{{
                  order.order_id
                }}</span>
              </div>
              <div class="col-4 text-end">
                <button class="btn p-0 js-btn-copy" data-value="0000000">
                  <img
                    :src="`${baseUrl}/1111111111111111111/images/copy.svg`"
                    alt=""
                    class="d-block"
                    width="15"
                  />
                </button>
              </div>
            </div>
            <div class="row gx-3 mb-12">
              <div class="col-4">Người nhận:</div>
              <div class="col-8 fw-semi">{{ order.shipping_full_name }}</div>
            </div>
            <div class="row gx-3 mb-12">
              <div class="col-4">Điện thoại:</div>
              <div class="col-8 fw-semi">
                {{ order.shipping_phone_number }}
              </div>
            </div>
            <div class="row gx-3 mb-12">
              <div class="col-4">Địa chỉ:</div>
              <div class="col-8 fw-semi">
                {{ order.shipping_address }}
              </div>
            </div>
            <div class="border-top border-C0 my-20"></div>
            <div class="row gx-3 mb-12">
              <div class="col-4">Tổng tiền:</div>
              <div class="col-8 fw-semi">
                {{
                  money(order.total_price + order.shipping_fee - order.discount)
                }}
              </div>
            </div>
            <div class="row gx-3 mb-12">
              <div class="col-4">Thanh toán:</div>
              <div class="col-8 fw-semi">
                {{ order.payment_method_type === 2 ? "Momo" : "VNPay" }}
              </div>
            </div>
            <div class="row gx-3 mb-12">
              <div class="col-4">Trạng thái:</div>
              <div class="col-8 fw-semi">
                <span class="badge badge-warning-custom">
                  Đang chờ xác nhận
                </span>
              </div>
            </div>
            <div class="border-top border-C0 my-20"></div>
            <div class="fw-medium lh-1-6">
              Cảm ơn bạn đã tin chọn POLOMAN. Mong rằng bạn đã có một trải
              nghiệm thoải mái. Nếu có bất kì thắc mắc nào vui lòng liên hệ 0905
              000 666
            </div>
          </div>
          <div class="mt-15">
            <div class="row row-cols-2 gx-1">
              <div class="col">
                <div
                  class="btn btn-outline-primary w-100 fz-14 p-2 h-100"
                  @click="goToProfilePage"
                >
                  Theo dõi hơn hàng
                </div>
              </div>
              <div class="col">
                <div
                  class="btn btn-primary w-100 fz-14 fw-semi p-2 h-100"
                  @click="goToHomePage"
                >
                  Quay về trang chủ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- EXPERIENCE MODAL -->
  <div
    class="modal fade modal--2 experience-modal"
    id="experienceModal"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title">ĐÁNH GIÁ TRẢI NGHIỆM</p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body py-25">
          <form action="" class="experience-form" id="experienceForm">
            <p class="experience-form__title">
              Trải nghiệm mua hàng của bạn <br />thế nào?
            </p>
            <div class="experience-form__rating">
              <label class="custom-checkbox">
                <span
                  class="checkmark-experience"
                  @click="() => setReport('Chưa tốt')"
                >
                  <svg
                    class="checkmark-experience__icon"
                    :fill="rate === 'Chưa tốt' ? '#004377' : '#cacbd2'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="48.937"
                    height="48.937"
                    viewBox="0 0 48.937 48.937"
                  >
                    <g
                      id="Group_5119"
                      data-name="Group 5119"
                      transform="translate(0 0)"
                    >
                      <path
                        id="Path_2602"
                        data-name="Path 2602"
                        d="M2197.065-534.2a24.5,24.5,0,0,1-24.468-24.469,24.5,24.5,0,0,1,24.468-24.468,24.5,24.5,0,0,1,24.469,24.468A24.5,24.5,0,0,1,2197.065-534.2Zm0-47.228a22.785,22.785,0,0,0-22.76,22.759,22.785,22.785,0,0,0,22.76,22.76,22.785,22.785,0,0,0,22.76-22.76A22.785,22.785,0,0,0,2197.065-581.423Z"
                        transform="translate(-2172.597 583.132)"
                      />
                    </g>
                    <g
                      id="Group_5120"
                      data-name="Group 5120"
                      transform="translate(11.74 16.886)"
                    >
                      <path
                        id="Path_2603"
                        data-name="Path 2603"
                        d="M2201.8-539.047a2.087,2.087,0,0,1,2.087-2.086,2.086,2.086,0,0,1,2.085,2.086,2.086,2.086,0,0,1-2.085,2.085A2.086,2.086,0,0,1,2201.8-539.047Z"
                        transform="translate(-2201.796 541.133)"
                      />
                    </g>
                    <g
                      id="Group_5121"
                      data-name="Group 5121"
                      transform="translate(33.025 16.886)"
                    >
                      <path
                        id="Path_2604"
                        data-name="Path 2604"
                        d="M2254.736-539.047a2.086,2.086,0,0,1,2.086-2.086,2.085,2.085,0,0,1,2.085,2.086,2.085,2.085,0,0,1-2.085,2.085A2.085,2.085,0,0,1,2254.736-539.047Z"
                        transform="translate(-2254.736 541.133)"
                      />
                    </g>
                    <g
                      id="Group_5122"
                      data-name="Group 5122"
                      transform="translate(12.176 25.768)"
                    >
                      <path
                        id="Path_2605"
                        data-name="Path 2605"
                        d="M2203.735-509.824a.85.85,0,0,1-.339-.071.855.855,0,0,1-.444-1.124,13.315,13.315,0,0,1,12.222-8.023,13.316,13.316,0,0,1,12.22,8.02.854.854,0,0,1-.443,1.124.854.854,0,0,1-1.124-.444,11.607,11.607,0,0,0-10.653-6.991,11.608,11.608,0,0,0-10.655,6.994A.853.853,0,0,1,2203.735-509.824Z"
                        transform="translate(-2202.881 519.042)"
                      />
                    </g>
                  </svg>
                  <span class="checkmark-experience__title">Chưa tốt</span>
                </span>
              </label>
              <label class="custom-checkbox" @click="() => setReport('Tạm ổn')">
                <span class="checkmark-experience">
                  <svg
                    class="checkmark-experience__icon"
                    :fill="rate === 'Tạm ổn' ? '#004377' : '#cacbd2'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="48.937"
                    height="48.937"
                    viewBox="0 0 48.937 48.937"
                  >
                    <g
                      id="Group_5124"
                      data-name="Group 5124"
                      transform="translate(11.74 16.886)"
                    >
                      <path
                        id="Path_2606"
                        data-name="Path 2606"
                        d="M2370.152-531.256a2.086,2.086,0,0,1,2.086-2.086,2.086,2.086,0,0,1,2.086,2.086,2.086,2.086,0,0,1-2.086,2.086A2.086,2.086,0,0,1,2370.152-531.256Z"
                        transform="translate(-2370.152 533.342)"
                      />
                    </g>
                    <g
                      id="Group_5125"
                      data-name="Group 5125"
                      transform="translate(33.025 16.886)"
                    >
                      <path
                        id="Path_2607"
                        data-name="Path 2607"
                        d="M2423.092-531.256a2.085,2.085,0,0,1,2.084-2.086,2.086,2.086,0,0,1,2.087,2.086,2.086,2.086,0,0,1-2.087,2.086A2.085,2.085,0,0,1,2423.092-531.256Z"
                        transform="translate(-2423.092 533.342)"
                      />
                    </g>
                    <g
                      id="Group_5126"
                      data-name="Group 5126"
                      transform="translate(0 0)"
                    >
                      <path
                        id="Path_2608"
                        data-name="Path 2608"
                        d="M2365.422-526.4a24.5,24.5,0,0,1-24.47-24.468,24.5,24.5,0,0,1,24.47-24.469,24.5,24.5,0,0,1,24.467,24.469A24.5,24.5,0,0,1,2365.422-526.4Zm0-47.228a22.786,22.786,0,0,0-22.761,22.76,22.786,22.786,0,0,0,22.761,22.759,22.785,22.785,0,0,0,22.759-22.759A22.785,22.785,0,0,0,2365.422-573.632Z"
                        transform="translate(-2340.952 575.341)"
                      />
                    </g>
                    <g
                      id="Group_5127"
                      data-name="Group 5127"
                      transform="translate(11.423 30.061)"
                    >
                      <path
                        id="Path_2609"
                        data-name="Path 2609"
                        d="M2394.6-498.866h-24.381a.854.854,0,0,1-.854-.854.854.854,0,0,1,.854-.854H2394.6a.855.855,0,0,1,.854.854A.855.855,0,0,1,2394.6-498.866Z"
                        transform="translate(-2369.365 500.575)"
                      />
                    </g>
                  </svg>
                  <span class="checkmark-experience__title">Tạm ổn</span>
                </span>
              </label>
              <label
                class="custom-checkbox"
                @click="() => setReport('Hài lòng')"
              >
                <span class="checkmark-experience">
                  <svg
                    class="checkmark-experience__icon"
                    :fill="rate === 'Hài lòng' ? '#004377' : '#cacbd2'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="48.937"
                    height="48.937"
                    viewBox="0 0 48.937 48.937"
                  >
                    <g
                      id="Group_5129"
                      data-name="Group 5129"
                      transform="translate(0 0)"
                    >
                      <path
                        id="Path_2610"
                        data-name="Path 2610"
                        d="M2545.611-535.505a24.3,24.3,0,0,1-17.165-7.036,24.306,24.306,0,0,1-7.3-17.247,24.31,24.31,0,0,1,7.035-17.355,24.31,24.31,0,0,1,17.247-7.3h.191a24.3,24.3,0,0,1,17.164,7.037,24.307,24.307,0,0,1,7.3,17.247,24.305,24.305,0,0,1-7.036,17.355,24.308,24.308,0,0,1-17.247,7.3Zm.011-47.228h-.178a22.609,22.609,0,0,0-16.042,6.788,22.607,22.607,0,0,0-6.544,16.144,22.606,22.606,0,0,0,6.788,16.042,22.608,22.608,0,0,0,15.966,6.545h.176A22.611,22.611,0,0,0,2561.831-544a22.614,22.614,0,0,0,6.544-16.144,22.612,22.612,0,0,0-6.788-16.042A22.606,22.606,0,0,0,2545.622-582.733Z"
                        transform="translate(-2521.149 584.442)"
                      />
                    </g>
                    <g
                      id="Group_5130"
                      data-name="Group 5130"
                      transform="translate(10.948 27.47)"
                    >
                      <path
                        id="Path_2611"
                        data-name="Path 2611"
                        d="M2561.9-504.974a14.082,14.082,0,0,1-13.476-9.84.858.858,0,0,1,.122-.762.854.854,0,0,1,.685-.353l25.392-.192a.879.879,0,0,1,.691.343.855.855,0,0,1,.133.759,14.081,14.081,0,0,1-13.436,10.044Zm-11.439-9.255a12.366,12.366,0,0,0,11.537,7.546,12.376,12.376,0,0,0,11.42-7.719Z"
                        transform="translate(-2548.379 516.12)"
                      />
                    </g>
                    <g
                      id="Group_5131"
                      data-name="Group 5131"
                      transform="translate(10.446 17.043)"
                    >
                      <path
                        id="Path_2612"
                        data-name="Path 2612"
                        d="M2548.235-535.012a1.067,1.067,0,0,1-.936-.552,1.067,1.067,0,0,1,.42-1.451l2.781-1.534-2.805-1.492a1.07,1.07,0,0,1-.441-1.445,1.07,1.07,0,0,1,1.445-.441l4.545,2.418a1.066,1.066,0,0,1,.565.935,1.066,1.066,0,0,1-.551.943l-4.508,2.487A1.062,1.062,0,0,1,2548.235-535.012Z"
                        transform="translate(-2547.129 542.053)"
                      />
                    </g>
                    <g
                      id="Group_5132"
                      data-name="Group 5132"
                      transform="translate(31.749 16.848)"
                    >
                      <path
                        id="Path_2613"
                        data-name="Path 2613"
                        d="M2605.727-535.5a1.068,1.068,0,0,1-.5-.125l-4.545-2.419a1.07,1.07,0,0,1-.567-.935,1.069,1.069,0,0,1,.553-.943l4.508-2.487a1.069,1.069,0,0,1,1.451.419,1.069,1.069,0,0,1-.42,1.451L2603.424-539l2.8,1.492a1.066,1.066,0,0,1,.441,1.445A1.067,1.067,0,0,1,2605.727-535.5Z"
                        transform="translate(-2600.113 542.539)"
                      />
                    </g>
                  </svg>
                  <span class="checkmark-experience__title">Hài lòng</span>
                </span>
              </label>
              <label
                class="custom-checkbox"
                @click="() => setReport('Tuyệt vời')"
              >
                <span class="checkmark-experience">
                  <svg
                    class="checkmark-experience__icon"
                    :fill="rate === 'Tuyệt vời' ? '#004377' : '#cacbd2'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="51.841"
                    height="48.937"
                    viewBox="0 0 51.841 48.937"
                  >
                    <g
                      id="Group_5134"
                      data-name="Group 5134"
                      transform="translate(2.904 0)"
                    >
                      <path
                        id="Path_2614"
                        data-name="Path 2614"
                        d="M2709.354-527.332a24.547,24.547,0,0,1-19.889-10.213.855.855,0,0,1,.2-1.193.855.855,0,0,1,1.192.2,22.831,22.831,0,0,0,18.5,9.5,22.785,22.785,0,0,0,22.758-22.76,22.785,22.785,0,0,0-22.758-22.76,22.785,22.785,0,0,0-22.76,22.76c0,.672.031,1.351.088,2.018a.854.854,0,0,1-.776.926.853.853,0,0,1-.926-.776c-.063-.717-.094-1.446-.094-2.167a24.5,24.5,0,0,1,24.469-24.468,24.5,24.5,0,0,1,24.468,24.468A24.5,24.5,0,0,1,2709.354-527.332Z"
                        transform="translate(-2684.886 576.269)"
                      />
                    </g>
                    <g
                      id="Group_5135"
                      data-name="Group 5135"
                      transform="translate(13.171 17.707)"
                    >
                      <path
                        id="Path_2615"
                        data-name="Path 2615"
                        d="M2711.425-528.753a.994.994,0,0,1-.5-.135,1.006,1.006,0,0,1-.367-1.374,3.951,3.951,0,0,1,3.409-1.966,3.936,3.936,0,0,1,3.264,1.735,1.006,1.006,0,0,1-.271,1.4,1,1,0,0,1-1.4-.27,1.926,1.926,0,0,0-1.6-.85,1.935,1.935,0,0,0-1.669.963A1,1,0,0,1,2711.425-528.753Z"
                        transform="translate(-2710.42 532.228)"
                      />
                    </g>
                    <g
                      id="Group_5136"
                      data-name="Group 5136"
                      transform="translate(34.594 17.707)"
                    >
                      <path
                        id="Path_2616"
                        data-name="Path 2616"
                        d="M2769.679-528.753a1.006,1.006,0,0,1-.871-.5,1.934,1.934,0,0,0-1.668-.963,1.926,1.926,0,0,0-1.6.85,1.006,1.006,0,0,1-1.4.27,1,1,0,0,1-.271-1.4,3.938,3.938,0,0,1,3.265-1.735,3.951,3.951,0,0,1,3.408,1.966,1.006,1.006,0,0,1-.366,1.374A1,1,0,0,1,2769.679-528.753Z"
                        transform="translate(-2763.703 532.228)"
                      />
                    </g>
                    <g
                      id="Group_5137"
                      data-name="Group 5137"
                      transform="translate(23.248 24.491)"
                    >
                      <path
                        id="Path_2617"
                        data-name="Path 2617"
                        d="M2739.689-500.826a4.212,4.212,0,0,1-4.208-4.207,4.186,4.186,0,0,1,1.218-2.962l.1-.1c-.033-.031-.066-.064-.1-.1a4.181,4.181,0,0,1-1.219-2.961,4.212,4.212,0,0,1,4.208-4.207,4.188,4.188,0,0,1,2.4.75.854.854,0,0,1,.214,1.189.854.854,0,0,1-1.189.215,2.478,2.478,0,0,0-1.423-.445,2.5,2.5,0,0,0-2.5,2.5,2.482,2.482,0,0,0,.725,1.759,2.473,2.473,0,0,0,.7.5.849.849,0,0,1,.469.439.856.856,0,0,1-.168.961.853.853,0,0,1-.3.2,2.472,2.472,0,0,0-.706.5,2.481,2.481,0,0,0-.725,1.759,2.5,2.5,0,0,0,2.5,2.5,2.481,2.481,0,0,0,1.423-.445.854.854,0,0,1,1.189.214.855.855,0,0,1-.214,1.189A4.189,4.189,0,0,1,2739.689-500.826Z"
                        transform="translate(-2735.482 515.356)"
                      />
                    </g>
                    <g
                      id="Group_5138"
                      data-name="Group 5138"
                      transform="translate(0 25.615)"
                    >
                      <path
                        id="Path_2618"
                        data-name="Path 2618"
                        d="M2685.939-499.155a.856.856,0,0,1-.542-.194c-1.161-.952-2.369-1.972-3.693-3.117-.235-.2-.488-.409-.748-.62-1.572-1.278-3.528-2.868-3.272-5.35a4.647,4.647,0,0,1,2.414-3.587,4.563,4.563,0,0,1,3.5-.335,4.561,4.561,0,0,1,2.333,1.639,4.557,4.557,0,0,1,2.333-1.639,4.562,4.562,0,0,1,3.5.336h0a4.613,4.613,0,0,1,2.436,3.865,4.95,4.95,0,0,1-2.091,3.969c-.81.739-1.64,1.457-2.354,2.071-1.1.946-2.2,1.877-3.268,2.766A.853.853,0,0,1,2685.939-499.155Zm-3.69-11.7a2.865,2.865,0,0,0-1.349.339,2.915,2.915,0,0,0-1.516,2.253c-.162,1.563,1.267,2.724,2.649,3.848.274.222.541.439.788.654,1.106.957,2.131,1.825,3.114,2.639.889-.744,1.8-1.513,2.7-2.294.706-.606,1.523-1.314,2.317-2.038.987-.9,1.582-1.526,1.536-2.634a2.9,2.9,0,0,0-1.529-2.428h0a2.867,2.867,0,0,0-2.2-.211,2.86,2.86,0,0,0-1.7,1.4,2.082,2.082,0,0,0-.278,1.063.854.854,0,0,1-.853.814h0a.855.855,0,0,1-.854-.813,2.1,2.1,0,0,0-.277-1.064,2.867,2.867,0,0,0-1.7-1.4A2.9,2.9,0,0,0,2682.249-510.851Z"
                        transform="translate(-2677.661 512.561)"
                      />
                    </g>
                  </svg>
                  <span class="checkmark-experience__title">Tuyệt vời</span>
                </span>
              </label>
            </div>
            <textarea
              class="form-control experience-form__textarea"
              name="danh-gia"
              placeholder="Góp ý của bạn"
              v-model="note"
            ></textarea>
            <button
              class="btn btn-primary experience-form__btn btn-disabled-C0"
              :disabled="isDisable"
              @click.prevent="addReport"
            >
              Gửi đánh giá
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- THANK MODAL -->
  <div class="modal fade modal--2 thank-modal" id="thankModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body py-25">
          <div class="thank-box">
            <img
              class="thank-box__icon"
              :src="`${baseUrl}/1111111111111111111/images/cuoi-deu.svg`"
              alt=""
            />
            <p class="thank-box__title">POLOMAN CẢM ƠN!</p>
            <p class="thank-box__sub">
              Đánh giá của bạn sẽ giúp chúng tôi <br />cải thiện trang web tốt
              hơn.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- LOADING MODAL -->
  <Loading :isLoading="isLoading"></Loading>
</template>

<style></style>
