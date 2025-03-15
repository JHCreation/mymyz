
import React, { useState } from "react";
import { IconArrowLeftBar, IconArrowNarrowLeft, IconArrowNarrowRight, IconArrowRightBar, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
// import { Icon } from "@mui/material";
// import { IconButton } from "@material-tailwind/react";
import Filters from "./Fitlers";


export default function AsideFilter ({ filterComponent }) {
  const [open, setOpen] = useState(true)
  return (
    <nav className={`border ${open?'fixed right-0':'relative'} md:relative bg-base-300 z-40`}>
      <div className={`sticky top-nav`}>
      
        <div className={`${!open ? 'max-w-10 -left-[0px]' : 'w-auto max-w-96 left-0'} relative duration-0`}>
          <div className="overflow-hidden">
            <div className={`${!open ? 'p-1 py-3' : 'p-3'} min-w-[300px] h-dvh-nav overflow-auto flex flex-col items-center`}>
              <div className="w-full flex justify-start items-center relative -left-0">  
                
                  <div onClick={e=> setOpen(!open)} className="btn btn-circle btn-sm btn-ghost">
                  { !open &&
                    <IconArrowNarrowLeft size={'18px'} stroke={1} className="font-" />
                  }
                  { open && 
                  <IconArrowNarrowRight size={'18px'} stroke={1} className="font-" />
                }
                  </div>
                
                
              </div>
              {/* <div className={`${open ? 'block absolute top-14 left-1/2 -translate-x-1/2' : 'hidden'} w-[calc(100%-1.4rem)]`}><Filters /></div> */}
              <div className={`${open ? 'block w-full' : 'hidden'}`}>
                <Filters>
                  {filterComponent}
                </Filters> 
              </div>
              {/* <div className={`${open ? 'block w-full' : 'hidden'}`}><Filters /></div>
              <div className={`${open ? 'block w-full' : 'hidden'}`}><Filters /></div>
              <div className={`${open ? 'block w-full' : 'hidden'}`}><Filters /></div>
              <div className={`${open ? 'block w-full' : 'hidden'}`}><Filters /></div> */}
            </div>
            
          </div>
        </div>
      </div>
    </nav>
  )
}