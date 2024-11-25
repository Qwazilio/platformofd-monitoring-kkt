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
  const [terminals, setTerminals] = useState<TerminalEntity[]>([]);

  const sendOnServer = () => {
    if(!socket) return;
    const socketData = {
      terminals: terminals
    }
    socket.emit('import', socketData)    
  }

  return (
    <div className={classes.wrapper}>
      <TerminalImportXLSX terminals={terminals} setTerminals={setTerminals} visible={setState} sendOnServer={sendOnServer}/>
      <TerminalImportAPI terminals={terminals} setTerminals={setTerminals} visible={setState} sendOnServer={sendOnServer}/>
    </div>
  );
}
