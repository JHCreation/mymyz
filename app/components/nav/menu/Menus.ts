import { 
	IconKey, IconHome2, IconToolsKitchen2, IconMapPinShare, IconGlassFull, IconChartDots2, IconCalendarEvent, IconSpeakerphone, IconListDetails, IconUsers,
	IconNotebook, IconFileUpload, IconShoppingBagHeart
} from '@tabler/icons-react';
// import dynamic from 'next/dynamic'
// import Users from '$/admin/users';




export interface MenuType {
	id: string
	title?: string
	caption?: string
	type: 'group'|'collapse'|'item'
	auth?: string[]
	url?: string
	target?: string | boolean
	external?: boolean
	icon?: any
	children?: MenuType[]
	component?: any
	div?: boolean
	defaultOpen?: boolean
	indent?: number
	gap?: number
	vLine?: boolean
}

const menus: MenuType[] = [
	{
		id: 'home-group',
		type: 'item',
		title: '홈',
		// caption: '여기는 메인 페이지 입니다.',
		url: '/admin',
		icon: IconHome2,
		// vLine: true,
		gap: 1
	},
	{
		id: 'cmpaign-group',
		title: '캠페인',
		type: 'collapse',
		// icon: IconToolsKitchen2,
		// defaultOpen: true,
		div: true,
		children: [
			{
				id: 'local',
				title: '지역',
				type: 'collapse',
				// icon: IconMapPinShare,
				url: '',
				target: true,
				children: [
					{
						id: 'category',
						title: '카테고리',
						type: 'item',
						url: `/admin/category`,
						indent: 5
					}
				]
			},
			/* {
				id: 'local',
				title: '지역',
				type: 'collapse',
				icon: IconMapPinShare,
				url: '',
				target: true,
				children: korealocal.map( local=> ({
					id: local.city.name,
					title: local.city.name,
					type: 'item',
					url: `/campaign/local/${local.city.id}`,
					indent: 5
				}) )
			}, */
			/* {
				id: 'goods',
				title: '제품',
				type: 'collapse',
				icon: IconShoppingBagHeart,
				url: '/admin/wine',
				target: true,
				children: korealocal.map( local=> ({
					id: local.city.name,
					title: local.city.name,
					type: 'item',
					url: `/${local.city.name}`,
					indent: 5
				}) )
			}, */
		]
	},
	

	{
		id: 'event-group',
		title: '이벤트',
		type: 'collapse',
		icon: IconChartDots2,
		div: true,
		children: [
			{
				id: 'event',
				title: '이벤트 내용',
				type: 'item',
				url: '/admin/event',
				target: true,
				indent: 4,
			},
			{
				id: 'event-register',
				title: '이벤트 신청',
				type: 'item',
				url: '/admin/event-register',
				target: true,
				indent: 4,
			}
		]
	},

	{
		id: 'review-group',
		title: '리뷰',
		type: 'collapse',
		icon: IconChartDots2,
		// div: true,
		children: [
			{
				id: 'reviewer-register',
				title: '리뷰어 신청',
				type: 'item',
				url: '/admin/review-register',
				target: true,
				indent: 4,
			}
		]
	},
	
	
	{
		id: 'notice-group',
		type: 'group',
		title: '뉴스',
			// auth: ['s25bubp1nsohdcvbgr3uhk'],
		children: [{
			id: 'notice',
			title: '공지사항',
			type: 'item',
			url: '/list',
			icon: IconSpeakerphone,
			div: true, gap: 1,
		}]
	},
	{
		id: 'admin-group',
		type: 'group',
		// auth: ['s25bubp1nsohdcvbgr3uhk'],
		children: [{
			id: 'admin',
			title: '설정',
			type: 'item',
			url: '/admin',
			icon: IconKey,
		}]
	},
	
	
]

export { menus }