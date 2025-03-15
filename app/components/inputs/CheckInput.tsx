import { SchemItemProps } from '@/@types/dataSchemas';
import { _validate, errCheck, helpText } from './_validate';
import _ from 'lodash';

export default function CheckInput ({ option, setSchema, ...props }:any) {
  const { key, name, value: schmValue, required, validate, helperText, maxLen, disabled, placeholder, notice, range }:SchemItemProps= option;
  const { schemas: wholeSchema }= props;

  const handleValue= (value)=> (e)=> {
    console.log(value, schmValue)
  
    setSchema((val:any)=> {
      const data= val[key];
      const currentValue= _.isArray(data.value) ? data.value : []
      const checked= currentValue.find(d=> _.isEqual(d, value))
      console.log(data.value, currentValue, checked)
      let filterVal
      if( checked ) filterVal= currentValue.filter(d=> !_.isEqual(d, value))
      if( !checked ) filterVal= currentValue.concat([value])
      const validate= _validate({schema: data, value: filterVal, wholeSchema})
      return {
        ...val,
        [key]: {
          ...val[key],
          value: validate.value,
          validate: validate.valid,
        }
      }
    });
      
  }
  
  const help= helperText && validate && helpText({validate});
  const err= errCheck({validate});
  console.log(schmValue)

  return (
    <div className={`flex flex-col bg-base-300 border ${err==true ? 'border-error' : 'border-base-content border-opacity-20'} p-2 rounded-btn`}>
      <span className={`${err==true ? 'text-error' : ''} text-xs`}>{name}</span>
      {
        range && 
        <div className="flex">
          {
            range?.value && range?.value.map(rng=> 
              <div key={rng.id} className="form-control mr-3">
                <label className="cursor-pointer label">
                  <input 
                    type="checkbox" className="checkbox checkbox-xs checkbox-accent" 
                    checked={ (schmValue && _.isArray(schmValue)) ? (schmValue.find(val=> _.isEqual(val, rng.id)) ?? false) : false}
                    onChange={handleValue(rng.id)}
                  />
                  <span className="label-text ml-1">{rng.key}</span>
                </label>
              </div>
            )
          }
          
        </div>
      }
      {help && <div className="mt-1 text-xs">{help}</div> }
      {notice}
    </div>
  )
}