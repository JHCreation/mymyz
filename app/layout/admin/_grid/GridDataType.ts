import { createContext, Dispatch, SetStateAction } from "react"
import { Category, CategoryList } from "~/@types/category"
import { LogTypes } from "~/@types/user"
import { FiltersType, GroupFilterType } from "~/utils/data/filterQry"

export type Page=number
export type SetPage= Dispatch<SetStateAction<number>>


interface DataListContextType {
  filterId: string
  filters: FiltersType
  setFilters: Dispatch<SetStateAction<FiltersType>>
  defaultFilters: FiltersType
  useSchemas: any
  category: Category[]
  page: Page
  setPage: SetPage
  pageSize: Page
  setPageSize: SetPage
  log: LogTypes
  queryOptions: {
    name: string
    [key:string]: any
  }
  // mutation: UseMutationResult<CategoryList, Error, any, unknown>
  reload: ({filters, page, pageSize}:{filters:FiltersType, page:Page, pageSize:Page})=>void
  checked: any[]
} 

export const DataListContext = createContext<DataListContextType|null>(null);
// const filterId= `category-filters-${generateUID()}`;
