import { useEffect, useState } from "react";

interface WindowSize {
  width: number | undefined
  height: number | undefined
}
const useWindowSizeCustom = () => {
  	// 초기 state 값은 undefined로 세팅한다.
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width : undefined,
        height: undefined,
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {

            const handleResize = () => {
                setWindowSize({
					          // 현재 브라우저의 가로, 세로 길이로 셋팅
                    width: window?.innerWidth,
                    height: window?.innerHeight,

                });
            }

            // resize 이벤트가 발생할 때 handleResize 함수가 실행되도록 한다.
            window.addEventListener("resize", handleResize);

            // 초기값을 설정할 수 있도록 handleResize 함수를 한 번 실행시킨다.
            handleResize();

            // 이벤트 리스너를 제거하여 이벤트 리스너가 리사이즈될 때마다 계속해서 생겨나지 않도록 처리한다. (clean up)
            return () => window.removeEventListener("resize", handleResize);
        } else {
            return () => window.removeEventListener("resize", () => {
                return null
            });
        }
    }, []); // 컴포넌트가 처음 마운트 될때와 언마운트 될 때 실행
    return windowSize;
}

export default useWindowSizeCustom;





// import { useState, useEffect } from "react";

// 현재 window의 width와 height를 반환하는 함수
const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

// window의 크기를 추적하는 커스텀 훅
const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

// export default useWindowDimensions;