
import { Select as MTSelect } from "@material-tailwind/react";
interface Props extends Omit<React.ComponentPropsWithRef<typeof MTSelect>, 'size'> {
  size?: 'sm'|'md'|'lg'
}

const labelClass= "!leading-[3.4] peer-[.border-t-transparent]:!leading-[1.25]  text-[13px] peer-[.border-t-transparent]:text-[11px] peer-[.border-t-transparent]:top-[-0.38rem]"
const meuClass= "min-w-0 text-xs p-1"
const containerClass= "!min-w-0 h-8"
const selecClass= "[&>*:nth-child(2)]:w-4 [&>*:nth-child(2)]:h-4"
const selectedClass= "text-xs"
export const Select= ({size, selected, ...props}: Props)=> {
  const is_sm= size == "sm"
  return (
    <MTSelect 
      labelProps={{ 
        className: is_sm ? labelClass : "",
      }}
      menuProps={{className: is_sm ? meuClass : "min-w-0"}}
      containerProps={{className: is_sm ? containerClass : "!min-w-0"}}
      className={`relative ${is_sm ? selecClass : ''}`}
      selected={(el)=> {
        let node;
        if( el ) node= el.key
        if( selected ) node= selected(el)
        return el && <div className={`${is_sm ? selectedClass : ''}`}>{node}</div>
      }}
      {...props}
    />
  )
}