import {useKKTStore} from "@/hooks/store/useKKTStore";
import {useEffect} from "react";

export default function useKKTList(){
    const {kkts, filter, setFiltredKkts, isShowDrop, isShowStock} = useKKTStore();

    useEffect(() => {
        filterKkts();
    }, [filter, kkts, isShowDrop, isShowStock])

    //Поиск элементов под условия
    const filterKkts =  () => {
        if (kkts.length == 0) return;

        const search = filter.toLowerCase();

        const newList = kkts
            // фильтр по удалённым/складу
            .filter(kkt =>
                !isShowDrop
                    ? isShowStock === kkt.stock && isShowDrop === kkt.deleted
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
            )

        setFiltredKkts(newList);
    }

    return {}
}