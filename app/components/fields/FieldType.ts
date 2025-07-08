import { Control } from "react-hook-form";
// import { FiledKeys, FormData, FormField } from "~/api/category/schemas";
import { createContext, useContext } from "react"
import { z } from "zod";
import { mbToBytes } from "~/utils/validate/utility";

export type FieldsSchema<T>= {
    // schema: T extends null ? undefined : T extends { schema: infer S } ? S | undefined : undefined
    // schemas: T extends null ? undefined : T extends { schemas: infer S } ? S | undefined : undefined
    schema: T extends { schema: infer S } ? S | any : undefined;
    schemas: T extends { schemas: infer S } ? S | any : undefined;   
    defaultValues: T extends { schema: infer S } ? { [K in keyof S]?: any } : any;
    init?: any
}
export type UseSchemaProp= { 
    tableName: string
    method?: FieldMethod
    data?: any 
}
export interface UseSchema<T> {
    (args:UseSchemaProp): FieldsSchema<T>
}

type BasicFieldTypeKey= 'text'|'file'|'hidden'|'text-array'
type SelectFieldTypeKey = 'checkbox'|'radio'|'select'|'toggle'
type FileFieldTypeKey = 'file'
type FieldTypeKey= BasicFieldTypeKey | SelectFieldTypeKey | FileFieldTypeKey
type BaseSchema= {
    key: string
    name: string
    type: FieldTypeKey
    custom?: any
    defaultValue: any
    hidden?: boolean
    pass?: boolean
    disabled?: boolean
    validation: any
}
type SchemaWithSelectOption = BaseSchema & {
    type: SelectFieldTypeKey
    selectOption: any
}

type SchemaWithoutSelectOption = BaseSchema & {
    type: BasicFieldTypeKey
    selectOption?: never
}
export type SchemaWithFileOption = BaseSchema & {
    type: FileFieldTypeKey
    selectOption?: never
    uploadPath: string
}

export type SchemaType = SchemaWithSelectOption | SchemaWithoutSelectOption | SchemaWithFileOption


export type FieldsType= Record<string, SchemaType>
export function defineFields<T extends Record<string, SchemaType>>(
  defs: T
) {
  return defs;
}
// export type InferFieldType<T extends FieldTypeKey> = FieldType[T]
// export type GetDataType<T extends Record<string, SchemaType>> = {
//   [K in keyof T]: InferFieldType<T[K]['type']>;
// };
// export function defineModel<T extends Record<string, SchemaType>>(defs: T) {

//   return {
//     defs,                        // 필드 정의
//     // schema,                      // Zod 유효성 검사 스키마
//     create: (data: GetDataType<T>) => data, // 타입 자동 ß추론
//   }
// }
export const files= z.object({
    id: z.string(),
    blob: z.string(),
    thumbnail: z.string().nullable(),
    file: z.instanceof(File)
})
export const fileItem= z.object({
    id: z.string(),
    file: z.instanceof(File),
    name: z.string(),
    uploadPath: z.string(),
    filePath: z.string(),
    method: z.enum(['add', 'override']),
})
export const filesData= z.object({
    file: z.array(fileItem),
    // name: z.string(),
    uploadPath: z.string(),
    method: z.enum(['add', 'override']),
    // id: z.string().optional(),
    // uploadFullPath: z.string().optional(),
    // uploadRootPath: z.string().optional(),
    // thumbnail: z.string().optional(),
    // file: files,
})
export type FileItemType = z.infer<typeof fileItem>
export type FilesDataType = z.infer<typeof filesData>
export type FilesType = z.infer<typeof files>

type FormData = Record<string, any>;
export type FieldMethod= 'create'|'update'
export type FiledContextProps = {
    control: Control<FormData>;
    // schema: FormField
    schema: Record<string, SchemaType>
    method: FieldMethod
    setEdits?: React.Dispatch<React.SetStateAction<{}>>
}
export interface FieldProps {
    schemaItem?: SchemaType
    name: string
    idKey?: string
    defaultValues?: any
} 
export type TextFieldArrayProps = FieldProps & {
    defaultValue: any
} 

export const FieldsContext = createContext<FiledContextProps|undefined>(undefined);

export const useFields = () => {
    const ctx = useContext(FieldsContext)
    if (!ctx) throw new Error('fieldsProvider 내에서 useFields를 사용해야 합니다');
    return ctx;
};

export const FieldsProvider = FieldsContext.Provider;


export const mimeToExt = {
  "image/png": "png",
  "image/jpeg": "jpg|jpeg",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/webp": "webp"
};
const extensions = Object.values(mimeToExt).join('|');
const mimeToExtRegex = new RegExp(`\\.(${extensions})$`, 'i');

const mimeTypes = Object.keys(mimeToExt)
const mimeTypesRegex = new RegExp(mimeTypes.map(type =>
    type.replace(/[.+?^${}()|[\]\\]/g, '\\$&')  // 특수문자 이스케이프
).join('|'));
export function getFilenameWithoutExt(filePath: string): string | null {
  const match = filePath.match(/\/([^\/]+)\.(png|jpe?g|gif|svg|webp)$/i);
  return match ? match[1] : null;
}



type MakeFileZodProp = {
    key: string
    method?: FieldMethod
    minFile?: number
    maxFile?: number
    maxFileSize?: number
    maxFileTotalSize?: number
}
export const makeFileZod= ({ key, method, minFile=0, maxFile=0, maxFileSize=0, maxFileTotalSize=0 }:MakeFileZodProp)=> {
    const zod= z.array(fileItem)
    const fZod= method == "update" ? zod.optional() : zod
    const fileZod= fZod.superRefine((files, ctx) => {
        console.log(key,files)
        if( !files ) {
            // ctx.addIssue({
            //     code: z.ZodIssueCode.custom,
            //     message: "한개 이상의 파일을 첨부 해주세요.",
            // });
            return
        }
        if( minFile !== 0 && files.length < minFile ) {
            // if( (method == "create") 
            //     // || (method == "update" && edits[key] ) 
            // ) 
            // {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "한개 이상의 파일을 첨부 해주세요.",
                });
            // }
        }
        if( maxFile !== 0 && files.length > maxFile ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `최대 ${maxFile}개까지만 가능합니다.`,
            });
        }
        
        let totalSize= 0;
        files.some( v=> {
            console.log(v)
            if( !v?.file ) return true

            const { type, size }= v?.file;
            if ( !mimeTypes.includes(type) ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "지원되지 않는 이미지 형식입니다.",
                });
                return true
            }
            
            if( maxFileSize !== 0 && size > mbToBytes(maxFileSize) ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `파일 하나당 ${maxFileSize}Mb를 초과할수 없습니다.`,
                });
                return true
            }
            totalSize += size;
            console.log('total size', totalSize)
            // return false
        })

        if( maxFileTotalSize !== 0 && totalSize >  mbToBytes(maxFileTotalSize) ){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `총파일이 ${maxFileTotalSize}Mb를 초과할수 없습니다.`,
            });
            // return true
        }
        // console.log('모두 순회')
        // return files.length > 0;
    })

    return fileZod
}

export type CreateParams= {
    data: any
    access_token: string
}

export type UpdateParams= CreateParams & {
    idKey: string
}