import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  type MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { Time } from 'ktscore';
import { ActionIcon, Tooltip, useMantineTheme } from '@mantine/core';
import { SchedulePoint, LinePoint } from 'ktscore';
import EditContext from '../../contexts/edit/EditContext';
import './TimetableEditor.css';
import axios from 'axios';
import { IconTrash } from '@tabler/icons-react';

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
  const { scheduleData, addPoint, editPoint, removePoint } = useContext(EditContext)!;
  const { colorScheme } = useMantineTheme();

  const [linepoints, setLinepoints] = useState<LinePoint[]>([]);

  useEffect(() => {
    if (!scheduleData?.lineid) return;

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
            editPoint(row.index, { ...scheduleData.points![row.index], linepointid: linepoints.find(lp => lp.name === value)!.linepointid});
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
            editPoint(row.index, { ...scheduleData.points![row.index], arrivaltime: timeFromString(event.target.value)});
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
            editPoint(row.index, { ...scheduleData.points![row.index], departuretime: timeFromString(event.target.value)});
          },
        }),
      },
      //TODOK: variation
    ],
    [memoLinepointNames, linepoints, scheduleData],
  );

  const tableData = useMemo(() => {
    console.log('new tabledata', scheduleData.points);
    return scheduleData.points || [];
  }, [scheduleData]);

  const table = useMantineReactTable({
    columns,
    getRowId: (row, index) => `${(row as any).uid}`,
    data: tableData,
    createDisplayMode: 'row',
    editDisplayMode: 'table',
    enableEditing: true,
    enableColumnActions: false,
    enableRowActions: true,
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
            axios.put(`http://localhost:8080/schedules/${scheduleData.scheduleid}/points`, scheduleData.points!.map(lp => ({...lp, scheduleid: scheduleData.scheduleid})));
        }}>Save</button>
      </>
    ),
    renderRowActions: ({ row }) => (
      <Tooltip label="Delete">
        <ActionIcon color="red" onClick={() => removePoint(row.index)}>
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    ),
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: '',
        size: 10,
      },
    },
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