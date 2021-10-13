import format from "date-fns/format";

export const date = (date, dateFormat = "MMM dd") => {
  try {
    if (typeof date === "string") {
      date = new Date(date)
    }
    return format(date, dateFormat);
  } catch (err) {
    return date;
  }
};

export const money = (value) => {
  try {
    return `${Intl.NumberFormat("vi-VN").format(value)}đ`;
  } catch(err) {
    return value
  }
};
