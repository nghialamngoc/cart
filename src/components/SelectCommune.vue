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
  <!-- WARD MODAL -->
  <div
    class="modal fade modal-bottom location-modal"
    id="wardModal"
    tabindex="-1"
    aria-labelledby="locationModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title">
            <i class="fas fa-chevron-left"></i>
            CHỌN PHƯỜNG / XÃ
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
              placeholder="Tìm kiếm Phường/ Xã"
            />
            <button type="button" class="btn search-form__btn">
              <img :src="`${baseUrl}/1111111111111111111/images/search-37.svg`" alt="" />
            </button>
          </div>
          <div class="flex-grow-1 overflow-y-auto">
            <ul class="location-nav">
              <li data-location="Phường 1">Phường 1</li>
              <li data-location="Phường 2">Phường 2</li>
              <li data-location="Phường 3">Phường 3</li>
              <li data-location="Phường 4">Phường 4</li>
              <li data-location="Phường 5">Phường 5</li>
              <li data-location="Phường 6">Phường 6</li>
              <li data-location="Phường 7">Phường 7</li>
              <li data-location="Phường 8">Phường 8</li>
              <li data-location="Phường 9">Phường 9</li>
              <li data-location="Phường 10">Phường 10</li>
              <li data-location="Phường 11">Phường 11</li>
              <li data-location="Phường 12">Phường 12</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
