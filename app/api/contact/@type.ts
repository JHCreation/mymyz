import { CommList } from "~/@types/queryType";

export interface Contact {
  id: number|string
  key: string
  name: string
  email: string
  phone: string
  content: string
  create_date: string
}
export type ContactList= CommList<Contact>
