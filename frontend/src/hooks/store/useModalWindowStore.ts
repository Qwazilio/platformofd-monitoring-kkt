import React from "react";
import { create } from "zustand";

export interface modalWindowType {
    title: string;
    id: string;
    content: (id: string) => React.ReactNode;
    isShow: boolean;
    zIndex: number;
}

interface modalWindowContext {
    windows: modalWindowType[] | [];
    setWindows: (newWindow: (prev) => modalWindowType[]) => void;
}

export const useModalWindowsStore = create<modalWindowContext>((set) => ({
    windows: [],
    setWindows: (newWindow) => {
        if (typeof newWindow === "function") {
            set((state) => ({ windows: newWindow(state.windows) }));
        } else {
            set({ windows: newWindow });
        }
    },
}));