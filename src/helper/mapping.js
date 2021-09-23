export const mappingStatus = (status) => {
  let result = "";
  switch (status) {
    case 1:
      result = "Mới";
      break;
    case 2:
      result = "Đã xác nhận";
      break;
    case 3:
      result = "Chờ hàng";
      break;
    case 5:
      result = "Delay lấy hàng";
      break;
    case 6:
      result = "Đã gửi hàng";
      break;
    case 7:
      result = "Đang giao hàng";
      break;
    case 8:
      result = "Delay giao hàng";
      break;
    case 8:
      result = "Chờ lấy hàng";
      break;
    case 9:
      result = "Giao thành công";
    case 10:
      result = "Giao 1 phần";
    case 11:
      result = "Đang hoàn";
    case 12:
      result = "Đã nhận hoàn";
    case 13:
      result = "Đã đối soát";
    case 19:
      result = "Đã huỷ";
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
