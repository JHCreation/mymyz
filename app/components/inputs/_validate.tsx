import { ValidateCheckStatus, ValidateMsgProps, ValidateProps } from "@/@types/dataSchemas";

export function _validate ({schema, value, wholeSchema}) {
  const validate= schema?.validate;
  let newValue= value;
  
  const validation= validate ? validate.map(valid=> {
    console.log(value, valid)
    let status= valid.value;
    if( valid.check ) {
      const checkRes= valid.check({ value, schema, wholeSchema });
      status= checkRes?.status;
      newValue= checkRes?.value;
    }
    if( !valid.check ) {
      status= value == '' ? 'empty' : true;
      if( Array.isArray(value) ) status= value.length == 0 ? 'empty' : true;
    }
    valid.value= status;
    return valid;
  }) : null;

  return {
    valid: validation,
    value: newValue
  }
}



export const colorRange:ValidateMsgProps= {
  empty: '',
  true: 'text-success',
  false: 'text-error',
  null: 'text-error',
}

export const msgRange:ValidateMsgProps= {
  empty: '',
  true: '',
  false: '유효하지 않음',
  null: '필수입력'
}
interface ValidateStatusProps {
  validate: ValidateProps[]
  colors?: ValidateMsgProps
  msgs?: ValidateMsgProps
}
interface Result {
  msg: string
  status: ValidateCheckStatus
  color: string
  err?: ValidateCheckStatus
  helpText?: React.ReactNode
}
/* interface getValidateStatusFn {
  fn(arg:Props): Result[]
} */
type getValidateStatusFn= (arg:ValidateStatusProps)=> Result[]
export const getValidateStatus:getValidateStatusFn= ({ validate, colors, msgs } = {
  validate: [],
  colors: colorRange,
  msgs: msgRange
})=> {
  const results= validate.map( (val:any, idx:any)=> {
    const status= val.value;
    const color= val?.color?.[`${status}`] || colors?.[`${status}`] || (colorRange?.[`${status}`] || '') ;

    let msg= '';
    if( val.msg ) msg= val.msg[`${status}`] || msgs?.[`${status}`] || '' ;
    if( !val.msg ) msg= msgRange[`${status}`] || msgs?.[`${status}`] || '' ;

    // const err= ( status == false || status == null ) ? true : false;
    const helpText= <div key={idx} className={`text-xs mt-1 ${color}`}>
      {msg}
    </div>
    return { msg, status, color, helpText }
  })
  return results;
}

export const helpText= ({ validate, colors, msgs }: ValidateStatusProps)=> {
  return validate.map( (val:any, idx:any)=> {
    const status = val.value;
    const color= colors?.[`${status}`] || val?.color?.[`${status}`] || colorRange?.[`${status}`] || '';
    const msg= val?.msg?.[`${status}`] || msgs?.[`${status}`] || msgRange?.[`${status}`] || '';
    return (
      <span key={idx} className={`${color}`}>
        {msg}
      </span>
    )
  })
}

export const errCheck=({ validate }: {validate: ValidateProps[]})=> {
  let err= false;
  validate && validate.some((val:any)=>{
    const status = val.value;
    err= ( status == false || status == null ) ? true : false;
    // err= status !== true && status !== 'empty'
    return err;
  });
  return err;
}