
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
// import SortableList from '../../../node_modules/react-easy-sort';
import {_validate, errCheck, getValidateStatus, helpText} from './_validate';
import guidQ1 from '@/utils/validate/guid';
import { arrayMoveImmutable } from 'array-move'
import './DynamicInput.css'
// import { IconButton, Input, Typography } from '@material-tailwind/react';
import { IconCircleMinus, IconCirclePlus, IconGripVertical } from '@tabler/icons-react';


export default function DynamicTextInput ({ option, setSchema, items, schemas }:any) {
  const { key:keyName, name, value, required, validate, elem, helperText, maxLen, disabled, placeholder, notice }= option;
  const wholeSchema= schemas;
  
  const handleValue= ({id, itemKey})=> (e)=> {
    
    let targetValue= e.target.value;
    setSchema(val=> {
      const data= val[keyName];
      const dataValue= data.value;
      const resVal= dataValue.map( v=> {
        if( v.id == id ) v[itemKey]= targetValue;
        return v;
      })
      // const validate= _validate(data, targetValue);
      const validate= _validate({schema: data, value: resVal, wholeSchema});

      return {
        ...val,
        [keyName]: {
          ...val[keyName],
          value: validate.value,
          validate: validate.valid,
        }
      }
    });
      
  }
  
  const addInput= (e)=> {
    setSchema(val=> {
      const data= val[keyName];
      const dataValue= data.value;
      const newVal= { id: guidQ1() }
      items.map(item=> newVal[item.key]= '');

      const resVal= dataValue.concat(newVal);
      // const validate= _validate({schema: data, value: resVal, wholeSchema});
      return {
        ...val,
        [keyName]: {
          ...val[keyName],
          // value: validate.value,
          // validate: validate.valid,
          value: resVal,
          validate: validate,
        }
      }
    });
  }

  const removeInput= (id)=> (e)=> {
    setSchema(val=> {
      const data= val[keyName];
      const dataValue= data.value;
      const resVal= dataValue.filter( v=> v.id != id );
      const validate= _validate({schema: data, value: resVal, wholeSchema});
      // console.log(validate)

      return {
        ...val,
        [keyName]: {
          ...val[keyName],
          value: validate.value,
          validate: validate.valid,
        }
      }
    });
  }

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setSchema(val=> {
      const data= val[keyName];
      return {
        ...val,
        [keyName]: {
          ...val[keyName],
          value: arrayMoveImmutable(data.value, oldIndex, newIndex),
        }
      }
    });
  }

  // const validsStatus= getValidateStatus({validate, colors, msgs});
  // const err= vaild[0].status == null
  /* let err= false;
  validsStatus.map(valid=> {
    const { msg, status, color, helpText }= valid;
    err= ( status == false || status == null ) ? true : false;
  }) */

  const help= helperText && validate && helpText({validate});
  const err= errCheck({validate});
  // console.log(wholeSchema)
  return (
    <>
    <div 
      ref={elem}
      className={`border ${err==true ? 'border-error' : 'border-base-content border-opacity-20'} rounded-btn px-3 py-2 bg-base-300`}
    >
      <div className='flex items-center '>
        <div id={keyName} className={`${err==true ? 'text-error' : ''} text-xs`}>
          {name}
          <span className="text-error">{required ? ' *' : ''}</span>
        </div>
        <div 
          onClick={addInput}
          className='btn btn-circle btn-xs btn-ghost ml-2'
        >
          <IconCirclePlus size={'18px'} className='font-thin text-accent' />
        </div>
      </div>
      
      {
        value && value.length > 0 &&
      
        <div className='w-full '>
          <SortableList 
            onSortEnd={onSortEnd} 
            draggedItemClassName="dragged" 
            className="list flex flex-wrap gap-1 w-full"
          >
            <>
            {
              value.map((val, idx)=> {
                const id= val.id;
                return (
                  <SortableItem key={idx} >
                    <div className='w-full flex items-center p-2 bg-base-200 rounded-md'>
                      <SortableKnob>
                        <div className="pr-1">
                          <IconGripVertical size={12} className='cursor-grab'/>
                        </div>
                      </SortableKnob>
                      {
                        items.map(item=> {
                          const { key, name }= item;
                          const itemValue= val[key] || '';
                          return (
                            <input
                              key={key}
                              className={`input input-bordered input-sm min-w-[40px] mr-2`}  
                              disabled={disabled}
                              ref={elem}
                              // error={err}
                              required={required || false}
                              id={keyName}
                              name={keyName}
                              autoComplete={keyName}
                              value={itemValue}
                              onChange={handleValue({id, itemKey: item.key})}
                            />
                          )
                        })
                      }
                      <div 
                        className='btn btn-xs btn-circle btn-ghost'
                        onClick={removeInput(id)}>
                        <IconCircleMinus size={'18px'} className='text-error font-thin' />
                      </div>
                    </div>
                  </SortableItem>
                )
              })
            }

            </>
            
          </SortableList>
          
        </div>
      }
    </div>
    {help && <div className="mt-1 text-xs">{help}</div> }
    {notice}
    </>
  )
}