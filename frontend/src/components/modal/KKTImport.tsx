import { useEffect, useState } from "react";
import classes from "@/components/terminalImport.module.scss"
import KKTImportXLSX from "@/components/import/KKTImportXLSX";
import KKTImportAPI from "@/components/import/KKTImportAPI";
import useKKT from "@/hooks/useKKT";
import {ModalWindowBase} from "@/ui/ModalWindow";
import useModalWindow from "@/hooks/useModalWindow";

type KktImportProps = ModalWindowBase
export default function KKTImport({id}: KktImportProps) {
    const [kkt, setKkt] = useState<TerminalEntity[]>([]);
    const {importKkt} = useKKT();
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const {closeWindow} = useModalWindow();

    useEffect(() =>{
      setIsDisabled(kkt.length > 0)
    }, [kkt])

    const clickSendOnServer = () => {
        importKkt(kkt);
        closeWindow(id)
    }

    return (
        <div className={classes.wrapper}>
          <KKTImportXLSX setKkt={setKkt}/>
          <KKTImportAPI setKkt={setKkt}/>
          <button onClick={clickSendOnServer} disabled={isDisabled}>Загрузить на сервер</button>
        </div>
    );
}
