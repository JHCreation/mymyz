import { useMediaQuery } from "react-responsive";
import { create } from "zustand";


// const isDesktopOrLaptop = useMediaQuery({
//   query: '(min-width: 1224px)'
// })

export interface EnvType {
  env: any
  setEnv: (val:any)=> void
}
export const useEnv= create<EnvType>((set) => ({
  env: null,
  setEnv: (env)=> set({ env })
}))


export interface RootLenis {
  rootLenis: any
  setRootLenis: (val:any)=> void
}
export const useRootLenis= create<RootLenis>((set) => ({
  rootLenis: null,
  setRootLenis: (rootLenis)=> set((state) => ({ rootLenis }))
}))

interface RootContainer {
  root: any
  setRootContainer: (val:any)=> void
}
export const useRootContainer= create<RootContainer>((set) => ({
  root: null,
  setRootContainer: (root)=> set((state) => {
    return { root }
  })
}))
const mediaQueryDefault= {
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
}

export type MediaQuery= typeof mediaQueryDefault
export type MediaQuerySize= keyof MediaQuery
export interface MediaQueryState {
  mediaQuery: MediaQuery
  currentSize: MediaQuerySize
  setMediaQuery: (val:any)=> void
}
const mediaQuerySize= Object.keys(mediaQueryDefault) as MediaQuerySize[]
const reverse = [...mediaQuerySize].reverse();
export const useMediaQueryState= create<MediaQueryState>((set) => ({
  mediaQuery: mediaQueryDefault,
  size: mediaQuerySize,
  currentSize: 'xs',
  setMediaQuery: (val)=> set((state) => {
    const { mediaQuery, currentSize }= state
    const resMediaQuery= { ...mediaQuery, ...val }
    let current= currentSize
    reverse.some((size)=> {
      if( resMediaQuery[size] ) current= size
      return resMediaQuery[size]
    })
    return { 
      currentSize: current,
      mediaQuery: resMediaQuery
    }
  })
}));



import queryOptions from '@/api/category/queryOption';
import _ from 'lodash'

const { queryFn }= queryOptions.all()

export type CategoryState= {
  data: any
}
export type CategoryAction = {
  setCategory: (category) => void
  getCategory: () => void
}
export const useCategoryState= create<CategoryState & CategoryAction>((set, get) => ({
  data: null,
  setCategory: (category)=> set( (state) => {
    return { data: category }
  }),
  getCategory: async ()=> {
    // get().setCategory({ a: 'test', contents: 'bb'})
    // return;
    const res= await queryFn();
    // console.log(res)
    const data= res?.data?.list.map(val=> {
      let value= val.value
      try {
        val.value= JSON.parse(value) 
      } catch (error) {
        value= val.value
      }
      
      return val;
    })
    const category= _.keyBy(data, 'key')
    // return category;
    get().setCategory(category)
  }
}));



export interface LogTypes {
  access_token: string;
  // refresh_token: string;
  userid: string;
  state: boolean | null | 'fail';
  is_login: boolean
}
export type LogState= {
  log: LogTypes
}

export type LogAction = {
  setLog: (log) => void
}

export const useLogState= create<LogState & LogAction>((set, get) => ({
  log: {
    // access_token: persist_storage('access_token', ''),
    // userid: persist_storage('userid', ''),
    // is_login: persist_storage('is_login', false),
    access_token: '',
    userid: '',
    state: null,
    is_login: false,
  },
  setLog: (log)=> set({log}) 
}))