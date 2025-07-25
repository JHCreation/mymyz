
import { useQuery, keepPreviousData, useMutation, UseMutationResult } from "@tanstack/react-query";
import { Dispatch, SetStateAction, Suspense, createContext, useCallback, useContext, useRef } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import { ColDef, ModuleRegistry, ValueFormatterParams, RowSelectionOptions, SelectionColumnDef } from 'ag-grid-community';
import { AG_GRID_LOCALE_KR } from '../_grid/agGridLocal';
import Pagination from '~/components/grid/Pagination';
import { FiltersType, GroupFilterType, gqlFilters } from "@/utils/data/filterQry";
import _ from "lodash";
import AsideFilter from "../_grid/(filters)/AsideFilter";
import { Loading } from "@/components/ui/Loading";
import { useCategoryState, useLogState } from "~/store/store";
import Delete from "./Delete";
import { CommList } from "~/@types/queryType";
import { DataListContext } from "./GridDataType";
import { TextFilterModule } from 'ag-grid-community'; 
import { NumberFilterModule } from 'ag-grid-community'; 
import { DateFilterModule } from 'ag-grid-community'; 
import { CustomFilterModule } from 'ag-grid-community';
import { HighlightChangesModule } from 'ag-grid-community';   
import { AllCommunityModule, ClientSideRowModelModule, ValidationModule, LocaleModule, TextEditorModule, SelectEditorModule, themeBalham, } from 'ag-grid-community';
import Create from "./Create";
import Update from "./Update";
ModuleRegistry.registerModules([ AllCommunityModule ]);

