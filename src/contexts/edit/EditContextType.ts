import { Periodicity, Schedule } from "ktscore";

export default interface EditContextType {
  scheduleData: Partial<Schedule>
  editingPeriodicity: boolean,
 
  newName: string,
  newFrom: string,
  newTo: string,

  setNewName: (n: string) => void,
  setNewFrom: (n: string) => void,
  setNewTo: (n: string) => void,
  
  updatePeriodicity: (newP: Periodicity) => void
  toggleEditingPeriodicity: () => void
  commitChanges: (sch: Schedule) => void
}