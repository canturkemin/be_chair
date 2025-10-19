import { useCamera, Html } from "@react-three/drei"
import { useFrame } from '@react-three/fiber'
import { useRef } from "react"
import { useThree, } from "@react-three/fiber"

export function Loader(){
  const camera = useThree(state => state.camera)
  const meshRef = useRef<THREE.Group>(null!)
  useFrame(()=>{meshRef.current.lookAt( camera.position )})

  return (
    <group position={[0,1,0]} ref={meshRef} >
      {/* <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={'white'} /> */}
      <Html transform castShadow>
        <div className="custom-loader"></div>
      </Html>
    </group>
  )
}