import { toasterConfirm, toaster } from "@/components/ui/Toast";
import { ToastOptions } from "react-toastify";


export const sortParams= ({ schema, values })=> {
    const parameter = Object.entries(values).reduce((acc, [key, value]:[string, any]) => {
        if (schema[key].type === 'file') {
            const fileList = Array.isArray(value) ? value : value ? [value] : [];
            // if (fileList.length > 0) {
                acc.files[key] = fileList;
            // }
            // acc.files[key] = value;
        } else {
            if( !schema[key]?.pass ) acc.params[key] = value;
        }
        return acc;
    }, { params: {}, files: {} });
    return parameter
}


export type DataToasterType= {
    instance: typeof toaster
    option: ToastOptions
    id: string
}
interface RequestProp {
    toaster: DataToasterType
    tasks: {
        name: string
        fn: ()=> Promise<any>
        success?: (res)=> void
        // fail?: (res)=> void
        error?: (err)=> void
    }[]
    
}
export const request= ({toaster, tasks}: RequestProp):Promise<any>[]=> {
    // toaster.instance.loading({text: "처리중입니다..."}, { ...toaster.option, toastId: toaster.id })
    // setStatuses(tasks.map(task => ({ name: task.name, status: "pending" })));

    const promisese = tasks.map(async (task, index) => {
        console.log('이건 데이터 요청')
        try {
            const result = await task.fn();
            // 단순히 요청하고 응답
            // setStatuses(prev => prev.map((s, i) => i === index ? { ...s, status: "success" } : s));
            console.log(result)

            return task?.success ? task?.success(result) : result
            // return task.fail ? task.fail(result) : result    
        } catch (err) {
            return task.error ? task.error(err) : err
        }
    });

    return promisese;

    

    // const dataResults = await Promise.all(dataPromises);
    // console.log(dataResults)
    // Promise.all(promisese).then(res=> {
    //     const hasSuccess = res.some((r:any) => r.status === "fulfilled");
    //     console.log(hasSuccess)
        
    //     if ( hasSuccess ) {
    //         // alert("하나 이상 성공했습니다!");
    //         toaster.instance.update(toaster.id, 
    //             { text: '성공입니다.' },
    //             { 
    //             ...toaster.option,
    //             type: "success", 
    //             isLoading: false, 
    //             autoClose: 2000, 
    //             hideProgressBar: true ,
    //             // onClose: ()=> setStatus('edit')
    //             }
    //         )
    //     }
    // })
}

// const responses= (promisese)=> {
//     Promise.all(promisese).then(res=> {
//         const hasSuccess = res.some((r:any) => r.status === "fulfilled");
//         console.log(hasSuccess)
        
//         if ( hasSuccess ) {
//             // alert("하나 이상 성공했습니다!");
//             toaster.instance.update(toaster.id, 
//                 { text: '성공입니다.' },
//                 { 
//                 ...toaster.option,
//                 type: "success", 
//                 isLoading: false, 
//                 autoClose: 2000, 
//                 hideProgressBar: true ,
//                 // onClose: ()=> setStatus('edit')
//                 }
//             )
//         }
//     })
// }