<script>
import { computed, defineComponent, ref, watch } from "@vue/runtime-core";
import axios from "../service/axios";;
import { baseUrl } from "../constant";

export default defineComponent({
  props: ["district_id"],
  emits: ["onSelect", "goBack"],
  setup(props, { emit }) {
    const communeList = ref([]);
    const searchString = ref("");

    watch(
      () => props.district_id,
      () => {
        getCommune();
      }
    );

    // computed
    const communeSearchList = computed(() => {
      if (!communeList.value || communeList.value.length == 0) {
        return [];
      }

      if (!searchString.value) {
        return communeList.value;
      }

      return communeList.value.filter((x) => {
          return x.name.toLowerCase().includes(searchString.value.toLowerCase()) ||
          x.query.toLowerCase().includes(searchString.value.toLowerCase())
        }
      );
    });

    // methods
    const getCommune = async () => {
      if (!props.district_id) {
        return;
      }

      try {
        const { data } = await axios.post(`${baseUrl}/country/api/v1/commune`, {
          id: props.district_id,
        });

        communeList.value = data;
      } catch (err) {
        console.log(err);
      }
    };

    const onSelectClick = (commune) => {
      emit("onSelect", commune);
    };

    const onGoBack = () => {
      emit("goBack");
    };

    return {
      communeSearchList,
      searchString,
      baseUrl,
      onSelectClick,
      onGoBack,
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
            <i class="fas fa-chevron-left" @click="onGoBack"></i>
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
              <ul class="location-nav">
                <li
                  v-for="(commune, index) in communeSearchList"
                  :key="index"
                  @click="() => onSelectClick(commune)"
                >
                  {{ commune.name }}
                </li>
              </ul>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
