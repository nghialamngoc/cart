<script>
import { computed, defineComponent, ref, watch } from "@vue/runtime-core";
import { baseUrl } from "../../constant";
import axios from "../../service/axios";;

export default defineComponent({
  props: ["province_id"],
  emits: ["onSelect", "goBack"],
  setup(props, { emit }) {
    const districtList = ref([]);
    const searchString = ref("");

    watch(
      () => props.province_id,
      () => {
        getDistrict();
      }
    );

    // computed
    const districtSearchList = computed(() => {
      if (!districtList.value || districtList.value.length == 0) {
        return [];
      }

      if (!searchString.value) {
        return districtList.value;
      }

      return districtList.value.filter((x) =>
        x.name.includes(searchString.value)
      );
    });

    // methods
    const getDistrict = async () => {
      try {
        const { data } = await axios.post(
          `${baseUrl}/country/api/v1/district`,
          {
            id: props.province_id,
          }
        );

        districtList.value = data.data;
      } catch (err) {
        console.log(err);
      }
    };

    const onSelectClick = (district) => {
      emit("onSelect", district);
    };

    const onGoBack = () => {
      emit("goBack");
    };

    return {
      districtSearchList,
      searchString,
      baseUrl,
      onSelectClick,
      onGoBack,
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
            <i class="fas fa-chevron-left" @click="onGoBack"></i>
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
              v-model="searchString"
            />
            <button type="button" class="btn search-form__btn">
              <img
                :src="`${baseUrl}/1111111111111111111/images/search-37.svg`"
                alt=""
              />
            </button>
          </div>
          <div class="flex-grow-1 overflow-y-auto">
            <ul class="location-nav">
              <li
                v-for="(district, index) in districtSearchList"
                :key="index"
                @click="() => onSelectClick(district)"
              >
                {{ district.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
