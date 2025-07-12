import { animated, useScroll, useSpring, useSprings } from "@react-spring/web"
import { useContext, useRef } from "react"
import SectionScroll from "./SectionScroll"
import { ScreenContext } from "../Layout1"
import { LinkText_2 } from "~/components/ui/LinkText"
import LinkArrow from "~/components/ui/LinkArrow"
import { MagneticCursor } from "~/components/cursor/MagneticCursor"
import { Link } from "@remix-run/react"
import { route } from "../route";

const scrolls= new SectionScroll({})

const snsLink= [
  {
    name: 'Instagram',
    to: 'https://www.instagram.com/myz',
    target: '_blank',
  },
  {
    name: 'Kakao',
    to: 'https://open.kakao.com/o/sU1yawGh',
    target: '_blank',
  },
  {
    name: 'Email',
    to: 'mailto:corenzomarket@naver.com',
    target: '_self',
  },
]

export default function Footer ({transition, menuClick}) {
  const {screen, windowSize} = useContext(ScreenContext)
  const scroll= useScroll({
    onChange: (result, ctrl, item)=> {
      scrolls.set({ 
        container: containerRef.current,
        distanceOffset: {
          start: screen.height.get() ? -(screen.height.get())/2 : scrolls?.get('distanceOffset').start,
          end: screen.height.get() ? -(screen.height.get()) : scrolls?.get('distanceOffset').end,
        },
        // print: true
      }) 
      
      const progress= scrolls.getProgress()
      if( !progress ) return;
      api.start({ per: progress})
    }
  })


  const [spring, api]= useSpring( ()=> ({ per: 0 }) )
  const containerRef= useRef<HTMLDivElement>(null)
  scrolls.set({ 
    scroll,
    container: containerRef.current,
    distanceOffset: {
      start: -(screen.height.get() || windowSize?.height)/2,
      end: -(screen.height.get() || windowSize?.height)
    },
    
  }) 
  return (
    <footer className="relative h-dvh bg-paper z-0">
      <div ref={containerRef} className="h-[200dvh] relative top-[-100dvh]">
        <div className="h-dvh-nav sticky top-nav w-full p-4 md:p-16 flex md:items-center justify-center">
          
          <animated.div 
            className="flex flex-col justify-between py-5 md:py-0 md:flex-row w-full max-w-container"
            style={{
              y: spring.per.to( progress => {
                const val= (1-progress)*100
                return `-${val <= 0 ?  0 : val}%`
              })
            }}
          >
            <div className="w-full md:w-1/3 ">
              <div className="w-full pr-20">
                <div className="border-b pl-0 md:px-2 py-1 ">
                  Social Media :
                </div>
                <div className="flex flex-col">
                  {
                    snsLink.map((v,i)=> {
                      return <LinkText_2 key={v.name} className='flex-1 md:px-2 py-1 border-b'>
                        <a href={v.to} target={v.target} className="custom-hover">
                          <div className="relative flex items-center justify-between group-hover:text-white group-hover:px-2 duration-200 ">
                            
                              <MagneticCursor className="">
                              {v.name}
                              </MagneticCursor>
                              <div className="w-3 ">
                                <LinkArrow className='group-hover:fill-white relative duration-200'/>
                              </div>
                            
                          </div>
                        </a>
                    </LinkText_2>
                    })
                  }
                
                
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3 md:mt-0">
              <div className="border-b pl-0 md:px-2 py-1 ">
                Menu :
              </div>
              <ul className="text-4xl md:text-[9em] md:leading-none">
                {
                  route.map(link=> <li key={link.to} className="border-b py-2 md:py-0">
                    <MagneticCursor className="inline-block custom-hover-lg">
                      {/* <Link to={link.to} className="">{link.name}</Link> */}
                      <Link
                        to={link.to}
                        onClick={e=> {
                          menuClick(link)(e)
                        }}
                        prefetch="intent"
                        // preventScrollReset
                      >
                        {link.name}
                      </Link>
                    </MagneticCursor>
                  </li>)
                }
              </ul>
            </div>
          </animated.div>
        </div>
       
      </div>
    </footer>
  )
}