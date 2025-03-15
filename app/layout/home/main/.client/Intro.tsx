import { useScroll, animated, useInView, useTrail, a, useResize, useSprings, useSpring, useSpringRef, useChain } from '@react-spring/web'
import { useEffect, useState } from 'react'
import Logo from '../Logo'

const dur= 1800
export default function Intro ({ setOn }) {
  useEffect(()=> {
    // setOn(true)
    /* springRef.start({ 
      to:{ 
        per: 1,
        x: 1,
        y: 1,
      }, 
      
      delay: (key)=> {
        if( key == 'x' ) return 3000
        if( key == 'y' ) return 4000
        return 0
      },
      loop: false, 
    }) */

    /* transApi.start({ 
      to:{ 
        x: 1,
        y: 1,
      }, 
      delay: (key)=> {
        if( key == 'x' ) return 3000
        if( key == 'y' ) return 4000
        return 0
      },
    }) */

    /* apiProp.start({ 
      to: { x: 1}, 
      loop: false, 
      delay: (key)=> {
        if( key == 'x' ) return 3500
        return 0
      }
    }) */
  }, [])

  const springRef = useSpringRef()
  const [spring] = useSpring(()=> ({
    // height: on ? '0px' :'100dvh',
    // ref: springRef,
    from: { per: 0, x: 0, y: 0, z: 0 },
    to: { per: 1, x: 1, y: 1, z: 1 },
    config: key=>{
      if( key == 'per' ) return { duration: dur }
      return 500
    },
    delay: (key)=> {
      if( key == 'x' ) return dur+500
      if( key == 'y' ) return dur+1000
      if( key == 'z' ) return dur+1100
      return 0
    },
    
    // delay: 2000
  }))
  /* const transRef = useSpringRef()
  const [trans, transApi] = useSpring(()=> ({
    // ref: transRef,
    from: { x: 0, y: 0 },
  })) */
  const transRef = useSpringRef()
  const [trans] = useSpring(()=>({
    ref: transRef,
    from: { x: 0, y: 0 },
    to: { x: 1, y: 0 },
    // config: { duration: 2000 },
    
  }));
  // useChain([springRef, transRef], [0, 1], 1000)

  return (
    <animated.div 
      style={{
        height: spring.y.to(val=> `${(1-val)*100}%`),
        y: spring.z.to(val=> {
          if( val == 1 ) setOn(true)
          return 0
        })
      }}
      className="fixed w-full h-dvh z-50 bg-neutral bg-opacity-10- flex items-center justify-center overflow-hidden"
    >
      <animated.div 
        // style={props}
        style={{
          x: spring.per.to(val=> `-${(1-val)*100}%`),
          display: spring.y.to(val=> { 
            if( val > .5 ) {
              return 'none'
            }
            return ''
          })
          // x: `-80%`
        }}
        className="absolute top-0 left-0 w-full h-dvh flex items-end justify-end"
      >
        <animated.div 
          // style={props}
          
          className={`relative text-white text-nowrap font-black flex origin-bottom-right`}
        > 
          {
            [...Array(15)].map((v,i)=> <div key={i} className="fill-white w-[10vw]">
              <Logo />
            </div>)
          }
            <div className="fill-white w-[10vw] opacity-0">
              <Logo />
            </div>
          <animated.div
            style={{
              x: spring.x.to(val=> `${(1-val)*35}%`),
              y: spring.x.to(val=> `-${(val*.5)*100}dvh`),
            }}
            className={'flex items-center justify-center fill-white fixed right-0 bottom-0 w-full '}
          >
            <div className="w-[10svw] relative ">
              <animated.div
                style={{
                  y: spring.x.to(val=> {
                    return `${(val)*50}%`
                  }),
                  // top: spring.per.to(val=> `${((val) *48)}px`),
                }} 
                className={'relative '}
              >
                <Logo />
            </animated.div>
           </div>
          </animated.div> 
        </animated.div>

        <div className="min-w-[10vw]">
          <animated.div 
            style={{
              scale: spring.per.to(val=> `${(val)*100}%`),
              // height: spring.per.to(val=> `${val*100}%`)
            }}
            className="text-white text-[2.8vw] font-black origin-bottom-left leading-[.8]">
              {spring.per.to(val=> `${Math.floor(val*100)}%`)}
          </animated.div>
        </div>


        
      </animated.div >
    </animated.div>
  )
}