import { LetterWrapperProp, SplitText } from "@cyriacbr/react-split-text";
import { animated, useInView, useSprings } from "@react-spring/web";
import { ComponentType, ReactNode, useEffect, useState } from "react";


interface Prop {
  ref?: any
  length?: number
  text?: string, 
  startDelay?: number, 
  delay?: number, 
  once?: boolean
  className?: string
  textClassName?: string
  children?: ReactNode
}

export function Rising ({ text, startDelay, delay, once, className, children }: Prop) {
  const delaySec= !delay ? 100 : delay 
  const startDelaySec= !startDelay ? 1 : startDelay 
  const [riseRef, riseInView] = useInView(()=> {
    return {
      from: { x: 0 },
      to: { x: 1 },
      onProps: (props)=> {
        if( !props.to ) return
        console.log('onProps', props.to)
        if( props && props.to.x == 0 ) {
          api.start({
            to: {
              opacity: 0,
              x: -100,
              // scaleY: 7,
              // scale: [1, 1.5, 1],
            },
          })
        } else {
          api.start((i, ctrl)=>{
            return {
              to: {
                opacity: 1,
                x: 0,
                scaleY: 1,
              },
              delay: key=> {
                if( key == 'x' ) return (i+1) * (startDelaySec+delaySec);
                if( key == 'opacity' ) return (i+1) * (startDelaySec+delaySec);
                // if( key == 'scaleY' ) return (i+1) * ((startDelaySec)+delaySec);
                return 0
              },
            }
          })
        }
      },
    }
  }, {
    once: once == undefined ? true : once
  });
 


  const [boxSprings, api] = useSprings(1, i => ({
    from: {
      x: -100,
      opacity: 0,
      // scaleY: 7,
      
    },
    transformOrigin: '50% 30%',
    config: (key) => {
      if ( key == 'x' ) return {
        /* mass: 1,
        friction: 8,
        tension: 40, */
        // velocity: 1,
        // duration: 1000
      }
      if ( key == 'opacity' ) return {
        duration: 800
      }
      if ( key == 'scaleY' ) return {
        mass: 1,
        friction: 30,
        tension: 100,
        // duration: 500,
      }
      return {}
    },
  }))

  const [ isClient, setIsClient ]= useState(false)
  useEffect(()=> {
    setIsClient(true)
  }, [])


  return (
    <animated.div 
      ref={riseRef} 
      className={className}
    >
      <animated.span 
        style={boxSprings[0]}
        className="inline-block "
        // className={`inline-block transition-all duration-1000 translate-y-[100%] group-[.inView]:translate-y-0`}
      >
      {children}
      </animated.span>
    </animated.div>
  )
}
















export const riging_text_from= {
  opacity: 0,
  y: `100%`,
  scaleY: 3.5,
}
export const riging_text_to= (delaySec, startDelaySec)=> (i, ctrl)=>{
  return {
    to: {
      opacity: 1,
      y: `0`,
      scaleY: 1,
    },
    delay: key=> {
      if( key == 'y' ) return ((i+1) * (delaySec)) + startDelaySec;
      if( key == 'opacity' ) return ((i+1) * (delaySec)) + startDelaySec;
      if( key == 'scaleY' ) return ((i+1) * (delaySec)) + startDelaySec;
      return 0
    },
  }
}

export const riging_text_config= (key) => {
  if ( key == 'y' )return {
    mass: 1,
    friction: 8,
    tension: 40,
    // velocity: 1,
    // duration: 1000
  }
  if ( key == 'opacity' ) return {
    duration: 800
  }
  if ( key == 'scaleY' ) return {
    mass: 1,
    friction: 30,
    tension: 100,
    // duration: 500,
  }
  return {}
}

export const riging_text_springs= i => ({
  from: riging_text_from,
  transformOrigin: '50% 0%',
  config: riging_text_config,
})


export function Rising2 ({ text, startDelay, delay, once, children }: Prop) {
  const delaySec= !delay ? 100 : delay 
  const startDelaySec= !startDelay ? 1 : startDelay 
  const [riseRef, riseInView] = useInView(()=> {
    return {
      from: { x: 0 },
      to: { x: 1 },
      onProps: (props)=> {
        if( !props.to ) return
        console.log('onProps', props.to)
        if( props && props.to.x == 0 ) {
          api.start({
            to: riging_text_from,
          })
        } else {
          api.start(riging_text_to(delaySec, startDelaySec))
        }
      },
    }
  }, {
    once: once == undefined ? true : once
  });
 


  const [boxSprings, api] = useSprings(7, riging_text_springs)

  const [ isClient, setIsClient ]= useState(false)
  useEffect(()=> {
    setIsClient(true)
  }, [])


  return (
    <animated.div 
      ref={riseRef} 
    >
      <animated.span 
        style={boxSprings[0]}
        className=""
        // className={`inline-block transition-all duration-1000 translate-y-[100%] group-[.inView]:translate-y-0`}
      >
      {children}
      </animated.span>
    </animated.div>
  )
}






