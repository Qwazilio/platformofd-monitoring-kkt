import classes from "@/ui/offcanvasWindow.module.scss"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"

interface OffcanvasWindowProps{ 
    title: string
    close: Dispatch<SetStateAction<boolean>>
    children?: React.ReactNode
}
export default function PopupWindow ({title, close, children} : OffcanvasWindowProps) {


    return(
        <div className={classes.wrapper}>
            <div className={classes.body}>
                {children}
            </div>
        </div>
    )
}