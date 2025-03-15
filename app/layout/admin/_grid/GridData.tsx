
import { useQuery, keepPreviousData, useMutation, UseMutationResult } from "@tanstack/react-query";
import { Dispatch, ReactNode, SetStateAction, Suspense, createContext, useCallback, useContext, useRef } from 'react';
// import queryOptions from '~/api/category/queryOption';

import { useState, useEffect, useMemo } from 'react';
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Grid Logic
import { ColDef, ModuleRegistry, ValueFormatterParams, RowSelectionOptions, SelectionColumnDef } from 'ag-grid-community';
import { AG_GRID_LOCALE_KR } from '../_grid/agGridLocal';
import Pagination from '~/components/grid/Pagination';
// import useSchemas from '~/api/category/useSchemas';

import { FiltersType, GroupFilterType, gqlFilters } from "@/utils/data/filterQry";
import { Category, CategoryList } from "@/@types/category";
import { generateUID } from "@/utils/validate/guid";
import _ from "lodash";

import AsideFilter from "../_grid/(filters)/AsideFilter";
import { LogTypes } from "@/@types/user";
import { Loading } from "@/components/ui/Loading";
import { useCategoryState, useLogState } from "~/store/store";

import Create from "./Create";
import Delete from "./Delete";
import Update from "./Update";
import { CommList } from "~/@types/queryType";
import { FloatingOverlay } from "@floating-ui/react";
import Dialog from "~/components/ui/Dialog";
import { DataListContext } from "./GridDataType";



    
// import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
// ModuleRegistry.registerModules([ ClientSideRowModelModule ]);

// Custom Cell Renderer (Display logos based on cell value)
const CompanyLogoRenderer = (params: CustomCellRendererProps) => (
  <span style={{ display: "flex", height: "100%", width: "100%", alignItems: "center" }}>{params.value && <img alt={`${params.value} Flag`} src={`https://www.ag-grid.com/example-assets/space-company-logos/${params.value.toLowerCase()}.png`} style={{display: "block", width: "25px", height: "auto", maxHeight: "50%", marginRight: "12px", filter: "brightness(1.1)"}} />}<p style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{params.value}</p></span>
);

/* Custom Cell Renderer (Display tick / cross in 'Successful' column) */
const MissionResultRenderer = (params: CustomCellRendererProps) => (
  <span style={{ display: "flex", justifyContent: "center", height: "100%", alignItems: "center"}}>{<img alt={`${params.value}`} src={`https://www.ag-grid.com/example-assets/icons/${params.value ? 'tick-in-circle' : 'cross-in-circle'}.png`} style={{width: "auto", height: "auto"}} />}</span>
);

/* Format Date Cells */
const dateFormatter = (params: ValueFormatterParams): string => {
  return new Date(params.value).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


type Page=number
type SetPage= Dispatch<SetStateAction<number>>
console.log('rendering')


// export const DataListContext = createContext<DataListContextType|null>(null);
// const filterId= `category-filters-${generateUID()}`;
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
}

export default function GridData<T> ({ useSchemas, queryOptions, filterComponent }) {
  // const log= useRecoilValue(logState);
  const { log, setLog }= useLogState()
  const keyname= queryOptions.name;
  const [createOpen, setCreateOpen]= useState(true)
  const [updateOpen, setUpdateOpen]= useState<any>(false)


  const [filters, setFilters]= useState<FiltersType>(defaultFilters)

  const [page, setPage]= useState<number>(1)
  const [pageSize, setPageSize]= useState<number>(10)
  const { queryFn: mutationFn }= queryOptions.filter(page-1, pageSize);
  const mutation:any = useMutation({
    mutationFn
  })
  useEffect(()=> {
    /* mutation.mutate({ 
      data: filters, access_token: log?.access_token, 
      // page: 0, size: pageSize 
    }) */
  }, [])
  useEffect(()=> {
    console.log( mutation.data )
    if( mutation.data ) setLists(mutation.data)
  }, [mutation])

  useMemo(()=> {
    if( mutation.isError ) console.log(mutation.error)
  }, [mutation])

  const gridRef = useRef<AgGridReact>(null);
  
  

  /* const { queryKey, queryFn }= queryOptions.list(pageVal-1, sizeVal);
  const { data } = useQuery({ 
    queryKey, queryFn, 
    staleTime: 15000, 
    placeholderData: keepPreviousData,
  }); */

  const [lists, setLists]= useState<CommList<T|any>>()


 
  // const lists:any= data;
  const {schema, getDefaultSchema, setSchema, init, category}= useSchemas({
    keyname: queryOptions.name, 
  });

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
    console.log(schema)
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

    // test
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


  
  // Column Definitions: Defines & controls grid columns.

  /* const defaultColDef = useMemo<ColDef>(() => {
    return {
      // filter: true,
      // flex: 1,
      editable: true,
      cellDataType: false,
      // autoHeight: true,
      // width: 50,
    };
  }, []); */
 
  
  const [checked, setChecked]= useState([]);
  const onSelectionChanged = useCallback((gridApi) => {
    const {api}= gridApi;
    const selectedRows = api.getSelectedRows();
    const selectedNodes = api.getSelectedNodes();
    setChecked(selectedRows)
    console.log(selectedRows, selectedNodes)
  }, []);

  const localeText = useMemo<{
    [key: string]: string;
  }>(() => {
    return AG_GRID_LOCALE_KR;
  }, []);

    
  /* const navigate = useNavigate()
  const refresh=()=> {
    navigate('.', { replace: true })
  } */

  const reload= useCallback(({filters, page, pageSize})=> {
    // console.log('debounce: ', filters, pageSize)
    setPage(1)
    mutation.mutate({ 
      data: filters, access_token: log?.access_token, 
      page: page-1, size: pageSize 
    })
  }, [])
  

  const [deleteOn, setDeleteOn]= useState(false)
  const [test, setTest]= useState(false)

  console.log(lists)
  return (
    category && 
    <DataListContext.Provider value={{ 
      filterId, filters, setFilters, defaultFilters,
      useSchemas,
      category: category,
      page, setPage,
      pageSize, setPageSize,
      log, queryOptions, reload, checked
    }}>
      {/* <div className="hidden">
        {JSON.stringify(lists?.category_list)}
      </div> */}
      <Dialog open={test} setOpen={setTest} outsidePress={false}>
        <div className={`h-[50dvh] bg-white my-10 p-10`}>
          tests
        </div>
      </Dialog >
      <div className="btn" onClick={e=>setTest(true)}>open</div>
      <Delete 
        checked={checked} deleteOn={deleteOn} setDeleteOn={setDeleteOn} 
        keyname={keyname}
        schema={schema}
        setSchema={setSchema}
        // useSchemas={useSchemas}
      />
      <Create 
        open={createOpen}
        setOpen={setCreateOpen}
        keyname={keyname}
        schema={schema}
        setSchema={setSchema}
        useSchemas={useSchemas}
        // onSubmit={onSubmit}
      />
      <Update 
        open={Boolean(updateOpen)}
        data={updateOpen}
        setOpen={setUpdateOpen}
        keyname={keyname}
        schema={schema}
        setSchema={setSchema}
        useSchemas={useSchemas}
      />
      {/* <div className="btn" onClick={e=> setOpen(true)}>click</div>
      <Modal open={open} className="fixed top-0 left-0 w-full h-full">
        <div className="">
          <div className="">test</div>
          <div className="btn" onClick={e=> setOpen(false)}>close</div>
        </div>
      </Modal> */}
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
                      // rowSelection='multiple'
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


