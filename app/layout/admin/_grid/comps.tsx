import { IconX } from "@tabler/icons-react"

export const CloseIcon= ({handleClose})=> {
  return (
    <div className="w-full flex justify-end sticky top-0 z-30">
      <div 
        className="absolute top-0 right-0 btn btn-circle btn-sm btn-ghost- " 
        onClick={handleClose}
      >
        <IconX size={20} className="font-thin"/>
      </div>
    </div>
  )
}