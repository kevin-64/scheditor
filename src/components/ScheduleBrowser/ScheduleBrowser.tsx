import React, { useContext, useEffect, useState } from 'react';
import { Tree, NodeRendererProps } from 'react-arborist';
import ScheduleContext from '../../contexts/schedule/ScheduleContext';
import './ScheduleBrowser.css';

export default function ScheduleBrowser() {
  const { lines } = useContext(ScheduleContext)!;

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    setData([
      ...lines.flatMap(ln => {
        return [{
          ...ln,
          id: `L-${ln.lineid}`,
          name: `Line ${ln.lineid}`,
          children: [
            ...[...ln.schedules.map(sch => {
              return {
                id: `S-${sch.scheduleid}`,
                scheduleid: `${sch.scheduleid}`,
                name: `Schedule ${sch.scheduleid}`
              }
            }), {
              id: `L-${ln.lineid}-ADD`,
              name: `+ New Schedule`
            }]
          ],
        }]
      })
    ])
  }, [lines.length]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Tree
      data={data}
      openByDefault={false}
      width={200}
      height={1000}
      indent={24}
      rowHeight={20}
      padding={0}
      className="kts-scheditor-schedule-tree"
      >
        {Node}
    </Tree>
  )
}

const Node = ({node, style, dragHandle}: NodeRendererProps<any>) => {
  const { setCurrentSchedule } = useContext(ScheduleContext)!;
  return (
    <div ref={dragHandle} className="kts-scheditor-schedule-row" style={style} onClick={() => {
      if (node.data.scheduleid) {
        setCurrentSchedule(Number(node.data.scheduleid));
      }
      node.toggle();
    }}>
      {node.data.name}
    </div>
  );
}