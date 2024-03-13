import React from "react";
import ScheduleBrowser from "./components/ScheduleBrowser/ScheduleBrowser";
import ScheduleProvider from "./contexts/schedule/ScheduleProvider";
import PeriodicityEditor from "./components/PeriodicityEditor/PeriodicityEditor";
import ScheduleEditor from "./components/ScheduleEditor/ScheduleEditor";
import TreeProvider from "./contexts/tree/TreeProvider";
import EditProvider from "./contexts/edit/EditProvider";

export default function App() {
  return (
    <div id="kts-scheditor-main-container">
      <ScheduleProvider>
        <TreeProvider>
          <EditProvider>
            <ScheduleBrowser />
            <ScheduleEditor />
            <PeriodicityEditor />
          </EditProvider>
        </TreeProvider>
      </ScheduleProvider>
    </div>
  )
}