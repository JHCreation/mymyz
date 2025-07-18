import { useScroll, animated, useInView, useTrail, a, useResize, useSprings, useSpring, useSpringRef, useChain } from '@react-spring/web'
import { useEffect, useState } from 'react'
import Logo from './Logo'
import { useMediaQueryState } from '~/store/store'

const dur= 1800
export default function Intro ({ setOn }:any) {
  const {mediaQuery, currentSize}= useMediaQueryState()
  useEffect(()=> {
    // console.log(mediaQuery, currentSize, spring)
    
  }, [currentSize])

  const springRef = useSpringRef()
  const [spring, action] = useSpring(()=> ({
    // height: on ? '0px' :'100dvh',
    // ref: springRef,
    from: { per: 0, x: 0, y: 0, z: 0 },
    to: { per: 1 },
    config: key=>{
      if( key == 'per' ) return { duration: dur }
      // if( key == 'y' ) return { duration: 500 }
      return 500
    },
    /* delay: (key)=> {
      if( key == 'x' ) return dur+500
      if( key == 'y' ) return dur+1000
      if( key == 'z' ) return dur+1100
      return 0
    }, */
    /* onStart(result, ctrl, item) {
      // console.log('intro start', result, ctrl, item )
    }, */
    /* onRest(result, ctrl, item) {
        // console.log('intro end', result, ctrl, item)
        if( result.value.per == 1 ) {
          console.log('intro end', result.value)
        }
        
        
    }, */
    onChange: {
      z: (result, ctrl, item)=> {
        console.log('intro change', result)
        setOn(true)
      }
    },
    onRest: {
      per: (result, ctrl, item)=> {
        api.start({ to: { size: mediaQuery.md ? 2 : 2.5 },
          // delay: 300
        })
        action.start({ x: 1 })
      },
      x: (result, ctrl, item)=> {
        action.start({ y: 1 })
      },
      y: (result, ctrl, item)=> {
        action.start({ z: 1 })
      },
      z: (result, ctrl, item)=> {
        console.log('intro end', result)
        setOn(true)
      }
    },
    /* onChange(result, ctrl, item) {
      // console.log(mediaQuery, currentSize)
      // console.log('intro resolve', result, ctrl, item)
      // console.log('intro change', result.value)
      
    }, */
    
    // delay: 2000
  }), [mediaQuery])
  const [mot, api]= useSpring(()=> ({
    from: {
      size: 1
    },
    /* to: {
      test: 1
    } */
  }))
  /* const transRef = useSpringRef()
  const [trans, transApi] = useSpring(()=> ({
    // ref: transRef,
    from: { x: 0, y: 0 },
  })) */
  /* const transRef = useSpringRef()
  const [trans] = useSpring(()=>({
    ref: transRef,
    from: { x: 0, y: 0 },
    to: { x: 1, y: 0 },
    // config: { duration: 2000 },
    
  })); */
  // useChain([springRef, transRef], [0, 1], 1000)

  return (
    <animated.div 
      style={{
        height: spring.y.to(val=> `${(1-val)*100}%`),
        /* y: spring.z.to(val=> {
          if( val == 1 ) setOn(true)
          return 0
        }) */
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
        <div
          className={`relative text-white text-nowrap font-black flex origin-bottom-right`}
        > 
          {
            [...Array(15)].map((v,i)=> <div key={i} className="fill-white w-[20vw] md:w-[10vw]">
              <Logo />
            </div>)
          }
            <div className="fill-white w-[20vw] md:w-[10vw] opacity-0">
              <Logo />
            </div>
          <animated.div
            style={{
              x: spring.x.to(val=> {
                console.log(mediaQuery.md)
                const gap= mediaQuery.md ? 35 : 20
                return `${(1-val)*gap}%`
              }),
              // x: spring.x.to(val=> `calc(${(1-val)}% + 30vw)`),
              y: spring.x.to(val=> `-${(val*.5)*100}dvh`),
            }}
            className={'flex items-center justify-center fill-white fixed right-0 bottom-0 w-full'}
          >
            <div className="w-[20vw] md:w-[10vw] relative">
              <animated.div
                style={{
                  y: spring.x.to(val=> {
                    return `${(val)*50}%`
                  }),
                  scale: mot.size.to(val=>{
                    return val
                  })
                  // top: spring.per.to(val=> `${((val) *48)}px`),
                }} 
                className={'relative '}
              >
                <Logo />
            </animated.div>
           </div>
          </animated.div> 
        </div>

        <div className="min-w-[20vw] md:min-w-[10vw]">
          <animated.div 
            style={{
              scale: spring.per.to(val=> `${(val)*100}%`),
              // height: spring.per.to(val=> `${val*100}%`)
            }}
            className="text-white text-[5.6vw] md:text-[2.8vw] font-black origin-bottom-left leading-[.8]">
              {spring.per.to(val=> `${Math.floor(val*100)}%`)}
          </animated.div>
        </div>


        
      </animated.div >
    </animated.div>
  )
}