const dateFormatter = (params: ValueFormatterParams): string => {
  return new Date(params.value).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const filterId= `category-filters-test`;
const defaultFilters:GroupFilterType= {
  type: "group",
  id: filterId,
  operator: "AND",
  filter: []
}
const defaultColDef= {
  // filter: true,
  // flex: 1,
  editable: true,
  cellDataType: false,
  // autoHeight: true,
  // width: 50,
}

interface GridDataProps {
  useSchemas: any
  queryOptions: any
  filterComponent?: any
  idKey: string
}
const size= 20
export default function GridData<T> ({ useSchema, queryOptions, filterComponent, idKey, idName }) {
  const { log, setLog }= useLogState()
  const tableName= queryOptions.name;
  const [createOpen, setCreateOpen]= useState(false)
  const [updateOpen, setUpdateOpen]= useState(false)
  const [filters, setFilters]= useState<FiltersType>(defaultFilters)

  const [page, setPage]= useState<number>(1)
  const [pageSize, setPageSize]= useState<number>(size)
  const { queryFn: mutationFn }= queryOptions.filter(page-1, pageSize);
  const mutation:any = useMutation({
    mutationFn
  })

  useEffect(()=> {
    if( mutation.data ) setLists(mutation.data)
  }, [mutation])

  useMemo(()=> {
    if( mutation.isError ) console.log(mutation.error)
  }, [mutation])

  const gridRef = useRef<AgGridReact>(null);
  
  const [lists, setLists]= useState<CommList<T|any>>()
  const { data: category }= useCategoryState()
  const { schema }= useSchema({tableName})

  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  
  /* const selection = useMemo<RowSelectionOptions>(() => {
    return { mode: "multiRow" };
  }, []); */
  const selectionColumnDef = useMemo<SelectionColumnDef>(() => {
    return {
      sortable: true,
      width: 36,
      maxWidth: 36,
      suppressHeaderMenuButton: false,
      pinned: "left",
    };
  }, []);
  
  useMemo(()=> {
    // console.log(schema)
    if( !schema ) return;
    const col= Object.keys(schema).map( (key):ColDef=> {
      return {
        field: key,
        headerName: schema[key].name,
        ...schema[key]?.column?.props
      }
    })

    const column:ColDef[]= [
      /* {
        headerName: "Checkbox Cell Editor",
        field: "boolean",
        cellEditor: "agCheckboxCellEditor",
        width: 36,
        editable: true,
        pinned: "left",
      }, */
      /* {
        field: "athlete",
        headerName: '',
        width: 36,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        // cellRenderer: 'agCheckboxCellRenderer',
        // cellEditor: 'agCheckboxCellEditor',
        // showDisabledCheckboxes: true,
        filter: false,
        sortable: false,
        editable: false,
        pinned: 'left',
      }, */
      
    ]
    // if( log.is_login ) 
    column.push(
      {
        field: "modify",
        headerName: '수정',
        editable: false,
        width: 62,
        pinned: 'left',
        cellRenderer: (param)=> {
          return (
            
            <div className="flex h-full items-center justify-center">
              <div 
                onClick={e=> { 
                  setUpdateOpen(param.data); 
                }} 
                className='btn btn-xs btn-secondary '
              >수정</div>
            </div>
          )
        }
      }
    )

    const columns:ColDef[]= column.concat([
      ...col,
      {
        field: 'test',
        valueGetter: `(data.key + ','+ data.value)`,
        minWidth: 135,
        cellRenderer: "agAnimateSlideCellRenderer",

      }
    ])

    setColDefs( columns )
  }, [schema, log])
 
  
  const [checked, setChecked]= useState([]);
  const onSelectionChanged = useCallback((gridApi) => {
    const {api}= gridApi;
    const selectedRows = api.getSelectedRows();
    const selectedNodes = api.getSelectedNodes();
    setChecked(selectedRows)
    // console.log(selectedRows, selectedNodes)
  }, []);

  const localeText = useMemo<{
    [key: string]: string;
  }>(() => {
    return AG_GRID_LOCALE_KR;
  }, []);

  const reload= useCallback(({filters, page, pageSize})=> {
    // console.log('debounce: ', filters, page, pageSize)
    setPage(1)
    mutation.mutate({ 
      data: filters, access_token: log?.access_token, 
      page: page-1, size: pageSize 
    })
  }, [lists])
  

  const [deleteOn, setDeleteOn]= useState(false)
  // const [test, setTest]= useState(false)

  const myTheme = themeBalham.withParams({
    spacing: 3,
    // accentColor: 'yellow',
  });


  const rowSelection:RowSelectionOptions = useMemo(() => { 
    return {
          mode: 'multiRow',
          checkboxes: true,
          enableClickSelection: true,
      };
  }, []);

  return (
    category && 
    <DataListContext.Provider value={{ 
      filterId, filters, setFilters, defaultFilters,
      tableName, 
      useSchema,
      category: category,
      page, setPage,
      pageSize, setPageSize,
      log, setLog,
      queryOptions, reload, checked,
      idKey, idName,
    }}>
      <div className="hidden">
        {JSON.stringify(lists?.list)}
      </div>
      <Delete checked={checked} deleteOn={deleteOn} setDeleteOn={setDeleteOn} />
      <Create open={createOpen} setOpen={setCreateOpen} />
      <Update
        open={Boolean(updateOpen)}
        data={updateOpen}
        setOpen={setUpdateOpen}
      />
      
      <div className="w-full flex">
        <div className='w-full flex flex-col h-full my-10'>
          
          {
            <div className="px-2">
              <div className="flex mt-2">
                <div className="">
                  <div 
                    onClick={e=> setCreateOpen(true)}
                    className='btn btn-accent btn-sm'
                  >등록</div>
                  { 
                  checked?.length > 0 && 
                  <div 
                    onClick={e=> setDeleteOn(true)}
                    className='btn btn-error btn-sm ml-2'
                  >삭제</div>
                  }
                </div>
                <div className="ml-auto mr-4 flex items-center">
                  {
                    checked?.length > 0 &&
                    <span className="text-sm text-primary">
                      <span className="font-bold">{checked?.length}</span> 개 선택
                    </span>
                  }
                </div>
              </div>
              <div className="">
                <div className={"ag-theme-quartz jhc-admin w-full mt-1 h-grid-95dvh"} >
                  {
                    !lists && mutation.isPending &&
                    <div className="h-full w-full flex justify-center items-center">
                      <Loading />
                    </div>
                  }
                  {
                    lists &&
                    <AgGridReact 
                      theme={myTheme}
                      loading={mutation.isPending}
                      localeText={localeText}
                      loadingOverlayComponent={()=> <div>Loading.......</div>}
                      noRowsOverlayComponent={()=> <div>데이터가 없습니다.</div>}
                      // reactiveCustomComponents
                      ref={gridRef}
                      // getRowHeight={()=>20}
                      // rowHeight={20}
                      // domLayout='autoHeight'
                      // onPaginationChanged={onPaginationChanged}
                      rowData={lists?.list}
                      columnDefs={colDefs}
                      /* selection={{
                        mode: 'multiRow',
                        headerCheckbox: true,
                        // enableClickSelection: true,
                        // enableMultiSelectWithClick: true,
                        checkboxes: true,
                      }} */
                      // selection={selection}
                      selectionColumnDef={selectionColumnDef}
                      defaultColDef={defaultColDef}
                      // pagination={true}
                      // paginationPageSize={size}
                      rowSelection={rowSelection}
                      editType={"fullRow"}
                      // suppressRowClickSelection={true}
                      // rowMultiSelectWithClick={true}
                      onSelectionChanged={onSelectionChanged}
                      onCellValueChanged={event => console.log(`New Cell Value: ${event.value}`)}
                    />
                  }
                  
                </div >
                {
                  lists?.list && 
                  <div className="mt-1.5">
                    <Pagination 
                      totalCount={lists ? lists.total : 0} 
                      page={page} 
                      setPage={setPage}
                      size={pageSize} 
                      setPageSize={setPageSize}
                      perSize={[10, 20, 50, 100]} 
                      callback={(page, size)=> {
                        console.log('paging!')
                        mutation.mutate({ data: filters, access_token: log?.access_token, page: page-1, size: size })
                        // debouncedSearch(filters)
                        // debouncedSearchDelay(0)(filters)
                      }}
                    />
                  </div>
                }
                
              </div>
            </div>
          }
        </div>

        {
          filterComponent &&
          <AsideFilter filterComponent={filterComponent}/>
        }

        
      </div>
    </DataListContext.Provider>
  )
}


