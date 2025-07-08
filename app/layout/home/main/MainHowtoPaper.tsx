import { animated, useScroll, useSpring } from "@react-spring/web";
import React, { useContext, useEffect, useRef } from "react";
import SectionScroll from "./SectionScroll";
import { ScreenContext } from "../Layout1";
import { howto } from "./Service";
import { RisingText } from "./RisingText";

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

const len= howto.length

const calcCard= (key, progress)=> {
  const start= key/len
  const end= (key+1)/len
  if( progress > start && progress < end ) {
    const y= (progress-start)/(end-start)
    return y
  }
  return false
}
export default function MainHowtoPaper () {
  const {screen, windowSize} = useContext(ScreenContext)
  const scroll = useScroll({
    /* config: {
      mass: 0,
      friction: 0,
      tension: 0,
      // duration: 1000,
    }, */
    onChange: (result, ctrl, item)=> {
      // const { value: { scrollYProgress } }= result
      const progress= scrolls.getProgress()
      if( !progress ) return
      api.start({ to: { per: progress }, immediate: true})
    }
  })
  const { scrollY } = scroll
  

  const containerRef= useRef<HTMLDivElement>(null)
  const sectRef= useRef<HTMLDivElement>(null)
  const topRef= useRef<HTMLDivElement[]>([])

  // const sectRef= useRef<HTMLDivElement>(null)

  useEffect(()=> {
    if( containerRef.current && windowSize ) {
      scrolls.set({ 
        screen: screen,
        container: containerRef.current,
        action: ({progress, containerDom})=> {
          return progress
        }
      }) 
    }
  }, [containerRef.current, windowSize])

  
  const [spring, api]= useSpring(()=> ({
    from: { per: 0 },
  }))

  
  return (
    <div ref={containerRef} className="">
      {
        howto.map((val,key)=> {
          return (
            <React.Fragment key={val.title}>
              <div ref={el=> topRef.current[key]= el as HTMLDivElement } className=""></div>
              <animated.div 
                // ref={el=> sectRef.current[key]= el as HTMLDivElement}
                className={`h-[95svh] sticky top-nav border-t w-full bg-paper overflow-hidden`}>

                <animated.div 
                  className={`h-full w-full z-0`}
                  style={{
                    opacity: spring.per.to(progress => {
                      // const progress= scrolls.event()
                      const y= calcCard(key, progress)
                      if( !y || key == len-1 ) return 1
                      return 1-y < .5 ? .5 : 1-y
                    }),
                    scale: spring.per.to(progress => {
                      // const progress= scrolls.event()
                      const y= calcCard(key, progress)
                      if( !y || key == len-1 ) return ''
                      // const value= 1-(y*.16)+.02
                      const value= 1-(y*.1)+.02
                      return value < .9 ? .9 : (value > 1 ? 1 : value)
                    }),
                  }}
                >
                  <Type02 val={val} key={key} />
                </animated.div>

                <animated.div 
                  style={{
                    // opacity: scrollY.to(val => {
                    opacity: spring.per.to(progress => {
                      // const progress= scrolls.event()
                      const y= calcCard(key, progress)
                      if( !y || key == len-1 ) return 0
                      // return `-${(progress*height)+(progress/((1)**5)*10)}px`
                      const value= y-.1
                      return value < 0 ? 0 : (value > 1 ? 1 : value)
                    })
                  }}
                  className="pointer-events-none opacity-0 absolute top-0 left-0 right-0 bottom-0 bg-black"
                ></animated.div>

              </animated.div>
            </React.Fragment>
          )
        })
      }
    </div>
  )
}


const Type02= ({val})=> {
  return (
    <div className="">
      <div className="flex flex-col px-4 md:px-8 py-3 md:py-5 w-full max-w-container-ms mx-auto">
        
        <div className="flex flex-col ">
          <div className="uppercase- font-type-en text text-3xl md:text-7xl text-black leading-none font-extrabold mt-2">{val.title}</div>
          
        </div>

        <div className=" w-full max-w-[700px] border-t- pt-2 mt-4 md:mt-2 ml-auto">
          <div className="text-xs">
            {val.name}
          </div>
          <div className="w-full border-t my-2"></div>
          <div className="text-xs">
            {val.subject}
          </div>
          <div className="w-full leading-snug max-w-[500px] relative text-left py-3 text-sm md:text-xl text-black break-keep mt-2 md:mt-6">
            {val.desc}
          </div>
        </div>
      </div>
      
      <div className={`relative ${val.color} bg-black bg-opacity-55 overflow-hidden`}>
        <img 
          src={val.image} 
          className="w-full aspect-square md:aspect-[2] object-cover opacity-50 grayscale" 
        />
      </div>
    
    </div>
  )
}



const Type01= ({val, key})=> {
  return (
    <>
      
      <div className="flex flex-row px-8 py-5">
        <div className="flex flex-col ">
          <div className="flex flex-nowrap gap-1">
            {
              val?.subject && val.subject.map((sub)=> {
                return (
                  <div key={sub} className="border border-gray-400 text-xs rounded-full  px-3 py-1 text-nowrap">{sub}</div>
                )
              })
            }
          </div>
          <div className="text-center text-[3em] uppercase text-black leading-none font-medium mt-2 ">{val.title}</div>
        </div>

        <div className=" w-full flex justify-center">
          <div className="w-full leading-snug max-w-[700px] relative text-left py-3 text-md text-black font-medium break-keep ">
            {/* <RisingText text={`${val.desc}`} startDelay={0} delay={0} once={true} /> */}
            {val.desc}
          </div>
        </div>
      </div>
      {/* <animated.div
      className={'bg-orange-400 w-full h-full'}
      style={{
        clipPath: scrollYProgress.to(
        val => `circle(${val * 100}%)`),
        opacity: scrollYProgress.to([0, 1], [1, 0])
      }}></animated.div> */}
      <div className={`relative ${val.color} bg-black bg-opacity-55 overflow-hidden`}>
        
        <animated.img 
          /* style={{
            y: spring.per.to(progress => {
              const y= calcCard(key, progress)
              // if( !y || key == len-1 ) return ''
              if( !y ) return ''
              return `-${y*30}%`
            })
          }} */
          src={val.image} 
          className="w-full h-full object-cover opacity-50 grayscale" 
        />

        {/* <div className="absolute top-0 left-0 w-full p-10 flex justify-center">
          <div className="w-full leading-tight max-w-[700px] relative text-center text-sm text-white font-thin break-keep">
            <RisingText text={`${val.desc}`} startDelay={0} delay={0} once={true} />
          </div>
        </div> */}
        
        
      </div>
    
    </>
  )
}