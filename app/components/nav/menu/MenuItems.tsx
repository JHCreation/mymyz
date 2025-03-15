import NavGroup from './NavGroup';
import NavCollapse from './NavCollapse';
import NavItem from './NavItem';
// import { useRouter, usePathname } from 'next/navigation';

import _ from 'lodash';
import { useLocation, useNavigate } from '@remix-run/react';
// import { Typography } from '@material-tailwind/react';

export default function MenuItems ({ menus, level }) {
  const location = useLocation();
  const navigate = useNavigate();
  // const router= useRouter()
  // const pathname = usePathname()
  
  const navItems = menus.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} level={level} linkRoute={navigate} location={location.pathname} />;
      case 'collapse':
        return <NavCollapse key={item.id} item={item} level={level} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level} pathname={location.pathname} />;
      default:
        return (
          <span key={item.id}>
            Menu Items Error
          </span>
        );
    }
  });

  return (
    <>{navItems}</>
  )
}