
import { useMutation } from "@tanstack/react-query";
import queryOptions from "@/api/user/queryOption";
import { useLogState } from "~/store/store";

interface Props {
  type?: string
  success_callback?: (data, variables, context)=> void
}
export default function useLogout ({ type, success_callback }:Props) {
  const { log, setLog }= useLogState()

  const { queryKey, queryFn }= queryOptions.logout();
  const mutation = useMutation({
    mutationFn: queryFn,
    onMutate: (variables) => {
      // A mutation is about to happen!
  
      // Optionally return a context containing data to use when for example rolling back
    },
    onError: (error, variables, context) => {
      // An error happened!
    },
    onSuccess: (data, variables, context) => {
      setLog({
        access_token: '',
        userid: '',
        state: type == 'refresh' ? 'fail' : false,
        is_login: false
      })
      success_callback && success_callback(data, variables, context)
    },
    onSettled: (data, error, variables, context) => {
      // Error or success... doesn't matter!
    },
  
    
  
  })
  const {data, isPending, isError, isSuccess}= mutation;

  const handleLogout= ()=> {
    const res= mutation.mutate()
  }

  // console.log( log, data, isPending, isError, isSuccess )
  return { log, data, handleLogout, isPending, isError, isSuccess }
}