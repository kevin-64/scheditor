import './PeriodicityEditor.css';

import React, { useContext, useEffect, useState } from "react";
import { Periodicity, getIndexOfWeekday, getWeekdayFromIndex, RepetitionPeriod, Schedule } from 'ktscore';
import axios from 'axios';
import ScheduleContext from '../../contexts/schedule/ScheduleContext';

export default function PeriodicityEditor() {
  const { currentSchedule: scheduleId, editingPeriodicity, setEditingPeriodicity } = useContext(ScheduleContext)!;
  const [scheduleData, setScheduleData] = useState<Schedule | undefined>();
  const [weekdays, setWeekdays] = useState<boolean[]>([]);
  const [repetitions, setRepetitions] = useState<[number, RepetitionPeriod][]>([])
  const [yearly, setYearly] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState(1);
  const [periodToAdd, setPeriodToAdd] = useState('');

  useEffect(() => {
    if (!scheduleId || !editingPeriodicity) return;
    axios.get(`http://localhost:8080/schedules/${scheduleId}`).then(res => {
      const sch = res.data as Schedule;

      setScheduleData(sch);

      console.log(sch.periodicity);
      const { daysOfTheWeek, repeat, everyYear } = sch.periodicity;
      const days = [false, false, false, false, false, false, false];
      const dotwArr = daysOfTheWeek || [];
      dotwArr.forEach(d => {
        days[getIndexOfWeekday(d)] = true;
      })
      setWeekdays([...days]);

      const rep: [number, RepetitionPeriod][] = [];
      if (repeat?.seconds) rep.push([repeat.seconds!, 'seconds']);
      if (repeat?.minutes) rep.push([repeat.minutes!, 'minutes']);
      if (repeat?.hours) rep.push([repeat.hours!, 'hours']);
      if (repeat?.days) rep.push([repeat.days!, 'days']);
      if (repeat?.weeks) rep.push([repeat.weeks!, 'weeks']);
      if (repeat?.months) rep.push([repeat.months!, 'months']);
      setRepetitions([...rep]);

      setYearly(everyYear || false);
    });
  }, [scheduleId, editingPeriodicity]);

  const setDay = (day: number, selected: boolean) => {
    const newWeekdays = [...weekdays];
    newWeekdays[day] = selected;
    setWeekdays(newWeekdays);
  }

  const addRepetition = () => {
    if (!amountToAdd || !periodToAdd) return;
    if (periodToAdd === 'seconds' && amountToAdd !== 30) return;

    const newRep = [...repetitions];
    newRep.push([amountToAdd, periodToAdd as RepetitionPeriod]);
    setRepetitions([...newRep]);

    setPeriodToAdd('');
  }

  const removeRepetition = (period: RepetitionPeriod) => {
    const newRep = repetitions.filter(rep => rep[1] !== period);
    setRepetitions([...newRep]);
  }

  const updateSchedule = () => {
    const repeat: {
      [key in RepetitionPeriod]?: number
    } = {};
    repetitions.forEach(rep => {
      repeat[rep[1] as RepetitionPeriod] = rep[0];
    });

    const body = {
      ...scheduleData,
      scheduleid: scheduleId,
      periodicity: {
        everyYear: yearly,
        repeat,
        daysOfTheWeek: weekdays.map((isSelected, index) => {
          return {
            index,
            isSelected
          }
        }).filter(wd => wd.isSelected)
          .map(wd => getWeekdayFromIndex(wd.index))
      } as Periodicity
    };

    console.log(body);

    axios.put(`http://localhost:8080/schedules/${scheduleId}`, body).then(() => close());
  }

  const close = () => {
    setEditingPeriodicity(false);
  }

  return (
    (scheduleId && editingPeriodicity) ? (
    <div className={`kts-scheditor-period-editor`}>
      <button onClick={() => close()}>Close</button><br />
      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => {
        return (
          <div key={`container-${day}`}>
            <label htmlFor={`period-${day}`}>{day}:</label> 
            <input type="checkbox"
                          id={`period-${day}`}
                          checked={weekdays[index] || false} 
                          onChange={(e) => setDay(index, e.target.checked)}></input>
          </div>
        )
      })}
      {repetitions.map(([times, period]) => {
        return (
          <div key={`container-${period}`}>
            Every {times} {period}
            <button onClick={() => removeRepetition(period)}>X</button>
          </div>
        )
      })}
      <div key="container-add">
        <button onClick={() => addRepetition()}>+</button>
        <span>Every </span> 
        <input type="text"
                id={`amount-add`}
                value={amountToAdd} 
                onChange={(e) => setAmountToAdd(Number(e.target.value))}></input>
        <select id={`period-add`} value={periodToAdd} onChange={e => setPeriodToAdd(e.target.value)}>
          <option value="">Select period</option>
          {['seconds', 'minutes', 'hours', 'days', 'weeks', 'months']
            .filter(p => !repetitions.map(r => r[1]).includes(p as RepetitionPeriod))
            .map(p => {
            return (
              <option key={p} value={p}>{p}</option>
            )
          })}
        </select>
      </div>
      <div key="yearly-repeat">
        <label htmlFor='period-yearly'>Repeat every year</label>
        <input type="checkbox"
               id={`period-yearly`}
               checked={yearly} 
               onChange={(e) => setYearly(e.target.checked)}></input>
      </div>

      <button onClick={() => updateSchedule()}>Update</button>
    </div>) : <></>
  )
}