import { createContext } from "react";
import ScheduleContextType from "./ScheduleContextType";
const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);
export default ScheduleContext;