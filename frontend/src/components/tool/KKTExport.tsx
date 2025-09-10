import * as XLSX from 'xlsx';
import {useKKTStore} from "@/hooks/store/useKKTStore";

export default function KktExport () {
    const {filtredKkts} = useKKTStore();

    const ExportToXSLS = () => {
        const exportData = filtredKkts.map((kkt: KktEntity) => ({
            "Название" : kkt.name_terminal,
            "Адрес" : kkt.address,
            "Рег. Номер" : kkt.reg_number,
            "ККН" : kkt.uid_terminal,
            "Доп. инф." : kkt.comment,
            "Организация" : kkt.organization,
            "ФН" : kkt.active_card.uid_card,
            "Дата" : new Date(kkt.active_card.end_date_card),
            "Комментарий" : kkt.notification,
            "Модель" : kkt.kkt_model
        }))
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