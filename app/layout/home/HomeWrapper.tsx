import { LinkText_1 } from "../../components/ui/LinkText";
import { animated, easings, useResize, useScroll, useSpring } from "@react-spring/web";
import { MagneticCursor } from "../../components/cursor/MagneticCursor";
import { Link, Outlet, useNavigate } from "@remix-run/react";
import Logo from "~/layout/home/main/Logo";
// import { ReactLenis, useLenis } from '@studio-freight/lenis'
import AnimatedCursor from "react-animated-cursor";
import {FloatingOverlay, FloatingPortal} from '@floating-ui/react';
import { createContext, useEffect, useRef, useState } from "react";
import { Navigation } from "./nav/Navigation";
import { useDeviceStore, useRootContainer } from "~/store/store";
import 'react-toastify/dist/ReactToastify.css';
// import './tastifyStyle.css';
import MainFooter from "./main/MainFooter";
import { ScreenContext, Size } from "./Layout1";
import Footer from "./main/Footer";
import { ToastContainer } from "react-toastify";
import { toastContainerId } from "./contact/ContactInputs";

/* type Size = {
  width: any
  height: any
}
interface ScreenContextProp {
  screen: Size
  windowSize: Size | null
}
export const ScreenContext= createContext<ScreenContextProp>({
  screen: {
    width: 0,
    height: 0
  },
  windowSize: null
}) */

const duration= 1800;
const delay= 600;
export default function HomeWrapper ({init, isMobile, children}) {
  // const isMobile = useDeviceStore((state) => state.isMobile);
  const { width, height }= useResize({})
  const [windowSize, setWindowSize] = useState<Size|null>(null);
  useEffect(()=> {
    if( window ) {
      // console.log('window:', window.innerWidth, window.innerHeight)
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
  }, [])

  const {setRootContainer}= useRootContainer();

  const body = useRef(null)
  useEffect(()=> {
    if( body?.current ) setRootContainer(body.current)
  }, [body.current])

  const navigate = useNavigate();
  const [transition, setTransition]= useState<any>(false)
  
  const handleClick = (menu)=> (event) => {
    event.preventDefault();

    setTransition(menu)
    let trTiming;
    trTiming= setTimeout(e=> {
      setTransition(false)
      clearTimeout(trTiming)
    }, duration)

    let navTiming;
    navTiming= setTimeout(() => {
      navigate(menu.to)
      clearTimeout(navTiming)
    }, delay);
    
  };
  
  // console.log('isMobile',isMobile)
  return (
    <ScreenContext.Provider value={{screen: { width, height }, windowSize }}>

    <div 
      className={init ? '' : 'h-dvh overflow-hidden'} 
      data-theme="lemonade"
    >
      <div id="custom-root-id" className="fixed top-0 left-0 z-30 w-dvw" ref={body}>
        <Navigation root={body.current} transition={transition} menuClick={handleClick}/>
      </div>
      {children}
      {/* <Outlet /> */}
      <MainFooter />
      <Footer transition={transition} menuClick={handleClick} />
      <div className="fixed bottom-0 z-20">
        <ToastContainer
          containerId={toastContainerId}
          theme="dark"
          // stacked
          position="bottom-center"
          // limit={1}
          // className={"!w-full max-w-[500px] "}
          // toastClassName={"!p-5"}
          // bodyClassName={"!p-2 justify-center"}
          
          // transition={bounce}
        />
      </div>

      {
      !isMobile && 
      <AnimatedCursor
        trailingSpeed={5}
        innerSize={10}
        outerSize={25}
        color='255,255,255'
        outerAlpha={1}
        innerScale={1}
        outerScale={2}
        clickables={[
          'a',
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '.links',
          {
            target: '.custom-hover',
            innerScale: 1,
            outerScale: 2,
            outerStyle: {
              backgroundColor: '#00ff00f6',
              mixBlendMode: 'exclusion',
            }
          },
          {
            target: '.custom-hover-lg',
            innerScale: 1,
            outerScale: 4,
            outerStyle: {
              backgroundColor: '#00ff00f6',
              mixBlendMode: 'exclusion',
            }
          },
          {
            target: '.custom-hover-xl',
            innerScale: 1,
            outerScale: 7,
            outerStyle: {
              backgroundColor: '#00ff00f6',
              mixBlendMode: 'exclusion',
            }
          }
        ] as any}
        outerStyle={{
          mixBlendMode: 'exclusion'
        }}
      />
      }
    </div>
    </ScreenContext.Provider>

  )
}







