'use client'

import axiosDefault from "@/lib/axiosDefault"
import { useEffect, useState } from "react"
import classes from '@/components/terminalList.module.scss'
import TerminalSerach from "./TerminalSearch"
import TerminalImport from "./TerminalImport"
import OffcanvasWindow from "@/ui/offcanvasWindow"
import useSocket from "@/hooks/useSocket"
import TerminalInfo from "./TerminalInfo"

interface TerminalListProps{

}
export default function TerminalList({} : TerminalListProps) {
    const socket = useSocket()
    const [terminals, setTerminals] = useState<TerminalEntity[]>([])
    const [filterTerminals, setFilterTerminals] = useState<TerminalEntity[]>([])
    const [showImport, setShowImport] = useState<boolean>(false);
    const [showTerminalInfo, setshowTerminalInfo] = useState<boolean>(false);
    const [terminalInfo, setTerminalInfo] = useState<TerminalEntity | null>(null)

    const getTerminalList = async () => {
        try{
            const response = await axiosDefault.get('/terminal/list')
            const {data} = response

            if(data) {
                const result = data;
                setTerminals(sortByFN(result))
            }
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
            setTerminals(terminals)          
            setshowTerminalInfo(false)      
        })

        return () => {
            socket.off('terminalListChanged')
        }
    }, [socket])

    const changeShowImport = () => {
        if(showImport) setShowImport(false)
        else setShowImport(true)
    }

    const sortByFN = (list : TerminalEntity[]) => {
        const sortedList = list.toSorted((a: any, b: any) => {
            const endDateA = new Date(a.active_card.end_date_card);
            const endDateB = new Date(b.active_card.end_date_card);
            return endDateA.getTime() - endDateB.getTime(); 
        });
        return sortedList;
    }

    const sortBySub = (list : TerminalEntity[]) => {
        const sortedList = list.toSorted((a: TerminalEntity, b: TerminalEntity) => {
            const endDateA = new Date(a.end_date_sub);
            const endDateB = new Date(b.end_date_sub);
            return endDateA.getTime() - endDateB.getTime();
        });
        return sortedList;
    }
    

    const viewList = (terminals : TerminalEntity[]) => {
        return terminals.map( (terminal) => (
            <div className={classes.terminal} key={terminal.uid_terminal} onClick={() => viewTerminal(terminal.id)}>
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
        ))
    }

    const viewTerminal = async (terminal_id: number) => {        
        try{
            const response = await axiosDefault.get('/terminal', {
                params: {
                    id: terminal_id
                }
            })
            const {data} = response;
            if(data){
                setTerminalInfo(data);
                setshowTerminalInfo(true)
            }
            else console.log('no data!');
        } catch (error) {
            console.log(`Error get terminal! ${error}`)
        }        
    }

    return(
        <div>
            {showImport && <OffcanvasWindow title={'Импорт терминалов'} close={setShowImport}>
                <TerminalImport />
            </OffcanvasWindow>}
            {showTerminalInfo && <OffcanvasWindow title={'Терминал'} close={setshowTerminalInfo}>
                <TerminalInfo terminal={terminalInfo}/>
            </OffcanvasWindow>}
            <div className={classes.tools}>
                <TerminalSerach list={terminals} setFilterList={setFilterTerminals} />
                <div>
                    <button onClick={() => setTerminals(sortBySub(terminals))}>Сорт. по Дате подписки</button>
                    <button onClick={() => setTerminals(sortByFN(terminals))}>Сорт. по Дате ФН</button>
                    <button onClick={() => changeShowImport()}>{!showImport ? "Загрузить" : "Закрыть"}</button>
                </div>
            </div>
            
            <div className={classes.wrapper}>
                <div className={classes.headerTerminal}>
                    <label>Название</label>
                    <label>Адрес</label>
                    <label>ККМ</label>
                    <label>Срок подписки</label>
                    <label>Срок ФН</label>
                </div>
                { filterTerminals.length < 1 ?
                    viewList(terminals) :
                    viewList(filterTerminals)
                }
            </div>
        </div>
    )
}