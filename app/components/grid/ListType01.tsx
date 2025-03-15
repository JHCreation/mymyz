import { ReactNode } from "react"


export const ListWrap01 = ({children}: {children: ReactNode}) => {
  return (
    <ul className="text-xs flex flex-wrap justify-center mx-auto">
      {children}
    </ul>
  )
}

export const ListItemWrap01 = ({children}: {children: ReactNode}) => {
  return (
    <li className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 2xl:w-1/12">
      {children}
    </li>
  )
}