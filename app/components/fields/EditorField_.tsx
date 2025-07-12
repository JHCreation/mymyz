import { useController, useFormContext } from "react-hook-form";
import { FieldProps, SchemaType, useFields } from "./FieldType";
import { cn } from "~/utils/style";
// import ClientSideQuillEditor from "./EditorField";
import { DataListContext } from "~/layout/admin/_grid/GridDataType";
import { useContext } from "react";


export default function EditorField_({ name, defaultValues }: FieldProps) {
    const context= useContext(DataListContext);
    if( !context ) throw new Error('cannot find DataListContext')
    const {filterId, filters, setFilters, defaultFilters, category, page, setPage, pageSize, log, setLog, queryOptions, reload, useSchema, tableName, idKey, idName }= context;

    const { control, schema }= useFields();
    const schemaItem:SchemaType= schema[name]
    const { register, setValue, formState: { errors } } = useFormContext()
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
        <fieldset 
            className={`fieldset border px-4 rounded-md 
                ${cn({ 
                    'border-error border-1': error,
                    'hidden': schemaItem?.hidden
                })}
            `}
        >
            <legend className="fieldset-legend px-2">{schemaItem?.name}</legend>
            
            <div className="pt-2">
                
                <input className={`input w-full`} disabled={schemaItem?.disabled} {...register(name)} />
            </div> 
            <p className="label text-error">{error?.message}</p>
            {/* <p className="label">{(errors as any)?.[name]?.required_error}</p> */}
        
        </fieldset>
    )
}
