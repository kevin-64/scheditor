import React, { PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import EditContextType from "./EditContextType";
import axios from "axios";
import EditContext from "./EditContext";
import { Periodicity, Schedule, SchedulePoint, ScheduleWithPoints, Time, addTimes, subtractTimes } from "ktscore";
import ScheduleContext from "../schedule/ScheduleContext";
import moment from "moment";

type SchedulePointWithUid = SchedulePoint & { uid: number }

type ScheduleWithPointsAndUid = Omit<ScheduleWithPoints, 'points'> & {
  points: SchedulePointWithUid[]
}

export default function EditProvider(props: PropsWithChildren) {
  const { currentSchedule, updateSchedule, notifyDeletion } = useContext(ScheduleContext)!;
  const [schData, setSchData] = useState<Partial<ScheduleWithPointsAndUid>>({});
  const [editPeriodicity, setEditPeriodicity] = useState(false);

  const [tempName, setTempName] = useState('');
  const [tempFrom, setTempFrom] = useState('');
  const [tempTo, setTempTo] = useState('');

  useEffect(() => {
    if (!currentSchedule) {
      setSchData({});
      return;
    };

    //partial schedule -> new or cloned
    if (typeof currentSchedule !== "number") {
      const tmpSch = {
        ...currentSchedule,
        name: currentSchedule.name || "NewSchedule",
        startvalidity: currentSchedule.startvalidity || moment().format("YYYY-MM-DD"),
        periodicity: currentSchedule.periodicity || {},
        departuretime: currentSchedule.departuretime || { hh: Number(moment().format("hh")), mm: Number((moment().format("mm"))), ss: 0}
      }
      setSchData(tmpSch);
      setTempName(tmpSch.name);
      setTempFrom(tmpSch.startvalidity);
      return;
    }

    axios.get(`http://localhost:8080/schedules/${currentSchedule}`).then((res) => {
      const sch = {...res.data as ScheduleWithPoints};
      setSchData({...sch, points: [...sch.points.map(pt => ({...pt, uid: Math.floor(Math.random() * 1000000000)}))]});

      setTempName(sch.name || '');
      setTempFrom(sch.startvalidity!.substring(0, 10))
      if (sch.endvalidity) {
        setTempTo(sch.endvalidity.substring(0, 10));
      }
    });
  }, [currentSchedule]);

  useEffect(() => {
    console.log('data change', schData)
  }, [schData])

  const provider = useMemo<EditContextType>(() => {
    return {
      scheduleData: schData,
      editingPeriodicity: editPeriodicity,
      
      newName: tempName,
      newFrom: tempFrom,
      newTo: tempTo,

      setNewName: (n: string) => {
        setTempName(n);
      },
      setNewFrom: (n: string) => {
        setTempFrom(n);
      },
      setNewTo: (n: string) => {
        setTempTo(n);
      },
      
      toggleEditingPeriodicity: () => {
        if (editPeriodicity) {
          setEditPeriodicity(false);
        } else {
          setEditPeriodicity(true);
        }
      },

      updatePeriodicity: (newPeriodicity: Periodicity) => {
        setSchData({...schData, periodicity: newPeriodicity});
      },

      addPoint: () => {
        setSchData({...schData, points: [...(schData.points || []), {
          arrivaltime: {hh:0, mm:0, ss:0},
          departuretime: {hh:0, mm:0, ss:0},
          linepointid: -1,
          scheduleid: -1,
          schedulepointid: -1,
          variation: 0,
          uid: Math.floor(Math.random() * 1000000000)
        }]});
      },

      editPoint: (index: number, newPt: Partial<SchedulePoint>) => {
        const newPoints = [...schData.points!];
        newPoints[index] = newPt as SchedulePointWithUid;
        setSchData({...schData, points: [...newPoints]})
      },

      removePoint: (index: number) => {
        console.log('removing', index, 'from', schData.points);
        setSchData({...schData, points: [...(schData.points || []).filter((_, i) => i !== index)]});
      },

      commitChanges: (sch: Schedule) => {
        if (sch.scheduleid) {
          axios.put(`http://localhost:8080/schedules/${sch.scheduleid}`, {...schData, ...sch}).then(() => {
            updateSchedule({...schData, ...sch} as Schedule);
          });
        } else {
          axios.post(`http://localhost:8080/lines/${sch.lineid}/schedules`, {...schData, ...sch}).then((res) => {
            updateSchedule({...schData, ...sch, scheduleid: res.data as number} as Schedule);
          });
        }
      },

      shiftSchedule: (mins: number) => {
        const shiftFn = mins >= 0 ? ((t: Time) => addTimes(t, {hh: 0, mm: mins, ss: 0})) : ((t: Time) => subtractTimes(t, {hh: 0, mm: -mins, ss: 0}));
        const newPoints = [...schData.points!];
        newPoints.forEach(pt => {
          pt.arrivaltime = shiftFn(pt.arrivaltime) as Time;
          pt.departuretime = shiftFn(pt.departuretime) as Time;
          pt.uid = Math.floor(Math.random() * 1000000000)
        })
        setSchData({...schData, points: [...newPoints]});
      },

      deleteSchedule: () => {
        if (!schData.scheduleid || !schData.lineid) return;

        axios.delete(`http://localhost:8080/schedules/${schData.scheduleid}`).then(() => {
          notifyDeletion(schData.lineid!, schData.scheduleid!);
        });
      }
    }
  }, [currentSchedule, schData, editPeriodicity, tempName, tempFrom, tempTo]);

  return (
    <EditContext.Provider value={provider}>
      {props.children}
    </EditContext.Provider>
  )
}