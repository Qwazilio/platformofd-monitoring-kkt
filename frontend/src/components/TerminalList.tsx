'use client'

import axiosDefault from "@/lib/axiosDefault"
import { ReactNode, useEffect, useState } from "react"
import classes from '@/components/terminalList.module.scss'
import TerminalSerach from "./TerminalSearch"
import TerminalImport from "./TerminalImport"
import OffcanvasWindow from "@/ui/offcanvasWindow"
import useSocket from "@/hooks/useSocket"
import { format } from "date-fns/fp"

interface TerminalListProps{

}
export default function TerminalList({} : TerminalListProps) {
    const socket = useSocket()
    const [terminals, setTerminals] = useState<TerminalEntity[]>([])
    const [showImport, setShowImport] = useState<boolean>(false);

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
            console.log(terminals)
            setTerminals(terminals)                
        })

        return () => {
            socket.off('terminalListChanged')
        }
    }, [socket])

    const changeShowImport = () => {
        if(showImport) setShowImport(false)
        else setShowImport(true)
    }

    return(
        <div>
            {showImport && <OffcanvasWindow title={'Импорт терминалов'} close={setShowImport}>
                <TerminalImport />
            </OffcanvasWindow>}
            <div className={classes.tools}>
                <TerminalSerach />
                <button onClick={() => changeShowImport()}>{!showImport ? "Загрузить" : "Закрыть"}</button>
            </div>
            
            <div className={classes.wrapper}>
                <div className={classes.headerTerminal}>
                    <label>Название</label>
                    <label>Адрес</label>
                    <label>Номер ККТ</label>
                    <label>Срок подписки</label>
                    <label>Срок ФН</label>
                </div>
                { terminals && (terminals.map((terminal) => (
                    <div className={classes.terminal} key={terminal.uid_terminal}>
                        <div className={classes.info}>{terminal.name_terminal}</div>
                        <div className={classes.info}>{terminal.address}</div>
                        <div className={classes.info}>{terminal.uid_terminal}</div>
                        <div className={classes.info}>{ terminal.end_date_sub ? (
                            new Date(terminal.end_date_sub).toLocaleDateString()
                        ): ('Нет подписки')}</div>
                        <div className={classes.info}>{terminal.active_card ? (
                            new Date(terminal.active_card.end_date_card).toLocaleDateString()
                        ) :  ('Нет ФН')}</div>                        
                    </div>
                )))}
            </div>
        </div>
    )
}