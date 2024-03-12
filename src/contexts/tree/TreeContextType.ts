import { Schedule } from "ktscore";

interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  schedule?: Schedule
}

export default interface TreeContextType {
  treeData: TreeNode[]
}