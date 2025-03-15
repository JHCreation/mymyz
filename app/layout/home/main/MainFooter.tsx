import { animated, useScroll, useSprings } from "@react-spring/web"
import { useContext, useRef } from "react"
import SectionScroll from "./SectionScroll"
import { ScreenContext } from "../Layout1"
import Logo from "./Logo"

const scrolls_1= new SectionScroll({})
const gap= (i)=> i*(i+2)
export default function MainFooter () {
  const {screen, windowSize} = useContext(ScreenContext)
  const scroll= useScroll({
    /* onChange: (result, ctrl, item)=> {
      scrolls_1.event()
    } */
  })
  const { scrollY }= scroll;

  /* const [springsCard, apiCard]= useSprings(9, (i) => ({
    from: { y: `${gap(i)}px` },
  })) */
  const container_1_Ref= useRef<HTMLDivElement>(null)
  scrolls_1.set({ 
    container: container_1_Ref.current,
    distanceOffset: {
      start: -(screen.height.get() || windowSize?.height)/2,
      // start: 0,
      end: 0
    },
    action: function ({progress, containerDom}, i) {
     return progress
    }
  }) 

  const arr= [...Array(7)]
  return (
    <section  className="pt-10 pb-24 bg-paper relative z-10">
      <div ref={container_1_Ref} className=" top-nav pt-20 w-full max-w-container mx-auto px-14">
        <div className="relative ">
          {
            arr.map((v,i)=> {
              const isLast= i+1 == arr.length
              return (
                <div 
                  key={i}
                  className={`w-full relative overflow-hidden leading-[.8] ${isLast ? 'sticky top-nav': ''}` }
                  // style={{ transform: `translateY(${i*i*10/5}dvh)` }}
                  style={{ height: `${isLast ? '' : ((i+1)*2)}svh`}}
                >
                  <animated.div style={{
                    translateY: scrollY.to(val=> {
                      const height= screen.height.get() || windowSize?.height
                      scrolls_1.set({ 
                        container: container_1_Ref.current,
                        distanceOffset: {
                          start: -(height)/2,
                          // start: 0,
                          // end: 0
                          end: height/3
                        },
                      })
                      const progress= scrolls_1.event()
                      const velocity= 20
                      const term= 8
                      const stack= (progress*velocity)-i
                      const value= (stack*((i*i/3)+term))
                      return `${isLast ? 0 :(stack <= 0 ? 0 :value)}%`
                    }),
                  }} className={'w-full overflow-hidden'}>
                    {/* <div className="relative text-[25dvh] font-black ">
                      MEMESITION
                    </div> */}
                    <div className="">
                      <Logo />
                    </div>
                  </animated.div>
                </div>

              )
            })
          }
        </div>
      </div>
      {/* <div className="h-[500dvh]"></div> */}

      
    </section>
  )
}