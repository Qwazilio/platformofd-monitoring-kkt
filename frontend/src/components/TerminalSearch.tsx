"use client";

import classes from "@/components/terminalSearch.module.scss";
import { SetStateAction, useEffect, useState } from "react";

interface TerminalSearchProps{
  list: TerminalEntity[];
  setList: React.SetStateAction<TerminalEntity[]>
}
export default function TerminalSerach({list, setList} : TerminalSearchProps) {
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    const result = list.filter((node) => (
      node.name_terminal.toLowerCase().toString().includes(search.toLowerCase())
    ));
    setList(result as TerminalEntity[])
  }, [search])


  return (
    <div className={classes.search}>
      <input value={search} onChange={(event) => setSearch(event.target.value) }/>
    </div>
  );
}
