'use client'
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface TerminalImportAPIProps{
    terminals: TerminalEntity[]
    setTerminals: Dispatch<SetStateAction<TerminalEntity[]>>
    visible: Dispatch<SetStateAction<boolean>>
    sendOnServer: () => void
}
export default function TerminalImportAPI({terminals, setTerminals, visible, sendOnServer} : TerminalImportAPIProps) {

    const fetchTerminal = async (route : string) => {
        try{
            const responce = await axios.get(route)
            console.log(responce.data);
        } catch (error) {
            
        }
    }

    return(
        <div>
            <button onClick={() => fetchTerminal('/api/ipk')}>ИПК</button>
            <button onClick={() => {}}>ИПЖ</button>
            <button onClick={() => {}}>ММ</button>
            <button onClick={() => {}}>ММР</button>
            <button onClick={() => {}}>Дом Быта</button>
            <button onClick={() => {}}>НеоСервисе</button>
        </div>
    )
}