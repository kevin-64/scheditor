import React, { useContext } from 'react';
import { Tree, NodeRendererProps } from 'react-arborist';
import ScheduleContext from '../../contexts/schedule/ScheduleContext';
import { Schedule, getScheduleShortString } from 'ktscore';
import './ScheduleBrowser.css';
import TreeContext from '../../contexts/tree/TreeContext';

export default function ScheduleBrowser() {
  const { treeData } = useContext(TreeContext)!;

  return (
    <Tree
      data={treeData}
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

  const { setCurrentSchedule, newSchedule } = useContext(ScheduleContext)!;
  return (
    <div ref={dragHandle} className="kts-scheditor-schedule-row" style={style} onClick={() => {
      if (node.data.scheduleid) {
        setCurrentSchedule(Number(node.data.scheduleid));
      } else if (node.data.isNew) {
        newSchedule({lineid: node.data.lineid})
      }
      node.toggle();
    }}>
      {scheduleName}
    </div>
  );
}