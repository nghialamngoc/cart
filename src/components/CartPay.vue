<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
  ref,
} from "@vue/runtime-core";
import axios from "axios";
import { resolveErrorMessage } from "../helper/resolveErrorMessage";
import ErrorDialog from "./ErrorDialog.vue";
import Loading from "./Loading.vue";
import CartTotalSumary from "./CartTotalSumary.vue";
import SelectCity from "./SelectCity.vue";
import SelectDistrict from "./SelectDistrict.vue";
import SelectCommune from "./SelectCommune.vue";
import CartHeader from "./CartHeader.vue";

export default defineComponent({
  components: {
    ErrorDialog,
    Loading,
    CartTotalSumary,
    SelectCity,
    SelectDistrict,
    SelectCommune,
    CartHeader,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <CartHeader />
  <main class="main">
    <div class="section py-30">
      <div class="container-fluid">
        <section class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-1.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h2 class="checkout__head__title">THÔNG TIN NHẬN HÀNG</h2>
          </div>
          <div class="checkout__body checkout__body--outside pt-2">
            <div id="buyer-info">
              <div class="checkout__body__signed">
                <div class="checkout__body__head">
                  <div class="checkout__body__head__left">
                    <p class="checkout__body__title d-flex align-items-center">
                      Nguyễn Văn Nam
                      <span class="badge badge-blue-custom badge-sm ms-10"
                        >Mặc định</span
                      >
                    </p>
                  </div>
                  <div class="checkout__body__head__right">
                    <button class="btn btn-fit buyer-info__head__btn">
                      <img
                        :src="`${baseUrl}/1111111111111111111/images/edit-37.svg`"
                        alt=""
                        width="18"
                      />
                    </button>
                  </div>
                </div>
                <div class="text-63 ls-20">
                  <p class="mb-1">0357 787 431</p>
                  <p class="mb-0">
                    Số 9 đường số 12, Phường 11, Quận Gò Vấp Thành phố Hồ Chí
                    Minh
                  </p>
                </div>
              </div>
            </div>
            <form action="" id="buyer-info-edit" class="d-none">
              <div class="mb-3">
                <label class="fw-medium">Họ và tên</label>
                <input
                  type="text"
                  name="ho-tem"
                  data-rules="required"
                  class="form-control form-control--underline"
                  placeholder="VD: Văn Nam"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-3">
                <label class="fw-medium">Số điện thoại</label>
                <input
                  type="tel"
                  name="so-tien-thoai"
                  data-rules="tel|required"
                  class="form-control form-control--underline"
                  placeholder="VD: 0905 555 000"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-3">
                <label class="fw-medium">Địa chỉ (gồm số nhà, tên đường)</label>
                <input
                  type="tel"
                  name="dia-chi"
                  data-rules="required"
                  class="
                    form-control
                    form-control--underline
                    form-control--icon
                    form-control--icon-location
                  "
                  placeholder="VD: 20 Hai Bà Trưng"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-3">
                <label class="fw-medium">Tỉnh / thành phố</label>
                <input
                  type="text"
                  name="tinh-thanh-pho"
                  data-rules="required"
                  class="
                    form-control
                    form-control--underline
                    form-control--icon
                    form-control--icon-dropdown
                  "
                  placeholder="VD : Hồ Chí Minh"
                  id="cityInput"
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-3">
                <label class="fw-medium">Quận / huyện</label>
                <input
                  type="text"
                  name="quan-huyen"
                  data-rules="required"
                  class="
                    form-control
                    form-control--underline
                    form-control--icon
                    form-control--icon-dropdown
                  "
                  placeholder="VD: quận Gò Vấp"
                  id="districtInput"
                  disabled
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-3">
                <label class="fw-medium">Phường / xã</label>
                <input
                  type="text"
                  name="phuong-xa"
                  data-rules="required"
                  class="
                    form-control
                    form-control--underline
                    form-control--icon
                    form-control--icon-dropdown
                  "
                  placeholder="VD: phường 11"
                  id="wardInput"
                  disabled
                />
                <div class="invalid-feedback"></div>
              </div>
              <div class="mb-0">
                <button
                  type="submit"
                  class="btn btn-outline-37-white fz-14 fw-semi w-100 py-2 ls-0"
                >
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
    <div class="separate-line separate-line--gradient"></div>
    <div class="section pt-30 pb-35">
      <div class="container-fluid">
        <section class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-2.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h2 class="checkout__head__title">PHƯƠNG THỨC GIAO HÀNG</h2>
          </div>
          <div class="checkout__body checkout__body--outside">
            <label class="box-picker">
              <input
                type="radio"
                class="box-picker__input"
                name="vanchuyen"
                value="vanchuyen-1"
                checked
              />
              <div class="box-picker__checkmark">
                <div class="row gx-2 align-items-center">
                  <div class="col-10">
                    <div class="row gx-10 align-items-center">
                      <div class="col-1">
                        <div class="box-picker__checkmark__icon"></div>
                      </div>
                      <div class="col-11">
                        <p class="box-picker__checkmark__title">
                          Giao hàng tiêu chuẩn
                        </p>
                      </div>
                    </div>
                    <div class="row gx-10">
                      <div class="col-11 offset-1">
                        <div class="box-picker__checkmark__desc">
                          <div class="row row-cols-2 gx-2">
                            <div class="col">
                              <p class="mb-0">Thời gian dự kiến</p>
                              <p class="mb-0 fw-bold">23/07 - 26/07</p>
                            </div>
                            <div class="col">
                              <p class="mb-0">Phí ship</p>
                              <p class="mb-0 fw-bold">30.000</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </label>
            <label class="box-picker">
              <input
                type="radio"
                class="box-picker__input"
                name="vanchuyen"
                value="vanchuyen-2"
              />
              <div class="box-picker__checkmark">
                <div class="row gx-2 align-items-center">
                  <div class="col-10">
                    <div class="row gx-10 align-items-center">
                      <div class="col-1">
                        <div class="box-picker__checkmark__icon"></div>
                      </div>
                      <div class="col-11">
                        <p class="box-picker__checkmark__title">
                          Giao nhanh 2h
                        </p>
                      </div>
                    </div>
                    <div class="row gx-10">
                      <div class="col-11 offset-1">
                        <p class="box-picker__checkmark__desc">
                          Giao hàng 24/7 kể cả ngày lễ. Vui lòng kiếm tra tình
                          trạng sp trước khi thanh toán.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="col-2 text-end">
                    <span class="btn box-picker__checkmark__toggle"></span>
                  </div>
                </div>
                <div class="select-transport-unit">
                  <label class="box-picker box-picker--2">
                    <input
                      type="radio"
                      class="box-picker__input"
                      name="donvi-vanchuyen"
                      value="donvi-vanchuyen-1"
                      checked
                    />
                    <div class="box-picker__checkmark">
                      <div class="row gx-2 align-items-center">
                        <div class="col-7">
                          <div class="unit-item">
                            <div class="unit-item__logo">
                              <img
                                :src="`${baseUrl}/1111111111111111111/images/grab.png`"
                                alt=""
                              />
                            </div>
                            <div class="unit-item__info">
                              <p class="unit-item__title">Grab</p>
                              <p class="unit-item__desc">
                                Phí ship: <span class="fw-semi">25.000</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="distance">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/distance.svg`"
                              alt=""
                            />
                            20km
                          </div>
                        </div>
                        <div class="col-1 text-end">
                          <div class="box-picker__checkmark__check">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/check-green.svg`"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                  <label class="box-picker box-picker--2">
                    <input
                      type="radio"
                      class="box-picker__input"
                      name="donvi-vanchuyen"
                      value="donvi-vanchuyen-2"
                    />
                    <div class="box-picker__checkmark">
                      <div class="row gx-2 align-items-center">
                        <div class="col-7">
                          <div class="unit-item">
                            <div class="unit-item__logo">
                              <img
                                :src="`${baseUrl}/1111111111111111111/images/ahamove.png`"
                                alt=""
                              />
                            </div>
                            <div class="unit-item__info">
                              <p class="unit-item__title">Grab</p>
                              <p class="unit-item__desc">
                                Phí ship: <span class="fw-semi">25.000</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="distance">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/distance.svg`"
                              alt=""
                            />
                            20km
                          </div>
                        </div>
                        <div class="col-1 text-end">
                          <div class="box-picker__checkmark__check">
                            <img
                              :src="`${baseUrl}/1111111111111111111/images/check-green.svg`"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </label>
          </div>
        </section>
      </div>
    </div>
    <div class="separate-line"></div>
    <div class="section py-30">
      <div class="container-fluid">
        <section class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-3.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h2 class="checkout__head__title">PHƯƠNG THỨC THANH TOÁN</h2>
          </div>
          <div class="checkout__body checkout__body--outside pt-2">
            <div class="box-picker-wrap">
              <label class="box-picker">
                <input
                  type="radio"
                  class="box-picker__input"
                  name="thanhtoan"
                  value="thanhtoan-1"
                  checked
                />
                <div class="box-picker__checkmark">
                  <div class="row gx-2 align-items-center">
                    <div class="col-1">
                      <div class="box-picker__checkmark__icon"></div>
                    </div>
                    <div class="col-10">
                      <div class="unit-item unit-item--lg">
                        <div class="unit-item__logo">
                          <img
                            :src="`${baseUrl}/1111111111111111111/images/money.svg`"
                            alt=""
                          />
                        </div>
                        <div class="unit-item__info">
                          <p class="unit-item__title">Tiền mặt</p>
                          <p class="unit-item__desc">
                            Thanh toán khi nhận hàng
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="col-1 text-end">
                      <div class="box-picker__checkmark__check">
                        <img
                          :src="`${baseUrl}/1111111111111111111/images/check-green.svg`"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="box-picker">
                <input
                  type="radio"
                  class="box-picker__input"
                  name="thanhtoan"
                  value="thanhtoan-2"
                />
                <div class="box-picker__checkmark">
                  <div class="row gx-2 align-items-center">
                    <div class="col-1">
                      <div class="box-picker__checkmark__icon"></div>
                    </div>
                    <div class="col-10">
                      <div class="unit-item unit-item--lg">
                        <div class="unit-item__logo">
                          <img
                            :src="`${baseUrl}/1111111111111111111/images/momo.png`"
                            alt=""
                          />
                        </div>
                        <div class="unit-item__info">
                          <p class="unit-item__title">Thanh toán MOMO</p>
                          <p class="unit-item__desc">Quét mã để thanh toán</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-1 text-end">
                      <div class="box-picker__checkmark__check">
                        <img
                          :src="`${baseUrl}/1111111111111111111/images/check-green.svg`"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="box-picker">
                <input
                  type="radio"
                  class="box-picker__input"
                  name="thanhtoan"
                  value="thanhtoan-2"
                />
                <div class="box-picker__checkmark">
                  <div class="row gx-2 align-items-center">
                    <div class="col-1">
                      <div class="box-picker__checkmark__icon"></div>
                    </div>
                    <div class="col-10">
                      <div class="unit-item unit-item--lg">
                        <div class="unit-item__logo">
                          <img
                            :src="`${baseUrl}/1111111111111111111/images/vnpay.png`"
                            alt=""
                          />
                        </div>
                        <div class="unit-item__info">
                          <p class="unit-item__title">Thanh toán VNPAY</p>
                          <p class="unit-item__desc">Qua ứng dụng VNPAY</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-1 text-end">
                      <div class="box-picker__checkmark__check">
                        <img
                          :src="`${baseUrl}/1111111111111111111/images/check-green.svg`"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
            <div class="ls-20 mt-3">
              <strong class="fw-600">Tiền mặt:</strong> Bạn sẽ thanh toán bằng
              tiền mặt cho nhân viên giao hàng khi thanh toán. Vui lòng kiểm tra
              tình trạng sản phẩm và hóa đơn khi thanh toán.
            </div>
          </div>
        </section>
      </div>
    </div>
    <div class="separate-line"></div>
    <div class="section pt-30 pb-35">
      <div class="container-fluid">
        <section class="checkout">
          <div class="checkout__icon">
            <img
              :src="`${baseUrl}/1111111111111111111/images/checkout-4.svg`"
              alt=""
            />
          </div>
          <div class="checkout__head">
            <h2 class="checkout__head__title checkout__head__title--2">
              DỊCH VỤ KÈM THEO
            </h2>
          </div>
          <div class="checkout__body checkout__body--outside">
            <p class="checkout__body__title checkout__body__title--2">
              Gói quà - kèm theo lời chúc
            </p>
            <textarea
              class="checkout__body__textarea form-control"
              placeholder="Lời nhắn của bạn"
            ></textarea>
          </div>
        </section>
      </div>
    </div>
    <div class="separate-line"></div>
    <div class="section pt-30 pb-35">
      <div class="container-fluid">
        <section class="checkout">
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
            <div class="checkout-pd">
              <div class="checkout-pd__img">
                <img
                  :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                  alt=""
                />
              </div>
              <div class="checkout-pd__info">
                <p class="checkout-pd__title">
                  Monogram Print Cotton Piqué Oversized Polo Shirt Xanh - size
                  XL <span class="fw-semi">(Premium Box)</span>
                </p>
                <p class="checkout-pd__price">
                  2 <span class="fz-10 mx-2">X</span> 500.000đ
                </p>
              </div>
            </div>
            <div class="checkout-pd">
              <div class="checkout-pd__img">
                <img
                  :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                  alt=""
                />
              </div>
              <div class="checkout-pd__info">
                <p class="checkout-pd__title">
                  Monogram Print Cotton Piqué Oversized Polo Shirt Xanh - size
                  XL <span class="fw-semi">(Premium Box)</span>
                </p>
                <p class="checkout-pd__price">
                  2 <span class="fz-10 mx-2">X</span> 500.000đ
                </p>
              </div>
            </div>
            <div class="checkout-pd">
              <div class="checkout-pd__img">
                <img
                  :src="`${baseUrl}/1111111111111111111/images/pd-1.jpg`"
                  alt=""
                />
              </div>
              <div class="checkout-pd__info">
                <p class="checkout-pd__title">
                  Monogram Print Cotton Piqué Oversized Polo Shirt Xanh - size
                  XL <span class="fw-semi">(Premium Box)</span>
                </p>
                <p class="checkout-pd__price">
                  2 <span class="fz-10 mx-2">X</span> 500.000đ
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <div class="separate-line"></div>
    <div class="section py-30">
      <div class="container-fluid">
        <div class="row row-cols-2 gx-2 mb-2 align-items-center">
          <div class="col fz-14 fw-medium">Tổng cộng</div>
          <div class="col text-end fz-16 fw-semi">1.200.000đ</div>
        </div>
        <div class="row row-cols-2 gx-2 mb-2 align-items-center">
          <div class="col fz-14 fw-medium">Phí giao hàng</div>
          <div class="col text-end fz-16 fw-semi">0đ</div>
        </div>
        <div class="row row-cols-2 gx-2 align-items-center">
          <div class="col fz-14 fw-medium">Giảm giá</div>
          <div class="col text-end fz-16 fw-semi">400.000đ</div>
        </div>
      </div>
    </div>
  </main>

  <!-- Cart Summary -->
  <CartTotalSumary />

  <!-- Select city -->
  <SelectCity />

  <!-- Select district -->
  <SelectDistrict />

  <!-- Select commune -->
  <SelectCommune />

  <ErrorDialog
    :isOpen="isError"
    :hideError="hideError"
    :message="errorMessage"
    title="Lỗi!"
  ></ErrorDialog>
  <ErrorDialog
    :isOpen="isErrorVoucher"
    :hideError="hideErrorVoucher"
    title="Lỗi!"
    message="Bạn chưa đủ điều kiện áp dụng voucher này"
  ></ErrorDialog>

  <!-- LOADING MODAL -->
  <Loading :isOpen="isLoading"></Loading>
</template>

<style></style>
