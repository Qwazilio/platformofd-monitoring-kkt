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

    const fetchTerminals = async (route : string) => {
        setTerminals([])
        try{
            const response = await axios.get(route)

            if(!response.data) return;
            const {kkts, branches} = response.data.kktList.orgBranches[0]

            const sortKkts = kkts.map((kkt) => ({
                name_terminal: kkt.kktName,
                uid_terminal: kkt.kktNumber,
                end_date_sub: kkt.kktCurrentSubscriptionDateTill,
                organization: response.data.kktList.orgName,
                address: kkt.retailAddress,
                last_active: kkt.kktLastCheckStatusDate,
                comment: kkt.deviceComment,
                card: {
                    uid_card: kkt.kktFN,
                    end_date_card: kkt.kktFnDateTill
                } as CardEntity,
            }) as TerminalEntity)

            setTerminals((prev) => [...prev, ...sortKkts])
            
            branches.forEach(branch => {
                const sortKkts = branch.kkts.map((kkt) => ({
                    name_terminal: kkt.kktName,
                    uid_terminal: kkt.kktNumber,
                    end_date_sub: kkt.kktCurrentSubscriptionDateTill,
                    organization: response.data.kktList.orgName,
                    address: kkt.retailAddress,
                    last_active: kkt.kktLastCheckStatusDate,
                    comment: kkt.deviceComment,
                    name_store: branch.branchName,
                    card: {
                        uid_card: kkt.kktFN,
                        end_date_card: kkt.kktFnDateTill
                    } as CardEntity,
                } as TerminalEntity))
                setTerminals((prev) => [...prev, ...sortKkts])
            });
            console.log(terminals)
        } catch (error) {
            console.log(`API error!${error}`)
        }
    }

    return(
        <div>
            <button onClick={() => fetchTerminals('/api/ipk')}>ИПК</button>
            <button onClick={() => fetchTerminals('/api/ipg')}>ИПЖ</button>
            <button onClick={() => fetchTerminals('/api/mm')}>ММ</button>
            <button onClick={() => fetchTerminals('/api/mmr')}>ММР</button>
            <button onClick={() => fetchTerminals('/api/db')}>Дом Быта</button>
            <button onClick={() => fetchTerminals('/api/neo')}>НеоСервисе</button>
        </div>
    )
}