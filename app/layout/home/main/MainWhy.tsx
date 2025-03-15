import { SplitText } from "@cyriacbr/react-split-text";
import { animated, useInView, useResize, useScroll, useSpring, useSprings, useTrail } from "@react-spring/web";
import { useCallback, useContext, useEffect, useRef } from "react";
import { ScreenContext } from "../Layout1";
import SectionScroll from "./SectionScroll";
import { RisingText } from "./RisingText";
import { characterTitle, characterDesc, why, whyMemyze } from "./Service";
import _ from 'lodash'
import character_1 from "/images/na.svg";
import character_7 from "/images/jh.svg";


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
  return (
    <div
      ref={containerRef}
      className="bg-gray- h- flex w-full max-w-screen-1 m-auto my-10 md:my-40"
      
    >
      <div className="w-full max-w-container-md mx-auto px-4 md:px-0">
        {/* {
          why && why.map((service, key)=> {
            return ( */}
              <div className="md:flex flex-col md:flex-row relative w-full h- ">
                <section className='w-full md:w-1/2 mr-20'>
                  <div className="md:sticky top-nav bg-paper z-10 ">
                    <div className="md:flex">
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

                    <div className="border-t mt-3 md:mt-8 pt-2 md:pt-4 max-w-[260px] ml-auto">
                      <RisingText 
                        text={'왜 꼭 우리여야 할까?'}
                        className="md:text-sm"
                      />
                    </div>
                  </div>
      
                </section>
                <div className="w-full md:w-1/2 top-[4em] left-0 relative md:top-auto break-keep">
                  
                {/* {
                  whyMemyze.map(why=> {
                    return ( */}

                    <div className="mb-20">
                        <animated.div
                          style={motion(0)}
                        >
                          <RisingText 
                            text={'경기가 좋지 않습니다.'}
                            className="text-xl md:text-3xl"
                          />
                        </animated.div>
                        <animated.div
                          style={motion(1)}
                        >
                          <RisingText 
                            text={'지속되는 저성장과 고물가에 비용상승은 부담스럽기만 합니다. 정해진 예산에 비용을 줄여야 하지만 안쓸수도 없습니다. 합리적인 비용이 필요합니다.'}
                            className="text-sm md:text-lg mt-2 md:mt-4 leading-5"
                          />
                        </animated.div>
                          
                      </div>
                        
                      <div className="mb-20">
                        <animated.div
                            style={motion(0)}
                          >
                            <RisingText 
                              text={'브랜딩은 필요합니다.'}
                              className="text-xl md:text-3xl"
                            />
                          </animated.div>
                          <animated.div
                            style={motion(2)}
                          >
                            <RisingText 
                              text={'비즈니스를 시작하는 동기는 여러가지가 있습니다. 체계적인 플랜으로 시작하기도 하지만 우연하게 시작되기도 합니다. 비즈니스가 시작되면 세일즈를 위해 여러 장르의 파트너들을 필요로 하게 됩니다. 다양한 협업 중에서 선행되어야 하면서 핵심적인 분야가 비즈니스의 시각화 디자인과 제품/서비스의 내용을 전달하는 단계일 것입니다. 우리는 이를 “브랜딩”이라 합니다.'}
                              className="text-sm md:text-lg mt-2 md:mt-4 leading-5"
                            />
                          </animated.div>
                            
                      </div>


                      <div className="mb-20">
                        <animated.div
                            style={motion(0)}
                          >
                            <RisingText 
                              text={'어떻게 시작해야 할까요'}
                              className="text-xl md:text-3xl"
                            />
                          </animated.div>
                          <animated.div
                            style={motion(2)}
                          >
                            <RisingText 
                              text={'가장 먼저 로고를 떠올릴 것이고, 로고 제작을 시작으로 로고에 맞춰 판촉물을 제작하고, 웹사이트를 제작, 그 다음, 그 다음… 이렇게 여러 단계를 거쳐 각각의 파트너들에게 전달됩니다. 이런 현실은 하나의 파트너에게 의뢰한다고 해서 달라지지 않습니다. 또 다시 외부 인력 혹은 업체를 통해서 같은 단계를 거칠테니까요. '}
                              className="text-sm md:text-lg mt-2 md:mt-4 leading-5"
                            />
                          </animated.div>
                            
                      </div>


                      <div className="mb-20">
                        <animated.div
                            style={motion(0)}
                          >
                            <RisingText 
                              text={'과정은 뒤에 숨어 있습니다.'}
                              className="text-xl md:text-3xl"
                            />
                          </animated.div>
                          <animated.div
                            style={motion(2)}
                          >
                            <RisingText 
                              text={'이러한 단계를 거치면서 브랜드의 가치관은 흐려지고 변색되어 통일성과 방향성은 사라질 것입니다. 단계별로 비용이 상승하는 문제 역시 예상하지 못한 문제죠. 운이 좋게 외부 인력이 쉽게 충원되어도 비용은 추가되는데, 인력 보충에 문제라도 생기면 그 비용은 고스란히 결과물에 반영이 되겠죠. '}
                              className="text-sm md:text-lg mt-2 md:mt-4 leading-5"
                            />
                          </animated.div>

                          <animated.div
                            style={motion(4)}
                          >
                            <RisingText 
                              text={'시각화 디자인을 통해 가치관을 전달하는 과정은 정형화되고 잘 짜여진 과정속에서 정확한 시점에 나오지 않습니다. 이는 일정을 무시한 채 무기한 창작을 위한 고뇌의 시간을 보낸다는 뜻이 아닙니다. 훌륭한 팀워크 안에서 이미지를 제작하고, 웹사이트를 디자인하고 전개하는 과정에서 ‘우연히’ 떠오르며 업무의 연결과정에서 자연스럽게 방향을 찾기도 하죠. 이런 ‘우연의 과정’을 여러 번 반복하며 다양한 협업과 수정을 통해 ‘브랜드의 가치관’이라는 공통된 하나의 방향을 위해 프로젝트를 실행 합니다.'}
                              className="text-sm md:text-lg mt-2 md:mt-4 leading-5"
                            />
                          </animated.div>
                            
                      </div>
                        


                      <div className="mb-20">
                        <animated.div
                            style={motion(0)}
                          >
                            <RisingText 
                              text={'합리적인 비용이 필요합니다.'}
                              className="text-xl md:text-3xl"
                            />
                          </animated.div>
                          <animated.div
                            style={motion(2)}
                          >
                            <RisingText 
                              text={'우리는 아직 스타트업 단계입니다. 각 분야의 오랜 경험과 그 동안 크고 작은 프로젝트를 함께 진행하면서 보다 나은 팀워크를 위해 노력해 왔습니다. 이제 그 실력을 시장에 검증 받으려 합니다. 그래서 아직은 비용이 높지 않습니다. 규모와 예산에 맞춰서 프로젝트를 진행해 드리겠습니다. 결코 이 기회를 놓치지 마세요. '}
                              className="text-sm md:text-lg mt-2 md:mt-4 leading-5"
                            />
                          </animated.div>
                            
                      </div>
                        


                        
                    {/* )
                  })
                } */}
                    
                </div>
      
              </div>
            {/* )
          })
        } */}
      
      </div>
      
      
    </div>
  )
}


