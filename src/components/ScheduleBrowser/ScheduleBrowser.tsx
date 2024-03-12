import React, { useContext, useEffect, useRef, useState } from 'react';
import { Tree, NodeRendererProps } from 'react-arborist';
import ScheduleContext from '../../contexts/schedule/ScheduleContext';
import { Schedule, getScheduleShortString } from 'ktscore';
import './ScheduleBrowser.css';

export default function ScheduleBrowser() {
  const { lines } = useContext(ScheduleContext)!;
  const treeRef = useRef(null);

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
                name: sch.name,
                schedule: { ...sch}
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
      ref={treeRef}
      data={data}
      openByDefault={false}
      width={400}
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
  let scheduleName = node.data.name;
  if (node.data.schedule) {
    scheduleName = `${getScheduleShortString(node.data.schedule as Schedule)} ${node.data.name || `Schedule ${node.data.scheduleid}`}`
  }

  const { setCurrentSchedule } = useContext(ScheduleContext)!;
  return (
    <div ref={dragHandle} className="kts-scheditor-schedule-row" style={style} onClick={() => {
      if (node.data.scheduleid) {
        setCurrentSchedule(Number(node.data.scheduleid));
      }
      node.toggle();
    }}>
      {scheduleName}
    </div>
  );
}