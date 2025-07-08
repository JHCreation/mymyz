import { createContext, Dispatch, SetStateAction } from "react"
import { Category, CategoryList } from "~/@types/category"
import { LogTypes } from "~/@types/user"
import { DefaultSchema } from "~/api/works/useSchemas_1"
import { UseSchema } from "~/components/fields/FieldType"
import { FiltersType, GroupFilterType } from "~/utils/data/filterQry"

export type Page=number
export type SetPage= Dispatch<SetStateAction<number>>


interface DataListContextType {
  tableName: string
  filterId: string
  filters: FiltersType
  setFilters: Dispatch<SetStateAction<FiltersType>>
  defaultFilters: FiltersType
  useSchemas: (prop:any)=>DefaultSchema
  useSchema: UseSchema<any>
  category: Category[]
  page: Page
  setPage: SetPage
  pageSize: Page
  setPageSize: SetPage
  log: LogTypes
  setLog: any
  queryOptions: {
    name: string
    [key:string]: any
  }
  // mutation: UseMutationResult<CategoryList, Error, any, unknown>
  reload: ({filters, page, pageSize}:{filters:FiltersType, page:Page, pageSize:Page})=>void
  checked: any[]
  idKey: string
} 

export const DataListContext = createContext<DataListContextType|null>(null);
// const filterId= `category-filters-${generateUID()}`;
