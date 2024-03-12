import './ScheduleEditor.css';

import React, { useContext, useEffect, useState } from "react";
import { Schedule } from 'ktscore';
import axios from 'axios';
import ScheduleContext from '../../contexts/schedule/ScheduleContext';

export default function ScheduleEditor() {
  const { currentSchedule: scheduleId, setEditingPeriodicity } = useContext(ScheduleContext)!;
  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [scheduleData, setScheduleData] = useState<Schedule | undefined>();

  useEffect(() => {
    if (!scheduleId) return;

    axios.get(`http://localhost:8080/schedules/${scheduleId}`).then(res => {
      const sch = res.data as Schedule;
      setScheduleData({...sch});

      console.log(sch);
      setFrom(sch.startvalidity.substring(0, 10));

      if (sch.endvalidity) {
        setTo(sch.endvalidity.substring(0, 10));
      }

      setName(sch.name || '');
    });
  }, [scheduleId]);

  const updateSchedule = () => {
    const body = {
      ...scheduleData,
      startvalidity: from,
      endvalidity: to === '' ? null : to,
      name,
    }
    axios.put(`http://localhost:8080/schedules/${scheduleId}`, body);
  }

  // const close = () => {
  //   setViewMode(ViewMode.NORMAL);
  //   setPopup(undefined);
  // }

  return (
    scheduleId ? (
    <div className={`kts-scheditor-schedule-editor`}>
      {/* <button onClick={() => close()}>Close</button><br /> */}
        <label htmlFor="schedule-name">Name:</label> 
        <input type="text"
                id="schedule-name"
                value={name} 
                onChange={(e) => setName(e.target.value)}></input>
        <button onClick={() => setEditingPeriodicity(true)}>Periodicity...</button>
        <button onClick={() => updateSchedule()}>Update</button>
        <br />
        <label htmlFor="schedule-from">Starts:</label> 
        <input type="date"
                id="schedule-from"
                value={from} 
                onChange={(e) => { 
                  setFrom(e.target.value);  

                  //ugly workaround to force close the datepicker
                  e.target.type="text";
                  e.target.type="date";
                }}></input>
        <label htmlFor="schedule-to">Ends:</label> 
        <input type="date"
                id="schedule-to"
                value={''} 
                onChange={(e) => setTo(e.target.value)}></input>
      </div>) : <></>
  )
}