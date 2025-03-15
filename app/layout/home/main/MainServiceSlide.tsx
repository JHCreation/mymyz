import { SplitText } from "@cyriacbr/react-split-text";
import { animated, useInView, useResize, useScroll, useSprings, useTrail } from "@react-spring/web";
import { useCallback, useContext, useEffect, useRef } from "react";
import { ScreenContext } from "../Layout1";
import SectionScroll from "./SectionScroll";
import _ from "lodash";
import { service } from "./Service";
import { useMediaQueryState } from "~/store/store";





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


export default function MainServiceSlide () {
  const mediaQueryState= useMediaQueryState()
  const { mediaQuery, currentSize }= mediaQueryState
  const {screen, windowSize} = useContext(ScreenContext)
  const scroll= useScroll({
    onChange: ()=> {
      const screenHeight= screen.height;
      const sectDom= sectRef?.current?.getBoundingClientRect();
      if( !screenHeight || !sectDom ) return ''
      const { height: sectHeight }= sectDom;
      scrolls.set({
        distanceOffset: {
          start: (-screen.height.get() || scrolls.get("distanceOffset").start),
          end: -sectHeight,
          // end: scrolls.get('distanceOffset').end,
        },
      })
      const progress= scrolls.getProgress();
      // if( !progress ) return
      // console.log(progress)
      trailApi.start((i)=> ({ to: { x: progress }, delay: i*20}))
    }
  })
  const { scrollY }= scroll;

  const containerRef= useRef<HTMLDivElement>(null)
  const sectRef= useRef<HTMLDivElement>(null)

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
  
  

  // console.log(mediaQuery)
  const slideWidth= mediaQuery.md ? 400 : 250;
  const slideDistance= slideWidth*(service.length);

  const [trails, trailApi] = useSprings(
    service.length,
    () => ({
      from: { x: 0 },
      // config: { tension: 210, friction: 20 }
      // to: { opacity: 1 },
    }),
    []
  )
  
  const motion = useCallback( (i)=> ({
    x: trails[i].x.to(progress=> {
      const dom= containerRef.current?.getBoundingClientRect()
      if( !dom ) return ''
      if( !screen?.width ) return ''
      const width= screen?.width?.get() || dom?.width
      const moving= slideDistance-width+450;
      const res= -((progress) * (moving))
      // console.log(progress, slideDistance, dom?.width)
      return `${res > 0 ? 0 : (-res > moving ? -(moving) : res )}px`
    })
  }), [slideWidth])

  return (
    <div>
      <section ref={containerRef} className=''
        style={{
          height: `${service.length*100}svh`
        }}
      >
        <div ref={sectRef} className="sticky min-h-[400px] h-dvh top-0 p-nav flex items-center overflow-hidden">
          <animated.div
            /* style={{
              translateX: scrollY.to(val=> {
                const screenHeight= screen.height;
                const sectDom= sectRef?.current?.getBoundingClientRect();
                if( !screenHeight || !sectDom ) return ''
                const { height: sectHeight }= sectDom;
                scrolls.set({
                  distanceOffset: {
                    start: -(screen.height.get() || windowSize?.height),
                    end: -sectHeight,
                    // end: scrolls.get('distanceOffset').end,
                  },
                })
                const progress= scrolls.getProgress();
                if( !progress ) return ''
                const width= screen.width.get() || windowSize?.width
                const moving= slideDistance-width+450;
                const res= -((progress) * (moving))
                return `${res > 0 ? 0 : (-res > moving ? -(moving) : res )}px`
              })
            }} */
            className={`whitespace-nowrap ml-[400px]`}
          >
            <div className="flex">
            {
              service.map((service,i)=> {
                const { name, tech, color }= service;
                return (
                  <animated.div 
                    key={i} 
                    className={`flex pr-4 md:pr-10`}
                    style={{
                      width: slideWidth,
                      maxWidth: slideWidth,
                      ...motion(i),
                    }}
                  >
                    <div className={`w-full border ${color} pt-3 pl-3 md:pt-6 md:pl-6 flex flex-col`}>
                      <div className="">
                        {/* <div className={`font-type-1 font-extralight text-xl leading-none`}>{String(i+1).padStart(2, '0')}</div> */}
                        
                        <div className="text-xl md:text-4xl font-black font-type-en leading-none">{name}</div>
                      </div>

                      
                      <div className="leading-4 text-xs flex-1 w-full flex flex-col justify-end">

                      <div className="mt-10">
                        <ul className="w-1/2 ml-auto">
                        {
                          tech.map(tech=> {
                            return (
                              <li key={tech} className="border-t px-1 py-0.5"> {tech} </li>
                            )
                          })
                        }
                        </ul>
                      </div>

                      </div>
                    </div>
                  </animated.div>
                )
              })
            }
            </div>
          </animated.div>
        </div>
      </section>
    </div>
  )
}