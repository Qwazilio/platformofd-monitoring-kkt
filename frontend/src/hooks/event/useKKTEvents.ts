import {useSocketStore} from "@/hooks/store/useSocketStore";
import {useEffect} from "react";
import {useKKTStore} from "@/hooks/store/useKKTStore";
import {toast} from "react-toastify";

export default function useKKTEvents() {
    const socket = useSocketStore(state => state.getSocket('KKT'))
    const {setKkts} = useKKTStore();

    useEffect(() => {
        if (!socket) return;

        socket.on("kktsList", (kkts: KktEntity[]) => {
            setKkts(kkts.toSorted((a: KktEntity, b: KktEntity) => {
                const endDateA = new Date(a?.active_card?.end_date_card);
                const endDateB = new Date(b?.active_card?.end_date_card);
                return endDateA.getTime() - endDateB.getTime()
            }));
            toast.success("Список ККТ обновлен")
        });

        socket.on("kktUpdated", (kkt: KktEntity) => {
            toast.success(`ККТ ${kkt.name_terminal} обновлена!`);
            setKkts((prev) => {
                const index = prev.findIndex(item => item.id === kkt.id);
                if (index !== -1) {
                    const updatedKkts = [...prev];
                    updatedKkts[index] = kkt;
                    return updatedKkts;
                }
                return prev;
            });

        });

        return () => {
            socket.off("kktsList");
            socket.off("kktUpdated");
        };
    }, [socket]);

    return {};
}