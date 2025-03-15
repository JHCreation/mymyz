
export interface CommResponse<T> {
  response: Response
  data: CommList<T>
}
export interface CommList<T> {
  total: number
  list: T[]
}

export interface CommCreate {
  id: number
  status: string
}