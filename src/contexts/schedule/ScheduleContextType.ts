import { LineWithSchedules, Schedule } from "ktscore";

export default interface ScheduleContextType {
  lines: LineWithSchedules[]
  currentSchedule: number | undefined
  editingPeriodicity: boolean
  
  updateSchedule: (sch: Schedule) => void
  setCurrentSchedule: (sch: number) => void
  setEditingPeriodicity: (ep: boolean) => void
}