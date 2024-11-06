"use client";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const convertExcelDateToJSDate = (excelDate) => {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date;
};

interface TerminalImportProps {}
export default function TerminalImport({}: TerminalImportProps) {
  const [terminals, setTerminals] = useState<TerminalEntity[]>([]);
  const [cards, setCards] = useState<CardEntity[]>([])

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result as any);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      // Фильтрация нужных столбцов
      const terminalData = json.map((row) => ({
        name_store: row["Наименование магазина"] as string,
        name_terminal: row["Наименование кассы"] as string,
        uid_terminal: row["ЗН"] as number,
        reg_number: row["РНМ"] as number,
        comment: row["Дополнительный идентификатор"] as string,
        address: row["Адрес кассы"] as string,
        date_end_sub: convertExcelDateToJSDate(row["Дата окончания подписки"]) as Date,
      } as TerminalEntity));
      const cardData = json.map((row) => ({
        end_date_card: convertExcelDateToJSDate(
          row["Прогнозируемая дата окончания ФН"] as Date
        ),
        uid_card: row["ФН"] as number,
      } as CardEntity));
      setTerminals(terminalData)
      
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    console.log(terminals);
  }, [terminals])

  return (
    <div>
      <input
        onChange={(event) => handleFileUpload(event)}
        type="file"
        accept=".xlsx, .xls"
      />
    </div>
  );
}
