import { animated, useScroll, useSpring, useSprings } from "@react-spring/web"
import { useContext, useEffect, useRef, useState } from "react"
import SectionScroll from "./SectionScroll"
import { ScreenContext } from "../Layout1"
import { characters } from "./Service"

const scrolls= new SectionScroll({})
const len= characters.length;
export default function MainOurTeam () {
  const {screen, windowSize} = useContext(ScreenContext)
  const scroll= useScroll({
    onChange: (result, ctrl, item)=> {
      // scrolls.event()
      const progress= scrolls.getProgress()
      if( !progress ) return
      // api.start({per: progress})
      apiCard.start((i, ctrl)=> {
        // const item= itemRef?.current?.getBoundingClientRect()
        // const box= container_1_Ref?.current?.getBoundingClientRect()
        if( progress > (i+.2)/(len+2) ){
          return {
            to: {
              x: `0%`, y: `0%`,
            },
          }
        }
        if( progress < (i+.2)/(len+2) ){
          return {
            to: {
              x: `120%`, y: `120%`,
            },
          }
        }
      })
    }
  })
  const { scrollY }= scroll;

  const [spring, api]= useSpring(()=> ({ from: { per: 0 } }))


  const [springsCard, apiCard]= useSprings(len, (i) => ({
    from: { x: '120%', y: '120%' },
  }))
  const container_Ref= useRef<HTMLDivElement>(null)
  const container_1_Ref= useRef<HTMLDivElement>(null)
  const itemRef= useRef<HTMLDivElement>(null)

  useEffect(()=> {
    if( container_Ref.current && windowSize ) {
      scrolls.set({ 
        container: container_Ref.current,
        distanceOffset: {
          // start: -(screen.height.get() || windowSize?.height),
          start: 0,
          end: 0
        },
        
      })
    }
  }, [container_Ref.current, windowSize])

  const [item, setItem]= useState<any>(null)
  const [box, setBox]= useState<any>(null)
  useEffect(()=> {
    // console.log(itemRef, container_1_Ref)
    if(itemRef && container_1_Ref) {
      setItem(itemRef?.current?.getBoundingClientRect())
      setBox(container_1_Ref?.current?.getBoundingClientRect())
    }
  }, [itemRef, container_1_Ref])
   
  return (
    <section 
      ref={container_Ref} 
      className="bg-paper relative z-10"
      style={{ height: `${(len)*100}lvh`}}
    >
      <div className="sticky top-0 h-dvh pt-nav w-full max-w-container mx-auto overflow-hidden">
        <div className="h-full p-3 md:p-10 relative">
          <div ref={container_1_Ref} className="h-full relative ">
          {/* {
            [...Array(9)].map((v,i)=> {
              const dom= container_Ref.current?.getBoundingClientRect()
              return (
                <animated.div key={i} style={springsCard[i]}>
                  <div 
                    className="w-[25%] absolute border border-black bg-white bg-opacity-80 backdrop-blur-sm" 
                    style={{ top: `${i*50/9}dvh`, left: i*(dom ? dom?.width/11 : 0) }}
                  >
                    <div className="relative aspect-square">
                    {i}
                    </div>
                  </div>
                </animated.div>
              )
            })
          } */}

          {
            characters.map((val,i)=> {
              // const item= itemRef?.current?.getBoundingClientRect()
              // const box= container_1_Ref?.current?.getBoundingClientRect()
              // console.log(len, item, box)

              return (
                <animated.div key={i} style={springsCard[i]} >
                  <div 
                    ref={itemRef}
                    className="absolute text-white bg-[#2b1701]/40 backdrop-blur-sm w-[70%] md:w-[30%]" 
                    style={{ 
                      // width: `${30}%`,
                      top: `calc( (${box?.height}px - ${item?.height}px) / ${len} * ${i})`, 
                      // left: i*(dom && item ? (dom?.width)/len : 0) 
                      left: `calc( (100% - ${item?.width}px) / ${len-1} * ${i})`
                    }}
                  >
                    <div className="relative aspect-[1/0.9]- md:aspect-[1/1.2] p-3 md:p-5 flex">
                      <div className="flex flex-col w-full">
                        <div className="flex items-end ">
                          <div className="w-full max-w-[54px] md:max-w-[130px]">
                            <img src={val.img} alt="" />
                          </div>
                          <p className="font-[] text-xl md:text-4xl font-black ml-2 md:ml-4">{val.name}</p>
                        </div>
                        <div className="flex-1 flex flex-col justify-end">
                          <div className="mt-2 md:mt-5">
                            <p className="text-sm font-black text-stone-200">
                              {val.title}
                            </p>
                          </div>
                          <ul className="text-2xs mt-2 md:mt-5 border-t border-white w-full max-w-[200px]">
                          {
                            val.subject.map((tech,i)=> <li key={i} className="border-b border-white">{tech}</li>)
                          }
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </animated.div>
              )
            })
          }
          </div>
        </div>
      </div>
      
    </section>
  )
}