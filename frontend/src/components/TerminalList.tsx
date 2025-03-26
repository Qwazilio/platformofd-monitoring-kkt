"use client";

import axiosDefault from "@/lib/axiosDefault";
import { ReactNode, useCallback, useEffect, useState } from "react";
import classes from "@/components/terminalList.module.scss";
import TerminalSerach from "./TerminalSearch";
import TerminalImport from "./TerminalImport";
import OffcanvasWindow from "@/ui/offcanvasWindow";
import useSocket from "@/hooks/useSocket";
import TerminalInfo from "./TerminalInfo";
import TerminalExport from "./TerminalExport";

export default function TerminalList() {
  const socket = useSocket();
  const [list, setList] = useState<ReactNode>(<></>);
  const [count, setCount] = useState<number>(0);
  const [terminals, setTerminals] = useState<TerminalEntity[]>([]);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [filterTerminals, setFilterTerminals] = useState<TerminalEntity[]>([]);
  const [showImport, setShowImport] = useState<boolean>(false);
  const [showTerminalInfo, setshowTerminalInfo] = useState<boolean>(false);
  const [terminalInfo, setTerminalInfo] = useState<TerminalEntity | null>(null);
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [showStock, setShowStock] = useState<boolean>(false);

  const changeShowImport = () => {
    if (showImport) setShowImport(false);
    else setShowImport(true);
  };

  const getTerminalList = async () => {
    try {
      const response = await axiosDefault.get("/terminal/list");
      const { data } = response;

      if (data) {
        setTerminals(sortByFN(data));
      } else console.log("No data received from the server");
    } catch (error) {
      console.log(`Error get terminal list! ${error}`);
    }
  };

  const sortByFN = (list: TerminalEntity[]) => {
    const sortedList = list.toSorted((a: TerminalEntity, b: TerminalEntity) => {
      const endDateA = new Date(a.active_card.end_date_card);
      const endDateB = new Date(b.active_card.end_date_card);
      return endDateA.getTime() - endDateB.getTime();
    });
    return sortedList;
  };

  const sortBySub = (list: TerminalEntity[]) => {
    const sortedList = list.toSorted((a: TerminalEntity, b: TerminalEntity) => {
      const endDateA = new Date(a.end_date_sub);
      const endDateB = new Date(b.end_date_sub);
      return endDateA.getTime() - endDateB.getTime();
    });
    return sortedList;
  };

  const viewList = useCallback((terminals: TerminalEntity[]) => {
    const new_list = terminals
      .filter(terminal => 
        (showDeleted === terminal.deleted) && 
        (showStock === terminal.stock)
      )
      .map(node);
  
    setList(new_list);
    setCount(new_list.length);
  }, [showDeleted, showStock, setList, setCount]);

  const listForExport = (terminals: TerminalEntity[]) =>
    terminals.filter(
      (terminal) =>
        showDeleted === terminal.deleted && showStock === terminal.stock
    );
    

  const node = (terminal: TerminalEntity) => {
    return (
      <div
        className={`
            ${classes.terminal}

            ${(terminal.broken) ? classes.broken : ""}
        `}
        key={terminal.uid_terminal}
        onClick={() => viewTerminal(terminal.id)}
      >
        <div className={classes.info}>{terminal.name_terminal}</div>
        <div className={classes.info}>{terminal.address}</div>
        <div className={classes.info}>{terminal.uid_terminal}</div>
        <div className={classes.info}>
          {terminal.end_date_sub
            ? new Date(terminal.end_date_sub).toLocaleDateString()
            : "Нет подписки"}
        </div>
        <div className={classes.info}>
          {terminal.active_card
            ? new Date(terminal.active_card.end_date_card).toLocaleDateString()
            : "Нет ФН"}
        </div>
      </div>
    );
  };

  const viewTerminal = async (terminal_id: number) => {
    try {
      const response = await axiosDefault.get("/terminal", {
        params: {
          id: terminal_id,
        },
      });
      const { data } = response;
      if (data) {
        setTerminalInfo(data);
        setshowTerminalInfo(true);
      } else console.log("no data!");
    } catch (error) {
      console.log(`Error get terminal! ${error}`);
    }
  };

  useEffect(() => {
    getTerminalList();
  }, []);

  useEffect(() => {
    if (!isSearch) viewList(terminals);
    else viewList(filterTerminals);
  }, [showDeleted, terminals, showStock, isSearch, filterTerminals]);

  useEffect(() => {
    if (!socket) return;

    socket.on("terminalListChanged", (terminals) => {
      setTerminals(sortByFN(terminals));
      setShowImport(false);
      setshowTerminalInfo(false);
    });

    return () => {
      socket.off("terminalListChanged");
    };
  }, [socket]);

  return (
    <div>
      {showImport && (
        <OffcanvasWindow title={"Импорт терминалов"} close={setShowImport}>
          <TerminalImport setState={setShowImport} />
        </OffcanvasWindow>
      )}
      <div style={{ position: "sticky", top: "0px", zIndex: "999999999" }}>
        <div style={{ position: "relative" }}>
          {showTerminalInfo && (
            <OffcanvasWindow title={"Терминал"} close={setshowTerminalInfo}>
              <TerminalInfo terminal={terminalInfo} />
            </OffcanvasWindow>
          )}
        </div>
      </div>

      <div className={classes.tools}>
        <TerminalSerach
          list={terminals}
          setFilterList={setFilterTerminals}
          setState={setIsSearch}
        />

        <div className={classes.sorts}>
          <div
            onClick={() => {
              if (showStock) setShowStock(false);
              else setShowStock(true);
            }}
          >
            <label>На складе</label>
            <input
              type={"checkbox"}
              checked={showStock}
              onChange={(event) => setShowStock(event.target.checked)}
            />
          </div>
          <div
            onClick={() => {
              if (showDeleted) setShowDeleted(false);
              else setShowDeleted(true);
            }}
          >
            <label>Удаленные</label>
            <input
              type={"checkbox"}
              checked={showDeleted}
              onChange={(event) => setShowDeleted(event.target.checked)}
            />
          </div>
          <button onClick={() => setTerminals(sortBySub(terminals))}>
            Сорт. по Дате подписки
          </button>
          <button onClick={() => setTerminals(sortByFN(terminals))}>
            Сорт. по Дате ФН
          </button>
          <button onClick={() => changeShowImport()}>
            {!showImport ? "Загрузить" : "Закрыть"}
          </button>
        </div>

        <TerminalExport
          terminals={
            filterTerminals
              ? listForExport(filterTerminals)
              : listForExport(terminals)
          }
        />
      </div>
      <span>Показано {count} теминалов</span>
      <div className={classes.wrapper}>
        <div className={classes.headerTerminal}>
          <label>Название</label>
          <label>Адрес</label>
          <label>ККМ</label>
          <label>Срок подписки</label>
          <label>Срок ФН</label>
        </div>
        {list}
      </div>
    </div>
  );
}
