import { SplitText } from "@cyriacbr/react-split-text";
import { animated, useInView, useResize, useScroll, useSpring, useSprings } from "@react-spring/web";
import { useContext, useEffect, useRef } from "react";
import { ScreenContext } from "../Layout1";
import SectionScroll from "./SectionScroll";
import { RisingText } from "./RisingText";

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

export default function MainPointMention () {
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
      const dom= containerRef.current?.getBoundingClientRect();
      if( !dom ) return
      const { height }= dom
      const progress= scrolls.event()
      apis.start((i, ctrl)=> (
        { 
          to: { y: `-${(progress*height)*.15 + (progress/((i+1)**0)*0)}px` },
          delay: (key)=> {
            if( key == 'y' ) return i*30;
            return 0
          }
        }
      ))
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
          end: 0
        },
        action: function ({progress, containerDom}) {
          return progress
        },
        // print: true
      }) 
    }
  }, [containerRef.current, windowSize])

  

  const [springs, apis]= useSprings(2, (i) => ({
    from: { y: '0px' },
  }))

  
  
  return (
    <div 
      ref={containerRef} 
      className="flex w-full max-w-screen-1 m-auto overflow-hidden"
    >

      <div className="flex justify-center w-full max-w-[800px] mx-auto pt-40 md:pt-80 pb-40 md:pb-40 px-5 md:px-10" >
        
        <div className="text-stroke-[1px] md:text-stroke-[1.4px] text-stroke-gray-500 text-stroke-fill-transparent">
          <animated.div 
            style={springs[0]}
          >
            
            <div className="font-[HSBombaram21-Regular] text-[2em] md:text-[4em] md:leading-[1.2] text-center">
              <RisingText text={'보고 계신 웹사이트가 저희의 첫 포트폴리오 입니다.'}/>
              {/* <RisingText text={'여러분만의 것을 만들어 보세요.'}/> */}
              <RisingText text={'아직 비싸지 않아요.'}/>
              <RisingText text={'지금이 기회 입니다.'}/>
            </div>
            {/* <div className="font-[HSBombaram21-Regular] font-black text-[4em] leading-[1.1] text-center">
              <RisingText text={'The website you\'re looking at is our first portfolio.'}/>
              <RisingText text={'Make your own.'}/>
            </div> */}
          
          </animated.div>
          
        </div>
      </div>
      
    </div>
  )
}