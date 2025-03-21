
import MainHowtoPaper from './MainHowtoPaper'
import MainServiceSlide from './MainServiceSlide'
import MainLogo from './MainLogo'
import MainOurTeam from './MainOurTeam'
import MainGoodPartner from './MainGoodPartner'
import MainPointMention from './MainPointMention'
import MainIntro from './MainIntro'
import Intro from './Intro'
import MainWorks from './MainWorks'
import MainWhy from './MainWhy'





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
      <MainGoodPartner/>
      <MainServiceSlide />
      <MainPointMention />
      <MainHowtoPaper/>
      <MainWorks dehydratedState={dehydratedState}/>
      <MainWhy />
      <MainOurTeam />
      
      {/* <div className="h-96"></div> */}
    </div>
  )
}
