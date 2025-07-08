import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { FieldProps, SchemaType, TextFieldArrayProps, useFields } from "./FieldType";
import { z } from "zod";
import { cn } from "~/utils/style";

export default function TextFieldArray({name, defaultValues}: FieldProps) {
    const { control, schema }= useFields();
    const schemaItem:SchemaType= schema[name]

    const { register, setValue, formState: { errors } } = useFormContext()
    if( !schemaItem ) return null
    type FormValues = z.infer<typeof schemaItem.validation[0]>;
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray<FormValues>({
        control,
        name,
    });

    // console.log('fieldArray', fields, errors)
    const handleAppend= (value)=> (e)=> {
        e.preventDefault();
        e.stopPropagation()
        append(value)
    }
    console.log(defaultValues, name)
    return (
        <div className="">
            
            <fieldset className={`fieldset border px-4 pb-2.5 rounded-md 
                ${cn({
                    // 'border-error border-1': errors?.[name],
                    'border-error border-1': errors?.[name]?.root?.message || errors?.[name]?.message
                })}
            `}>
                <legend className="fieldset-legend px-2">{schemaItem?.name}</legend>
                <div className="flex justify-start">
                    <button onClick={handleAppend(defaultValues[name])} className="btn btn-sm btn-info">추가</button>
                </div>
            
                {fields.map((field, index) => (
                    <div key={field.id} className="flex" >
                        {
                            Object.keys(field).map((key, i)=> {
                                // console.log(key)
                                if( key != 'id' )
                                return (
                                    <div key={i} className="flex flex-col w-1/2 mr-1.5">
                                        <input
                                            key={field?.id}
                                            className={`input input-sm input-accent
                                                ${cn({
                                                    'border-error': errors?.[name]?.[index]?.[key]?.message
                                                })}
                                            `}
                                            {...register(`${name}.${index}.${key}`)}
                                        />
                                        <p className="label text-error">{errors?.[name]?.[index]?.[key]?.message}</p>
                                    </div>
                                )
                            })
                        }
                        {/* <div className="flex flex-col w-1/2 mr-1.5">
                            <input
                                key={field?.id}
                                className="input input-sm input-accent"
                                {...register(`${name}.${index}.name`)}
                            />
                            <p className="label text-red-500">{errors?.[name]?.[index]?.['name']?.message}</p>
                        </div>
                        <div className="flex flex-col w-1/2 mr-1.5">
                            <input
                                key={field?.id}
                                className="input input-sm input-accent"
                                {...register(`${name}.${index}.value`)}
                            />
                            <p className="label text-red-500">{errors?.[name]?.[index]?.['value']?.message}</p>
                        </div> */}
                        <button className="btn btn-sm btn-error" onClick={e=>remove(index)}>삭제</button>
                    </div>
                ))}
                {errors?.[name]?.root?.message && 
                <p className="label text-error">{(errors?.[name] as any)?.root?.message}</p>}
                {errors?.[name]?.message && 
                <p className="label text-error">{(errors?.[name] as any)?.message}</p>}
                {/* <div className="pt-2"><input className='input' {...register(name)} /></div>  */}
            
                {/* <p className="label">{(errors as any)?.[name]?.required_error}</p> */}
            
            </fieldset>
        </div>
    )
}
