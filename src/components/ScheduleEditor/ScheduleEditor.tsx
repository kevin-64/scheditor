import './ScheduleEditor.css';

import React, { useContext } from "react";
import { Schedule, getScheduleLongString } from 'ktscore';
import EditContext from '../../contexts/edit/EditContext';
import ScheduleContext from '../../contexts/schedule/ScheduleContext';

export default function ScheduleEditor() {
  const { newSchedule } = useContext(ScheduleContext)!;
  const { scheduleData, 
          newName, newFrom, newTo, setNewName, setNewFrom, setNewTo, 
          commitChanges, deleteSchedule, toggleEditingPeriodicity } = useContext(EditContext)!;

  const applyChanges = () => {
    const body = {
      ...scheduleData,
      startvalidity: newFrom,
      endvalidity: newTo === '' ? null : newTo,
      name: newName,
    }
    
    commitChanges(body as Schedule);
  }

  return (
    scheduleData?.startvalidity ? (
    <div className={`kts-scheditor-schedule-editor`}>
        <label htmlFor="schedule-name">Name:</label> 
        <input type="text"
                id="schedule-name"
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}></input>
        <button onClick={() => applyChanges()}>{scheduleData.scheduleid ? 'Update' : 'Create'}</button>
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
        <br />
        {scheduleData.scheduleid && (<button onClick={() => newSchedule({...scheduleData, scheduleid: undefined})}>Clone</button>)}
        {scheduleData.scheduleid && (<button onClick={() => deleteSchedule()}>Delete</button>)}
      </div>) : <></>
  )
}