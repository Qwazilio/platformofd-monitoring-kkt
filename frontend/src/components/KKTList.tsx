import { useEffect, useState } from "react";
import classes from "@/components/terminalList.module.scss";
import {useKKTStore} from "@/hooks/store/useKKTStore";
import KKTNode from "@/components/KKTNode";


export default function KKTList() {
  const { filtredKkts } = useKKTStore();
  const [countKkts, setCountKkts] = useState<number>(0);

  useEffect(() => {
    setCountKkts(filtredKkts.length)
  }, [filtredKkts]);

  return (
    <div>
      <span>Показано {countKkts} терминалов</span>
      <div className={classes.wrapper}>
        <div className={classes.headerTerminal}>
          <label>Название</label>
          <label>Адрес</label>
          <label>ККМ</label>
          <label>Срок подписки</label>
          <label>Срок ФН</label>
        </div>
        {filtredKkts.map((kkt: KktEntity, index: number) => <KKTNode key={index} kkt={kkt}/>)}
      </div>
    </div>
  );
}
