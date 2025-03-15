import { SplitText } from "@cyriacbr/react-split-text";
import { animated, useInView, useResize, useScroll, useSpring, useSprings, useTrail } from "@react-spring/web";
import { useCallback, useContext, useRef } from "react";
import { ScreenContext } from "../Layout1";
import SectionScroll from "./SectionScroll";
import { RisingText } from "./RisingText";
import { characterTitle, characterDesc, why } from "./Service";
import _ from 'lodash'
import character_1 from "/images/na.svg";
import character_7 from "/images/jh.svg";


const scrolls= why.map(w=> new SectionScroll({
  actionOffset: {
    start: 0,
    end: 0
  },
  distanceOffset: {
    start: 0,
    end: 0
  }
}) )


export default function Main1_3_1 () {
  return (
    <div className="">
      {
        why.map( (service, i) => <Parallax key={i} scrolls={scrolls[i]} service={service}/>)
      }
    </div>
  )
} 
function Parallax ({ scrolls, service }) {
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

  scrolls.set({ 
    screen: screen,
    container: containerRef.current,
    distanceOffset: {
      start: -(screen.height.get() || windowSize?.height),
      end: 0
    },
  }) 


  
  

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
  return (
    <div className="">

      

      <div
        ref={containerRef}
        className="bg-gray- h- flex w-full max-w-screen-1 m-auto my-52"
      
      >
        <div className="w-full max-w-container-md mx-auto ">
          {/* {
            why && why.map((service, key)=> {
              return ( */}
                <div className="md:flex flex-col md:flex-row relative w-full h- ">
                  <section className='w-full md:w-1/2 mr-20'>
                    <div className="sticky top-nav bg-paper z-10 ">
                      <div className="text-2xl md:text-4xl font-extrabold">
                        {service.title}
                      </div>
                    </div>
      
                  </section>
                  <div className="w-full md:w-1/2 absolute top-[10%] left-0 md:relative md:top-auto break-keep">
                  {
                    service.list.map((list, i)=> {
                      // len++
                      return (
                        <div key={i} className="mb-[19svh] last:mb-0 w-full relative">
                          <animated.div
                            style={motion(0)}
                          >
                            <div className="">
                              {/* <RisingText text={list.name}/> */}
                              {/* {list.subject} */}
                              <div className="text-5xl">
                                {/* <span>{String(i+1).padStart(2, '0')}.</span> */}
                                <span className="font-thin">{list.subject.kr} </span>
                                <span className="font-[Pretendard] font-black">{list.subject.en}</span>
                              </div>
                            </div>
                          </animated.div>
      
                          <animated.div
                            style={motion(1)}
                            className={`mt-7`}
                          >
                            {/* <RisingText text={list.desc} /> */}
                            {list.desc}
                          </animated.div>
                        </div>
                      )
                    })
                  }
                  </div>
      
                </div>
              {/* )
            })
          } */}
      
        </div>
      
      
      </div>
      


      
      <div className="w-full max-w-container-md mx-auto">
        <div className="text-4xl break-keep font-bold  leading-tight">
          <div className="float-start">　　　　　　　　</div>
          <RisingText text={`모든 비즈니스가 뚜렷하고 독창적인 브랜딩이 필요한건 아닙니다. 규모가 작은 비즈니스일 수도, 시장 범위가 작을 수도 있죠. 또, 분야에 따라 브랜딩의 비중이 크지 않을 수도 있습니다. 그렇다고 없을 수도 없으니 적절한 파트너를 찾기란 쉽지 않습니다. 메메지션이 합리적인 비용을 제시해 드리겠습니다.`} startDelay={200} delay={100} once={true} />
        </div>

        <div className="w-full mt-10 flex">
          <div className="w-full max-w-[540px] flex">
            <div className="flex items-center justify-center border border-gray-300 p-5 mr-4">
              <img src={character_1} alt="" className="w-full" />
            </div>
            <div className="flex items-center justify-center border border-gray-300 p-5 mr-4">
              <img src={character_7} alt="" className="w-full" />
            </div>
          </div>

          <div className="flex-1 ml-20">
            <div className="text-sm columns-2 ">
              <RisingText text={`비즈니스를 시작하는 동기는 여러가지가 있습니다. 체계적인 플랜으로 시작하기도 하지만 우연하게 시작되기도 합니다. 비즈니스가 시작되면 세일즈를 위해 여러 장르의 파트너들을 필요로 하게 됩니다. 다양한 협업 중에서 선행되어야 하면서 핵심적인 분야가 비즈니스의 시각화 디자인과 제품/서비스의 내용을 전달하는 단계일 것입니다. 우리는 이를 “브랜딩”이라 합니다.`} startDelay={200} delay={100} once={true} className="inline" />
              <br></br>
              <RisingText text={`하지만 현실은 가장 먼저 로고를 떠올릴 것이고, 로고 제작을 시작으로 로고에 맞춰 판촉물을 제작하고, 웹사이트를 제작, 그 다음, 그 다음… 이렇게 여러 단계를 거쳐 각각의 파트너들에게 전달됩니다. 이런 현실은 하나의 파트너에게 의뢰한다고 해서 달라지지 않습니다. 또 다시 외부 인력 혹은 업체를 통해서 같은 단계를 거칠테니까요.`} startDelay={200} delay={100} once={true} className="inline" />
              <br></br>
              {/* <RisingText text={`이러한 단계를 거치면서 브랜드의 가치관은 흐려지고 변색되어 통일성과 방향성은 사라질 것입니다. 단계별로 비용이 상승하는 문제 역시 예상하지 못한 문제죠. 운이 좋게 외부 인력이 쉽게 충원되어도 비용은 추가되는데, 인력 보충에 문제라도 생기면 그 비용은 고스란히 결과물에 반영이 되겠죠.`} startDelay={200} delay={100} once={true} /> */}
            </div>

          </div>
        </div>
      </div>


    </div>
  )
}


