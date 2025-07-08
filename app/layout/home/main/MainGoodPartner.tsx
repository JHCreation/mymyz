import { SplitText } from "@cyriacbr/react-split-text";
import { animated, useInView, useSprings } from "@react-spring/web";
import { Rising, Rising2, RisingText, useRisingText } from "./RisingText";
// import { service } from "./Service";
import { useMediaQueryState } from "~/store/store";
import { Link } from "@remix-run/react";

const text= "웹/앱 개발 서비스를 제공합니다. 프론트엔드, 백엔드가 모두 가능한 풀스택 개발 서비스를 지원합니다. 10년차 경력의 개발 노하우를 바탕으로 트렌디하고 세련된 디자인의 웹사이트 제작이 가능하며, 합리적인 가격으로 커스터마이징 작업이 가능합니다. 우리의 단가가 오르기전에 기회를 놓치지 마세요 🤩"

const txt_1= "성공적인 비즈니스로 가야할 길은 멀고도 험난하죠. 웹사이트도 있어야 하죠. 명함도 필요합니다. 각종 인쇄물은 또 어찌나 많은지..."
// const txt_1= "________________ 성공적인 비즈니스로 가야할 길은 멀고도 험난하죠. 웹사이트도 있어야 하죠. 명함도 필요합니다. 각종 인쇄물은 또 어찌나 많은지..."
const txt_2= "웹사이트도 있어야 하죠. 명함도 필요합니다. 각종 인쇄물은 또 어찌나 많은지..."
const txt_3= "비즈니스가 앞으로 나아가기 위해서는 많은 것들이 요구 됩니다. 많은 파트너들을 만나야 하는데 각 분야별로 전문가를 찾기란 쉽지 않습니다."

const content= '비즈니스 시작을 위한 가장 최적의 파트너. 가장 합리적인 비용으로 비즈니스를 시작할 수 있도록 돕겠습니다. 망설이지 마세요.'

export default function MainGoodPartner () {
  const mediaQueryState= useMediaQueryState()
  const { mediaQuery }= mediaQueryState
  const service= [
    '작지만 강한 브랜드를 만들고 싶은 분',
    '내가 가진 자원을 효율적으로 쓰고 싶은 분',
    '비즈니스 본질에서 출발한 전략적 마케팅이 필요한 분 ',
    '디자인, 브랜딩, 콘텐츠의 방향을 설정하는 데 도움이 필요한 분',
  ]


  return (
    <section className='px-4 md:py-20 md:px-8 overflow-hidden w-full max-w-container mx-auto'>
      <div className="relative">

        <div className="md:flex">
          <div className="font-black text-5xl md:text-[2em] font-type-1 mr-2" >
            <RisingText text={'02'} className="font-thin text-stroke-[1px] text-stroke-gray-500 text-stroke-fill-transparent"/>
          </div>
          <div className="text-left uppercase font-type-en- text-5xl md:text-8xl font-extrabold leading-[.8]">
            <RisingText 
              text={'이런 파트너가 '}
              className="leading-[1]"
            />
            <RisingText 
              text={'필요하신가요?'}
              className="leading-[1]"
            />
          </div>
        </div>

        <div className="break-keep border-t w-full max-w-[800px] ml-auto pt-6 md:pt-12 mt-6 md:mt-12 ">
          
          <div className="md:flex">
            <div className="md:w-1/2 md:pr-20 text-xl md:text-2xl font-semibold leading-9">
              <RisingText text={`우리의 협업은, 단순한 '외주'가 아닙니다. 당신의 비즈니스를 위한 최고의 '전략 파트너'입니다.`} startDelay={200} delay={100} once={true} />
            </div>
            <div className="md:w-1/2">
              <div className=" md:pr-20 text-sm mt-6 md:mt-0 leading-6">
                <RisingText text={`우리는 여러분의 사업 방향과 핵심을 함께 지향하는 실무 파트너입니다. 브랜드의 정체성과 가치를 함께 고민하고, 시장에서의 설득력을 만들어갑니다. 저희는 단순히 업무를 대신 처리하는 대행사가 아닙니다. 저희의 역할은 당신의 가장 믿음직한 '업무 대리인'이자 '성장 전략가'가 되는 것입니다. `} startDelay={500} delay={100} once={true} />
              </div>
            
            </div>
          </div>

          <ul className="text-sm border-b w-full md:max-w-[400px]- mt-6 md:mt-12">
            {
              service.map((service, i)=> <li key={service} className={`border-t px-1 py-4 overflow-hidden `}>
                  <div className="before:content-[''] before:w-1.5 before:h-1.5 before:bg-black before:block before:rounded-md before:mr-2 flex items-center">
                    <Rising2 once={true} startDelay={(i+2)*100}>
                      {service}
                    </Rising2>
                  </div>
              </li>)
            }
          </ul>
          
          
        </div>
        

        
        
      </div>


      {/* <div className="mt-10 md:mt-20 md:flex items-start justify-end">
        <div className="overflow-hidden md:mr-40">
          
          <div className="ml-auto w-full md:max-w-[256px] break-keep">
            <div className="overflow-hidden text-sm">
              <RisingText text={`우리는 우리가 할 수있는 모든 서비스를 제공합니다. 비즈니스의 상황에 따라 A-Z까지 모든 서비스를 제공할 수는 없을 수도 있습니다. 범위를 벗어나 무리한 서비스를 제공하기보다는 가장 최선의 서비스를 제공하는데 더 힘을 쓰도록 노력할 것입니다.`} startDelay={500} delay={100} once={true} />
              <Rising2 once={true} startDelay={500}>
                우리는 우리가 할 수있는 모든 서비스를 제공합니다. 비즈니스의 상황에 따라 A-Z까지 모든 서비스를 제공할 수는 없을 수도 있습니다. 범위를 벗어나 무리한 서비스를 제공하기보다는 가장 최선의 서비스를 제공하는데 더 힘을 쓰도록 노력할 것입니다. <br/><br/>
              </Rising2>
            </div>
            <br />
            <div className="overflow-hidden text-sm font-bold">
              <RisingText text={`합리적인 비용으로 최고의 비즈니스 파트너를 만들어보세요! 미마이즈가 가장 최선의 파트너가 될 것입니다.`} startDelay={600} delay={100} once={true} />
              <Rising2 once={true} startDelay={600}>
              합리적인 비용으로 최고의 비즈니스 파트너를 만들어보세요!
                <span className="text-"> 미마이즈</span>가 가장 최선의 <span className="text-">파트너</span>가 될 것입니다.
              </Rising2>
            </div>
            <Rising2 startDelay={700} once={true}>
              <div className="d_btn custom border mt-4 block md:inline-block text-center">
                <Link to='/' className="relative z-10 text-sm inline-block px-6">더보기</Link>
              </div>
            </Rising2>
          </div>
        </div>


        <ul className="text-sm border-b w-full md:max-w-[200px] mt-10 md:mt-0">
          {
            service.map((service, i)=> <li key={service.name} className={`border-t px-1 py-1 overflow-hidden `}>
                <div className="before:content-[''] before:w-1.5 before:h-1.5 before:bg-black before:block before:rounded-md before:mr-2 flex items-center">
                  <Rising2 once={true} startDelay={(i+2)*100}>
                    {service.name}
                  </Rising2>
                </div>
            </li>)
          }
        </ul>

      </div> */}

    </section>
  )
}