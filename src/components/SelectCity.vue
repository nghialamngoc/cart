<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  setup() {
    const baseUrl = !window.location.origin.includes("localhost")
      ? window.location.origin
      : "https://quang.tvtsolutions.com";

    return {
      baseUrl,
    };
  },
});
</script>

<template>
  <!-- CITY MODAL -->
  <div
    class="modal fade modal-bottom location-modal"
    id="cityModal"
    tabindex="-1"
    aria-labelledby="locationModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title">
            <i class="fas fa-chevron-left"></i>
            CHỌN TỈNH / THÀNH PHỐ
          </p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body d-flex flex-column overflow-hidden">
          <div class="mb-2 search-form flex-shrink-0">
            <input
              class="form-control search-form__input"
              type="text"
              placeholder="Tìm kiếm"
            />
            <button type="button" class="btn search-form__btn">
              <img :src="`${baseUrl}/1111111111111111111/images/search-37.svg`" alt="" />
            </button>
          </div>
          <div class="flex-grow-1 overflow-y-auto">
            <ul class="location-nav">
              <li data-location="Hồ Chí Minh">Hồ Chí Minh</li>
              <li data-location="Hà Nội">Hà Nội</li>
              <li data-location="Đồng Nai">Đồng Nai</li>
              <li data-location="Đà Nẵng">Đà Nẵng</li>
              <li data-location="Bình Dương">Bình Dương</li>
              <li data-location="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</li>
              <li data-location="Hải Phòng">Hải Phòng</li>
              <li data-location="Cần Thơ">Cần Thơ</li>
              <li data-location="Khánh Hòa">Khánh Hòa</li>
              <li data-location="Lâm Đồng">Lâm Đồng</li>
              <li data-location="Kiên Giang">Kiên Giang</li>
              <li data-location="Quảng Ninh">Quảng Ninh</li>
              <li data-location="Nghệ An">Nghệ An</li>
              <li data-location="Đắk Lắk">Đắk Lắk</li>
              <li data-location="Bắc Ninh">Bắc Ninh</li>
              <li data-location="Long An">Long An</li>
              <li data-location="Bình Thuận">Bình Thuận</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
