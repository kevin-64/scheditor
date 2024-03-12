import React from "react";
import ScheduleBrowser from "./components/ScheduleBrowser/ScheduleBrowser";
import ScheduleProvider from "./contexts/schedule/ScheduleProvider";
import PeriodicityEditor from "./components/PeriodicityEditor/PeriodicityEditor";
import ScheduleEditor from "./components/ScheduleEditor/ScheduleEditor";
import TreeProvider from "./contexts/tree/TreeProvider";

export default function App() {
  return (
    <div id="kts-scheditor-main-container">
      <ScheduleProvider>
        <TreeProvider>
          <ScheduleBrowser />
          <ScheduleEditor />
          <PeriodicityEditor />
        </TreeProvider>
      </ScheduleProvider>
    </div>
  )
}