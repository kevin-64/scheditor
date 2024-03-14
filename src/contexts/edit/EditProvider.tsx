import React, { PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import EditContextType from "./EditContextType";
import axios from "axios";
import EditContext from "./EditContext";
import { Periodicity, Schedule } from "ktscore";
import ScheduleContext from "../schedule/ScheduleContext";
import moment from "moment";

export default function EditProvider(props: PropsWithChildren) {
  const { currentSchedule, updateSchedule, notifyDeletion } = useContext(ScheduleContext)!;
  const [schData, setSchData] = useState<Partial<Schedule>>({});
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
      const sch = {...res.data as Schedule};
      setSchData(sch);

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