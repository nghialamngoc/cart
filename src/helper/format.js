import format from "date-fns/format";

export const date = (date, dateFormat = "MMM dd") => {
  try {
    return format(date, dateFormat)
  } catch (err) {
    return date;
  }
};
