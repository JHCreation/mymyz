import { ReactNode } from "react";

export function LinkText_1 ({ className, children }: { className?:string, children:ReactNode } ) {
  return (
    <div className={`group cursor-pointer relative overflow-hidden before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-black before:translate-x-[-105%] hover:before:translate-x-0 before:transition-all before:duration-300 ${className}`}>
      {children}
    </div>  
  )
}

export function LinkText_2 ({ className, children }: { className?:string, children:ReactNode } ) {
  return (
    <div className={`group cursor-pointer relative overflow-hidden  ${className}`}>
      <span className="h-full absolute left-0 origin-bottom bottom-0 bg-black group-hover:scale-y-100 scale-y-0 transition-transform w-full duration-500 group-hover:origin-top "></span>
      {children}
    </div>  
  )
}
export function LinkText_3 ({ className, children }: { className?:string, children:ReactNode } ) {
  return (
    <LinkText_2>
      <div className="relative flex justify-between group-hover:text-white group-hover:px-2 duration-500">
      {children}
      </div>
    </LinkText_2>  
  )
}


/* import { FC, HTMLProps, ReactNode } from "react";
interface TextProps {
  children: ReactNode;
  className?: HTMLProps<HTMLElement>["className"];
}
export const LinkText: FC<TextProps> = ({ className, children } )=> {
  return (
    <div className={`relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-black before:translate-x-[-100%] hover:before:translate-x-0 before:transition-all before:duration-1000 ${className}`}>
      {children}
    </div>
  )
} */