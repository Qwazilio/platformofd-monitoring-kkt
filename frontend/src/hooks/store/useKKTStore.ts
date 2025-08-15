import { create } from "zustand"

interface KKTContext {
    kkts: KktEntity[] |[]
    setKkts: ( newMessages: KktEntity[] | ((prev: KktEntity[]) => KktEntity[])) => void
    filtredKkts: KktEntity[] | []
    setFiltredKkts: ( newMessages: KktEntity[] | ((prev: KktEntity[]) => KktEntity[])) => void
    filter: string
    setFilter: (newFilter: string) => void
    isShowStock: boolean
    setIsShowStock: (changed: boolean) => void
    isShowDrop: boolean
    setIsShowDrop: (changed: boolean) => void
}

export const useKKTStore = create<KKTContext>((set) => ({
    kkts: [],
    setKkts: (data) => {
        if (typeof data === 'function') {
            set((state) => ({ kkts: data(state.kkts) }));
        } else {
            set({ kkts: data });
        }
    },
    filtredKkts: [],
    setFiltredKkts: (data) => {
        if (typeof data === 'function') {
            set((state) => ({ filtredKkts: data(state.filtredKkts) }));
        } else {
            set({ filtredKkts: data });
        }
    },
    filter: "",
    setFilter: (newFilter) => set({filter: newFilter}),
    isShowStock: false,
    setIsShowStock: (changed) => set({isShowStock: changed}),
    isShowDrop: false,
    setIsShowDrop: (changed) => set({isShowDrop: changed}),
}))