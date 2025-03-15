import { Suspense, useEffect, useState } from "react";
import useSchemas from "~/api/category/useSchemas";
import queryOptions from '~/api/category/queryOption';
import GridData from "../_grid/GridData";
import { InputWrap } from "../_grid/(filters)/Fitlers";
import FilterInput from "../_grid/(filters)/FilterInput";
import FilterCheck from "../_grid/(filters)/FilterCheck";
import FilterDate from "../_grid/(filters)/FilterDate";
import FilterSelect from "../_grid/(filters)/FilterSelect";

export default function Category () {
  /* const {schema, getDefaultSchema, setSchema, init, category}= useSchemas({
    keyname: queryOptions.name, 
  }); */
  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <GridData 
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
        <FilterInput init={init} id={['key', 'name']} />
      </InputWrap>
      <InputWrap className="my-1">
        <FilterCheck init={init} id={'status'} option={categoryItem} operator={'LIKE'}/>
      </InputWrap>
      <InputWrap className="my-1">
        <FilterCheck init={init} id={'name'} option={categoryGender} operator={'LIKE'}/>
      </InputWrap>
      <InputWrap className="my-1">
        <FilterDate init={init} id={'create_date'}/>
      </InputWrap>
      <InputWrap className="my-1">
        <FilterSelect init={init}/>
      </InputWrap>

      <div className="flex-1 py-1">
        <div className="p-2 border">
          {/* <FilterAutoComplete init={init}/> */}
        </div>
      </div>

    </div>
  )
}