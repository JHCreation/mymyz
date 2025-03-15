
import MainHowtoPaper from './MainHowtoPaper'
import MainServiceSlide from './MainServiceSlide'
import MainLogo from './MainLogo'
import Main1_5 from './Main1_5'
import MainOurTeam from './MainOurTeam'
// import MainFooter from './MainFooter'
import MainGoodPartner from './MainGoodPartner'
import MainPointMention from './MainPointMention'
import MainIntro from './MainIntro'
// import Footer from './Footer'
import Main1_3_1 from './Main1_3_1'
import Intro from './Intro'
import Main_1_0 from './Main_1_0'
import MainWorks from './MainWorks'
import MainWhy from './MainWhy'
import { useEffect, useState } from 'react'
import { useMediaQueryState } from '~/store/store'





export default function Main({dehydratedState, init, setInit}) {
  return (
    <div 
      // className={init ? '' : 'h-dvh overflow-hidden'}
      // className={'h-dvh overflow-hidden'}
    >
    {/* {!init && <Intro setOn={setInit} />} */}
      
    {/* <div className="mt-nav-m md:mt-nav"> */}
      <MainLogo />
      <MainIntro />
      {/* <Main_1_0 /> */}
      <MainGoodPartner/>
      <MainServiceSlide />
      <MainPointMention />
      <MainHowtoPaper/>
      {/* <Main1_4 /> */}
      <MainWorks dehydratedState={dehydratedState}/>
      {/* <Main1_5 /> */}
      <MainWhy />
      <MainOurTeam />
      {/* <MainFooter />
      <Footer /> */}
      
      {/* <div className="h-96"></div> */}
    </div>
  )
}
