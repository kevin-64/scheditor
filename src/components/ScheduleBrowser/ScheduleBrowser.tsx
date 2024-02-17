import React, { useContext, useEffect, useState } from 'react';
import TreeView from "react-accessible-treeview";
import ScheduleContext from '../../contexts/schedule/ScheduleContext';

export default function ScheduleBrowser() {
  const { lines } = useContext(ScheduleContext)!;

  const [data, setData] = useState<any>([{
    name: "",
    id: 0,
    children: [],
    parent: null,
  }]);

  useEffect(() => {
    setData([
      {
        name: "",
        id: 0,
        children: [...lines.map(ln => `L-${ln.lineid}`)],
        parent: null,
      },
      ...lines.map(ln => {
        return {
          ...ln,
          id:`L-${ln.lineid}`,
          parent: 0,
          children: [...ln.schedules.map(sch => `S-${sch.scheduleid}`)],
          isBranch: true
        }
      }),
      ...lines.flatMap(ln => ln.schedules).map(sch => {
        return {
          id: `S-${sch.scheduleid}`,
          name: `Schedule ${sch.scheduleid}`, //TODO: have actual name
          parent: sch.lineid,
          children: [],
        }
      })
    ])
  }, [lines.length]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <TreeView
      data={data}
      className="basic"
      aria-label="basic example tree"
      nodeRenderer={({ element, getNodeProps, level, handleSelect }) => (
        <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
          {element.name}
        </div>
      )}
    />
  )
}