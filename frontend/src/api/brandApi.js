import axiosClient from "./axiosClient";

const brandApi = {
  getAll: () => axiosClient.get("/brands"),
  get: (id) => axiosClient.get(`/brands/${id}`),
  add: (data) => axiosClient.post("/brands", data),
  update: (id, data) => axiosClient.put(`/brands/${id}`, data),
  delete: (id) => axiosClient.delete(`/brands/${id}`),
};

export default brandApi;
