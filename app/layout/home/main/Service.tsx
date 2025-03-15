
export const service= [
  {
    name: 'Design',
    tech: [
      '웹 디자인',
      'UI/UX 디자인',
      '그래픽 디자인',
      'Photoshop',
      'Illustrator',
    ],
    description: '',
    color: {
      text: 'text-primary',
      border: 'border-primary',
    }
  },
  {
    name: 'Development',
    tech: [
      '웹앱 개발',
      'Frontend',
      'Backend',
      'React',
      'Python',
      'Node.js',
      'PHP',
    ],
    description: '',
    color: {
      text: 'text-secondary',
      border: 'border-secondary',
    }
  },
  {
    name: 'Media',
    tech: [
      '영상 촬영',
      '영상 편집',
      '자막 편집',
      '숏폼 제작',
    ],
    description: '',
    color: {
      text: 'text-accent',
      border: 'border-accent',
    }
  },
  {
    name: 'Strategy',
    tech: [
      'Branding',
      '전략/기획',
      'SNS Marketing',
      '채널 광고',
    ],
    description: '',
    color: {
      text: 'text-success',
      border: 'border-success',
    }
  },
  {
    name: 'Place/Promotion',
    tech: [
      '공간 디자인',
      '판촉물',
      '프로모션 기획',
      'Product Display',
    ],
    description: '',
    color: {
      text: 'text-success',
      border: 'border-success',
    }
  },
  {
    name: 'Writing',
    tech: [
      '콘텐츠 구성 기획',
      '카피문구 제작',
      '콘텐츠 작문',
    ],
    description: '',
    color: {
      text: 'text-error',
      border: 'border-error',
    }
  },
]


import banner_1 from "/images/13102.jpg";
import banner_2 from "/images/48.jpg";
import banner_3 from "/images/1042.jpg";
import banner_4 from "/images/11769.jpg";


export const howto= [
  {
    title: 'Unique',
    name: '독창성',
    subject: ['Design', 'Web Develope', 'Writing'],
    desc: '기존에 없던 희소성이 짙은 새로움을 추구합니다. 새로운 디자인, 새로운 콘텐츠, 새로운 기술들을 통한 독창적인 결과물을 만들어 냅니다.',
    image: banner_1,
    color: {
      bg: 'bg-primary'
    }
  },
  {
    title: 'Fast',
    subject: ['Design', 'Web Develope', 'Media'],
    name: '신속함',
    desc: '비즈니스에 걸맞는 최신의 기술을 사용합니다. 최신 스킬과 숙련된 노하우로 효율과 생산성을 높여 빠른 업무 처리가 가능합니다.',
    image: banner_2,
    color: {
      bg: 'bg-secondary'
    }
  },
  {
    title: 'Trendy',
    name: '트렌드',
    desc: '빠르게 변화되는 트렌드를 반영하기 위해 예술/문화의 꾸준한 관심과 탐색을 게을리하지 않습니다.',
    image: banner_4,
    color: {
      bg: 'bg-secondary'
    }
  },
  {
    title: 'Teamwork',
    name: '팀워크',
    desc: '외부 하청이나 급조한 인력으로 업무를 처리하지 않습니다. 반드시 내부 인력으로 검증된 팀워크안에서 프로젝트를 진행합니다.',
    image: banner_3,
    color: {
      bg: 'bg-secondary'
    }
  },
]


export const characterTitle= [
  {
    title: 'differentiated service',
  },
  {
    title: 'reasonable price',
  }
]

export const characterDesc= [
      
  { 
    name: '남다른 경쟁력',
    desc: '비즈니스 환경을 고려한 프로세스를 구현합니다.'
  },
  { 
    name: '독창적 창의성',
    desc: '새롭고 감각적인 디자인을 제공합니다.'
  },
  { 
    name: '트렌디한 감성',
    desc: '대중이 공감할수 있는 트렌드를 반영합니다.'
  },
  { 
    name: '커스터마이징',
    desc: '환경과 특성에 맞는 구성과 방법을 제안드립니다.'
  },
  { 
    name: '차별화된 서비스',
    desc: '비즈니스에 가장 적합한 최고의 결과물을 제공할 것입니다.'
  },
  { 
    name: '비즈니스의 성격',
    desc: '모든 비즈니스가 최상의 결과물을 필요로 하진 않습니다.'
  },
  { 
    name: '제한된 예산',
    desc: '정해진 예산안에서 성격에 맞는 결과물을 만들고 싶죠.'
  },
  { 
    name: '빠른 결과물',
    desc: '보다 합리적인 가격을 유지하기 위해 빠른 처리과정이 필요합니다.'
  },
]



import character_1 from "/images/na.svg";
import character_2 from "/images/ce.svg";
import character_3 from "/images/sh.svg";
import character_4 from "/images/s.svg";
import character_5 from "/images/h.svg";
import character_6 from "/images/rr.svg";
import character_7 from "/images/jh.svg";

