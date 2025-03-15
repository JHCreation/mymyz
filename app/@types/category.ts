export interface Category {
  id: number
  key: string
  name: string
  value: any|string
  status: string
  doc_01: string
  doc_02: string
  create_date: string
  user_id: number
}
export interface CategoryResponse {
  response: Response
  data: CategoryList
}
export interface CategoryList {
  total: number
  data: Category[]
}

export interface CategoryCreate {
  id: number
  status: string
}