'use client'

import axiosDefault from "@/lib/axiosDefault"
import { useEffect, useState } from "react"
import classes from '@/components/terminalList.module.scss'
import TerminalSerach from "./TerminalSearch"
import TerminalImport from "./TerminalImport"

interface TerminalListProps{

}
export default function TerminalList({} : TerminalListProps) {
    const [terminals, setTerminals] = useState<TerminalEntity[]>([])

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

    return(
        <div>
            <TerminalImport />
            <TerminalSerach />
            <div className={classes.wrapper}>
                {terminals.map((terminal) => (
                    <div className={classes.terminal} key={terminal.uid_terminal}>{terminal.name_terminal}</div>
                ))}
            </div>
        </div>
    )
}