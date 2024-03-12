import { createContext } from "react";
import TreeContextType from "./TreeContextType";
const TreeContext = createContext<TreeContextType | undefined>(undefined);
export default TreeContext;