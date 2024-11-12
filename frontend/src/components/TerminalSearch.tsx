"use client";

import classes from "@/components/terminalSearch.module.scss";
import { SetStateAction, useEffect, useState } from "react";

interface TerminalSearchProps{
  list: TerminalEntity[];
  setFilterList: React.Dispatch<SetStateAction<TerminalEntity[]>>
}
export default function TerminalSerach({list, setFilterList} : TerminalSearchProps) {
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if(!list) return;
    const result = list.filter((node) => (
      node.address?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.comment?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.name_store?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.name_terminal?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.organization?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.uid_terminal?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.active_card?.uid_card?.toString().toLowerCase().includes(search.toLowerCase())
    ));
    setFilterList(result as TerminalEntity[])
  }, [search])


  return (
    <div className={classes.search}>
      <input value={search} onChange={(event) => setSearch(event.target.value) }/>
    </div>
  );
}
