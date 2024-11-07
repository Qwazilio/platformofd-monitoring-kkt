'use client'

import axiosDefault from "@/lib/axiosDefault"
import { ReactNode, useEffect, useState } from "react"
import classes from '@/components/terminalList.module.scss'
import TerminalSerach from "./TerminalSearch"
import TerminalImport from "./TerminalImport"
import OffcanvasWindow from "@/ui/offcanvasWindow"
import useSocket from "@/hooks/useSocket"

interface TerminalListProps{

}
export default function TerminalList({} : TerminalListProps) {
    const socket = useSocket()
    const [terminals, setTerminals] = useState<TerminalEntity[]>([])
    const [showImprot, setShowImport] = useState<boolean>(false);

    const getTerminalList = async () => {
        try{
            const response = await axiosDefault.get('/terminal/list')
            const {data} = response

            if(data) setTerminals(data)
            else console.log('No data received from the server');
        } catch (error){
            console.log(`Error get terminal list! ${error}`)
        }
    }

    useEffect(() => {
        getTerminalList();
    }, [])

    useEffect(() => {
        if(!socket) return;
        
        socket.on('terminalListChanged', (terminals) => {
            setTerminals(terminals);
        })
    }, [socket])

    const changeShowImport = () => {
        if(showImprot) setShowImport(false)
        else setShowImport(true)
    }

    return(
        <div>
            {showImprot && <OffcanvasWindow title={'Импорт терминалов'} close={setShowImport}>
                <TerminalImport />
            </OffcanvasWindow>}
            <div className={classes.tools}>
                <TerminalSerach />
                <button onClick={() => changeShowImport()}>{!showImprot ? "Загрузить" : "Закрыть"}</button>
            </div>
            
            <div className={classes.wrapper}>
                {terminals.map((terminal) => (
                    <div className={classes.terminal} key={terminal.uid_terminal}>
                        <div>{terminal.name_terminal}</div>
                        <div>{terminal.uid_terminal}</div>

                    </div>
                ))}
            </div>
        </div>
    )
}