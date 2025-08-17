import axios from "axios";
import { IApiResponse } from "types";
import { useAuthStore } from "@/stores/useAuthStore";

type ALLOWED_API_METHODS = "GET" | "POST" | "PATCH" | "DELETE";

// axios client with base api url
const axiosClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// add request interceptor
axiosClient.interceptors.request.use(
	(config) => {
		const accessToken = useAuthStore.getState().accessToken;

		if (accessToken) {
			console.log("[ApiService] Attaching access token to request.");

			config.headers.Authorization = `Bearer ${accessToken}`;
		} else {
			console.log("[ApiService] No access token found for request.");
		}

		return config;
	},
	(error) => {
		console.error("[ApiService] Request interceptor error:", error);
		return Promise.reject(error);
	}
);

// add response interceptor
axiosClient.interceptors.response.use(
	(response) => {
		console.log(
			"[ApiService] Received successful response:",
			response.status
		);
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			console.warn(
				"[ApiService] Received 401 Unauthorized. Attempting token refresh..."
			);

			const { refreshAuth } = useAuthStore.getState();

			try {
				const response = await refreshAuth();

				// if we successfully got tokens, else case is handled in authStore itself
				if (response?.success) {
					console.log(
						"[ApiService] Token refresh successful. Retrying original request."
					);

					const { accessToken: newAccessToken } = response.payload;

					// retry original request with new token
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

					return axiosClient(originalRequest);
				} else {
					console.warn(
						"[ApiService] Token refresh failed. Logging out user."
					);
				}
			} catch (error) {
				// handle error
				console.error(
					"[ApiService] Error during token refresh:",
					error
				);

				// logout the user
				useAuthStore.getState().clearAuth();

				return Promise.reject(error);
			}

			await useAuthStore.getState().clearAuth();
		}

		return Promise.reject(error);
	}
);

// a global method for api interactions
export const sendApiRequest = async (
	url: string,
	method: ALLOWED_API_METHODS,
	payload?: any
) => {
	const response = await axiosClient.request({
		url,
		method,
		data: payload,
		withCredentials: true,
	});

	const data: IApiResponse<any> = await response.data;

	if (!data) {
		throw new Error("[ApiService] Error in response for url:" + url);
	}

	return data;
};
