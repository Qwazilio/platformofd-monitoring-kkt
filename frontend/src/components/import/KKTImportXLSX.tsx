import classes from "@/components/terminalImport.module.scss"
import React, { Dispatch, SetStateAction } from "react";
import * as XLSX from "xlsx";

interface TerminalImportXLSXProps{
    setKkt: Dispatch<SetStateAction<KktEntity[] | []>>
}
export default function KKTImportXLSX({setKkt} : TerminalImportXLSXProps) {

    const convertExcelDateToJSDate = (excelDate: number) => {
        return new Date((excelDate - 25569) * 86400 * 1000);
    };
      
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKkt([]);
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = (event : ProgressEvent<FileReader>) => {
          const data = new Uint8Array(event.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
    
          const terminalData: KktEntity[] = json.map((row) => ({
            organization: row["Наименование магазина"] as string,
            name_terminal: row["Наименование кассы"] as string,
            uid_terminal: row["ЗН"] as string,
            reg_number: row["РНМ"] as string,
            comment: row["Дополнительный идентификатор"] as string,
            address: row["Адрес кассы"] as string,
            end_date_sub: convertExcelDateToJSDate(row["Дата окончания подписки"]),
            active_card: {
                end_date_card: convertExcelDateToJSDate(row["Прогнозируемая дата окончания ФН"]),
                uid_card: row["ФН"] as string,
                uid_terminal: row["ЗН"] as string,
            } as CardEntity
          }));
            setKkt(terminalData)
        };
    
        reader.readAsArrayBuffer(file);
    };

    return(
        <div className={classes.wrapper}>
        <h3 style={{textAlign: "center", fontSize: "1.2em"}}>Импорт из файла</h3>
        <input
          onChange={(event) => handleFileUpload(event)}
          type="file"
          accept=".xlsx, .xls"
        />      
      </div>
    )
}