export function RisingText ({ ref, text, startDelay, delay, once, className, textClassName }: Prop) {
  const delaySec= !delay ? 0 : delay 
  const startDelaySec= !startDelay ? 1 : startDelay 
  const [riseRef, riseInView] = useInView(()=> {
    return {
      from: { x: 0 },
      to: { x: 1 },
      onProps: (props)=> {
        if( !props.to ) return
        // console.log('onProps', props.to)
        if( props && props.to.x == 0 ) {
          api.start({
            to: riging_text_from,
          })
        } else {
          api.start(riging_text_to(delaySec, startDelaySec))
        }
      },
    }
  }, {
    once: once == undefined ? true : once
  });
 


  const [boxSprings, api] = useSprings(12, riging_text_springs)

  const [ isClient, setIsClient ]= useState(false)
  useEffect(()=> {
    setIsClient(true)
  }, [])


  return (
    <>
    <animated.div ref={riseRef} className={className}>
      {
        !isClient &&
        <div className="opacity-0">{text}</div>
      }
      {
        isClient && 
        <SplitText
          // className='text-3xl'
          LineWrapper={({ lineIndex, extraProps, children }:any) => {
            return <div className='overflow-y-hidden '>
              
              <animated.span 
                style={boxSprings[lineIndex]}
                className={`inline-block whitespace-pre ${textClassName}`}
                // className={`inline-block transition-all duration-1000 translate-y-[100%] group-[.inView]:translate-y-0`}
              >
                {children}
              </animated.span>
            </div>
          }}
          /* WordWrapper={({wordIndex, children}:any)=> {
            let indent= true;
            for (let index = 0; index < 3; index++) {
              if( children?.[index]?.props.children !='_' ) indent= false
            }
            return <span className={`${indent ? 'opacity-0': ''}`}>{children}</span>

          }} */
          LetterWrapper={({lineIndex, letterIndex, wordIndex, extraProps, children}:any)=> {
            return children
            // return `${wordIndex == 0 ? extraProps :''}${children}`
          }}
          // extraProps={'....................'}
          {...({ children: text } as any )}
        />
      }
    </animated.div>
    </>
  )
}





export function useRisingText ({ length, startDelay, delay, once }: Prop) {
  const delaySec= !delay ? 100 : delay 
  const startDelaySec= !startDelay ? 1 : startDelay 
  const [inViewRef, inView] = useInView(()=> {
    return {
      from: { x: 0 },
      to: { x: 1 },
      onProps: (props)=> {
        if( !props.to ) return
        console.log('onProps', props.to)
        if( props && props.to.x == 0 ) {
          api.start({
            to: {
              opacity: 0,
              y: 100,
              scaleY: 5,
            },
          })
        } else {
          api.start((i, ctrl)=>{
            return {
              to: {
                opacity: 1,
                y: 0,
                scaleY: 1,
              },
              delay: key=> {
                if( key == 'y' ) return ((i+1) * (delaySec)) + startDelaySec;
                if( key == 'opacity' ) return ((i+1) * (delaySec)) + startDelaySec;
                if( key == 'scaleY' ) return ((i+1) * (delaySec)) + startDelaySec;
                return 0
              },
            }
          })
        }
      },
    }
  }, {
    once: once == undefined ? true : once
  });
 


  const [springs, api] = useSprings(length?length:1, i => ({
    from: {
      y: 100,
      opacity: 0,
      scaleY: 5,
      
    },
    transformOrigin: '50% 0%',
    config: (key) => {
      if ( key == 'y' )return {
        mass: 1,
        friction: 8,
        tension: 40,
        // velocity: 1,
        // duration: 1000
      }
      if ( key == 'opacity' ) return {
        duration: 800
      }
      if ( key == 'scaleY' ) return {
        mass: 1,
        friction: 30,
        tension: 100,
        // duration: 500,
      }
      return {}
    },
  }))

  /* const [ isClient, setIsClient ]= useState(false)
  useEffect(()=> {
    setIsClient(true)
  }, []) */

  return { inViewRef, inView, springs }
}