export const characters= [
  {
    name: '나용',
    img: character_1,
    title: service[0].name,
    subject: service[0].tech,
    desc: '',
  },
  {
    name: '찬의',
    img: character_2,
    title: service[2].name,
    subject: service[2].tech,
    desc: '',
  },
  {
    name: '승훈',
    img: character_3,
    title: service[3].name,
    subject: service[3].tech,
    desc: '',
  },
  {
    name: '선행',
    img: character_4,
    title: 'Singer',
    subject: ['미용','소찬휘','막말','비난', '욕설', '패드립'],
    desc: '',
  },
  {
    name: '라리',
    img: character_6,
    title: service[4].name,
    subject: service[4].tech,
    desc: '',
  },
  {
    name: '은지',
    img: character_5,
    title: 'Dance',
    subject: ['맘마미아', '소원을 말해봐', 'Step'],
    desc: '',
  },
  {
    name: 'JH',
    img: character_7,
    title: service[1].name,
    subject: service[1].tech,
    desc: '',
  },
  
]


export const why= [
  { 
    title: <div className="flex font-type-en">
      <div className="flex flex-col items- mt-">
        <span className="uppercase block leading-[.8] tracking-[-0.15em]">
          {/* <span className="text-secondary">와</span>
          <span className="text-accent">이</span> */}
          <span className="text-primary-">w</span>
          <span className="text-secondary-">h</span>
          <span className="text-accent-">y</span>
        </span>
        <span className="leading-none indent-[38px]">memesition?</span>
      </div>
    </div>,
    list: [
      {
        subject: {
          kr: '독창적',
          en: 'Unique',
        },
        desc: <div className="">창의적이고 독창적인 결과물을 만들어 냅니다. 작은 요소나 문자 하나의 변화라도 꼭 새로운 결과물을 제시합니다.</div>
      },
      {
        subject: {
          kr: '빠른 처리',
          en: 'Quick ',
        },
        desc: <div className="">최신 스킬과 숙련된 노하우로 효율과 생산성을 높여 빠른 업무 처리가 가능합니다.</div>
      },
      {
        subject: {
          kr: '트렌드 ',
          en: 'Trendy',
        },
        desc: <div className="">빠르게 변화되는 트렌드를 반영하기 위해 예술/문화의 꾸준한 관심과 탐색을 게을리하지 않습니다.</div>
      },
      {
        subject: {
          kr: '팀워크',
          en: 'Teamwork',
        },
        desc: <div className="">외부 하청이나 급조한 인력으로 업무를 처리하지 않습니다. 반드시 내부 인력으로 검증된 팀워크안에서 프로젝트를 진행합니다.</div>
      },
      /* {
        subject: <div className="text-6xl">
          <span>01.</span>
          <span className="font-thin">독창적 </span> 
          <span className="font-[Pretendard] font-black">Unique</span>
        </div>,
        desc: <div className="">창의적이고 독창적인 결과물을 만들어 냅니다. 작은 요소나 문자 하나의 변화라도 꼭 새로운 결과물을 제시합니다.</div>
      },
      {
        subject: <div className="">Make your animations flawless333</div>,
        desc: <div className="">Synchronization with native scroll is not reliable. Those jumps and delays with scroll-linked animations are caused by multi-threading, where modern browsers run animations/effects asynchronously with the scroll. Smooth scroll fixes this.3</div>
      },
      {
        subject: <div className="">Make your animations flawless34</div>,
        desc: <div className="">Synchronization with native scroll is not reliable. Those jumps and delays with scroll-linked animations are caused by multi-threading, where modern browsers run animations/effects asynchronously with the scroll. Smooth scroll fixes this.4</div>
      }, */
    ]
    
  },
  /* { 
    title: <div className="">
      why
    </div>,
    list: [
      {
        subject: <div className="">Make your animations flawless</div>,
        desc: <div className="">Synchronization with native scroll is not reliable. Those jumps and delays with scroll-linked animations are caused by multi-threading, where modern browsers run animations/effects asynchronously with the scroll. Smooth scroll fixes this.</div>
      },
      {
        subject: <div className="">Make your animations flawless333</div>,
        desc: <div className="">Synchronization with native scroll is not reliable. Those jumps and delays with scroll-linked animations are caused by multi-threading, where modern browsers run animations/effects asynchronously with the scroll. Smooth scroll fixes this.3</div>
      },
      {
        subject: <div className="">Make your animations flawless34</div>,
        desc: <div className="">Synchronization with native scroll is not reliable. Those jumps and delays with scroll-linked animations are caused by multi-threading, where modern browsers run animations/effects asynchronously with the scroll. Smooth scroll fixes this.4</div>
      },
    ]
    
  }, */
]

export const whyMemyze= [
  {
    id: 1,
    suject: '경기가 좋지 않습니다. ',
    desc: '지속되는 저성장과 고물가에 비용상승은 부담스럽기만 합니다. 정해진 예산에 비용을 줄여야 하지만 안쓸수도 없습니다. 합리적인 비용이 필요합니다.'
  }
]