export const create = () => {
  document.querySelectorAll(".swiper-init").forEach((swiper) => {
    const swiperContainer = swiper.querySelector(".swiper-container");
    const swiperPrev = swiper.querySelector(".swiper-button-prev");
    const swiperNext = swiper.querySelector(".swiper-button-next");
    const swiperPagination = swiper.querySelector(".swiper-pagination");
    const loop = swiper.dataset.loop !== "false";
    new Swiper(swiperContainer, {
      speed: 600,
      autoHeight: false,
      slidesPerView: "auto",
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      loop: loop,
      pagination: {
        el: swiperPagination,
        clickable: true,
      },
      navigation: {
        nextEl: swiperNext,
        prevEl: swiperPrev,
      },
    });
  });

  document.querySelectorAll(".swiper-vertical").forEach((swiper) => {
    const swiperContainer = swiper.querySelector(".swiper-container");

    new Swiper(swiperContainer, {
      speed: 600,
      slidesPerView: 1,
      spaceBetween: 12,
      direction: "vertical",
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      //loop: false,
    });
  });

  const comboSlider = document.getElementById("combo-slider");
  if (comboSlider) {
    const swiperContainer = comboSlider.querySelector(".swiper-container");
    if (swiperContainer.querySelectorAll(".swiper-slide").length > 3) {
      new Swiper(swiperContainer, {
        speed: 600,
        slidesPerView: 3,
        spaceBetween: 12,
        direction: "vertical",
        watchOverflow: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
        // loop: false,
      });
    }
  }
};

export const createSwipper = (el) => {
  const swiperContainer = el.querySelector(".swiper-container");

  const swiper = new Swiper(swiperContainer, {
    speed: 600,
    slidesPerView: 1,
    spaceBetween: 12,
    direction: "vertical",
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    loop: false,
  });

  return swiper;
};

export const createSwipper2 = (el) => {
  const swiperContainer = el.querySelector(".swiper-container");
  const swiperPrev = el.querySelector(".swiper-button-prev");
  const swiperNext = el.querySelector(".swiper-button-next");
  const swiperPagination = el.querySelector(".swiper-pagination");
  const swiperConfig = {
    speed: 800,
    autoHeight: true,
    slidesPerView: "auto",
    spaceBetween: 4,
    direction: "vertical",
    watchOverflow: true,
    observer: true,
    resizeObserver: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: false,
    pagination: {
      el: swiperPagination,
      clickable: true,
    },
    navigation: {
      nextEl: swiperNext,
      prevEl: swiperPrev,
    },
  };
  const swiper = new Swiper(swiperContainer, swiperConfig);

  return swiper;
};

export const createSwipper3 = (el) => {
  const swiperContainer = el.querySelector(".swiper-container");
  const swiperPrev = el.querySelector(".swiper-button-prev");
  const swiperNext = el.querySelector(".swiper-button-next");
  const swiperPagination = el.querySelector(".swiper-pagination");
  const loop = el.dataset.loop !== "false";
  const swipper = new Swiper(swiperContainer, {
    speed: 800,
    autoHeight: false,
    slidesPerView: "auto",
    observer: true,
    resizeObserver: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: loop,
    pagination: {
      el: swiperPagination,
      clickable: true,
    },
    navigation: {
      nextEl: swiperNext,
      prevEl: swiperPrev,
    },
  });

  return swipper;
};
