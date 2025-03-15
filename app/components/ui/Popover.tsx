import {
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  FloatingPortal,
  useId,
  useFloating,
  arrow
} from "@floating-ui/react";
import { ForwardRefExoticComponent, ReactNode, RefAttributes, useRef } from "react";

interface PopvoerProp {
  children: ReactNode
  InputEl: ForwardRefExoticComponent<RefAttributes<unknown>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  open: boolean
  arrowClassName: string
}

export function Portal({ children, InputEl, setOpen, open, arrowClassName }:PopvoerProp) {
  
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context, middlewareData } = useFloating({
    placement: 'bottom-end',
    open: open,
    onOpenChange: setOpen,
    middleware: [
      arrow({
        element: arrowRef,
      }),
      offset({
        mainAxis: 10,
        alignmentAxis: 0,
      }),
      flip({ fallbackAxisSideDirection: "none" }),
      shift({
        /* crossAxis: true,
        limiter: limitShift({
          offset: 200
        }), */
      })
    ],
    // strategy: 'absolute',
    whileElementsMounted: autoUpdate
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role
  ]);

  const headingId = useId();
  let arrowPlacement;
  if( middlewareData.offset?.y ) {
    if( middlewareData.offset?.placement=='top-end' ) {
      arrowPlacement= { 
        bottom: middlewareData.offset?.y,
        borderTopWidth: 11
      }
    }
    else {
      arrowPlacement= { 
        top: -middlewareData.offset?.y,
        borderBottomWidth: 11
      }
    }
  }
  
  return (
    <>
      <InputEl 
        ref={refs.setReference} 
        {...getReferenceProps()}
      />

      {open && (
        <FloatingPortal  >
          
          <div
            className=" z-50 "
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <div
              ref={arrowRef}
              style={{
                position: 'absolute',
                left: middlewareData.arrow?.x,
                ...arrowPlacement
                // top: middlewareData.arrow?.y,
              }}
              className={`h-0 w-0 border-x-8 border-x-transparent border-base-100 ${arrowClassName}`}
            />
            {children}
            
          </div>
        </FloatingPortal>
      )}
    </>
  )
}