export type SchemParamProps= {
  category?: any
  schemaProp?: any
  data?: any
  log?: any
  override?: any,
  keyname?: string,
  option?: any
}


interface SchemDefaultProps {
  key: string
  name: string
  value?: any
  validate: any[]
  disabled?: boolean
  disableFilter?: boolean
  component?: JSX.Element
  order?: number
  maxLen?: number
  required?: boolean
  helperText?: boolean
  placeholder?: string
  range?: any
}

type FileProps= {
  multiple?: boolean
  thumbWidth?: number
  uploadPath?: string
}
type SchemDataType= 'file'|'text'|'check'|'radio'

// type Test= SchemDefaultProps extends SchemDataType ? SchemDefaultProps  : SchemDefaultProps;

type ColumnProps= {
  type?: SchemDataType
  props?: any
}
export type ValidateCheckStatus= keyof ValidateMsgProps | boolean | null
type ValidateCheckProps= {
  value: any
  schema: SchemItemProps
  wholeSchema: SchemProps
  status?: ValidateCheckStatus
}
type ValidateCheckStatusProps= {
  value: any 
  status: ValidateCheckStatus
}
export type ValidateProps= {
  name?: string
  value: any
  check?: (param:ValidateCheckProps)=> ValidateCheckStatusProps
  // check?: (any)=> void
  msg?: ValidateMsgProps
  color?: ValidateMsgProps
}
export type ValidateMsgProps= {
  empty?: string
  true?: string
  null?: string
  false?: string
  ext?: string
  limitItem?: string
  limitTotal?: string
  limitLen?: string
}

export interface SchemItemProps {
  key: string
  name: string
  type?: SchemDataType
  defaultValue?: any
  value?: any
  validate: ValidateProps[]
  disabled?: boolean
  disableFilter?: boolean
  component?: JSX.Element | null
  order?: number
  maxLen?: number
  required?: boolean
  helperText?: boolean
  placeholder?: string
  notice?: React.ReactNode | string
  range?: any
  multiple?: boolean
  thumbWidth?: number
  uploadPath?: string
  searchSelect?: boolean
  column?: ColumnProps
  update?: SchemItemUpdateProps
}

export interface SchemItemUpdateProps extends Omit<SchemItemProps, 'key'|'name'|'validate'> {
  key?: string
  name?: string
  validate?: ValidateProps[]
}


export interface SchemProps {
  [key: string]: SchemItemProps;
}


/* export interface ValidateProps {
  value: any
  msg: {
    empty?: string
    true?: string
    null?: string
  }
} */



type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<"a">;  // "string"
type T2 = TypeName<true>;  // "boolean"
type T3 = TypeName<() => void>;  // "function"
type T4 = TypeName<string[]>;  // "object"