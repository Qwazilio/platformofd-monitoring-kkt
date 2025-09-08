import classes from "@/components/terminalList.module.scss";
import KKTInfo from "@/components/modal/KKTInfo";
import useModalWindow from "@/hooks/useModalWindow";

interface KKTNodeProps{
    kkt: KktEntity
}
export default function KKTNode({kkt}: KKTNodeProps) {
    const {createWindow} = useModalWindow();

    //Для подробного просмотра данных терминала
    const viewKkt = async (kkt_id: number) => {
        createWindow((id) => <KKTInfo id={id} kkt_id={kkt_id}/>, "Информация")
    };

    //Определяет статус терминала устанавливая цвет
    const statusKkt = () => {
        if(kkt.broken) return classes.broken
        if(!kkt.hasFN && kkt.updated) return classes.attention;
        if(!kkt.hasFN) return classes.warning;
        if(kkt.updated) return classes.done;
    }

    return (
        <div
            className={`
            ${classes.terminal}
            ${statusKkt()}
        `}
            key={kkt.uid_terminal}
            onClick={() => viewKkt(kkt.id)}
        >
            <div className={classes.info}>{kkt.name_terminal}</div>
            <div className={classes.info}>{kkt.address}</div>
            <div className={classes.info}>{kkt.uid_terminal}</div>
            <div className={classes.info}>
                {kkt.end_date_sub
                    ? new Date(kkt.end_date_sub).toLocaleDateString()
                    : "Нет подписки"}
            </div>
            <div className={classes.info}>
                {kkt.active_card
                    ? new Date(kkt.active_card.end_date_card).toLocaleDateString()
                    : "Нет ФН"}
            </div>
        </div>
    );
}