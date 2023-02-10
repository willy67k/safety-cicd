import axios, { CancelToken } from "axios";
import { FormUser, Order } from "../type/form";

class API {
  $axios;
  constructor() {
    this.$axios = axios.create({
      withCredentials: true,
    });
  }

  async login(data: FormUser, cancelToken: CancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, { data, cancelToken });
  }

  async logout(cancelToken: CancelToken) {
    return await this.$axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, { cancelToken });
  }

  async getSafeties(cancelToken: CancelToken) {
    return await this.$axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/safety-grouping-items`, { cancelToken });
  }

  async addGroup(cancelToken: CancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-group`, { cancelToken });
  }

  async setGroup(id: number, data: { name: string }, cancelToken: CancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-group/${id}`, { data, cancelToken });
  }

  async setGroupOrder(data: Order[], cancelToken: CancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-group-order`, { data, cancelToken });
  }

  async removeGroup(id: number, cancelToken: CancelToken) {
    return await this.$axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/safety-group/${id}`, { cancelToken });
  }

  async addItem(data: { id_group: number; name: string; password: string }, cancelToken: CancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-item`, { data, cancelToken });
  }

  async setItem(id: number, data: { name: string; password: string }, cancelToken: CancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-item/${id}`, { data, cancelToken });
  }

  async setItemOrder(id: number, data: Order[], cancelToken: CancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-item-order/${id}`, { data, cancelToken });
  }

  async removeItem(id: number, cancelToken: CancelToken) {
    return await this.$axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/safety-item/${id}`, { cancelToken });
  }
}

const Api = new API();

export default Api;
