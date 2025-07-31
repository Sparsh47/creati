import {create} from "zustand/react";

export const useAuthStore = create(set => ({
    accessToken: null,
    status: "loading",
    setAccessToken: (token: string) => set({accessToken: token}),
    setStatus: (status: string) => set({status}),
}))