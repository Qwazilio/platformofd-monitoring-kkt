'use client'

import KKTList from "@/components/KKTList";
import classes from '@/components/page.module.scss'
import useKKTEvents from "@/hooks/event/useKKTEvents";
import useSocket from "@/hooks/useSocket";
import {useEffect} from "react";
import {useSocketStore} from "@/hooks/store/useSocketStore";
import {modalWindowType, useModalWindowsStore} from "@/hooks/store/useModalWindowStore";
import ModalWindow from "@/ui/modalWindow";
import {ToastContainer} from "react-toastify";
import KktSearch from "@/components/tool/KKTSearch";
import KKTSort from "@/components/tool/KKTSort";
import TerminalExport from "@/components/tool/KKTExport";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;
export default function Home() {
    const {setSocket} = useSocketStore();
    const socket = useSocket(SOCKET_URL);
    const {windows} = useModalWindowsStore();

    useEffect(() => {
        setSocket("KKT", socket);
    }, [socket]);

    //Ивенты для сокетов
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _useKKTEvents = useKKTEvents();

    return (
    <div>
        {socket ?
        <main className={classes.main}>
            <h1>Терминалы</h1>
            <div className={classes.tools}>
                <KktSearch />
                <KKTSort />
                <TerminalExport />
            </div>
            <KKTList />
            {windows.length > 0
                ? windows.map((window: modalWindowType) => (
                    <ModalWindow
                        key={window.id}
                        id={window.id}
                        title={window.title}
                    >
                        {window.content(window.id)}
                    </ModalWindow>
                ))
                : null
            }
        </main>
        : <h1>Идет подлкючение...</h1>}
        <ToastContainer/>
    </div>);

}
