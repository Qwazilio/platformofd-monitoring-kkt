'use client'

import classes from "@/components/terminalImport.module.scss"
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Kkt {
    kktName: string; // Название ККТ
    kktNumber: string; // Уникальный номер ККТ
    kktCurrentSubscriptionDateTill: string | Date; // Дата окончания подписки
    kktLastCheckStatusDate: string | Date; // Последняя проверка состояния
    kktFN: string; // Уникальный идентификатор карты (ФН)
    kktFnDateTill: string | Date; // Дата окончания действия карты (ФН)
    retailAddress: string; // Адрес торговой точки
    deviceComment?: string; // Комментарий к устройству (опционально)
}

interface TerminalImportAPIProps{
    setTerminals: Dispatch<SetStateAction<(TerminalEntity | CardEntity)[][]>>
    visible: Dispatch<SetStateAction<boolean>>
    sendOnServer: () => void
}
export default function TerminalImportAPI({setTerminals, visible, sendOnServer} : TerminalImportAPIProps) {

    const fetchTerminals = async (route : string) => {
        setTerminals([])
        try{
            const response = await axios.get(route)

            if(!response.data) return;
            const {kkts, branches} = response.data.kktList.orgBranches[0]

            const sortKkts = kkts.map((kkt : Kkt) => ([{
                name_terminal: kkt.kktName,
                uid_terminal: kkt.kktNumber,
                end_date_sub: kkt.kktCurrentSubscriptionDateTill,
                organization: response.data.kktList.orgName,
                address: kkt.retailAddress,
                last_active: kkt.kktLastCheckStatusDate,
                comment: kkt.deviceComment,
            } as TerminalEntity,                 
            {
                uid_card: kkt.kktFN,
                end_date_card: kkt.kktFnDateTill
            } as CardEntity
            ]))            
            
            const sortKktsInStores = branches.flatMap(branch => 
                branch.kkts.map((kkt: Kkt) => ([{
                    name_terminal: kkt.kktNumber,
                    uid_terminal: kkt.kktNumber,
                    end_date_sub: kkt.kktCurrentSubscriptionDateTill,
                    organization: response.data.kktList.orgName,
                    address: kkt.retailAddress,
                    last_active: kkt.kktLastCheckStatusDate,
                    comment: kkt.deviceComment,
                    name_store: branch.branchName
                } as TerminalEntity,
                {
                    uid_card: kkt.kktFN,
                    end_date_card: kkt.kktFnDateTill,
                } as CardEntity]))
            );
            setTerminals([...sortKkts, ...sortKktsInStores])
            
        } catch (error) {
            console.log(`API error!${error}`)
        }
    }

    return(
        <div >
            <h2 style={{textAlign: "center", fontSize: '1.2em'}}>Импорт из ОФД</h2>
            <button onClick={() => fetchTerminals('/api/ipk')}>ИПК</button>
            <button onClick={() => fetchTerminals('/api/ipg')}>ИПЖ</button>
            <button onClick={() => fetchTerminals('/api/mm')}>ММ</button>
            <button onClick={() => fetchTerminals('/api/mmr')}>ММР</button>
            <button onClick={() => fetchTerminals('/api/db')}>Дом Быта</button>
            <button onClick={() => fetchTerminals('/api/neo')}>НеоСервисе</button>
        </div>
    )
}