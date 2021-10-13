import * as baseAxios from "axios";

const axios = baseAxios.create();

axios.interceptors.response.use(async (response) => {
  const { data } = response;

  return data;
});

export default axios;
