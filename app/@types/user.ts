
import { CommList } from "./queryType"

export interface User {
  id: number|string
  userid: string
  status: string

  phone: string
  email: string
  username: string
  nickname: string
  usertype: string
  sns_type: string
  sns_id: string
  sns_connect_date: string
  sns_name: string
  sns_gender: string
  sns_age: string
  sns_birthyear: string
  sns_birthday: string
  permission: string
  create_date: string
}

export interface UserToken {
  access_token: string
  token_type: string
  userid: string
}

export interface UserResponse<T> {
  response: Response
  data: T
}

export interface LogTypes {
  access_token: string;
  // refresh_token: string;
  userid: string;
  state: boolean | null | 'fail';
  is_login: boolean
}

/* export interface UserList {
  total: number
  data: User[]
} */

export type UserList= CommList<User>
