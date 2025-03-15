import { json, Link } from '@remix-run/react'
import Main from './main/Main'
// import Part1 from './Part1'
import { IParallax, Parallax, ParallaxLayer } from '@react-spring/parallax'
import { createContext, useEffect,  useState } from 'react'
import { useResize } from '@react-spring/web'
import _ from 'lodash'


export type Size = {
  width: any
  height: any
}
export interface ScreenContextProp {
  screen: Size
  windowSize: Size | null
}
export const ScreenContext= createContext<ScreenContextProp>({
  screen: {
    width: 0,
    height: 0
  },
  windowSize: null
})


export default function Layout1({dehydratedState, init, setInit}) {
  
  /* const { width, height }= useResize({})
  const [windowSize, setWindowSize] = useState<Size|null>(null);
  useEffect(()=> {
    if( window ) {
      // console.log('window:', window.innerWidth, window.innerHeight)
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
  }, []) */

  return (
    <>
    {/* <ScreenContext.Provider value={{screen: { width, height }, windowSize }}> */}
      <div className="bg-paper">
        <Main dehydratedState={dehydratedState} init={init} setInit={setInit}/>
      </div>
    {/* </ScreenContext.Provider> */}
    </>
  )
}
