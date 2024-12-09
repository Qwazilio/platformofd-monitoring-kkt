"use client";
import useSocket from "@/hooks/useSocket";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import classes from "@/components/terminalImport.module.scss"
import TerminalImportXLSX from "./TerminalImportXLSX";
import TerminalImportAPI from "./TerminalImportAPI";

interface TerminalImportProps {
  setState: Dispatch<SetStateAction<boolean>>
}
export default function TerminalImport({setState}: TerminalImportProps) {
  const socket = useSocket()
  const [terminals, setTerminals] = useState<(TerminalEntity | CardEntity)[][]>([]);

  const [isDisabled, setisDisabled] = useState<boolean>(true);
    

  
  useEffect(() =>{
      if(terminals.length > 0){
        setisDisabled(false)}
      else{
       setisDisabled(true) 
      }
    }, [terminals])

  const sendOnServer = () => {
    if(!socket) return;
    socket.emit('import', terminals)
  }

  return (
    <div  className={classes.wrapper}>
      <TerminalImportXLSX  setTerminals={setTerminals} visible={setState} sendOnServer={sendOnServer}/>
      <TerminalImportAPI setTerminals={setTerminals} visible={setState} sendOnServer={sendOnServer}/>
      <button onClick={() => sendOnServer()} disabled={isDisabled}>Загрузить на сервер</button>
    </div>
  );
}
