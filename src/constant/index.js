export const baseUrl = !window.location.origin.includes("localhost")
  ? window.location.origin
  : "https://quang.tvtsolutions.com";

export const cancelReason = [
  {
    label: "Tôi muốn đặt lại đơn hàng khác",
    value: "reason-1"
  },
  {
    label: "Tôi muốn mua sản phẩm khác",
    value: "reason-2"
  },
  {
    label: "Tôi muốn đặt lại đơn hàng để hưởng ưu đãi",
    value: "reason-3"
  },
  {
    label: "Phí ship quá cao",
    value: "reason-4"
  },
  {
    label: "Tôi bị nhầm thông tin đơn hàng",
    value: "reason-5"
  },
  {
    label: "Tôi chưa ưng ý với sản phẩm này",
    value: "reason-6"
  },
]