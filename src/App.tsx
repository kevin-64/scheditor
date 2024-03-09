import React from "react";
import ScheduleBrowser from "./components/ScheduleBrowser/ScheduleBrowser";
import ScheduleProvider from "./contexts/schedule/ScheduleProvider";
import PeriodicityEditor from "./components/PeriodicityEditor/PeriodicityEditor";

export default function App() {
  return (
    <div id="kts-scheditor-main-container">
      <ScheduleProvider>
        <ScheduleBrowser />
        <PeriodicityEditor />
      </ScheduleProvider>
    </div>
  )
}