import axios from "axios";

const API_URL = "http://localhost:3000/tents";

export const getTents = async (params) => axios.get(API_URL, { params });
export const getTentById = async (id) => axios.get(`${API_URL}/${id}`);
export const markFavorite = async (id) => axios.post(`${API_URL}/favorites/${id}`);
export const getFavorites = async () => axios.get(`${API_URL}/favorites`);
export const addTent = async (data) => axios.post(API_URL, data);