'use client'

import useSocket from "@/hooks/useSocket"
import { useEffect, useState } from "react"
import classes from '@/components/terminalInfo.module.scss'

interface TerminalInfoProps{
    terminal: TerminalEntity
}
export default function TerminalInfo({terminal} : TerminalInfoProps) {
    const [terminalInfo, setTerminalInfo] = useState<TerminalEntity | null>(null)
    const socket = useSocket();

    useEffect(() => {
        setTerminalInfo(terminal)
    }, [])

    useEffect(() => {
        setTerminalInfo(terminal)
    }, [terminal])

    const updateTerminal = () => {
        if(!socket) return
        socket.emit('updateTerminal', terminalInfo)
    }

    const onChangeInfo = (event) => {
        const { name, value } = event.target;
        setTerminalInfo((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
      const onChangeCheckbox = (event) => {
        const { name, checked } = event.target;
        setTerminalInfo((prev) => ({
          ...prev,
          [name]: checked,
        }));
      };

    return(
        <> 
        {terminalInfo ? 
            <div className={classes.wrapper}>
                <label>Название</label>
                <input onChange={onChangeInfo} name='name_terminal' value={terminalInfo?.name_terminal || ''}/>
                <label>Магазин</label>
                <input onChange={onChangeInfo} name="name_store" value={terminalInfo?.name_store || ''}/>
                <label>ККМ</label>
                <input onChange={onChangeInfo} name="uid_terminal" value={terminalInfo?.uid_terminal}/>
                <label>Организация</label>
                <input onChange={onChangeInfo} name="organization" value={terminalInfo?.organization || ''}/>
                <label>Дополнительный идентификатор</label>
                <input onChange={onChangeInfo} name="comment" value={terminalInfo?.comment || ''}/>
                <label>Адрес</label>
                <input onChange={onChangeInfo} name="address" value={terminalInfo?.address || ''}/>
                <label>Подписка</label>
                <input onChange={onChangeInfo} name="end_date_sub" value={
                    terminal.end_date_sub ? (
                        new Date(terminal.end_date_sub).toLocaleDateString()
                    ): ('')
                }/>
                <label>Номер ФН</label> 
                <input onChange={onChangeInfo} name="active_card.uid_card" value={terminalInfo?.active_card?.uid_card || ''}/> 
                <label>Дата ФН</label>
                <input onChange={onChangeInfo} name="active_card.end_date_card" value={
                    terminalInfo.active_card?.end_date_card ? (
                        new Date(terminalInfo.active_card.end_date_card).toLocaleDateString()
                    ) : ('')                    
                }/> 
                <label>Комментарий</label>      
                <input onChange={onChangeInfo} name="notification" value={terminalInfo?.notification || ''}/>
                <div>
                    <label>На складе</label> <input onChange={onChangeCheckbox} name="stock" type='checkbox' checked={terminalInfo?.stock}/>
                </div>    
                <div>
                    <label>Сломан</label> <input onChange={onChangeCheckbox} name="broken" type='checkbox' checked={terminalInfo?.broken}/>
                </div>            
                <div>
                    <label>Удален</label> <input onChange={onChangeCheckbox} name="deleted" type='checkbox' checked={terminalInfo?.deleted}/>
                </div>
                <button onClick={() => updateTerminal()}>Сохранить</button>
            </div>
            :
            <div>Загрузка...</div>        
        }
        </> 
    )
}