import axios from "axios";
import { IUser } from "types";
import { create } from "zustand";

type AuthStore = {
	isAuthenticated: boolean;
	isLoading: boolean;
	accessToken: string | null;
	user: IUser | null;

	setAuth: (accessToken: string) => Promise<void>;
	refreshAuth: () => Promise<any>;
	clearAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
	isAuthenticated: false,
	isLoading: true,
	accessToken: null,
	user: null,

	setAuth: async (accessToken) => {
		console.log("[AuthStore] Setting auth.");
		if (!accessToken) {
			console.error(
				"[AuthStore] Error in setAuth: accessToken not provided."
			);

			return;
		}

		set({
			isAuthenticated: true,
			isLoading: false,
			accessToken,
		});
	},

	refreshAuth: async () => {
		try {
			console.log("[AuthStore] Attempting to refresh tokens...");

			const response = await axios.request({
				baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
				url: "/auth/refresh",
				method: "POST",
				withCredentials: true,
				validateStatus: () => true,
			});

			const data = await response.data;
			console.log("[AuthStore] Refresh tokens response:", data);

			if (data.success) {
				// successfully got tokens
				console.log("[AuthStore] Tokens refreshed successfully.");

				const { accessToken: newAccessToken, user } =
					await data.payload;

				// update store
				set({
					isAuthenticated: true,
					isLoading: false,
					accessToken: newAccessToken,
					user,
				});

				return data;
			} else {
				console.warn(
					"[AuthStore] Failed to refresh tokens. Clearing auth state."
				);

				await get().clearAuth();

				return null;
			}
		} catch (error) {
			console.error("[AuthStore] Error refreshing tokens:", error);

			await get().clearAuth();

			return null;
		}
	},

	clearAuth: async () => {
		console.log("[AuthStore] Clearing auth.");

		set({
			isAuthenticated: false,
			isLoading: false,
			accessToken: null,
		});
	},
}));
