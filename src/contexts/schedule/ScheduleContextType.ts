import { LineWithSchedules, Schedule } from "ktscore";

export default interface ScheduleContextType {
  lines: LineWithSchedules[]
  currentSchedule: number | Partial<Schedule> | undefined
  
  newSchedule: (sch: Partial<Schedule>) => void
  updateSchedule: (sch: Schedule) => void
  notifyDeletion: (lineid: number, scheduleid: number) => void
  setCurrentSchedule: (sch: number) => void
}