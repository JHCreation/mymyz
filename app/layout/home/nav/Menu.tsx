import { LinkText_1 } from "~/components/ui/LinkText";
import { animated, easings, useScroll, useSpring, useSprings, useTrail } from "@react-spring/web";
import { MagneticCursor } from "~/components/cursor/MagneticCursor";
import { Link, useNavigate } from "@remix-run/react";
import Logo from "~/layout/home/main/Logo";
import { ReactLenis, useLenis } from 'lenis/react'
import {FloatingOverlay, FloatingPortal} from '@floating-ui/react';
import { useEffect, useMemo, useRef, useState } from "react";
import { route } from "../route";
import { riging_text_from, riging_text_springs, riging_text_to, RisingText } from "../main/RisingText";

export const Menu= ({ active, setActive, handleClick })=> {
    const [view, setView]= useState(false)
    const [dur, setDur]= useState(true)
    const [styles, api] = useSpring(()=> ({
        config:{
            // duration: 500,
            // bounce: 100,
            easing: easings.easeInCubic,
        },
        from : { scaleY: 0, transformOrigin: '50% 100%' },
    /* to: [
        { scaleY: 1, transformOrigin: '50% 100%', config: { duration: 600 } },
        { scaleY: 1.2, transformOrigin: '50% 0%', config: { duration: 300 } },
        // { scaleY: 1, transformOrigin: '50% 0%', duration: 100 },
        { scaleY: 0, transformOrigin: '50% 0%', config: { duration: 600 } },
    ], */
    // reset: true
    /* from: {
        opacity: 0,
        x: 0,
        backgroundColor: '#ff0',
    }, */
    /* to: {
        opacity: 1,
        x: '0%',
        backgroundColor: '#ff0000',
    }, */
    }) )

    const [trails, trailApi] = useTrail(
        12,
        () => ({
            from: { y: 0 },
            // to: { opacity: 1 },
        }),
        []
    )

    useEffect(()=> {
        if( active ) {
            setView(true)
            api.start({
                from : { scaleY: 0, transformOrigin: '50% 100%' },
                to: [
                    { scaleY: 1, transformOrigin: '50% 100%', config: { duration: 600 } },
                    { scaleY: 1, transformOrigin: '50% 0%', config: { duration: 1000 } },
                    // { scaleY: 1, transformOrigin: '50% 0%', duration: 100 },
                    // { scaleY: 0, transformOrigin: '50% 0%', config: { duration: 600 } },
                    // { scaleY: 1, transformOrigin: '50% 0%', config: { duration: 0 } },
                ],
                onStart(result, ctrl, item) {
                  console.log('open start', result, ctrl, item )
                  setDur(true)
                },
                onRest(result, ctrl, item) {
                    console.log('open end', result, ctrl, item)
                },
                onResolve(result, ctrl, item) {
                    setDur(false)
                    console.log('open resolve', result, ctrl, item)
                },
            })
            textApi.start(riging_text_to(100, 500))
            
        }
        if( !active ) {
              setDur(true)
              api.start({
                // from : { scaleY: 1, transformOrigin: '50% 0%' },
                to: [
                    { scaleY: 0, transformOrigin: '50% 0%', delay: 200,  config: { duration: 600 } },
                ],
                onStart(result, ctrl, item) {
                  console.log('close start', result, ctrl, item )
                  setDur(true)
                },
                onRest(result, ctrl, item) {
                    setView(false)
                    setDur(false)
                    console.log('close end', result, ctrl, item)
                },
                onResolve(result, ctrl, item) {
                    console.log('close resolve', result, ctrl, item)
                },
            })
            textApi.start({
                to: riging_text_from,
            })
        }
    }, [active])

    
    const easing= {
      y: easings.easeInBounce,
      opacity: easings.easeInOutBounce,
    }
    const [styles_1] = useSpring(()=> ({
      
      // immediate: true,
      // reverse: false,
      // reset: false,
      // loop: false,
      from: {
        opacity: 0,
        y: '-20%',
        // config: { duration: 350, },
      },
      to: [
        { opacity: 1, y: '.1%', config: { duration: 250, },},
        { opacity: 1, y: '0%', config: { duration: 300, },},
        { opacity: 0, y: '0%', config: { duration: 200, },},
      ],
      delay: 600
    }) )
  
    // console.log(styles_1)
  
    const [isAnimated, setIsAnimated] = useState(false);
    useEffect(()=> {
      console.log('init animation')
      // setIsAnimated(true)
      /* api.start({
        to: [
          { opacity: 1, y: '0%', config: { duration: 500, },},
          { opacity: 0, y: '-20%', config: { duration: 150, },},
          // { opacity: 1, y: '0%' },
          // { opacity: 0, y: '-10%', },
        ],
        delay: 500
      }) */
    }, [])

    const [TextSprings, textApi] = useSprings(7, riging_text_springs)

    
    return (
      <div className={`w-dvw h-dvh flex items-center justify-center fixed left-0 ${view ? 'top-0' : 'top-[100dvh]'}`}>
      <animated.div
        style={styles}
        className={`absolute top-0 left-0 bg-accent w-full h-dvh`}
      >
      </animated.div>
  
      
      <ul className="flex flex-col ">
            {
              route.map( (menu,i)=> 
              <li key={menu.name} className="w-full flex items-center h-[13dvh]">
                <div className={dur ? `overflow-y-hidden` : ''}>
                  <animated.div
                      style={TextSprings[i]}
                      className="relative z-50"
                  >
                  <MagneticCursor className="px-0 custom-hover">
                    <div className="pl-3">
                  
                        <LinkText_1 className="text-6xl font-thin">
                          {/* {
                            menu.transition &&
                            <LinksWrap
                              menu={menu} setTransition={setTransition}
                              duration={1000}
                              delay={500}
                            />
                          } */}
                          {
                            menu.transition &&
                            <Link
                              to={menu.to}
                              onClick={e=> {
                                  handleClick(menu)(e)
                                  setActive(false)
                              }}
                              prefetch="intent"
                              // preventScrollReset
                            >
                              {menu.name}
                            </Link>
                          }
                          {
                            !menu.transition &&
                            <Link
                              to={menu.to}
                              onClick={e=> setActive(false)}
                              // unstable_viewTransition
                              prefetch="intent"
                              // preventScrollReset
                            >
                              {menu.name}
                            </Link>
                          }
                  
                        </LinkText_1>
                    </div>
                  </MagneticCursor>
                  </animated.div>
                </div>
              </li> )
            }
          </ul>

    
      </div>
    )
  }