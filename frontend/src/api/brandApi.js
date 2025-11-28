import axiosClient from "./axiosClient";
const brandApi = {
  getAll: () => axiosClient.get("/brands"),
};
export default brandApi;
