export const mappingStatus = (status) => {
  let result = "";
  switch (status) {
    case 1:
      result = "Chờ lấy hàng";
      break;

    default:
      break;
  }

  return result;
};

export const mappingPaymentMethod = (method) => {
  let result = "";
  switch (method) {
    case 1:
      result = "Thanh toán khi nhận hàng";
      break;
    case 2:
      result = "Thanh toán qua momo";
      break;
    case 3:
      result = "Thanh toán qua VNPay";
      break;

    default:
      break;
  }

  return result;
};

export const mappingDeliveryType = (type) => {
  let result = "";
  switch (type) {
    case 1:
      result = {
        title: "Giao hàng tiêu chuẩn",
        detail: "Giao hàng vào giờ hành chính, từ thứ 2 đến thứ 7 hàng tuần.",
      };
      break;
    case 2:
      result = {
        title: "Giao hàng nhanh 2h (Grab)",
        detail: "Giao hàng 24/7 kể cả ngày lễ.",
      };
      break;
    case 3:
      result = {
        title: "Giao hàng nhanh 2h (Ahamove)",
        detail: "Giao hàng 24/7 kể cả ngày lễ.",
      };
      break;

    default:
      break;
  }

  return result;
};
