import { CommList } from "~/@types/queryType";

export interface Works {
  id: number|string
  key: string
  title: string
  content: string
  create_date: string
}
export type WorksList= CommList<Works>
