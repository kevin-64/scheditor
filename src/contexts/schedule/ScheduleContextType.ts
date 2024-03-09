import { LineWithSchedules } from "ktscore";

export default interface ScheduleContextType {
  lines: LineWithSchedules[]
  currentSchedule: number | undefined

  setCurrentSchedule: (sch: number) => void
}