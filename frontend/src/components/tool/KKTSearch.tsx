import classes from "@/components/terminalSearch.module.scss";
import React from "react";
import {useKKTStore} from "@/hooks/store/useKKTStore";

export default function KktSearch() {
  const {filter, setFilter} = useKKTStore();

  return (
    <div className={classes.search}>
      <input value={filter} onChange={(event) => setFilter(event.target.value) }/>
    </div>
  );
}
