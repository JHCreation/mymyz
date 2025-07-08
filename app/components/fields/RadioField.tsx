import React from 'react'
import { FieldProps, SchemaType, useFields } from './FieldType'
import { useController, useFormContext } from 'react-hook-form';
import { cn } from '~/utils/style';


export default function RadioField<T>({name, defaultValues}: FieldProps) {
    const { control, schema }= useFields();
    const schemaItem:SchemaType= schema[name]
    const { register, setValue } = useFormContext()
    const { 
        field,
        fieldState: { invalid, isTouched, isDirty, error, isValidating },
        formState: { touchedFields, dirtyFields }
        } = useController({
        name,
        control,
        defaultValue: defaultValues?.[name] || '',
        // rules: { required: '파일을 첨부해주세요' },
    });


    return (
        <fieldset className={`fieldset border px-4 rounded-md ${cn({'border-error border-1': error})}`} >
            <legend className="fieldset-legend px-2">{schemaItem?.name}</legend>
            
            <div className="flex flex-wrap">
                {
                    schemaItem?.selectOption.map(sel=> {
                        return (
                            <label key={sel.id} className='mr-4'>
                            <input
                                type="radio"
                                className='radio radio-accent radio-sm'
                                value={sel.value}
                                {...register(name)}
                            />
                                
                                <span className="mx-1">{sel.key}</span>
                            </label>
                        )
                    })
                }
                {/* <input className='checkbox' {...register(name)} /> */}
                {/* <label className="label">
                    <input type="checkbox" defaultChecked className="checkbox" />
                    Remember me
                </label> */}
            </div> 
            <p className="label text-error">{error?.message}</p>
            {/* <p className="label">{error?.required_error}</p> */}
            
        </fieldset>
    )
}