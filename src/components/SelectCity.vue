<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  ref,
} from "@vue/runtime-core";
import axios from "../service/axios";
import { baseUrl } from "../constant";

export default defineComponent({
  emits: ["onSelect"],
  setup(props, { emit }) {
    const provinceList = ref([]);
    const searchString = ref("");

    onBeforeMount(() => {
      getProvince();
    });

    // computed
    const provinceSearchList = computed(() => {
      if (!provinceList.value || provinceList.value.length == 0) {
        return [];
      }

      if (!searchString.value) {
        return provinceList.value;
      }

      return provinceList.value.filter((x) =>
        x.name.includes(searchString.value)
      );
    });

    // methods
    const getProvince = async () => {
      try {
        const { data } = await axios.post(`${baseUrl}/country/api/v1/province`);

        provinceList.value = data;
      } catch (err) {
        console.log(err);
      }
    };

    const onSelectClick = (province) => {
      emit("onSelect", province)
    };

    return {
      searchString,
      provinceSearchList,
      baseUrl,
      onSelectClick,
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
                v-for="(province, index) in provinceSearchList"
                :key="index"
                @click="() => onSelectClick(province)"
              >
                {{ province.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
