import { forwardRef, ReactNode, useEffect, useState } from "react";
import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  useId,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useTransitionStyles
} from "@floating-ui/react";

const ani_fadein= 'animate-fadein'
const ani_fadeout= 'animate-fadeout'

const ani_appear= 'animate-appear'
const ani_disappear= 'animate-disappear'

interface DialogAniType {
  overlay: {
    on: string
    off: string
  }
  content: {
    on: string
    off: string
  }
}
const setAnimations= (animation):DialogAniType=> {
  let overlayOn= ani_fadein
  let overlayOff= ani_fadeout
  let contentOn= ani_appear
  let contentOff= ani_disappear
  if( !animation ) {
    overlayOn= overlayOff= contentOn= contentOff= 'animate-none'
  }
  if( typeof animation == 'object' ) {
    return animation
  }

  return {
    overlay: {
      on: overlayOn,
      off: overlayOff
    },
    content: {
      on: contentOn, 
      off: contentOff
    }
  }
}

export default function Dialog({ root, open, setOpen, children, outsidePress=true, escapeKey=true, contentClassName, overLayClassName, full, lockScroll=true, animation=true, duration=300 }:
  { 
    root?: HTMLElement | null | React.MutableRefObject<HTMLElement | null>
    open: boolean 
    setOpen?: any 
    children: ReactNode 
    outsidePress?: boolean
    escapeKey?: boolean
    contentClassName?: string
    overLayClassName?: string
    full?: boolean
    lockScroll?: boolean
    animation?: DialogAniType | boolean
    duration?: number
  }
) {

  const { refs, context } = useFloating({
    open: open,
    onOpenChange: setOpen,
  });

  const {isMounted, styles} = useTransitionStyles(context, {
    duration: duration
  });

  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { 
    outsidePressEvent: "mousedown",
    outsidePress,
    escapeKey,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    role,
    dismiss
  ]);

  const headingId = useId();
  const descriptionId = useId();

  // console.log(isMounted, open, styles, lockScroll)

  /* let aniFade= open ? ani_fadein : ani_fadeout
  let aniAppear= open ? ani_appear : ani_disappear
  if( !animation ) {
    aniFade = open ? ani_nofadein : ani_nofadeout
    aniAppear= open ? ani_noappear : ani_nodisappear
  } */
  const ani= setAnimations(animation)
  return (
    // on && 
    <>
      
      <FloatingPortal root={root}>
        {isMounted && (
          <FloatingOverlay className={`flex ${!full && 'py-5'} justify-center bg-black bg-opacity-40 z-[999] ${open?ani.overlay.on:ani.overlay.off} ${overLayClassName}`} lockScroll={lockScroll}>
            <FloatingFocusManager context={context}>
              <>
              <div
                className={`focus-visible:outline-none ${open?ani.content.on:ani.content.off} ${contentClassName} flex ${full && 'w-full'}`}
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                {children}
              </div>
              </>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
}


const DialogContent = ({ 
  children, open, headingId, descriptionId, getFloatingProps, ref
}:{
  children: ReactNode
  open:boolean
  headingId?:string
  descriptionId?:string
  getFloatingProps?: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>
  ref?: ((node: HTMLElement | null) => void) & ((node: HTMLElement | null) => void)
}
)=> {
  const props= getFloatingProps ? {...getFloatingProps()} : null
  // console.log({...getFloatingProps()}, props)
  return (
    <div
      className={`modal-box Dialog my-auto- focus-visible:outline-none ${open ? 'animate-appear':'animate-disappear'}`}
      ref={ref}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      {...props}
    >
      {children}
    </div>
  );
};
