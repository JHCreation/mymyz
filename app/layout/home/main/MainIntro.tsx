import { SplitText } from "@cyriacbr/react-split-text";
import { animated, useInView, useResize, useScroll, useSpring, useSprings, useTrail, useTransition } from "@react-spring/web";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ScreenContext } from "../Layout1";
import SectionScroll from "./SectionScroll";
import { Rising2, RisingText } from "./RisingText";
// import banner_1 from "/images/chani.jpg";
import banner_1 from "~/assets/images/banner-1.webp";
import { service } from "./Service";

const text= "합리적인 가격"
const textLen= text.length;

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

export default function MainIntro () {
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
      const progress= scrolls.getProgress() || 0
      // if( !progress ) return
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

  useEffect(()=> {
    if( containerRef.current && windowSize ) {
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
    }
  }, [containerRef.current, windowSize])

  

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
      return `-${(1+(progress*64))}px`
      return `-${(1+(progress*250))}%`


      /* const y= calcCard(0,progress)
      if( !y ) return ''
      return `-${(1+y)*50}%`; */
    })
  }), [])

  return (
    <div 
      ref={containerRef} 
      className="w-full"
    >
      {/* <div className="btn" onClick={e=>setIsOpen(!isOpen)}>start</div>
      <animated.div style={{x: springs_1[0].test}}>test</animated.div> */}

      <div className=" w-full max-w-container mx-auto pt-80 pb-10 px-5 md:px-10" >
        
        <div className="w-full  md:flex">

          <animated.div 
            style={motion(0)}
            className="font-black text-5xl md:text-[2em] font-type-1 mr-2"
          >
            <RisingText text={'01'} className="text-stroke-[1px] font-thin text-stroke-gray-500 text-stroke-fill-transparent"/>
          </animated.div>
          
          <div className="w-full">
            <animated.div 
              style={motion(0)}
            >
              <div className="text-left max-w-[900px] uppercase font-type-en- text-5xl md:text-8xl font-extrabold ">
                
                {/* 지금, 당신의 브랜드에 필요한 실질적 변화를 시작해보세요. */}
                
                <RisingText 
                  text={'지금,'}
                  className="leading-[1.1] text-stroke-[1px] text-stroke-gray-500 text-stroke-fill-transparent"
                />
                <RisingText 
                  text={'브랜드에 필요한'}
                  className="leading-[1]"
                />
                <RisingText 
                  text={'실질적 변화를'}
                  className="leading-[1]"
                />
                <RisingText 
                  text={'경험해보세요.'}
                  className="leading-[1]"
                />
                

                {/* <RisingText 
                  text={'myz-'}
                  className="leading-[.8]"
                />
                <RisingText 
                  text={'creative design agency'}
                  className="leading-[.8]"
                /> */}
                
                
              </div>
              <div className="text-left mt-4 md:mt-14 ml-auto w-full max-w-[800px] font-type-en text-3xl md:text-7xl font-thin ">

                <RisingText 
                  text={'Your business was built to succeed.'}
                  className="font-type-1 text-stroke-[1px] text-stroke-gray-500 text-stroke-fill-transparent leading-[.75]"
                  textClassName="leading- pt-3 pl-1 italic"
                />
              </div>
            
            </animated.div>

            <div className="break-keep ml-auto w-full max-w-[800px]">
              <animated.div 
                style={motion(1)}
                className={'border-t pt-6 md:pt-12 mt-6 md:mt-12 ml-auto w-full '}
              >
                <div className="max-w-[540px]">
                  <RisingText text={'우리는 브랜딩을 ‘표현’을 넘어선, 비즈니스의 확장으로 이해합니다. '} startDelay={100} className="text-xl md:text-2xl"/>
                </div>
              </animated.div>

              
              <animated.div 
                style={motion(2)}
                className={'mt-8 w-full max-w-[520px]'}
              >
                <RisingText text={'빠르게 변화하는 시장 환경 속, 브랜딩은 단순한 노출 수단을 넘어 비즈니스의 본질을 드러내는 핵심 도구로 자리 잡았습니다. 과거, 물자와 자원의 부족으로 인해 공급 자체가 경쟁력이던 시절이 있었습니다. 그러나 지금은 공급 과잉의 시대. 수많은 상품과 서비스가 동시에 소비자의 선택을 기다리는 경쟁 환경 속에서, 이제 브랜딩은 단순히 제품을 노출하는 것을 넘어, "왜 수많은 선택지 속에서 반드시 이 브랜드여야만 하는가?"를 증명하는 논리적이고 체계적인 과정이 되었습니다.'} startDelay={100} className="leading-7"/>
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

      <div className="w-full flex justify-center relative">
        <div className="overflow-hidden w-full  relative">
          <div className=" min-h-[100dvh]">
            <animated.div
              style={{
                ...springs[1],
                scale: spring.per.to(progress=> {
                  return progress+.35
                })
              }}
              className={`absolute top-[-50%] left-0 w-full h-full overflow-hidden`}
            >
              <animated.img 
                src={banner_1} alt="" className="w-full h-full object-cover" 
                style={{
                  scale: spring.per.to(progress=> {
                    // console.log(progress)
                    return 1/(progress+.35)
                  })
                }}
              />
            </animated.div>
          </div>
        </div>
      </div>

      
    </div>
  )
}

