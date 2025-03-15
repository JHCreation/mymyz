import { Parallax, ParallaxLayer } from '@react-spring/parallax'

export default function Part1() {
  return (
    <>
    {/* <Parallax pages={2}> */}
      <ParallaxLayer offset={2} speed={0.5}>
        <h1>첫 번째 레이어</h1>
      </ParallaxLayer>
      <ParallaxLayer offset={3} speed={2}>
        <h2>두 번째 레이어</h2>
      </ParallaxLayer>
    {/* </Parallax> */}
    </>
  )
}