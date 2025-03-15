import MenuItems from './MenuItems';
// import { List, ListItem, Typography } from '@material-tailwind/react';

export default function NavGroup ({ item, level, linkRoute, location }) {
  const items = item?.children && <MenuItems menus={item.children} level={level+1}/>;
  const Icon = item.icon;

  const caption= (
    <div>
      {
        item?.title &&
        <div className="p-1">
          <h6 className=''>
            {item.title}
          </h6>
        </div>
      }
      
      { item.caption && <div className='font-medium px-1' > {item.caption} </div> }
    </div>
  )

  
  return (
    <>
      <ul className='px-0 py-0'>
        {item?.div != false && <div className="border-t border-gray-300"></div>}
        <>
          {
            item.url && 
            <li
              className={`${location == item.url ? 'font-extrabold': ''}`}
              onClick={e=> linkRoute(item.url)}
            >
              {caption}
            </li>
          }
          {
            !item?.url && caption
          }
        </>
      
        {items}
      </ul>

    </>
  );
}