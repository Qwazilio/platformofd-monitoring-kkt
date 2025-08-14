import classes from "@/components/terminalList.module.scss";
import Checked from "@/ui/Checked";
import {useKKTStore} from "@/hooks/store/useKKTStore";
import useKKT from "@/hooks/useKKT";
import KKTImport from "@/components/modal/KKTImport";
import useModalWindow from "@/hooks/useModalWindow";

export default function KKTSort() {
    const {
        isShowDrop, setIsShowDrop,
        isShowStock, setIsShowStock
    } = useKKTStore();
    const {createWindow} = useModalWindow()
    const {sortByFN, sortBySub} = useKKT();

    //Для Импорта из источников
    const showImport = () => {
        createWindow((id: string) => <KKTImport id={id}/>, "Импорт")
    };

    return(
        <div className={classes.sorts}>
            <div onClick={() => setIsShowStock(!isShowStock)}>
                <label>На складе</label>
                <Checked value={isShowStock} setValue={setIsShowStock}/>
            </div>
            <div onClick={() => setIsShowDrop(!isShowDrop)}>
                <label>Удаленные</label>
                <Checked value={isShowDrop} setValue={setIsShowDrop}/>
            </div>
            <button onClick={() => sortBySub()}>
                Сорт. по Дате подписки
            </button>
            <button onClick={() => sortByFN()}>
                Сорт. по Дате ФН
            </button>
            <button onClick={showImport}>Загрузить</button>
        </div>
    )
}