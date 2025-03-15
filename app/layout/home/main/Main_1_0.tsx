
import React, { useRef } from 'react'
import { useTrail, a } from '@react-spring/web'
import _ from 'lodash'
import { LinkText_2 } from '~/components/ui/LinkText'

import LinkArrow from '~/components/ui/LinkArrow'
import { MediaQuery, MediaQuerySize, useMediaQueryState } from '~/store/store'
import { RisingText } from './RisingText'


const motion= {
  height: {
    xs: 20, sm: 80, md: 80, lg: 110
  }
}
const Trail: React.FC<{ open: boolean, mediaQuery: MediaQuerySize, children: React.ReactNode, wordRef }> = ({ open, children, mediaQuery, wordRef }) => {
  const items = React.Children.toArray(children)
  
  // if( wordRef) console.log(items, mediaQuery, wordRef?.height)
  const trail = useTrail(items.length, ({
    config: { mass: 5, tension: 200, friction: 200, duration: 500 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    // height: open ? (motion.height[mediaQuery] || 110) : 0,
    height: open && wordRef ? (wordRef?.height) : 0,
    from: { opacity: 0, x: 20, height: 0 },
    delay: 300,

  }))
  return (
    <div>
      {trail.map((prop, index) => {
        const { height, ...style }= prop
        return (
          <a.div 
            key={index} 
            className={
              'relative w-full h-[57px] lg:h-[80px] leading-[60px] md:leading-[60px] lg:leading-[86px] text-black text-[4em] md:text-[4em] lg:text-[5.7em] font-extrabold tracking-[-0.05em] will-change-[transform,opacity] overflow-hidden '
            } 
            style={style}
          >
            <a.div 
              style={{ height }} 
              className={'pr-[0.5em] overflow-hidden'}
            >{items[index]}</a.div>
          </a.div>
        )
      })}
    </div>
  )
}





export default function Main_1_0() {
  const mediaQueryState= useMediaQueryState()
  const { mediaQuery, currentSize }= mediaQueryState

  const ref= useRef<HTMLSpanElement>(null)
  const refDom= ref.current?.getBoundingClientRect();
  return (
      <div className="flex flex-col md:flex-row h-full border-b">
        
        <div
          // style={{height: `calc(100vh + 50vh)`}} 
          className={`h-lvh md:h-[calc(100vh+100px)] flex items-start w-full md:w-1/2 top-0 px-0`}>
          <div className="h-full w-full max-h-dvh-nav flex items-center justify-center">
            <div className={`sticky top-nav py-8`} >
              <Trail open={true} mediaQuery={currentSize} wordRef={refDom}>
                <span ref={ref}>우리의</span>
                <span>
                  <span className='text-primary'>다</span>
                  <span className='text-secondary'>양</span>
                  <span className='text-accent'>한</span>
                </span>
                <span>서비스를</span>
                <span>소개합니다</span>
              </Trail>
            </div>
          </div>
        </div>

        


        <div className="w-full md:w-1/2 md:border-l flex">

          {/* <TestSpring on={on} mediaQuery={currentSize}/>
          <button className="btn" onClick={e=> setOn(!on)}>시작</button> */}

          <div className="flex flex-col w-full">
            <div className="">
              <div className="border-b px-4 py-1">
                memyzee :
              </div>
            
              <div className="break-keep ml-0 py-2 px-4 text-sm md:text-lg">
                <RisingText text={'미마이즈는 다양한 서비스를 제공합니다. 비즈니스를 시작할 수 있는 가장 좋은 파트너가 될 수 있을 것입니다. 비즈니스를 시작하거나, 성장할 수 있는 업무와 서비스들을 지원 해드립니다.'} startDelay={100} once={true}/>
              </div>
            </div>

            <div className="md:pt-6  break-keep leading-normal font- text- ">
              <div className="flex flex-col md:flex-row justify-between ml- px-4 w-full md:w-auto">
                <div className="text-sm ">
                  <RisingText text={'We have : '} startDelay={200} once={true}/>
                  <div className="flex flex-wrap md:flex-col gap-x-3">
                    <RisingText text={'1. 합리적인 비용'} startDelay={300} once={true}/>
                    <RisingText text={'2. 빠른 처리'} startDelay={400} once={true}/>
                    <RisingText text={'3. 다양한 서비스'} startDelay={500} once={true}/>
                    <RisingText text={'4. 만족스러운 결과'} startDelay={500} once={true}/>
                  </div>
                  {/* <RisingText text={'미마이즈는 다양한 서비스를 제공합니다. 비즈니스를 시작할 수 있는 가장 좋은 파트너가 될 수 있을 것입니다. 비즈니스를 시작하거나, 성장할 수 있는 업무와 서비스들을 지원 해드립니다.'} startDelay={100} once={true}/> */}
                </div>

                <div className="text-sm mt-4 md:w-full md:mt-0 md:flex md:justify-around ">
                  <div className="flex-">
                    <RisingText text={'Discover, Study, Have Fun: '} startDelay={200} once={true}/>
                    <RisingText text={'All-in-One Learning!'} startDelay={200} once={true}/>
                  </div>
                  <div className="flex- flex font-">
                    <div className="pr-10">
                      <a href="mailto:memesition@naver.com" className=''>
                        <RisingText className='' textClassName='link' text={'memesition@naver.com'} startDelay={300} once={true}/>
                      </a>
                      <RisingText className='' text={'@2024'} startDelay={200} once={true}/>

                    </div>
                  </div>
                </div>
              </div>

              
              {/* <div className="text-xs w-full max-w-64 ml-auto p-2">
                미마이즈는 다양한 서비스를 제공합니다. 기업이 성장할 수 있는 업무와 서비스들을 지원 해드립니다.
              </div>
              <div className="text-xs w-full max-w-64 ml-auto p-2">
                미마이즈는 다양한 서비스를 제공합니다. 기업이 성장할 수 있는 업무와 서비스들을 지원 해드립니다.
              </div> */}
            </div>
            <div className="flex-1 flex flex-col justify-end w-full md:w-1/2 ml-auto ">
              <div className="border-b px-0 py-3">

                <div className="hidden md:block text-2xl max-w-72 leading-tight font-bold">
                  <RisingText className='' text={'Original Series by memesition® about the main design principles'} startDelay={300} once={true}/>
                  {/* Original Series by memesition® about the main design principles */}
                </div>
              
              </div>
              <div className="flex flex-col">
                {
                  ['about','portfolio','contact'].map((v,i)=> {
                    return <LinkText_2 key={v} className='flex-1 px-2 py-1 border-b last:border-none'>
                    <div className="relative flex items-center justify-between group-hover:text-white group-hover:px-2 duration-200 ">
                      {v}
                      <div className="w-3 ">
                        <LinkArrow className='group-hover:fill-white relative duration-200'/>
                      </div>
                    </div>
                  </LinkText_2>
                  })
                }
            
            
              </div>
            </div>
          </div>
          
          
        </div>

        
        
      </div>


      
  )
}

