import React, {ChangeEvent, useEffect, useState} from "react"
import classes from '@/components/terminalInfo.module.scss'
import {ModalWindowBase} from "@/ui/ModalWindow";
import axiosDefault from "@/lib/axiosDefault";
import useKKT from "@/hooks/useKKT";
import useModalWindow from "@/hooks/useModalWindow";

interface TerminalInfoProps extends ModalWindowBase{
    kkt_id: number
}
export default function KKTInfo({id, kkt_id} : TerminalInfoProps) {
    const {updateKkt} = useKKT();
    const {closeWindow} = useModalWindow();
    const [kkt, setKkt] = useState<TerminalEntity | null>(null)

    useEffect(() => {
        getInfo();
    }, [])

    const getInfo = async () => {
        try {
            const response = await axiosDefault.get("/terminal", {
                params: {
                    id: kkt_id,
                },
            });
            const { data } = response;
            if (data) {
                setKkt(data);
            } else console.log("no data!");
        } catch (error) {
            console.log(`Error get terminal! ${error}`);
        }
    }

    const onChangeInfo = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setKkt((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    
    const onChangeCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setKkt((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const onChangeDate = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setKkt((prev) => ({
            ...prev,
            [name]: new Date(value).toISOString(),
        }));
    };

    const clickUpdateKkt = () => {
        updateKkt(kkt)
        closeWindow(id);
    }

    return(
        <> 
        {kkt ?
            <div className={classes.wrapper}>
                <label>Название</label>
                <input onChange={onChangeInfo} name='name_terminal' value={kkt?.name_terminal || ''}/>
                {/*<label>Магазин</label>
                <input onChange={onChangeInfo} name="name_store" value={terminalInfo?.name_store || ''}/>*/}
                <label>Организация</label>
                <input onChange={onChangeInfo} name="organization" value={kkt?.organization || ''}/>
                <label>ККМ</label>
                <input name="uid_terminal" readOnly value={kkt?.uid_terminal}/>
                <label>Дополнительный идентификатор</label>
                <input onChange={onChangeInfo} name="comment" value={kkt?.comment || ''}/>
                <label>Адрес</label>
                <input onChange={onChangeInfo} name="address" value={kkt?.address || ''}/>
                <label>Подписка</label>
                <input type="date" onChange={onChangeDate} name="end_date_sub" value={
                    kkt.end_date_sub ? (
                        new Date(kkt.end_date_sub).toISOString().split('T')[0]
                    ): ('')
                }/>
                <label>Номер ФН</label> 
                <input readOnly name="active_card.uid_card" value={kkt?.active_card?.uid_card || ''}/>
                <label>Дата ФН</label>
                <input readOnly type="date" name="active_card.end_date_card" value={
                    kkt.active_card?.end_date_card ? (
                        new Date(kkt.active_card.end_date_card).toISOString().split('T')[0]
                    ) : ('')                    
                }/> 
                <label>РНМ</label>
                <input onChange={onChangeInfo} name="reg_number" readOnly value={kkt?.reg_number || ''}/>
                <label>Комментарий</label>      
                <input onChange={onChangeInfo} name="notification" value={kkt?.notification || ''}/>
                <div>
                    <label>Обновление</label> <input onChange={onChangeCheckbox} name="updated" type='checkbox' checked={kkt?.updated}/>
                </div>
                <div>
                    <label>На складе</label> <input onChange={onChangeCheckbox} name="stock" type='checkbox' checked={kkt?.stock}/>
                </div>
                <div>
                    <label>Сломан</label> <input onChange={onChangeCheckbox} name="broken" type='checkbox' checked={kkt?.broken}/>
                </div>            
                <div>
                    <label>Удален</label> <input onChange={onChangeCheckbox} name="deleted" type='checkbox' checked={kkt?.deleted}/>
                </div>
                <button onClick={clickUpdateKkt}>Сохранить</button>
            </div>
            :
            <div>Загрузка...</div>        
        }
        </> 
    )
}