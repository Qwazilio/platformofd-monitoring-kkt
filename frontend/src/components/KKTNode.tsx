import classes from "@/components/terminalList.module.scss";
import KKTInfo from "@/components/modal/KKTInfo";
import useModalWindow from "@/hooks/useModalWindow";

interface KKTNodeProps{
    kkt: TerminalEntity
}
export default function KKTNode({kkt}: KKTNodeProps) {
    const {createWindow} = useModalWindow();

    //Для подробного просмотра данных терминала
    const viewTerminal = async (kkt_id: number) => {
        createWindow((id) => <KKTInfo id={id} kkt_id={kkt_id}/>, "Информация")
    };

    return (
        <div
            className={`
            ${classes.terminal}
            ${
                (kkt.broken) ? classes.broken :
                    (kkt.updated) ? classes.done : ""
            }
        `}
            key={kkt.uid_terminal}
            onClick={() => viewTerminal(kkt.id)}
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