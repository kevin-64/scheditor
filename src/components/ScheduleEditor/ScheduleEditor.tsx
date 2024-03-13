import './ScheduleEditor.css';

import React, { useContext } from "react";
import { Schedule, getScheduleLongString } from 'ktscore';
import ScheduleContext from '../../contexts/schedule/ScheduleContext';
import EditContext from '../../contexts/edit/EditContext';

export default function ScheduleEditor() {
  const { currentSchedule: scheduleId } = useContext(ScheduleContext)!;
  const { scheduleData, 
          newName, newFrom, newTo, setNewName, setNewFrom, setNewTo, 
          commitChanges, toggleEditingPeriodicity } = useContext(EditContext)!;

  const updateSchedule = () => {
    const body = {
      ...scheduleData,
      scheduleid: scheduleId,
      startvalidity: newFrom,
      endvalidity: newTo === '' ? null : newTo,
      name: newName,
    }
    
    commitChanges(body as Schedule);
  }

  // const close = () => {
  //   setViewMode(ViewMode.NORMAL);
  //   setPopup(undefined);
  // }

  return (
    scheduleData?.scheduleid ? (
    <div className={`kts-scheditor-schedule-editor`}>
      {/* <button onClick={() => close()}>Close</button><br /> */}
        <label htmlFor="schedule-name">Name:</label> 
        <input type="text"
                id="schedule-name"
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}></input>
        <button onClick={() => updateSchedule()}>Update</button>
        <br />
        <div>{getScheduleLongString(scheduleData as Schedule)}</div>
        <button onClick={() => toggleEditingPeriodicity()}>Periodicity...</button>
        <br />
        <label htmlFor="schedule-from">Starts:</label> 
        <input type="date"
                id="schedule-from"
                value={newFrom} 
                onChange={(e) => { 
                  setNewFrom(e.target.value);  

                  //ugly workaround to force close the datepicker
                  e.target.type="text";
                  e.target.type="date";
                }}></input>
        <label htmlFor="schedule-to">Ends:</label> 
        <input type="date"
                id="schedule-to"
                value={newTo} 
                onChange={(e) => setNewTo(e.target.value)}></input>
      </div>) : <></>
  )
}