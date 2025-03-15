import { SchemProps } from '@/@types/dataSchemas';
import * as React from 'react';

export interface InputsProps {
  schema: SchemProps
  setSchema: (schema: SchemProps)=> SchemProps
  keyname: string
  method?: 'create'|'update'|'delete'
  toastOption?: any | undefined
}
interface InputProps extends InputsProps {
  schemaKey: string
  component: any
}

export function Inputs ({ schema, setSchema, keyname, method, toastOption }:InputsProps) {
  return (
    <div>
        
      {
        schema && Object.keys(schema).map( key=> {
          const Component= schema[key].component;
          if( !Component ) return <React.Fragment key={key}></React.Fragment>
          return (
            <div key={key} className='my-4' >
              {<Component.type {...Component.props} option={schema[key]} setSchema={setSchema} schemas={schema} name={keyname} method={method} toastOption={toastOption} />}
            </div>
          )
        })
      }
        
    </div>
    
  )
}

export const Input= ({ schemaKey, schema, setSchema, keyname, method, toastOption, component }:InputProps)=> {
  console.log('schema',schema)
  if( !schema ) return null
  const Component= component;
  if( !Component ) return <React.Fragment key={schemaKey}></React.Fragment>
  return (
    <Component.type {...Component.props} option={schema[schemaKey]} setSchema={setSchema} schemas={schema} name={keyname} method={method} toastOption={toastOption} />
  )
}