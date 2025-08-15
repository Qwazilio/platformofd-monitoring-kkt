'use client'

import KKTList from "@/components/KKTList";
import classes from '@/components/page.module.scss'
import classesTools from '@/components/terminalList.module.scss'
import useKKTEvents from "@/hooks/event/useKKTEvents";
import useSocket from "@/hooks/useSocket";
import {useEffect} from "react";
import {useSocketStore} from "@/hooks/store/useSocketStore";
import {ToastContainer} from "react-toastify";
import KktSearch from "@/components/tool/KKTSearch";
import KKTSort from "@/components/tool/KKTSort";
import ModalWindows from "@/components/ModalWindows";
import useKKTList from "@/hooks/useKKTList";
import KktExport from "@/components/tool/KKTExport";

export default function Home() {
    const {setSocket} = useSocketStore();

    const socket = useSocket("KKT");

    useEffect(() => {
        console.log("render ")
    })

    useEffect(() => {
        setSocket("KKT", socket);
    }, [socket]);

    //Ивенты для сокетов
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _useKKTEvents = useKKTEvents();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _useKKTList = useKKTList();

    return (
    <div>
        {socket ?
        <main className={classes.main}>
            <h1>Терминалы</h1>
            <div className={classesTools.tools}>
                <KktSearch />
                <KKTSort />
                <KktExport />
            </div>
            <KKTList />
        </main>
        : <h1>Идет подлкючение...</h1>}
        <ToastContainer/>
        <ModalWindows />
    </div>);

}
