import { MenuType } from "~/components/nav/menu/Menus";
import { 
	IconKey, IconHome2, IconToolsKitchen2, IconMapPinShare, IconGlassFull, IconChartDots2, IconCalendarEvent, IconSpeakerphone, IconListDetails, IconUsers,
	IconNotebook, IconFileUpload, IconShoppingBagHeart,
  IconUser,
  IconCategory,
  IconMessage,
  IconTools
} from '@tabler/icons-react';
// import dynamic from 'next/dynamic'
// import Users from '$/admin/users';



const menus: MenuType[] = [
	{
    id: 'category',
    title: '카테고리',
    type: 'collapse',
    icon: IconCategory,
    url: '',
    // target: true,
		div: true,
    children: [
      {
        id: 'category',
        title: '카테고리',
        type: 'item',
        url: `/admin/category`,
        // icon: IconHome2,
        indent: 5,
        vLine: true
      },
    ]
  },
  {
    id: 'users',
    title: '사용자',
    type: 'item',
    url: `/admin/users`,
		icon: IconUser,
		div: true,
    // indent: 5
  },
  {
    id: 'works',
    title: '포트폴리오',
    type: 'item',
    url: `/admin/works`,
		icon: IconTools,
		div: true,
    // indent: 5
  },
  {
    id: 'contact',
    title: '문의',
    type: 'item',
    url: `/admin/contact`,
		icon: IconMessage,
		div: true,
    // indent: 5
  },
]

export { menus }