import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import guidQ1 from '~/utils/validate/guid';
import FileFieldFileList from './FileFieldFileList';
import { FieldProps, FileItemType, FilesDataType, getFilenameWithoutExt, SchemaType, SchemaWithFileOption, useFields } from './FieldType';
import { cn } from '~/utils/style';
import path from 'path-browserify';
import { format } from 'date-fns';


const uploadPath= typeof window !== 'undefined' ? window.ENV.REMIX_PUBLIC_UPLOAD_PATH : process.env.REMIX_PUBLIC_UPLOAD_PATH;
export default function FileField({ name, idKey, defaultValues }:FieldProps) {
    const { control, schema, method, setEdits, }= useFields();
    const schemaItem= schema[name] as SchemaWithFileOption
    const linkKey= schemaItem.key

    const { setValue, formState: { errors} } = useFormContext()
    
    const [edit, setEdit]= useState<boolean>(method != 'update')
    const handleEdit= (e)=> {
        e.preventDefault()
        console.log('edit!', edit, linkKey,  defaultValues?.[linkKey])
        setEdit(!edit)
    }


    useEffect(() => {
        if (!edit) {
            console.log('edit → false 상태에서 초기화 실행');
            setValue(linkKey, defaultValues?.[linkKey] || [], {
                shouldValidate: true,
                shouldTouch: false,
            });
        }
    }, [edit, defaultValues, linkKey, setValue]);

    // console.log('File Fields: ',defaultValues, schema[name], schema,name)
    
    return (
        <fieldset className={`fieldset border px-4 rounded-md ${cn({'border-error border-1': errors[name]})}`} >
            <legend className="fieldset-legend px-2">{schemaItem?.name}</legend>
            {
                method == 'update' &&
                <>
                <button 
                    onClick={handleEdit}
                    className={`btn ${cn({
                        'bg-error': edit
                    })}`} >
                    {edit ? '취소' : '수정'}
                </button>
                </>
            }
            {
                !edit ? 
                <div className="">
                    {defaultValues?.[schema[name].key] &&
                    <ul className="text-sm text-gray-600 mt-2 flex flex-wrap gap-1.5">
                    {
                        defaultValues?.[schema[name].key].map((val, key)=> {
                            const url= `${uploadPath}${val}`
                            return (
                                <li key={key} className="w-20 p-1 border relative cursor-grab">
                                    <img
                                        src={url}
                                        // alt={`preview-${id}`}
                                        className='w-full'
                                    />
                                    <div className="line-clamp-2">
                                        <p className="text-2xs">{getFilenameWithoutExt(val)}</p>
                                    </div>
            
                                </li>
                            )
                        })
                    }
                    </ul>
                    }
                </div> :
                <EditableFileInput name={name} idKey={idKey} defaultValues={defaultValues} edit={edit} />
            }
        </fieldset>
        
    )
}

function EditableFileInput({ name, idKey, defaultValues, edit }:FieldProps & { edit: boolean}) {
    const { control, schema, method, setEdits }= useFields();
    const schemaItem= schema[name] as SchemaWithFileOption
    const linkKey= schemaItem.key
    
    const { register, unregister, setValue, getValues, watch } = useFormContext()
    const { 
        field,
        fieldState: { invalid, isTouched, isDirty, error, isValidating },
        formState: { touchedFields  , dirtyFields }
     } = useController({
        name,
        control,
        defaultValue: defaultValues?.[name] || [],
        // rules: { required: '파일을 첨부해주세요' },
    });
    // console.log(watch(name), getValues()[idKey as string],watch('id'))
    const fileChange= (files)=> {
        console.log(field, getValues())
        const fieldValue:FileItemType[]= field.value
        if (files && files.length > 0) {
            const targetVal:FileItemType[]= Object.keys(files).map( idx=> {
                const file= files[idx];
                const now= format(new Date(), 'yyyyMMddHHmmss');
                const uploadPath= schemaItem?.uploadPath
                const filePath= `${getValues()[idKey as string]}/${schemaItem.key}`
                const uploadFilePath= `${uploadPath}/${filePath}`;
                const uploadFileName= `${now}_${file.name}`;
                
                return {
                    id: guidQ1(),
                    name: uploadFileName,
                    method: 'add',
                    uploadPath: uploadFilePath,
                    filePath,
                    file,
                }
            })
            const newValue= (fieldValue as FileItemType[]).concat(targetVal)
            
            field.onBlur()
            setValue(name, newValue, { shouldValidate: true })
            setDropOver(false);
        }

    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        fileChange(files)
    };


    const [dropOver, setDropOver] = useState<boolean>(false);
    
    const handleDrop = useCallback((id)=> (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        fileChange(files)
    }, [field, setValue]);

    const inputRef = useRef<HTMLInputElement|null>(null);
    const handleSelectClick = (e) => {
        e.preventDefault();
        if( inputRef.current ) inputRef.current?.click();
    };
    
    const fileValue= watch(name)
    useEffect(() => {
        if (fileValue) {
            const filenames= fileValue.map(file=> `${file.uploadPath}/${file.name}`)
            // const filenames= fileValue.file.map(file=> file.file.name)
            setValue(schemaItem.key, filenames);
        } else {
            setValue(schemaItem.key, []);
        }
    }, [fileValue, setValue]);

    useEffect(()=> {
        // console.log('edit 변화 감지')
        
        if( edit ){
            // setValue(linkKey, [], { shouldValidate: true, shouldTouch: false })
            // console.log('파일 초기화', name)
            field.onBlur()
            setValue(name, [], { shouldValidate: true, shouldTouch: true })
            setDropOver(false);
        }
    }, [edit])
    
    // console.log(getValues(), fileValue, error)
    return (
        <>
            <div
                onDrop={handleDrop(name)}
                onDragOver={e=> e.preventDefault()}
                onDragEnter={e => setDropOver(true)}
                onDragLeave={e=> setDropOver(false)}
                className={`border-dashed border-2 p-10 text-center ${dropOver ? 'border-red-500' : 'border-slate-400'}`}
            >
                <div 
                className="inline-flex flex-col"
                >
                
                    <p className=''>여기로 파일을 드래그하거나 클릭해서 업로드하세요</p>


                    <button className='btn' onClick={handleSelectClick}>파일열기</button>
                    <input
                        // ref={field.ref}
                        ref={(el) => {
                            field.ref(el);
                            inputRef.current = el;
                        }}
                        type="file"
                        hidden
                        // {...register(name)}
                        multiple 
                        onChange={handleChange} 
                        className='file-input file-input-xs'
                    />
                    <div className="text-sm text-gray-600 mt-2">
                        {field.value?.length
                        ? `${field.value.length}개의 파일이 선택됨`
                        : '선택된 파일 없음'}
                    </div>

                    
                </div>
            </div>
            {error && <p className='label text-error'>{error.message}</p>}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {
                    // field?.value?.file &&
                    field?.value &&
                    <FileFieldFileList list={field.value} field={field} />

                }
            </div>
        </>
    )
}