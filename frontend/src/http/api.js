import axios from "axios";
import config from "../config/config";

const api = axios.create({
	baseURL: config.backendUrl,
	headers: {
		"Content-Type": "application/json",
	},
});

export const login = async (data) => {
	return api.post("/users/login", data);
};
export const register = async (data) => {
	return api.post("/users/register", data);
};
