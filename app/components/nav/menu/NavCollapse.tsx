import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import MenuItems from './MenuItems';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
// import { Typography } from '@material-tailwind/react';
/* import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Collapse
} from "@material-tailwind/react"; */


export default function NavCollapse ({ item, level }) {
  // menu list collapse & items
  const items = item?.children && <MenuItems menus={item.children} level={level+1}/>;

  const [open, setOpen] = useState(item?.defaultOpen ?? false);
  const [selected, setSelected] = useState(null);

  const handleClick = (e) => {
    // e.stopPropagation()
    // e.preventDefault()
    console.log(open)
    setOpen(!open);
    setSelected(!selected ? item.id : null);
  };

  const Icon = item.icon;
  
  return (
    <>
    <ul className='px-0 py-0'>
      {item?.div && <div className="border-t border-gray-300"></div>}
      <li 
        className="collapse p-0 w-full" 
        // selected={open === 1}'
        
      >
        <input onClick={handleClick} type="checkbox" className='min-h-0 ' />
        <div  className="collapse-title min-h-0 p-0">
          <div className="flex justify-between items-center py-2">
            <div  className="border-b-0 py-0 flex items-center">
              {
                Icon && 
                <div >
                  <Icon strokeWidth={1}/>
                </div>
              }
                  
              <span color="blue-gray" className="pl-2 mr-auto font-light text-nowrap">
                {item.title}
              </span>
            </div>
            <div className="pl-3 pr-2">
              {open ? (
                <IconChevronUp stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
              ) : (
                <IconChevronDown stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
              )}
            </div>
          </div>
        </div>


        <div className="collapse-content p-0">
          {items} 
        </div>

      </li>
      

      

        

      {/* <div className="w-full">
        <Collapse open={open}  className='overflow-hidden'>
           {items} 
        </Collapse>
      </div> */}

    </ul>
    
    </>
  );
}