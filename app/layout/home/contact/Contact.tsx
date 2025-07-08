
import { animated,  useScroll, useSpring, useSprings, useTrail } from "@react-spring/web";
import { useCallback, useContext, useRef } from "react";
import { ScreenContext } from "./index";
import SectionScroll from "../main/SectionScroll";
import {  RisingText } from "../main/RisingText";
import { service } from "../main/Service";
import ContactInputs from "./ContactInputs";


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

const delay=800
export default function Contact () {
  const {screen, windowSize} = useContext(ScreenContext)

  const containerRef= useRef<HTMLDivElement>(null)

  const scroll= useScroll({
    onChange: (result, ctrl, item)=> {
      scrolls.set({
        distanceOffset: {
          start: (-screen.height.get() || scrolls.get("distanceOffset").start),
          end: (screen.height.get() || scrolls.get("distanceOffset").end),
        },
      })
      const dom= containerRef.current?.getBoundingClientRect();
      if( !dom ) return
      const { height }= dom
      const progress= scrolls.getProgress()
      if( !progress ) return
      api.start({per: progress})
      trailApi.start({ to: { y: progress }})
      apis.start((i, ctrl)=> {
        const moveY_1= `-${(progress*height)*.15 + (progress/((i+1)**0)*0)}px`;
        const moveY_2= `${(progress*height/2)*.39 + (progress/((i+1)**4)*0)}px`;
        return (
          { 
            to: { y: i==0 ? moveY_1 : moveY_2 },
            /* delay: (key)=> {
              if( key == 'y' ) return i*30;
              return 0
            } */
          }
        )}
      )
    }
  })

  scrolls.set({ 
    screen: screen,
    container: containerRef.current,
    distanceOffset: {
      start: -(screen.height.get() || windowSize?.height),
      // start: 0,
      end: (screen.height.get() || windowSize?.height)
    },
    // action: function ({progress, containerDom}) {
    //   return progress
    // },
    // print: true
  }) 

  const [springs, apis]= useSprings(2, (i) => ({
    from: { y: '0px' },
  }))

  const [spring, api]= useSpring(()=> ({
    per: 0
  }) )


  const [trails, trailApi] = useTrail(
    service.length,
    () => ({
      from: { y: 0 },
      // to: { opacity: 1 },
    }),
    []
  )

  const motion = useCallback( (i)=> ({
    y: trails[i].y.to(progress=> {
      const dom= containerRef.current?.getBoundingClientRect();
      if( !dom ) return ''
      const { height }= dom
      const moveY_1= `-${(progress*height)*.15 + (progress/((i+1)**0)*0)}px`;
      return moveY_1;
    })
  }), [])

  const detail= "우리의 협업은, 단순한 '외주'가 아닙니다. 우리는 귀하의 사업의 방향과 맥을 함께 읽는 실무 파트너입니다. 브랜드의 정체성과 가치를 함께 고민하며, 시장에서의 설득력을 만들어갑니다."
  return (
    <div 
      ref={containerRef} 
      className="w-full mt-nav"
    >
      <div className=" w-full max-w-container mx-auto pt-30 md:pt-40 pb-10 px-3 md:px-10" >
        
        <div className="w-full flex">
          
          {/* <animated.div 
            style={motion(0)}
            className="font-black text-[2em] font-type-1 mr-2"
          >
            <RisingText text={'01'} className="text-stroke-[1px] font-thin text-stroke-gray-500 text-stroke-fill-transparent"/>
          </animated.div> */}
          <div className="w-full flex flex-col">
            <animated.div 
              style={motion(0)}
              className={'flex flex-col justify-center'}
            >
              <div className="text-left max-w-[900px] text-6xl md:text-8xl font-extrabold ">
                <RisingText 
                  text={'상담이'}
                  className=""
                  startDelay={delay}
                />
                <RisingText 
                  text={'필요하세요?'}
                  className=""
                  startDelay={delay}
                />
                
                {/* <a
                  href="mailto:corenzomarket@naver.com"
                  className="hover:text-stroke-[.8px] hover:text-transparent duration-500 font-type-en uppercase-"
                >
                  <RisingText 
                    text={'corenzomarket'}
                    className="leading-[1] "
                    startDelay={delay}
                    delay={100}
                    
                  />
                  <RisingText 
                    text={'@naver.com'}
                    className="leading-[1] "
                    startDelay={delay}
                    delay={100}
                    
                  />
                </a> */}
                
                
              </div>
              <div className="text-left mt-4 md:mt-14 ml-auto w-full max-w-[640px] text-4xl md:text-6xl font-thin ">

                <RisingText 
                  text={'우리에게 '}
                  className="font-type-1 text-stroke-[1px] text-stroke-gray-500 text-stroke-fill-transparent"
                  textClassName="leading-5 md:leading-13 pt-3 pl-1 italic"
                  startDelay={delay}
                  delay={200}
                />
                <RisingText 
                  text={'문의하세요'}
                  className="font-type-1 text-stroke-[1px] text-stroke-gray-500 text-stroke-fill-transparent"
                  textClassName="leading-5 md:leading-13 pt-3 pl-1 italic"
                  startDelay={delay}
                  delay={400}
                />
              </div>
            
            </animated.div>

            <div className="break-keep ml-auto w-full max-w-[640px]">
              <animated.div 
                style={motion(1)}
                className={'border-t pt-8 mt-8 md:pt-6 md:mt-6 ml-auto w-full '}
              >
                <div className="max-w-[540px]">
                  <RisingText text={detail} startDelay={1000} delay={100} className="text-xl md:text-2xl"/>
                </div>
              </animated.div>

              
              {/* <animated.div 
                style={motion(2)}
                className={'mt-8 w-full max-w-[320px]'}
              >
                <RisingText text={'기존에 없던 희소성이 짙은 새로움을 추구합니다. 새로운 디자인, 새로운 콘텐츠, 새로운 기술들을 통한 창의적인 결과물을 만들어 냅니다. 고객의 니즈를 반영해 트렌디하고 새로운 창작물을 만드는데 최선을 다 할 것입니다.'} startDelay={100} className="text-"/>
              </animated.div> */}


            </div>

            <animated.div 
              style={motion(3)}
              className="mt-10 break-keep ml-auto w-full max-w-[400px] border-t "
            >
              <h2 className="text-sm py-5">Our services</h2>
              <div className="flex justify-end">
                <ul className=" text-sm w-full ">
                  {
                    service.map((service, i)=> <li key={service.name} className={` overflow-hidden text-2xl font-bold`}>
                        <div className="">
                          <RisingText text={service.name} startDelay={(i+2)*100}>
                          </RisingText>
                        </div>
                    </li>)
                  }
                </ul>
              </div>
            </animated.div>
          </div>
          
        </div>

        
      </div>

      <ContactInputs />
      
    </div>
  )
}
