import React from 'react'
import { FieldProps, SchemaType, useFields } from './FieldType'
import { useController, useFormContext } from 'react-hook-form';
import { cn } from '~/utils/style';


export default function ToggleField({name, defaultValues}: FieldProps) {
    const { control, schema }= useFields();
    const schemaItem:SchemaType= schema[name]
    const { register, setValue, watch } = useFormContext()
    const { 
        field,
        fieldState: { invalid, isTouched, isDirty, error, isValidating },
        formState: { touchedFields, dirtyFields }
        } = useController({
        name,
        control,
        defaultValue: defaultValues?.[name] || '',
    });
    const checked= schemaItem?.selectOption[0]
    const unChecked= schemaItem?.selectOption[1]
    const isChecked = watch(name) === checked.value;
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(name, e.target.checked ? checked.value : unChecked.value, {
            shouldValidate: true,
        });
    };


    return (
        <fieldset className={`fieldset border px-4 rounded-md ${cn({'border-error border-1': error})}`} >
            <legend className="fieldset-legend px-2">{schemaItem?.name}</legend>
            
            <div className="flex flex-wrap">
                <label className='mr-4'>
                    <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    <span className="mx-1">{isChecked ? checked.key : unChecked.key}</span>
                </label>

            </div> 
            <p className="label text-error">{error?.message}</p>
            
        </fieldset>
    )
}