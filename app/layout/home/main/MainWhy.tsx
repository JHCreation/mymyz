import { animated, useInView, useResize, useScroll, useSpring, useSprings, useTrail } from "@react-spring/web";
import { useCallback, useContext, useEffect, useRef } from "react";
import { ScreenContext } from "../Layout1";
import SectionScroll from "./SectionScroll";
import { RisingText } from "./RisingText";
import _ from 'lodash'


const scrolls= new SectionScroll({
  actionOffset: {
    start: 0,
    end: 0
  },
  distanceOffset: {
    start: 0,
    end: 0
  }
})


export default function MainWhy () {
  return (
    <div className="">
      {
        /* why.map( (service, i) => <Parallax key={i} scrolls={scrolls[i]} service={service}/>) */
      }

      <Parallax scrolls={scrolls}/>


    </div>
  )
} 
function Parallax ({ scrolls }) {
  const {screen, windowSize} = useContext(ScreenContext)
  const containerRef= useRef<HTMLDivElement>(null)
  
  const scroll= useScroll({
    onChange: (result, ctrl, item)=> {
      scrolls.set({
        distanceOffset: {
          start: (-screen.height.get() || scrolls.get("distanceOffset").start),
          end: 0,
        },
      })
      
      const progress= scrolls.getProgress()
      if( !progress ) return
      const height= scrolls?.position ? scrolls.position.containerDom.height : 0;
      trailApi.start({y: progress})
    }
  })

  useEffect(()=> {
    if( containerRef.current && windowSize ) {
      scrolls.set({ 
        screen: screen,
        container: containerRef.current,
        distanceOffset: {
          start: -(screen.height.get() || windowSize?.height),
          end: 0
        },
      }) 
    }
  }, [containerRef.current, windowSize])
  
  

  const [trails, trailApi] = useTrail(
    12,
    () => ({
      from: { y: 0 },
      // to: { opacity: 1 },
    }),
    []
  )

  const motion = useCallback( (i)=> ({
    y: trails[i].y.to(progress=> {
      return `-${(1+(progress*64))}px`
      return `-${(1+(progress*250))}%`
    })
  }), [])
  
  let len=0

  const why= [
    { 
      title: "방향 탐색 및 본질 파악" , 
      subject: "(Tree-Shaking)",
      detail: "저희는 가장 먼저 당신의 비즈니스가 가진 고유의 철학과 핵심 가치를 파악합니다. 사업의 '본질'을 이해하는 것에서 모든 전략이 시작됩니다.불필요한 가지는 쳐내고 가장 중요한 열매, 즉 사업의 핵심 가치와 가장 시급한 목표를 찾아냅니다. 이를 통해 모든 활동이 하나의 목표를 향해 정렬되도록 합니다."
    },
    { 
      title: "단계적 성장 로드맵" , 
      subject: "(Tech-Tree)" , 
      detail: "사업의 핵심 철학에서 시작하여 성장 단계에 따라 꼭 필요한 솔루션만을 순서대로 제안합니다. 비즈니스의 성장에 맞춰 유연하게 확장되는 '테크트리' 전략을 경험하실 수 있습니다."
    },
    { 
      title: "최적의 예산 설계" , 
      detail: "사업 규모와 특징, 목표를 고려하여 가장 합리적인 예산과 비용을 산정합니다. 주어진 예산과 자원 내에서 최고의 퍼포먼스를 낼 수 있도록 구성, 범위, 품질의 완벽한 균형점을 찾아냅니다. 불필요한 거품을 모두 걷어내고 정직한 진단과 최적화된 설계를 통해 예산 안에서 최고의 효율을 만들어냅니다."
    },
    { 
      title: "현황 분석 및 좌표 설정" , 
      detail: "현재 비즈니스의 성과 지표(매출, 고객 데이터, 트래픽 등)를 기반으로 시장 내에서 우리의 정확한 위치를 파악합니다. 어디에 있는지 알아야 어디로 갈지 정할 수 있습니다. "
    },
    { 
      title: "보장된 전문성" , 
      detail: "'만능'이라고 말하지 않습니다. 각 분야에서 최고의 역량을 검증받은 전문가들이 자신의 영역을 책임져 결과물의 품질을 보장합니다. 단 1원의 예산도 낭비되지 않도록 기능적 필요성과 예술적 필요성을 구분하여 최적의 전문가를 배정합니다. "
    },
    { 
      title: "통합적 시너지" , 
      detail: "마케팅, 브랜딩, 디자인, 콘텐츠 제작까지. 각 분야의 전문가들이 하나의 팀처럼 유기적으로 움직여 흩어지고 분산되는 노력들로 비용이 낭비되지 않게, 응집된 시너지를 창출합니다. "
    },
  ]
  
  return (
    <div
      ref={containerRef}
      className="bg-gray- h- flex w-full max-w-screen-1 m-auto my-10 md:my-40"
    >
      <div className="w-full max-w-container-md mx-auto px-4 md:px-0">
  
        <div className="md:flex flex-col md:flex-row relative w-full h- ">
          <section className='absolute h-[600dvh] md:h-auto md:relative w-full md:w-1/2 mr-20'>
            <div className="sticky top-nav bg-paper z-10 ">
              <div className="flex pt-1.5">
                <div className="font-black text-5xl md:text-[2em] font-type-1 mr-2" >
                  <RisingText text={'04'} className="font-thin text-stroke-[1px] text-stroke-gray-500 text-stroke-fill-transparent"/>
                </div>
                <div className="text-left max-w-[700px] uppercase font-type-en text-6xl md:text-title-lg font-extrabold leading-[.8]">
                  <RisingText 
                    text={'why'}
                    className=""
                  />
                </div>
              </div>

              <div className="border-t mt-2 md:mt-8 pt-1 md:pt-4 max-w-[260px] ml-auto">
                <RisingText 
                  text={'왜 꼭 우리여야 할까?'}
                  className="md:text-sm"
                />
              </div>
            </div>

          </section>
          <div className="w-full md:w-1/2 top-[14em] pb-[14em] left-0 relative md:top-auto break-keep">
          {
            why.map(item=> <div key={item.title} className="mb-20">
                  <animated.div
                    style={motion(0)}
                  >
                    <RisingText 
                      text={item.title}
                      className="text-2xl md:text-4xl"
                    />
                  </animated.div>
                  {
                    item.subject && 
                    <animated.div
                      style={motion(0)}
                    >
                      <RisingText 
                        text={item.subject}
                        className="text-xl md:text-2xl"
                      />
                    </animated.div>
                  }
                  <animated.div
                    style={motion(1)}
                  >
                    <RisingText 
                      text={item.detail}
                      className="text-sm md:text-lg mt-2 md:mt-4 leading-6 md:leading-7"
                    />
                  </animated.div>
                    
                </div>)
          }
          
              
          </div>

        </div>
      
      </div>
      
      
    </div>
  )
}


