import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import ScheduleContextType from "./ScheduleContextType";
import axios from "axios";
import ScheduleContext from "./ScheduleContext";
import { Line, LineWithSchedules, Schedule } from "ktscore";

export default function ScheduleProvider(props: PropsWithChildren) {
  const [linesWithSchedules, setLinesWithSchedules] = useState<LineWithSchedules[]>([]);
  const [currSchedule, setCurrSchedule] = useState<number | undefined>();
  const [editPeriodicity, setEditPeriodicity] = useState(false);

  const loadSchedules = () => {
    axios.get('http://localhost:8080/lines').then((res) => {
      const lines = res.data as Line[];
      const promises = lines.map(ln => new Promise<LineWithSchedules>((resolve, reject) => {
        return axios.get(`http://localhost:8080/lines/${ln.lineid}/schedules`).then(
          resp => resolve({...ln, schedules: resp.data as Schedule[] } as LineWithSchedules)
        ).catch((err) => reject(err))
      }));
      Promise.all(promises).then(lsch => {
        setLinesWithSchedules(lsch);
      })
    });
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  useEffect(() => {
    console.log(linesWithSchedules)
  }, [linesWithSchedules])

  useEffect(() => {
    console.log(currSchedule)
  }, [currSchedule])

  const provider = useMemo<ScheduleContextType>(() => {
    return {
      lines: linesWithSchedules,
      currentSchedule: currSchedule,
      editingPeriodicity: editPeriodicity,
      
      updateSchedule: (sch: Schedule) => {
        const newLines = [...linesWithSchedules];
        const lnIndex = newLines.findIndex(ln => ln.lineid === sch.lineid);
        const schIndex = newLines[lnIndex].schedules.findIndex(s => s.scheduleid === sch.scheduleid);

        newLines[lnIndex].schedules[schIndex] = { ...sch };

        setLinesWithSchedules(newLines);
      },
      setCurrentSchedule: (sch: number) => {
        setCurrSchedule(sch);
      },
      setEditingPeriodicity: (ep: boolean) => {
        setEditPeriodicity(ep);
      }
    }
  }, [linesWithSchedules, currSchedule, editPeriodicity]);

  return (
    <ScheduleContext.Provider value={provider}>
      {props.children}
    </ScheduleContext.Provider>
  )
}