import { LineWithSchedules } from "ktscore";

export default interface ScheduleContextType {
  lines: LineWithSchedules[]
  currentSchedule: number | undefined
  editingPeriodicity: boolean

  setCurrentSchedule: (sch: number) => void
  setEditingPeriodicity: (ep: boolean) => void
}