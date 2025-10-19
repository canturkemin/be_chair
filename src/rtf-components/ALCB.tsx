import { Text } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'
import { useProductStore } from '../store'
import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'

const groupMap: Record<string, string[]> = {
  Nose: ['Object1030', 'Object998'],
  BodyUp: ['Object1029', 'Object979'],
  BodySide: ['Object1028', 'Object1027', 'Object1026', 'Object1004'],
  LogoOutside: ['Object1012','Object1012', 'Object978'],
  Sole: ['Object1008', 'Object1006', 'nike swoosh met051'],
  Bottom: ['Object1009', 'Object1002'],
  BodyBack: ['Object1033', 'Object999'],
  FlapBack: ['Object1035', 'Object1007'],
  Inside: ['Object1032', 'Object1000'],
  FlapTop: [ 'Object980', 'Object1026', 'Object1034', 'Object1011', 'Object997','Object1037','Object990', 'Object992'],
  Laces: [
    'Object1015', 'Object1016', 'Object1017', 'Object1018',
    'Object1019', 'Object1020', 'Object1021', 'Object1022',
    'Object1023', 'Object1024', 'Object1025', 'Object1010', 'Object1014',

     'Object984', 'Object994', 'Object985', 'Object986', 'Object987', 'Object988', 'Object989', 'Object993', 'Object995', 'Object981',
      'Object983', 'Object982', 'Object991'
  ],
  LogoBoxUp: ['Object1013', 'Object996'],
  LogoBack: ['nike swoosh met054','nike swoosh met050'],
  LogoInside: ['Object1031', 'Object1003'],
  SuedeBack: ['Object1036', 'Object1005'],
}

export function Model(props: any) {
  const { scene } = useGLTF('/AirForce/AirForce.gltf') as any
  const groupColors = useProductStore((state) => state.groupColors)
  const customText = useProductStore((state) => state.customText)
  const [textPos, setTextPos] = useState<[number, number, number] | null>(null)
  const [suedeTarget, setSuedeTarget] = useState<THREE.Object3D | null>(null)
  const [suedeMesh, setSuedeMesh] = useState<THREE.Mesh | null>(null)

  useEffect(() => {
    const materialCache: Record<string, THREE.MeshStandardMaterial> = {}

    scene.traverse((child: any) => {

      if (child.isMesh) {
        for (const [group, names] of Object.entries(groupMap)) {
          if (names.includes(child.name)) {
            const colorHex = groupColors[group] ?? '#ffffff'

            // Remove textures and set up clean material
            if (child.material.map) {
              child.material.map.dispose()
              child.material.map = null
            }
            if (child.material.bumpMap) {
              child.material.bumpMap.dispose()
              child.material.bumpMap = null
            }
            if (child.material.normalMap) {
              child.material.normalMap.dispose()
              child.material.normalMap = null
            }
            if (child.material.roughnessMap) {
              child.material.roughnessMap.dispose()
              child.material.roughnessMap = null
            }

            child.material.transparent = false
            child.material.opacity = 1
            child.material.alphaTest = 0
            child.material.depthWrite = true
            child.material.depthTest = true

            child.material.dispose()

            if (!materialCache[colorHex]) {
              materialCache[colorHex] = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setStyle(colorHex),
                roughness: 0.5,
                metalness: 0.1,
                side: THREE.DoubleSide,
              })
            }

            child.material = materialCache[colorHex]
            child.castShadow = true
            child.receiveShadow = true

          if (child.name === 'Object1036') {
            setSuedeMesh(child)
          }

          }
        }
      }
    })
  }, [groupColors, scene])

return (
    <group {...props}>
      <primitive object={scene} />

      {suedeMesh && customText && (
        <group position={[0, 0.02, 0]} rotation={[0, 0, 0]} ref={(ref) => {
          if (ref) suedeMesh.add(ref) // ✅ Add text as child of mesh
        }}>
          <Text
            fontSize={1}
            color="red"
            anchorX="center"
            anchorY="middle"
          >
            {customText}
          </Text>
        </group>
      )}
    </group>
  )
}


useGLTF.preload('/AirForce/AirForce.gltf')
