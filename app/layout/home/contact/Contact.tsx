
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
  

  return (
    <div 
      ref={containerRef} 
      className="w-full mt-nav"
    >
      <div className=" w-full max-w-container mx-auto pt-40 pb-10 px-10" >
        
        <div className="w-full  flex">
          
          {/* <animated.div 
            style={motion(0)}
            className="font-black text-[2em] font-type-1 mr-2"
          >
            <RisingText text={'01'} className="text-stroke-[1px] font-thin text-stroke-gray-500 text-stroke-fill-transparent"/>
          </animated.div> */}
          <div className="w-full">
            <animated.div 
              style={motion(0)}
            >
              <div className="text-left max-w-[900px] uppercase font-type-en text-title font-extrabold ">
                <RisingText 
                  text={'memyze-'}
                  className="leading-[.8]"
                  startDelay={delay}
                />
                
                <a href="mailto:corenzohouse@naver.com"
                  className="hover:text-stroke-[.8px] hover:text-transparent duration-500"
                >
                  <RisingText 
                    text={'creative design agency'}
                    className="leading-[.8] "
                    startDelay={delay}
                    delay={100}
                    
                  />
                </a>
                
                
              </div>
              <div className="text-left mt-14 ml-auto w-full max-w-[840px] uppercase font-type-en text-title font-thin ">

                <RisingText 
                  text={'i wish award we\'ll make it'}
                  className="font-type-1 text-stroke-[1px] text-stroke-gray-500 text-stroke-fill-transparent leading-[.75]"
                  textClassName="leading- pt-3 pl-1 italic"
                  startDelay={delay}
                  delay={200}

                />
              </div>
            
            </animated.div>

            <div className="break-keep ml-auto w-full max-w-[800px]">
              <animated.div 
                style={motion(1)}
                className={'border-t pt-12 mt-12 ml-auto w-full '}
              >
                <div className="max-w-[540px]">
                  <RisingText text={'우리는 창작을 사랑합니다. 애증과도 같은 관계죠. 창작의 과정을 통해 훌륭한 프로젝트를 완성하는 경험으로 여러분과 함께 성장하고 발전해 나가고 싶습니다.'} startDelay={100} className="text-2xl"/>
                </div>
              </animated.div>

              
              <animated.div 
                style={motion(2)}
                className={'mt-8 w-full max-w-[320px]'}
              >
                <RisingText text={'기존에 없던 희소성이 짙은 새로움을 추구합니다. 새로운 디자인, 새로운 콘텐츠, 새로운 기술들을 통한 창의적인 결과물을 만들어 냅니다. 고객의 니즈를 반영해 트렌디하고 새로운 창작물을 만드는데 최선을 다 할 것입니다.'} startDelay={100} className="text-"/>
              </animated.div>


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
                            {/* {service.name} */}
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
