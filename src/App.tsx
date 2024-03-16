import React from "react";
import ScheduleBrowser from "./components/ScheduleBrowser/ScheduleBrowser";
import ScheduleProvider from "./contexts/schedule/ScheduleProvider";
import PeriodicityEditor from "./components/PeriodicityEditor/PeriodicityEditor";
import ScheduleEditor from "./components/ScheduleEditor/ScheduleEditor";
import TreeProvider from "./contexts/tree/TreeProvider";
import EditProvider from "./contexts/edit/EditProvider";
import TimetableEditor from "./components/TimetableEditor/TimetableEditor";

export default function App() {
  return (
    <div id="kts-scheditor-main-container">
      <ScheduleProvider>
        <TreeProvider>
          <EditProvider>
            <ScheduleBrowser />
            <div id="kts-scheditor-sch-container">
              <div id="kts-scheditor-details-container">
                <ScheduleEditor />
                <PeriodicityEditor />
              </div>
              <div id="kts-scheditor-tt-container">
                <TimetableEditor />
              </div>
            </div>
          </EditProvider>
        </TreeProvider>
      </ScheduleProvider>
    </div>
  )
}