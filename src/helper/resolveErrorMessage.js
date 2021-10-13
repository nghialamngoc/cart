export const resolveErrorMessage = (
  response,
  message = "Đã xảy ra lỗi, vui lòng kiểm tra lại"
) => {
  return response && response.data && response.data.message
    ? response.data.message
    : message;
};
