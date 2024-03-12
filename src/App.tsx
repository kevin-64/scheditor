import React from "react";
import ScheduleBrowser from "./components/ScheduleBrowser/ScheduleBrowser";
import ScheduleProvider from "./contexts/schedule/ScheduleProvider";
import PeriodicityEditor from "./components/PeriodicityEditor/PeriodicityEditor";
import ScheduleEditor from "./components/ScheduleEditor/ScheduleEditor";

export default function App() {
  return (
    <div id="kts-scheditor-main-container">
      <ScheduleProvider>
        <ScheduleBrowser />
        <ScheduleEditor />
        <PeriodicityEditor />
      </ScheduleProvider>
    </div>
  )
}