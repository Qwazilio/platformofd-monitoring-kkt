"use client";

import classes from "@/components/terminalSearch.module.scss";
import React, { SetStateAction, useEffect, useState } from "react";

interface TerminalSearchProps{
  list: TerminalEntity[];
  setFilterList: React.Dispatch<SetStateAction<TerminalEntity[]>>
  setState: React.Dispatch<SetStateAction<boolean>>
}
export default function TerminalSerach({list, setFilterList, setState} : TerminalSearchProps) {
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    setState(search.length > 0)

    if(!list) return;
    const result = list.filter((node) => (
      node.address?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.comment?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.name_store?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.name_terminal?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.organization?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.uid_terminal?.toString().toLowerCase().includes(search.toLowerCase()) ||
      node.active_card?.uid_card?.toString().toLowerCase().includes(search.toLowerCase()) || 
      node.notification?.toString().toLowerCase().includes(search.toLowerCase())
    ));
    setFilterList(result as TerminalEntity[])
  }, [search, list])


  return (
    <div className={classes.search}>
      <input value={search} onChange={(event) => setSearch(event.target.value) }/>
    </div>
  );
}
