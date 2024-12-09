import * as XLSX from 'xlsx';

interface TerminalExport{
    terminals: TerminalEntity[]
}

export default function TerminalExport ({terminals } : TerminalExport ) {

    const ExportToXSLS = () => {
        const fileName = `monitoring_ofd ${Date.now()}`
        const worksheet = XLSX.utils.json_to_sheet(terminals);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `monitoring_ofd ${Date.now()}`);
    
        // Генерируем Excel-файл и инициируем скачивание
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }

    return(
        <button onClick={() => ExportToXSLS()}>Экспорт</button>
    )
}