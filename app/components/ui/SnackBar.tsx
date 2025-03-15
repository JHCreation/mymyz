'use client'

import { useMemo } from "react";
import { Alert, Button } from "@material-tailwind/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { color } from "@material-tailwind/react/types/components/alert"
export type { color };
export type StatusType= { 
  open: boolean, 
  color?: color
  msg: string,
}
interface AlertProps {
  status: StatusType
  setOpen: (status: StatusType)=> void
  msg: string
  duration?: number
  children?: ReactJSXElement
  className?: string
}
export function AlertCustomAnimation({ status, setOpen, msg, duration, children, className }: AlertProps) {
  const { open, color }= status;
  useMemo(()=> {
    if( open ){
      const time= setTimeout(e=> {
        setOpen({ open: false, msg: '' });
        clearTimeout(time)
      }, duration || 2000)
      return time;
    }
  }, [open]);


  return (
    <div 
      // className={className}
      className={`${className ? className : 'absolute bottom-10 left-10 z-[2000]'}`}
    >
      <Alert
        color={color || 'gray'}
        open={open}
        onClose={() => setOpen({ open: false, msg: ''})}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
      >
        {children && children}
        {!children && msg && msg}
        {/* {msg} */}
      </Alert>
    </div>
  );
}