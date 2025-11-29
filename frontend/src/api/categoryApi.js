import axiosClient from "./axiosClient";

const categoryApi = {
  getAll: () => axiosClient.get("/categories"),
  get: (id) => axiosClient.get(`/categories/${id}`),
  add: (data) => axiosClient.post("/categories", data),
  update: (id, data) => axiosClient.put(`/categories/${id}`, data),
  delete: (id) => axiosClient.delete(`/categories/${id}`),
};

export default categoryApi;
