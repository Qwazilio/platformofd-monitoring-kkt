import {useSocketStore} from "@/hooks/store/useSocketStore";
import {useEffect} from "react";
import {useKKTStore} from "@/hooks/store/useKKTStore";
import useKKT from "@/hooks/useKKT";

export default function useKKTEvents() {
    const socket = useSocketStore(state => state.getSocket('KKT'))
    const {setKkts} = useKKTStore();
    const {sortByFN} = useKKT();

    useEffect(() => {
        if (!socket) return;

        socket.on("kktListChanged", (terminals: TerminalEntity[]) => {
            setKkts(terminals);
            sortByFN();
        });

        return () => {
            socket.off("kktListChanged");
        };
    }, [socket]);

    return {};
}