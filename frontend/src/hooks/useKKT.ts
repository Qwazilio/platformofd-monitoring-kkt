import {useSocketStore} from "@/hooks/store/useSocketStore";
import {useEffect} from "react";
import {useKKTStore} from "@/hooks/store/useKKTStore";

export default function useKKT(){
    const socket = useSocketStore(state => state.getSocket("KKT"));
    const {kkts, filtredKkts, filter, setFiltredKkts, isShowDrop, isShowStock} = useKKTStore();

    useEffect(() => {
        filterKkts();
    }, [filter, kkts, isShowDrop, isShowStock])

    //Поиск элементов под условия
    const filterKkts = () => {
        if (kkts.length == 0) return;

        const search = filter.toLowerCase();

        const list = kkts
            // фильтр по удалённым/складу
            .filter(kkt =>
                !isShowDrop
                    ? isShowStock === kkt.stock
                    : isShowDrop === kkt.deleted
            )
            // фильтр по тексту, только если есть строка поиска
            .filter(kkt =>
                kkt.address?.toString().toLowerCase().includes(search) ||
                kkt.comment?.toString().toLowerCase().includes(search) ||
                kkt.name_terminal?.toString().toLowerCase().includes(search) ||
                kkt.organization?.toString().toLowerCase().includes(search) ||
                kkt.uid_terminal?.toString().toLowerCase().includes(search) ||
                kkt.active_card?.uid_card?.toString().toLowerCase().includes(search) ||
                kkt.notification?.toString().toLowerCase().includes(search) ||
                kkt.reg_number?.toString().toLowerCase().includes(search)
            );

        setFiltredKkts(list);
    };

    //Сортировка по дате окончания ФН
    const sortByFN = () => {
        const sortedList = filtredKkts.toSorted((a: TerminalEntity, b: TerminalEntity) => {
            const endDateA = new Date(a.active_card.end_date_card);
            const endDateB = new Date(b.active_card.end_date_card);
            return endDateA.getTime() - endDateB.getTime();
        });
        setFiltredKkts(sortedList);
    };

    //Сортировка по дате окончания подписки ОФД
    const sortBySub = () => {
        const sortedList = filtredKkts.toSorted((a: TerminalEntity, b: TerminalEntity) => {
            const endDateA = new Date(a.end_date_sub);
            const endDateB = new Date(b.end_date_sub);
            return endDateA.getTime() - endDateB.getTime();
        });
        setFiltredKkts(sortedList);
    };

    const importKkt = (terminals: TerminalEntity[]) => {
        socket?.emit('import', terminals)
    }

    const updateKkt = (kkt: TerminalEntity) => {
        socket?.emit('updateTerminal', kkt)
    }

    return {importKkt, updateKkt, sortByFN, sortBySub}
}