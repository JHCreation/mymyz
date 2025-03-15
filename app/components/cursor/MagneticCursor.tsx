import { animated, useScroll, useSpring } from "@react-spring/web";
import { ReactNode } from "react";

interface Props {
  className?: string
  children: ReactNode
  [key: string]: any;
}
export const MagneticCursor= ({ className, children, ...props }:Props)=> {
  const onMove= (e)=> {
    const single= e.currentTarget
    const triggerDistance = single.getBoundingClientRect().width;
    const cursorPosition = {
      left: e.clientX,
      top: e.clientY
    };
    const targetPosition = {
      left:
        single.getBoundingClientRect().left +
        single.getBoundingClientRect().width / 2,
      top:
        single.getBoundingClientRect().top +
        single.getBoundingClientRect().height / 2
    };
    const distance = {
      x: targetPosition.left - cursorPosition.left,
      y: targetPosition.top - cursorPosition.top
    };

    const angle = Math.atan2(distance.x, distance.y);
    const hypotenuse = Math.sqrt(
      distance.x * distance.x + distance.y * distance.y
    );
    if (hypotenuse < triggerDistance) {
      api.start({
        to: {
          x: -((Math.sin(angle) * hypotenuse) / 2),
          y: -((Math.cos(angle) * hypotenuse) / 2),
        },
        // immediate: true,
      })
      
    }
    // console.log(cursorPosition.left, cursorPosition.top, e.currentTarget.getBoundingClientRect())

    if (e.type === 'mouseleave') {
      e.target.style.transform = '';
      api.start({
        to: {
          x: 0,
          y: 0,
        },
        // immediate: true,
      })
    }
  }

  const [spring, api]= useSpring(()=> ({
    from: {
      x: 0,
      y: 0,
    },
    config: {
      mass: 2,
      friction: 22,
      tension: 400,
    }
  }))
  return (
    
    <animated.div 
      style={spring}
      onMouseMove={onMove}
      onMouseLeave={onMove}
      className={className}
      {...props}
    >
      {children}
    </animated.div>
    
  )
}

