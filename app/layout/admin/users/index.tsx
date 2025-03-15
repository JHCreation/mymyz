import { Suspense } from "react"
import { useLogState } from "~/store/store"
import GridData from "../_grid/GridData"
import queryOptions from '~/api/user/queryOption';
import { InputWrap } from "../_grid/(filters)/Fitlers";
import FilterInput from "../_grid/(filters)/FilterInput";
import FilterCheck from "../_grid/(filters)/FilterCheck";
import FilterDate from "../_grid/(filters)/FilterDate";
import FilterSelect from "../_grid/(filters)/FilterSelect";
import useSchemas from "~/api/user/useSchemas";
import { UserList } from "~/@types/user";

export default function AdminUsers () {
  const { log, setLog }= useLogState()
  console.log(log)
  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <GridData<UserList>
          useSchemas={useSchemas}
          queryOptions={queryOptions} 
          filterComponent={FilterComponent}
        />
      </Suspense>
    </div>
  )
}


const FilterComponent= ({ init, handleInit, category})=> {

  const categoryItem= category['status']
  const categoryGender= category['loote']

  return (
    <div className="flex flex-col gap-0 flex-wrap ">
      <InputWrap className="my-1">
        <FilterInput init={init} id={['username', 'sns_name']} />
      </InputWrap>
      <InputWrap className="my-1">
        <FilterCheck init={init} id={'name'} option={categoryGender} operator={'LIKE'}/>
      </InputWrap>

      <InputWrap className="my-1">
        <FilterCheck init={init} id={'status'} option={categoryItem} operator={'LIKE'}/>
      </InputWrap>
      
      <InputWrap className="my-1">
        <FilterDate init={init} id={'create_date'}/>
      </InputWrap>
      {/* <InputWrap className="my-1">
        <FilterSelect init={init}/>
      </InputWrap> */}

    </div>
  )
}