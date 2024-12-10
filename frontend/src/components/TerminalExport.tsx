import * as XLSX from 'xlsx';

interface TerminalExport{
    terminals: TerminalEntity[]
}

export default function TerminalExport ({terminals } : TerminalExport ) {

    const ExportToXSLS = () => {
        const exportData = terminals.map((terminal) => ({
            "Название" : terminal.name_terminal,
            "Адрес" : terminal.address,
            "Рег. Номер" : terminal.reg_number,
            "ККН" : terminal.uid_terminal,
            "Доп. инф." : terminal.comment,
            "Организация" : terminal.organization,
            "ФН" : terminal.active_card.uid_card,
            "Дата" : new Date(terminal.active_card.end_date_card),
            "Комментарий" : terminal.notification
        }))
        console.log(terminals)
        console.log(exportData)
        const fileName = `monitoring_ofd ${Date.now()}`
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `monitoring_ofd ${Date.now()}`);
    
        // Генерируем Excel-файл и инициируем скачивание
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }

    return(
        <button onClick={() => ExportToXSLS()}>Экспорт</button>
    )
}