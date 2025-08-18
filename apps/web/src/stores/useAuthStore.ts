import axios from "axios";
import { IUser } from "types";
import { create } from "zustand";

type AuthStore = {
	isAuthenticated: boolean;
	isRestoring: boolean;
	isRefreshing: boolean;
	accessToken: string | null;
	user: IUser | null;

	syncAuth: (isRefresh: boolean) => Promise<void>;
	clearAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
	isAuthenticated: false,
	isRestoring: true, // auth loading on app load
	isRefreshing: false, // token refresh on 401 response
	accessToken: null,
	user: null,

	syncAuth: async (isRefresh) => {
		if (isRefresh) set({ isRefreshing: true });
		else set({ isRestoring: true });

		try {
			console.log("[AuthStore] Attempting to sync auth...");

			const response = await axios.request({
				baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
				url: "/auth/refresh",
				method: "POST",
				withCredentials: true,
				validateStatus: () => true,
			});

			const data = response.data;
			console.log("[AuthStore] syncAuth response:", data);

			if (data.success) {
				// successfully synced
				console.log("[AuthStore] auth synced successfully.");

				const { accessToken, user } = data.payload;

				// update store
				set({
					isAuthenticated: true,
					accessToken,
					user,
				});
			} else {
				console.warn(
					"[AuthStore] Failed to sync auth. Clearing auth state."
				);

				await get().clearAuth();
			}
		} catch (error) {
			console.error("[AuthStore] Error syncing auth:", error);

			await get().clearAuth();
		} finally {
			set({
				isRefreshing: false,
				isRestoring: false,
			});
		}
	},

	clearAuth: async () => {
		console.log("[AuthStore] Clearing auth...");

		set({
			isAuthenticated: false,
			isRestoring: false,
			isRefreshing: false,
			accessToken: null,
			user: null,
		});
	},
}));
