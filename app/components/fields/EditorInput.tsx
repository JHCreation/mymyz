import React, { useContext } from 'react';
import { useHydrated } from 'remix-utils/use-hydrated';
import EditorField from '~/components/fields/EditorField.client';
// import ClientSideQuillEditor from './.client/ClientSideQuillEditor';
import { SchemaType, useFields } from './FieldType';
import { useController, useFormContext } from 'react-hook-form';
import { DataListContext } from '~/layout/admin/_grid/GridDataType';

export default function EditorInput ({ name, defaultValues, toastOption }) {

    const context= useContext(DataListContext);
    if( !context ) throw new Error('cannot find DataListContext')
    const {filterId, filters, setFilters, defaultFilters, category, page, setPage, pageSize, log, setLog, queryOptions, reload, useSchema, tableName, idKey, idName }= context;

    const { control, schema }= useFields();
    const schemaItem:SchemaType= schema[name]
    const { register, setValue, watch, formState: { errors } } = useFormContext()
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
    const formValues = watch()
    console.log(formValues)

    
    const isHydrated = useHydrated();
    return (<>
        <EditorField name={name} defaultValues={defaultValues} toastOption={toastOption} />

    {/* {
        isHydrated ? (
            <React.Suspense fallback={<div>Loading editor...</div>}>
            <ClientSideQuillEditor {...props}/>
            </React.Suspense>
        ) : (
            <div>Editor is loading...</div>
        )
    } */}
    </>)
}