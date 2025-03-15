interface SectScrollProp {
  scroll?: any 
  screen?: any
  /* {
    scrollX: number;
    scrollY: number;
    scrollXProgress: number;
    scrollYProgress: number;
  } */
  container: HTMLElement | null
  // containerDom: any
  // screenHeight: number
  actionOffset: {
    start: number
    end: number
  }
  distanceOffset: {
    start: number
    end: number
  }
  action: ({ 
    progress, containerDom
  }: { 
    progress: number,
    containerDom : any
  },
  prop?: any)=> any
  
  print?: boolean
}

interface Position {
  containerDom:any
  distance:number
  distanceTop:number
  distanceOffsetTop:number
  distanceOffsetBottom:number
  top:number
  offseTop:number
  offseBottom:number
  progress:number
}


type RequiredKey<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export default class SectionScroll {
  private scroll: Partial<SectScrollProp>['scroll']
  private screen: Partial<SectScrollProp>['screen']
  private container: Partial<SectScrollProp>['container']
  // private containerDom: SectScrollProp['containerDom']
  private actionOffset: SectScrollProp['actionOffset']
  private distanceOffset: SectScrollProp['distanceOffset']
  private action: SectScrollProp['action']
  private print: Partial<SectScrollProp>['print']
  public position: Position|null
  
  constructor (prop:Partial<SectScrollProp>) {
    this.scroll= prop.scroll
    this.screen= prop.screen
    this.container= prop.container
    this.actionOffset={ start: 0, end: 0 }
    this.distanceOffset= { start: 0, end: 0 }
    this.action= ()=> ''
    this.print= prop.print || false
    this.position= this.getPosition()
  }
  
  set= (prop:Partial<SectScrollProp>)=> {
    Object.keys(prop).map(key=> {
      this[key]= prop[key]
    })
    this.position= this.getPosition()
  }

  get= (key:keyof SectScrollProp)=> {
    return this[key]
  }

  getPosition:()=>Position|null= ()=> {
    // if( this.print ) console.log(this)
    const containerDom= this.container?.getBoundingClientRect();
    const offseTop= this.container?.offsetTop
    if( containerDom && (offseTop || offseTop == 0) ) {
      const { top, bottom, height, width }= containerDom;
      const offseBottom= offseTop + height
      const distance= height + -(this.distanceOffset.start) + this.distanceOffset.end;
      const distanceTop= top + this.distanceOffset.start
      const progress= -(distanceTop)/(distance);
      const distanceOffsetTop= offseTop+this.distanceOffset.start
      const distanceOffsetBottom= offseBottom+this.distanceOffset.end
      // console.log(containerDom, offseTop,  this.distanceOffset.start)
      
      if( this.print ){
        console.log(
          ' top:', top, '\n',
          'distanceTop:', distanceTop, '\n',
          'distanceOffsetTop:', distanceOffsetTop, '\n',
          'distanceOffsetBottom:', distanceOffsetBottom, '\n',
          'bottom:', bottom, '\n',
          'height', height, '\n',
          'offseTop:', offseTop, '\n',
          'offseBottom:', offseBottom, '\n',
          // 'val:', this.scroll.scrollY.get(), '\n',
          'distance:', distance, '\n',
          'progress:', progress*100,'%'
        )
      }

      this.position = {
        containerDom,
        distance,
        distanceTop,
        distanceOffsetTop,
        distanceOffsetBottom,
        top,
        offseTop,
        offseBottom,
        progress,
      }

      return this.position
    }
    return null
  }

  getProgress= (key?:string)=> {
    const position= this.getPosition()
    // console.log(position,key)
    if( position ) {
      const {distanceTop, distance, progress} = position
      if( -distanceTop < this.actionOffset.start ) return 0
      if( -(distanceTop) > distance + this.actionOffset.end ) return 1
      if( -distanceTop > this.actionOffset.start && 
        -(distanceTop) < distance + this.actionOffset.end ) {
        return progress
      }
      return null
    }
    return null
  }
  
  event= (prop?:any)=> {
    const position= this.getPosition()
    if( position ) {
      const {containerDom, distanceTop, distance, progress} = position
      if( -distanceTop < this.actionOffset.start ) return ''
      if( -(distanceTop) > distance + this.actionOffset.end ) return ''
      if( -distanceTop > this.actionOffset.start && 
        -(distanceTop) < distance + this.actionOffset.end ) {
        // console.log(progress)
        return this.action({progress, containerDom}, prop)
      }
      return ''
    }
    return ''
  }
}



export const sectScroll = ({ scroll, container, actionOffset, distanceOffset, action }: SectScrollProp)=> {
  const containerDom= container?.getBoundingClientRect();
  // const sectDom= sectRef?.current?.getBoundingClientRect();
  const offseTop= container?.offsetTop
  if( containerDom && offseTop ) {
    const { top, bottom, height, width }= containerDom;
    const offseBottom= offseTop + height
    const distance= height + -(distanceOffset.start) + distanceOffset.end;
    const distanceTop= top + distanceOffset.start
    const progress= -(distanceTop)/(distance);

    /* console.log(
      ' top:', top, '\n',
      'distanceTop:', distanceTop, '\n',
      'bottom:', bottom, '\n',
      'height', height, '\n',
      'offseTop:', offseTop, '\n',
      'offseBottom:', offseBottom, '\n',
      'val:', scroll, '\n',
      'distance:', distance, '\n',
      'progress:', progress*100,'%'
    ) */

    if( -distanceTop < actionOffset.start ) return 'yet'
    if( -(distanceTop) > distance + actionOffset.end ) return 'pass'
    if( -distanceTop > actionOffset.start && 
      -(distanceTop) < distance + actionOffset.end ) {
                
      console.log(progress)
      
      /* return `${
        res > 0 ? 0 : 
          `calc(${-res > slideDistance-width ? -(slideDistance-width) : res }px - (10*2.5rem))`
        }` */
      // return progress
      return action({progress, containerDom})
    }
    return ''
  }
  return ''
}