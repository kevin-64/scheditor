import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  type MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { Time } from 'ktscore';
import { useMantineTheme } from '@mantine/core';
import { SchedulePoint, LinePoint } from 'ktscore';
import EditContext from '../../contexts/edit/EditContext';
import './TimetableEditor.css';
import axios from 'axios';

const padNum = (n: number) => {
  return n.toString().padStart(2, "0");
}

const timeFromString = (s: string) => {
  const time: Partial<Time> = {};
  const timeParts = s.split(':');

  time.hh = Number(timeParts[0]);
  time.mm = Number(timeParts[1]);
  time.ss = Number(timeParts[2] || 0) as (0 | 30);

  return time as Time;
}

export default function TimetableEditor() {
  const { scheduleData, addPoint } = useContext(EditContext)!;
  const { colorScheme } = useMantineTheme();

  const [linepoints, setLinepoints] = useState<LinePoint[]>([]);
  const [newTimetable, setNewTimetable] = useState<SchedulePoint[]>([]);

  useEffect(() => {
    if (!scheduleData?.lineid) return;

    setNewTimetable(scheduleData.points || []);

    axios.get(`http://localhost:8080/lines/${scheduleData.lineid}/points`).then(res => {
      setLinepoints(res.data);
    });
  }, [scheduleData]);

  const memoLinepointNames = useMemo<string[]>(() => {
    return linepoints.map(lp => lp.name) || [];
  }, [linepoints]);

  const columns = useMemo<MRT_ColumnDef<SchedulePoint>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Location',
        editVariant: 'select',
        mantineEditSelectProps: ({row}) => ({
          data: memoLinepointNames,
          onChange: (value: any) => {
            const newTt = [...newTimetable];
            const linepointid = linepoints.find(lp => lp.name === value)!.linepointid;
            newTt[Number(row.id)] = {...newTimetable[Number(row.id)], linepointid};
            setNewTimetable([...newTt]);
          }
        }),
      },
      {
        accessorFn: (sp => `${padNum(sp.arrivaltime.hh)}:${padNum(sp.arrivaltime.mm)}:${padNum(sp.arrivaltime.ss)}`),
        id: 'arrivaltime',
        header: 'Arrival',
        mantineEditTextInputProps: ({ row }) => ({
          type: 'time',
          required: true,
          onBlur: event => {
            const newTt = [...newTimetable];
            newTt[Number(row.id)] = {...newTimetable[Number(row.id)], arrivaltime: timeFromString(event.target.value)};
            setNewTimetable([...newTt]);
          },
        }),
      },
      {
        accessorFn: (sp => `${padNum(sp.departuretime.hh)}:${padNum(sp.departuretime.mm)}:${padNum(sp.departuretime.ss)}`),
        id: 'departuretime',
        header: 'Departure',
        mantineEditTextInputProps: ({ row }) => ({
          type: 'time',
          required: true,
          onBlur: event => {
            const newTt = [...newTimetable];
            newTt[Number(row.id)] = {...newTimetable[Number(row.id)], departuretime: timeFromString(event.target.value)};
            setNewTimetable([...newTt]);
          },
        }),
      },
      //TODOK: variation
    ],
    [memoLinepointNames, newTimetable],
  );

  const tableData = useMemo(() => {
    console.log(scheduleData.points);
    return scheduleData.points || [];
  }, [scheduleData]);

  const table = useMantineReactTable({
    columns,
    data: tableData,
    createDisplayMode: 'row',
    editDisplayMode: 'table',
    enableEditing: true,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    initialState: { density: 'xs' },
    renderToolbarInternalActions: ({ table }) => (
      <>
      </>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <button
          onClick={() => {
            addPoint();
        }}>+</button>
        <button
          onClick={() => {
            axios.put(`http://localhost:8080/schedules/${scheduleData.scheduleid}/points`, newTimetable.map(lp => ({...lp, scheduleid: scheduleData.scheduleid})));
        }}>Save</button>
      </>
    ),
    mantineTableProps: {
      highlightOnHover: true,
      withColumnBorders: true,
      withBorder: true,
      sx: {
        'thead > tr': {
          backgroundColor: 'inherit',
        },
        'thead > tr > th': {
          backgroundColor: 'inherit',
        },
        'tbody > tr > td': {
          backgroundColor: 'inherit',
        },
      },
    },
  });

  return (
    <MantineReactTable table={table} />
  )
}