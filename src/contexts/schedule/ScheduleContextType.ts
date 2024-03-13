import { LineWithSchedules, Schedule } from "ktscore";

export default interface ScheduleContextType {
  lines: LineWithSchedules[]
  currentSchedule: number | undefined
  
  updateSchedule: (sch: Schedule) => void
  setCurrentSchedule: (sch: number) => void
}