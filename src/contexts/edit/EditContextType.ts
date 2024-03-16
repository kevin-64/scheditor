import { Periodicity, Schedule, ScheduleWithPoints } from "ktscore";

export default interface EditContextType {
  scheduleData: Partial<ScheduleWithPoints>
  editingPeriodicity: boolean,
 
  newName: string,
  newFrom: string,
  newTo: string,

  setNewName: (n: string) => void,
  setNewFrom: (n: string) => void,
  setNewTo: (n: string) => void,
  
  addPoint: () => void,
  updatePeriodicity: (newP: Periodicity) => void
  toggleEditingPeriodicity: () => void
  commitChanges: (sch: Schedule) => void
  deleteSchedule: () => void
}