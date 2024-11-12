"use client";
import useSocket from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import classes from "@/components/terminalImport.module.scss"

const convertExcelDateToJSDate = (excelDate) => {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date;
};

interface TerminalImportProps {}
export default function TerminalImport({}: TerminalImportProps) {
  const socket = useSocket()
  const [terminals, setTerminals] = useState<TerminalEntity[]>([]);
  const [isDisabled, setisDisabled] = useState<boolean>(true);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result as any);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const terminalData = json.map((row) => ({
        name_store: row["Наименование магазина"] as string,
        name_terminal: row["Наименование кассы"] as string,
        uid_terminal: row["ЗН"] as number,
        reg_number: row["РНМ"] as number,
        comment: row["Дополнительный идентификатор"] as string,
        address: row["Адрес кассы"] as string,
        end_date_sub: convertExcelDateToJSDate(row["Дата окончания подписки"]) as Date,
        card: {
          end_date_card: convertExcelDateToJSDate(
            row["Прогнозируемая дата окончания ФН"] as Date
          ),
          uid_card: row["ФН"] as number,
          uid_terminal: row["ЗН"] as number,
        }
      }));

      setTerminals(terminalData)
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() =>{
    if(terminals.length > 0)
      setisDisabled(false)
  }, [terminals])

  const sendOnServer = () => {
    if(!socket) return;
    const socketData = {
      terminals: terminals
    }
    socket.emit('import', socketData)
  }


  return (
    <div className={classes.wrapper}>
      <input
        onChange={(event) => handleFileUpload(event)}
        type="file"
        accept=".xlsx, .xls"
      />      
      <button onClick={() => sendOnServer()} disabled={isDisabled}>Загрузить на сервер</button>
    </div>
  );
}
