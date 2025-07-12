import _ from "lodash";
import { useEffect, useState } from "react";
import { z } from "zod";
import CustomTest from "~/components/fields/CustomTest";
import { defineFields, UseSchema, FieldsSchema, UseSchemaProp, makeFileZod } from "~/components/fields/FieldType";
import { useCategoryState } from "~/store/store";
import guidQ1 from "~/utils/validate/guid";

const useSchema:UseSchema<ReturnType<typeof getSchema> | null>= ({ tableName, method, data })=> {
    const [schema, setSchema]= useState<FieldsSchema<ReturnType<typeof getSchema>> | null>(null);
    const { data: category, getCategory }= useCategoryState()
    useEffect(()=> {
        getCategory();
    }, [])
    const init= (defaultValue?:any)=> {
        console.log('initing!')
        const defs = getSchema({tableName, category, method, data});
        let defaultValues;
        if( data ){
            defaultValues = _.mapValues(
                _.pickBy(defs.schema, (v) => v.defaultValue !== null),
                (v) => v.defaultValue
            );

            console.log(defaultValues)

            // const result = _.transform(defs.schema, (acc, value, key) => {
            //     if (value.type === 'file') {
            //       acc.files[key] = value;
            //     } else {
            //       acc.others[key] = value;
            //     }
            // }, { files: {}, others: {} });

            // const fileSchemas = Object.entries(defs.schema).reduce((acc, [key, value]) => {
            //     if (value?.type === 'file') {
            //         acc[key] = value;
            //     }
            //     return acc;
            // }, {} as Record<string, any>);
            // console.log(fileSchemas, result)
            
            // Object.keys(fileSchemas).map(key=> {
            //     try {
            //         defaultValues[key]= JSON.parse(data[fileSchemas[key].key])
            //     } catch (error) {
            //         defaultValues[key]= data[fileSchemas[key].key]
            //     }
            // })

            Object.keys(data).map(key=> {
                try {
                    defaultValues[key]= JSON.parse(data[key])
                } catch (error) {
                    defaultValues[key]= data[key]
                }
            })
            if( defaultValue ) defaultValues= {...defaultValues, ...defaultValue}
        } else {
            defaultValues= _.mapValues(defs.schema, 'defaultValue')
        }
        console.log(defaultValues)

        setSchema({
          schema: defs?.schema, 
          schemas: defs?.schemas, 
          defaultValues
        });
    }
    useEffect(() => {
        if (category) {
            init()
        }
    }, [category, tableName]);
    
    return { 
        schema: schema?.schema, 
        schemas: schema?.schemas, 
        defaultValues: schema?.defaultValues,
        init,
    }
}
export default useSchema


const getSchema = ({tableName, category, method, data}:UseSchemaProp & { category: any }) => {
    const schema= defineFields({
        id: {
            key: 'id',
            name: '아이디',
            type: 'text',
            defaultValue: null,
            disabled: true,
            hidden: true,
            pass: true,
            validation: z.coerce.number()
        },
        key: {
            key: 'key',
            name: '키',
            type: 'text',
            custom: CustomTest,
            defaultValue: guidQ1(),
            validation: z.string().nonempty('비었다고.')
        },
        user_id: {
            key: 'user_id',
            name: '작성자',
            type: 'text',
            defaultValue: 2,
            validation: z.coerce.number()
        },
        // title: {
        //     key: 'title',
        //     name: '제목',
        //     type: 'text',
        //     defaultValue: guidQ1(),
        //     validation: z.string().nonempty('비음')
        // },
        value: {
            key: 'category',
            name: '카테고리',
            type: 'text-array',
            defaultValue: [{
                name: 't', value: 'a'
            }],
            validation: z.array(z.object({
                // id: z.string(),
                name: z.string().nonempty('이름이 없어'),
                value: z.string().nonempty('값이 없어')
                /* .refine(d=> {
                    return d == 'test'
                }, '이거말고') */
            })).min(1, '더해야지')
        },
        // status: {
        //     key: 'gender',
        //     name: '성별',
        //     type: 'radio',
        //     defaultValue: '',
        //     selectOption: category['status'].value,
        //     validation: z.string({
        //         message: '필수입력'
        //     })
        // },

        // type: {
        //     key: 'type',
        //     name: '타입',
        //     type: 'checkbox',
        //     defaultValue: [],
        //     selectOption: category['status'].value,
        //     validation: z.array(z.string(), {message:'이것은 배열이 아녀'}).min(1, '하나라도 입력하라고.')
        // },

        status: {
            key: 'type',
            name: '타입',
            type: 'toggle',
            defaultValue: category['status'].value[0].value,
            selectOption: category['status'].value,
            validation: z.enum(
                [category['status'].value[0].value, category['status'].value[1].value], 
                { message: '아니' }
            ),
        },
        
        // content: {
        //     key: 'content',
        //     name: '내용',
        //     type: 'text',
        //     defaultValue: guidQ1(),
        //     validation: z.string().nonempty('빔')
        //     // .max(2,'길어')
        // },
        doc_01: {
            key: 'doc_01',
            name: '썸네일',
            type: 'text',
            defaultValue: null,
            hidden: true,
            validation: z.array(z.string().nonempty()),
        },
        thumb_file: {
            key: 'doc_01',
            name: '썸네일',
            type: 'file',
            defaultValue: method == "update" ? null : [],
            uploadPath: `/${tableName}`,
            pass: true,
            validation: makeFileZod({
                key: 'thumb_file', 
                method, 
                // minFile: 1, 
                maxFile: 3, 
                maxFileSize: .8, 
                maxFileTotalSize: 3
            })
        },

        doc_02: {
            key: 'doc_02',
            name: '이미지',
            type: 'text',
            defaultValue: null,
            hidden: true,
            validation: z.array(z.string().nonempty()),
        },
        thumb2_file: {
            key: 'doc_02',
            name: '이미지',
            type: 'file',
            defaultValue: method == "update" ? null : [],
            uploadPath: `/${tableName}`,
            pass: true,
            validation:  makeFileZod({
                key: 'thumb2_file', 
                method, maxFile: 3, maxFileSize: .5, maxFileTotalSize: 1.5
            })
        },
        create_date: {
            key: 'create_date',
            name: '등록일자',
            type: 'hidden',
            defaultValue: '',
            validation: z.string().optional(),
        }
    })
    const schemas= z.object( _.mapValues(schema, (value) => value.validation) )
    return { schemas, schema }
}
