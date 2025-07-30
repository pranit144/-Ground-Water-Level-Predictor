import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useTokenStore = create(
	devtools(
		persist(
			(set) => ({
				token: "",
				userId: null,
				setToken: (data) => set({ token: data }),
				clearToken: () => set({ token: "", userId: null }), // Clear userId when logging out
				setUserId: (id) => set({ userId: id }),
			}),
			{
				name: "auth-token", // persist key name
			}
		),
		{
			name: "TokenStore", // devtools store name
		}
	)
);

export default useTokenStore;
