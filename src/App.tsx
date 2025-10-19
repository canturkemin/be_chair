import { useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Ground } from './rtf-components/Ground'
import { Model } from './rtf-components/ALCB'
import { Configurator } from './components/Configurator'
import { Loader } from './rtf-components/Loader'
import * as THREE from 'three'
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

function ProductConfigurator({ glRef, sceneRef, cameraRef }: any) {
  const orbitRef = useRef<any>(null)

  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.object.rotation.y = Math.PI
      orbitRef.current.update()
    }
  }, [])

  return (
    <>
      <PerspectiveCamera
        makeDefault
        fov={50}
        position={[-5, 6, 3]}
        ref={(ref) => {
          if (ref) cameraRef.current = ref
        }}
      />
      <OrbitControls ref={orbitRef} target={[-1, 0.35, 0]} enableZoom={false} />
      <color args={[0, 0, 0]} attach="background" />
      <spotLight
        color={[0.8, 0.8, 0.8]}
        intensity={1.5}
        angle={0.6}
        penumbra={0.5}
        position={[5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
      <spotLight
        color={[0.8, 0.8, 0.8]}
        intensity={2}
        angle={0.6}
        penumbra={0.5}
        position={[-5, 4, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
      <Suspense fallback={<Loader />}>
        <Model scale={10} />
      </Suspense>
      <Ground />
    </>
  )
}

function App() {
  const glRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const sceneRef = useRef<any>(null)

  useEffect(() => {
    let lastX = 0
    let lastY = 0
    const buffer: any[] = []
    const uid = new URLSearchParams(window.location.search).get('uid') || 'anon'

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX
      lastY = e.clientY
    }

    document.addEventListener('mousemove', handleMouseMove)

    const eventCollectionInterval = setInterval(() => {
      buffer.push({
        type: 'mouseMove',
        x: lastX,
        y: lastY,
        t: Date.now(),
      })

      window.parent.postMessage({
        type: 'mouseMove',
        x: lastX,
        y: lastY,
        t: Date.now(),
      }, '*')
    }, 300)

    const uploadInterval = setInterval(() => {
      if (buffer.length === 0) return
      ;(async () => {
        try {
          await addDoc(collection(db, 'mouseEvents'), {
            uid,
            events: [...buffer],
            timestamp: new Date().toISOString(),
          })
          buffer.length = 0
        } catch (err) {
          console.error('Firebase upload error:', err)
        }
      })()
    }, 6000)

    const modal = document.createElement('div')
    modal.id = 'adviceModal'
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
      ">
        <div style="
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 400px;
          max-height: 80vh;
          overflow-y: auto;
          text-align: left;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        ">
          <h2 style="color: black;">Advice #1: Dare to be bold</h2>
          <p style="color: black;">Play with contrast and mix bold colors with subtle tones. Surprising combinations often stand out.</p>
          <br>
          <h2 style="color: black;">Advice #2: Tell a story</h2>
          <p style="color: black;">Draw inspiration from nature, art, architecture, or people. How might a leaf, a painting, a building, or a memory influence your design?</p>
          <br>
          <h2 style="color: black;">Advice #3: Think function and style</h2>
          <p style="color: black;">Design the sneaker to match a unique environment or lifestyle e.g., festivals, travel, work etc.</p>
          <br>
          <h2 style="color: black;">Advice #4: Reinvent the classic</h2>
          <p style="color: black;">Take a classic style and add a futuristic or nostalgic twist. Think of how trends from the ‘90s or 2050 might look here.</p>
          <br>
          <button id="closeAdviceModal" style="
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: black;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Close</button>
        </div>
      </div>
    `
    modal.style.display = 'none'
    document.body.appendChild(modal)

    const closeBtn = modal.querySelector('#closeAdviceModal')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const timestamp = Date.now(); // ✅ define timestamp

        modal.style.display = 'none'; // ✅ Hide the modal

        window.parent.postMessage(
          { type: 'adviceClosed', t: timestamp },
          '*'
        );

        // ✅ Send to Firestore
        (async () => {
          try {
            await addDoc(collection(db, 'colorClicks'), {
              uid,
              events: [
                {
                  type: 'adviceClosed',
                  timestamp: new Date(timestamp).toISOString(),
                },
              ],
              timestamp: new Date(timestamp).toISOString(),
            });
          } catch (err) {
            console.error('Firestore advice click log error:', err);
          }
        })();
      });
    }


    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      clearInterval(eventCollectionInterval)
      clearInterval(uploadInterval)
      modal.remove()
    }
  }, [])

  const handleNextClick = async () => {
    const gl = glRef.current
    const scene = sceneRef.current
    const uid = new URLSearchParams(window.location.search).get('uid') || 'anon'

    if (gl && scene) {
      const { width, height } = gl.domElement
      const aspect = width / height
      const fov = 50
      const near = 0.1
      const far = 1000

      const fixedCamera = new THREE.PerspectiveCamera(fov, aspect, near, far)
      fixedCamera.position.set(-5, 6, 3)
      fixedCamera.lookAt(0, 0, 0)
      fixedCamera.updateProjectionMatrix()

      gl.render(scene, fixedCamera)

      const originalCanvas = gl.domElement
      const originalDataURL = originalCanvas.toDataURL('image/png')

      const img = new Image()
      img.onload = async () => {
        const cropCanvas = document.createElement('canvas')
        const cropCtx = cropCanvas.getContext('2d')

        if (!cropCtx) {
          console.error('Could not get 2D context')
          return
        }

        const originalWidth = originalCanvas.width
        const originalHeight = originalCanvas.height
        const cropWidth = originalWidth * 0.6
        const cropHeight = originalHeight * 0.6
        const cropX = (originalWidth - cropWidth) / 2
        const cropY = (originalHeight - cropHeight) / 2

        cropCanvas.width = cropWidth
        cropCanvas.height = cropHeight

        cropCtx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

        const dataURL = cropCanvas.toDataURL('image/jpeg', 0.8)

        window.parent.postMessage({
          type: 'goToNextQuestion',
          image: dataURL,
          t: Date.now(),
        }, '*')

        try {
          await addDoc(collection(db, 'screenshots'), {
            uid,
            image: dataURL,
            timestamp: new Date().toISOString(),
          })
        } catch (err) {
          console.error('Firebase screenshot save error:', err)
        }
      }

      img.src = originalDataURL
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <button
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => {
  const timestamp = Date.now();
  const uid = new URLSearchParams(window.location.search).get("uid") || "anon";

  window.parent.postMessage({ type: 'adviceClicked', t: timestamp }, '*');

  const modal = document.getElementById('adviceModal');
  if (modal) modal.style.display = 'flex';

      (async () => {
        try {
          await addDoc(collection(db, 'colorClicks'), {
            uid,
            events: [
              {
                type: 'adviceClicked',
                timestamp: new Date(timestamp).toISOString(),
              },
            ],
            timestamp: new Date(timestamp).toISOString(),
          });
        } catch (err) {
          console.error('Firestore advice click log error:', err);
        }
      })();
    }}
      >
        Advice
      </button>

      <button
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 10,
          padding: '12px 24px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}
        onClick={handleNextClick}
      >
        Next Question
      </button>

      <Configurator />
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl, scene }) => {
          glRef.current = gl
          sceneRef.current = scene
        }}
      >
        <ProductConfigurator glRef={glRef} sceneRef={sceneRef} cameraRef={cameraRef} />
      </Canvas>
    </Suspense>
  )
}

export default App