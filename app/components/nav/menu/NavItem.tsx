import { Link } from '@remix-run/react';
import MenuItems from './MenuItems';
// import {
//   Typography,
//   ListItem,
//   List,
// } from "@material-tailwind/react";
// import Link from 'next/link';
import { MenuType } from './Menus'

const gapStyle= { 1: 'my-1', 2: 'my-2', }
const indentStyle= { 1: 'pl-1', 2: 'pl-2', 3: 'pl-3', 4: 'pl-4', 5: 'pl-5', }
export default function NavItem ({ item, level, pathname }: { item: MenuType, level: number, pathname: string}) {
  const { children, icon, target, url, title, caption, indent, gap, div, vLine }= item;
  const items = children && <MenuItems menus={item.children} level={level+1}/>;
  const Icon = icon;

  let itemTarget;
  switch ( target ) {
    case null: itemTarget = '_self'; break;
    case true: itemTarget= '_blank'; break;
    case false: itemTarget= '_self'; break;
    default: itemTarget= item.target; break;
  }
  
  return (
    <ul className={`gap-0 px-0 py-0 ${indent ? indentStyle[indent] : ''}`}>
      {div && <div className="border-t border-gray-300"></div>}
      <Link to={url ? url : ''} target={itemTarget}>
        <div 
          // selected={location == item.url}
          // onClick={e=> linkRoute(item.url, {})}
          className={`flex items-center rounded-lg px-0 ${gap ? gapStyle[gap] : 'my-0'} ${Icon ? 'py-0' : 'py-0 rounded-s-none '}`}
        >
          
          
          <div className={`py-2 ${vLine && 'border-l border-gray-300 pl-1.5'} flex items-center `}>
            {
              Icon && 
              <div className="flex items-center justify-center rounded-lg p-0 pr-0 ">
                <Icon
                  strokeWidth={1}
                  // className="h-6 text-gray-900 w-6"
                />
              </div>
            }
            <div className="pl-2">
              <h6
                color="blue-gray"
                className="flex items-center font-light text-nowrap"
              >
                {title}
              </h6>
              {
                caption &&
                <span
                  className="text-xs !font-medium text-blue-gray-500"
                >
                  {caption}
                </span>
              }
              {items}
            </div>
          </div>
        </div>
      </Link>
    </ul>
  );
}