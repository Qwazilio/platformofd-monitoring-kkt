import {useSocketStore} from "@/hooks/store/useSocketStore";
import {useKKTStore} from "@/hooks/store/useKKTStore";

export default function useKKT(){
    const socket = useSocketStore(state => state.getSocket("KKT"));
    const {kkts, setKkts} = useKKTStore();

    //Сортировка по дате окончания ФН
    const sortByFN = () => {
        const sortedList = kkts.toSorted((a: KktEntity, b: KktEntity) => {
            const endDateA = new Date(a.active_card.end_date_card);
            const endDateB = new Date(b.active_card.end_date_card);
            return endDateA.getTime() - endDateB.getTime();
        });
        setKkts(sortedList);
    };

    //Сортировка по дате окончания подписки ОФД
    const sortBySub = () => {
        const sortedList = kkts.toSorted((a: KktEntity, b: KktEntity) => {
            const endDateA = new Date(a.end_date_sub);
            const endDateB = new Date(b.end_date_sub);
            return endDateA.getTime() - endDateB.getTime();
        });
        setKkts(sortedList);
    };



    const importKkt = async (terminals: KktEntity[]): Promise<boolean> => {
        return new Promise((resolve) => {
            socket?.emit('importKkts', terminals, (response: boolean) => {
                console.log(response);
                resolve(response);
            })
        })
    }

    const updateKkt = (kkt: KktEntity): Promise<boolean> => {
        return new Promise((resolve) => {
            socket?.emit('updateKkt', kkt, (response: boolean) => {
                console.log(`ККТ ${kkt.name_terminal} обработана сервером!`);
                resolve(response);
            })
        })
    }

    return {importKkt, updateKkt, sortByFN, sortBySub}
}