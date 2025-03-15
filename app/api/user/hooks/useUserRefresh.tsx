
import { useMutation } from "@tanstack/react-query";
import queryOptions from "@/api/user/queryOption";
import useLogout from "./useLogout";
import { useLogState } from "~/store/store";

interface Props {
  success_callback?: (data, variables, context, response?: any)=> void
  error_callback?: (error, variables, context)=> void
}
// type RefreshProps = Props | any | null
export default function useUserRefresh (props:Props|null) {
  // const { success_callback, error_callback }= props
  const { log, setLog }= useLogState()
  // const { queryKey: logout_queryKey, queryFn: logout_queryFn }= queryOptions.logout();
  const { handleLogout }= useLogout({type: 'refresh'})

  const { queryKey, queryFn }= queryOptions.refresh();
  const mutation = useMutation({
    mutationFn: queryFn,
    onMutate: (variables) => {
      // A mutation is about to happen!
  
      // Optionally return a context containing data to use when for example rolling back
    },
    onError: (error, variables, context) => {
      console.log(error)
      // An error happened!
      handleLogout()
      props?.error_callback && props.error_callback(error, variables, context)
    },
    onSuccess: (res, variables, context) => {
      console.log(res)
      /* setLog({
        access_token: 'test',
        userid: 'admin_user',
        state: true,
        is_login: true,
      }) */
      // return;
      
      if( res?.access_token ) {
        const { access_token, userid }= res;
        const responseLog= {
          access_token: access_token,
          userid: userid,
          state: true,
          is_login: true,
        }
        setLog(responseLog)
        props?.success_callback && props.success_callback(res, variables, context, { log: responseLog })
      } else {
        handleLogout()
        props?.success_callback && props.success_callback(res, variables, context)
      }
    },
    onSettled: (data, error, variables, context) => {
      // Error or success... doesn't matter!
    },
  
  })
  const {data, isPending, isError, isSuccess}= mutation;

  const handleRefresh= ()=> {
    mutation.mutate()
  }

  // console.log( log, data, isPending, isError, isSuccess )
  return { log, data, handleRefresh, isPending, isError, isSuccess }
}