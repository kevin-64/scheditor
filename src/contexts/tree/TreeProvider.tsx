import React, { PropsWithChildren, useContext, useMemo } from "react";
import ScheduleContext from "../schedule/ScheduleContext";
import TreeContextType from "./TreeContextType";
import TreeContext from "./TreeContext";

export default function TreeProvider(props: PropsWithChildren) {
  const { lines } = useContext(ScheduleContext)!;

  const treeData = [...lines.flatMap(ln => {
    return [{
      ...ln,
      id: `L-${ln.lineid}`,
      name: `Line ${ln.lineid}`,
      children: [
        ...[...ln.schedules.map(sch => {
          return {
            id: `S-${sch.scheduleid}`,
            scheduleid: `${sch.scheduleid}`,
            name: sch.name,
            schedule: { ...sch}
          }
        }), {
          id: `L-${ln.lineid}-ADD`,
          name: `+ New Schedule`
        }]
      ],
    }]
  })]

  const provider = useMemo<TreeContextType>(() => {
    return {
      treeData
    }
  }, [lines]);

  return (
    <TreeContext.Provider value={provider}>
      {props.children}
    </TreeContext.Provider>
  )
}