import { ToastContainer, toast, cssTransition, Id, ToastOptions, TypeOptions } from 'react-toastify';
// import Button from './Button';
import { MouseEvent } from 'react';

interface MsgProp {
  text: string | React.ReactNode
  children: React.ReactNode
}

const Msg = ({ text, children }:MsgProp)=> (
  <div className="flex flex-col">
    <span className="font-suite text-sm font-bold">{text}</span>
    {children && children}
  </div>
)

interface ConfirmProp {
  text: MsgProp['text']
  agree: (e:MouseEvent<HTMLElement> | undefined)=> void
  disagree: (e:MouseEvent<HTMLElement> | undefined)=> void
  type?: TypeOptions
}
const Confirm = ({ text, agree, disagree }:ConfirmProp) => (
  <Msg text={text} >
    <div className="flex gap-2 items-center justify-center mt-2">
      <div className="btn btn-sm bg-main" onClick={agree}>네</div>
      <div className="btn btn-sm bg-main" onClick={disagree}>아니오</div>
    </div>
  </Msg>
);


export const toasterConfirm = (myProps:ConfirmProp, toastProps:ToastOptions ): Id =>{
  let toaster= myProps.type ? toast[myProps.type] : toast
  return toaster(<Confirm {...myProps} />, { ...toastProps });
}
  

export const toaster = (myProps, toastProps:ToastOptions): Id => toast(<Msg {...myProps} />, { ...toastProps });
toaster.success  = (myProps, toastProps:ToastOptions): Id => toast.success(<Msg {...myProps} />, { ...toastProps });
toaster.error = (myProps, toastProps?:ToastOptions): Id => toast.error(<Msg {...myProps} />, { ...toastProps });
toaster.warn = (myProps, toastProps:ToastOptions): Id => toast.warn(<Msg {...myProps} />, { ...toastProps });
toaster.info = (myProps, toastProps:ToastOptions): Id => toast.info(<Msg {...myProps} />, { ...toastProps });
toaster.loading = (myProps, toastProps:ToastOptions): Id => toast.loading(<Msg {...myProps} />, { ...toastProps });
toaster.update = (id, myProps, toastProps) => toast.update(id, { 
  render: <Msg {...myProps} />, closeButton: true, 
  ...toastProps 
});

toaster.clearWaitingQueue = (toastProps) => toast.clearWaitingQueue({ 
  ...toastProps 
});
toaster.dismiss= toast.dismiss;