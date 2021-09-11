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
  <!-- DISTRICT MODAL -->
  <div
    class="modal fade modal-bottom location-modal"
    id="districtModal"
    tabindex="-1"
    aria-labelledby="locationModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title">
            <i class="fas fa-chevron-left"></i>
            CHỌN QUẬN / HUYỆN
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
              placeholder="Tìm kiếm Quận / Huyện"
            />
            <button type="button" class="btn search-form__btn">
              <img :src="`${baseUrl}/1111111111111111111/images/search-37.svg`" alt="" />
            </button>
          </div>
          <div class="flex-grow-1 overflow-y-auto">
            <ul class="location-nav">
              <li data-location="Quận 1">Quận 1</li>
              <li data-location="Quận 2">Quận 2</li>
              <li data-location="Quận 3">Quận 3</li>
              <li data-location="Quận 4">Quận 4</li>
              <li data-location="Quận 5">Quận 5</li>
              <li data-location="Quận 6">Quận 6</li>
              <li data-location="Quận 7">Quận 7</li>
              <li data-location="Quận 8">Quận 8</li>
              <li data-location="Quận 9">Quận 9</li>
              <li data-location="Quận 10">Quận 10</li>
              <li data-location="Quận 11">Quận 11</li>
              <li data-location="Quận 12">Quận 12</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
