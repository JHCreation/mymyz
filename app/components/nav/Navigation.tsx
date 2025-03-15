import { Link } from "@remix-run/react";
import { useState } from "react";


export default function Navigation () {
  const [open, setOpen]= useState<boolean>(false)
  return (
    <div className="navbar min-h-2 bg-base-100 justify-between">
      <div className="navbar-start">
      
        {/* <details className="dropdown" open={open}>
          <summary tabIndex={0} role="button" className="btn m-1"
            onClick={e=>setOpen(!open)}
          >open or close</summary>
          <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li><Link to={'/about'}>Item 1</Link></li>
            <li><Link to={'/'}>Item 2</Link></li>
          </ul>
        </details> */}

        {/* <div className="dropdown">
          
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
          <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </div> */}


        <div className="dropdown" >
          <div tabIndex={0} role="button" className="btn btn-sm btn-ghost flex items-center md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><Link to={'/about'}>Item 1</Link></li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li><a>Submenu 1</a></li>
                <li><a>Submenu 2</a></li>
              </ul>
            </li>
            <li><a>Item 3</a></li>
          </ul>
        </div>
        <a className="btn btn-ghost btn-sm text-md md:text-xl">memesition</a>
      </div>
      
      <div className="">
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to={'/about'}>Item 1</Link>
            </li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </details>
            </li>
            <li><a>Item 3</a></li>
          </ul>
        </div>
        <div className="navbar-end w-auto">
          <a className="btn btn-xs md:btn-md">Button</a>
        </div>
      </div>
    </div>
  )
}