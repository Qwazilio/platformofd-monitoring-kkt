import { create } from "zustand"
import {Socket} from "socket.io-client";

interface SocketContext {
    [namespace: string]: Socket | null;
}

interface SocketStore {
    sockets: SocketContext;
    setSocket: (namespace: string, socket: Socket) => void;
    getSocket: (namespace: string) => Socket | null;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
    sockets: {},
    setSocket: (namespace: string, socket: Socket) =>
        set((state) => ({
            sockets: {
                ...state.sockets,
                [namespace]: socket,
            },
        })),
    getSocket: (namespace: string) => get().sockets[namespace] ?? null,
}));
