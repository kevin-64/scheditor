import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  type MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { timeFromString, timeToString } from 'ktscore';
import { ActionIcon, Tooltip, useMantineTheme } from '@mantine/core';
import { SchedulePoint, LinePoint } from 'ktscore';
import EditContext from '../../contexts/edit/EditContext';
import './TimetableEditor.css';
import axios from 'axios';
import { IconTrash } from '@tabler/icons-react';



export default function TimetableEditor() {
  const { scheduleData, addPoint, editPoint, removePoint, shiftSchedule } = useContext(EditContext)!;
  const { colorScheme } = useMantineTheme();
  
  const [shiftAmount, setShiftAmount] = useState(0);
  const [linepoints, setLinepoints] = useState<LinePoint[]>([]);

  useEffect(() => {
    if (!scheduleData?.lineid) return;

    axios.get(`http://localhost:8080/lines/${scheduleData.lineid}/stops`).then(res => {
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
        accessorFn: (sp => timeToString(sp.arrivaltime)),
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
        accessorFn: (sp => timeToString(sp.departuretime)),
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
    return scheduleData.points || [];
  }, [scheduleData]);

  const table = useMantineReactTable({
    columns,
    getRowId: (row) => `${(row as any).uid}`,
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
        <input  type="number"
                id="shift-amount"
                value={shiftAmount} 
                onChange={(e) => setShiftAmount(Number(e.target.value))}></input>
        <label htmlFor="shift-amount">mins</label> 
        <button
          onClick={() => shiftSchedule(shiftAmount)}>Shift</button>
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