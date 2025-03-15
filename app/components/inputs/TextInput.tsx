
import { SchemItemProps } from '@/@types/dataSchemas';
import { _validate, errCheck, helpText } from './_validate';

// import NumSearchChange from '@/src/module/jhc-NumSearchChange';
// import { emailCheck, onlyNum, replacePhone, birthCheck, phoneCheck, NumSearchChange } from '@/utils/validate/check-validate'
// import { Input } from '@material-tailwind/react';
// import { SchemProps } from '@/@types/dataSchemas';
// const numCheck= new NumSearchChange();

export const useTextInput=  ({ option, setSchema, ...props }:any)=> {
  const { key, name, value, required, validate, helperText, maxLen, disabled, placeholder, notice }:SchemItemProps= option;
  const { schemas: wholeSchema }= props;

  const handleValue= (keyname, obj)=> (e)=> {
    let targetValue= e.target.value;

    /* if( isNum ) {
      if( numComma ) targetValue= numCheck.checkNum(e.target.value);
      else targetValue= numCheck.checkNumStr(e.target.value);
    } */

    // const value= obj || { value: targetValue };
    if( maxLen !== undefined && ( maxLen && String(targetValue).length > maxLen ) ) return;
  
    setSchema((val:any)=> {
      const data= val[key];
      const validate= _validate({schema: data, value: targetValue, wholeSchema})
      return {
        ...val,
        [keyname]: {
          ...val[keyname],
          // ...value,
          value: validate.value,
          validate: validate.valid,
        }
      }
    });
      
  }
  
  const help= helperText && validate && helpText({validate});
  const err= errCheck({validate});
  // console.log(err)
  // console.log(key, value)

  return { err, handleValue, help }
}


export default function TextInput ({ option, setSchema, ...props }:any) {
  
  const { key, name, value, required, validate, helperText, maxLen, disabled, placeholder, notice }:SchemItemProps= option;
  const { schemas: wholeSchema }= props;
  const { err, handleValue, help }= useTextInput({ option, setSchema, ...props })

  return (
    <div className='flex flex-col bg-base-300 border border-base-content border-opacity-20 p-2 rounded-btn'>
      {/* <span className='text-xs'>{name}</span> */}
      <div className={`${err==true ? 'text-error' : ''} text-xs`}>
        {name}
        <span className="text-error">{required ? ' *' : ''}</span>
      </div>
      <input
        // {...props}
        type="text"
        disabled={disabled}
        // error={err}
        required={required || false}
        // color='teal'
        id={key}
        // label={name}
        name={key}
        value={value}
        onChange={handleValue(key, null)}
        placeholder={placeholder || undefined}
        /* labelProps={{
          className: "peer-disabled:!text-black"
        }} */
        className={`input input-sm input-bordered ${err==true ? 'border-error' : 'border-base-content border-opacity-20'} w-full mt-1`}
      />
      {help && <div className="mt-1 text-xs">{help}</div> }
      {notice}
    </div>
  )
}