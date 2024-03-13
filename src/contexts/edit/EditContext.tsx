import { createContext } from "react";
import EditContextType from "./EditContextType";
const EditContext = createContext<EditContextType | undefined>(undefined);
export default EditContext;