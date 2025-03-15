import { Link } from '@remix-run/react'
import Main from './main/Main'
import Part1 from './Part1'
import { IParallax, IParallaxLayer, Parallax, ParallaxLayer } from '@react-spring/parallax'
import React, { MutableRefObject, RefObject, useEffect, useRef, useState } from 'react'
import { useScroll, useSpring, animated, useSpringValue } from '@react-spring/web'
import { transform } from 'lodash'


const pages=4.5
export default function Layout() {
  const parallaxRef = useRef<IParallax>(null);
  const container = useRef<HTMLDivElement>(null);

  /* const { scrollYProgress } = useScroll({
    container: parallaxRef.current as any,
    // onChange: ({ value: { scrollYProgress } }) => {
    onChange: (prop) => {
      console.log(prop);
    },
    default: {
      immediate: true,
    },
  });
  console.log(scrollYProgress)

  const springProps = useSpring({
    rotate: scrollYProgress.to([0, 1], [0, 360]),
  }); */

  const [speed, setSpeed]= useState(2)
  useEffect(() => {
    const handleScroll = () => {
      // const scrollTop = parallaxRef.current?.container.current?.scrollTop;
      if( parallaxRef?.current ){ 
        const { current, busy, space, container: { current: {scrollTop}} } = parallaxRef?.current;
        const scrollBottom= (scrollTop+space);
        const scrollCenter= (scrollTop+space)-(space/2);
        const totalHeight= (space*pages);
        const progress= scrollBottom/totalHeight;
        
        console.log(space, scrollTop)
        if( scrollCenter > space*1 ) {
          setMainLeave(true)
          if( layer_1?.current ) {
            console.log(layer_1?.current)
            setSpeed(0)
            layer_1?.current.sticky
            // layer_1?.current.setPosition(space*1.2, 10, true)
          }
        } else {
          /* if( layer_1?.current ) {
            layer_1?.current.setPosition(0, 100, true)
          } */
        }
        
        if( scrollCenter > space*2.42 ) {
          const velocity= (scrollCenter-space)*2.42/30
          console.log(scrollCenter, velocity)
          
          props.start(velocity)
          
        }
        // console.log('Scroll position:', current, parallaxRef, scrollTop, scrollCenter, scrollBottom );
      }
    };
  
    parallaxRef.current?.container.current?.addEventListener('scroll', handleScroll);
    return () => {
      parallaxRef.current?.container.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* const [props, api] = useSpring(
    () => ({
      from: { rotate: 0 }
      // from: { transform: 'rotate(0deg)' },
      // to: { opacity: 1 },
      // immediate: true
    }),
    []
  )
  const handleClick = () => {
    api.start({
      from: { rotate: 0 },
      to: { rotate: 180 }
      // from: { transform: 'rotate(0deg)' },
      // to: { transform: 'rotate(180deg)' },
    });
  }; */


  const props = useSpringValue(0, {
    config: {
      mass: 2,
      friction: 5,
      tension: 0,
    },
  })

  const handleClick = () => {
    console.log(props, props.get())
    props.start(props.get() != 0 ? 0 : 90)
  }

  const [mainLeave, setMainLeave]= useState(false);
  
  const layer_0= useRef<IParallaxLayer>(null)
  const layer_1= useRef<IParallaxLayer>(null)
  return (

    <div  className="container">
      <Parallax ref={parallaxRef} pages={pages} className=''>
      
        <ParallaxLayer ref={layer_0} offset={0} factor={1}>
          {/* <Main /> */}
          <div className="btn" onClick={handleClick}>start</div>
          
        </ParallaxLayer>
        <ParallaxLayer ref={layer_1} offset={1} factor={1} speed={speed}>
          <div className="">첫번째 레이어.</div>
        </ParallaxLayer>

        {/* <div className="">
          <div className="absolute top-0 left-0 w-full h-full bg-white">
            <img
              src={banner}
              className="w-full h-full object-cover opacity-60" />
          </div>
          
          <div className="w-full max-w-[1200px] mx-auto relative">
              
            <div className="hero min-h-screen justify-center md:justify-start relative">
                
              <div className="hero-content flex-col lg:flex-row max-w-[600px]">
                    
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-4xl font-bold break-keep">우리 팀의 다양한 서비스로 성공을 이끌어요!</h1>
                  <p className="py-6 text-sm md:text-md">
                    웹 디자인, 영상 제작, 번역 등 다양한 분야에서 최고의 품질과 서비스를 제공합니다. 
                  </p>
                  <button className="btn btn-secondary">Get Started</button>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className=''> */}
          <ParallaxLayer  sticky={{ start: 1, end: 2}}>
            <div className="w-full max-w-[1200px] mx-auto py-10 md:py-20 px-5 md:px-10">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                  <p className="text-xs">팀워크</p>
                  <p className="text-lg md:text-3xl">우리의 다양한 서비스를 소개 합니다</p>
                </div>
                <div className="w-full md:w-1/2 mt-3 md:mt-0">
                  <p className="">
                    웹에이전시 팀은 홈페이지 제작, 디자인, 영상, 번역 서비스를 제공합니다. 우리는 고객의 요구에 맞춰 최고의 결과물을 제공하기 위해 항상 노력하고 있습니다. 팀워크와 전문성을 바탕으로 고객의 비즈니스 성공을 돕습니다.
                  </p>
                </div>
              </div>
            </div>
          </ParallaxLayer>
        {/* </div> */}

        <ParallaxLayer  sticky={{ start: 2, end: 4}}>
          <ul className="pt-nav">
            <li className="">1</li>
            <li className="">2</li>
            <li className="">3</li>
            <li className="">4</li>
            <li className="">5</li>
            <li className="">6</li>
          </ul>
        </ParallaxLayer>

        <ParallaxLayer offset={2.42} speed={-0.5}>
          <animated.div style={{rotateY: props}} className={'inline-block text-2xl'}>Hello World</animated.div>


          <div className="font-sans p-4">
            <h1 className="text-3xl">Welcome to Remix</h1>
            <ul className="list-disc mt-4 pl-6 space-y-2">
              <li>
                <a
                  className="text-blue-700 underline visited:text-purple-900"
                  target="_blank"
                  href="https://remix.run/start/quickstart"
                  rel="noreferrer"
                >
                  5m Quick Start
                </a>
              </li>
              <li>
                <a
                  className="text-blue-700 underline visited:text-purple-900"
                  target="_blank"
                  href="https://remix.run/start/tutorial"
                  rel="noreferrer"
                >
                  30m Tutorial
                </a>
              </li>
              <li>
                <a
                  className="text-blue-700 underline visited:text-purple-900"
                  target="_blank"
                  href="https://remix.run/docs"
                  rel="noreferrer"
                >
                  Remix Docs
                </a>
              </li>
              <li className="">
                <Link to={'about'}>about</Link>
              </li>
            </ul>
          </div>
        </ParallaxLayer>

        <Part1 />
      </Parallax>


      {/* <div ref={container} className="h-[800px] overflow-y-scroll">
        
      </div> */}
    </div>
  )
}
