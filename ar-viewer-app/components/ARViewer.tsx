import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

interface ARViewerProps {
  models: { id: string; url: string }[]
  onModelPlaced: (modelId: string, position: THREE.Vector3) => void
  audioUrl?: string
  particleOptions?: {
    position: THREE.Vector3
    color: THREE.Color
    size: number
    count: number
  }
  onAnimationUpdate?: (time: number) => void
}

export default function ARViewer({ models, onModelPlaced, audioUrl, particleOptions, onAnimationUpdate }: ARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedModel, setSelectedModel] = useState<THREE.Object3D | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true
    containerRef.current.appendChild(renderer.domElement)

    let arButton;
    if ('xr' in navigator) {
      arButton = ARButton.createButton(renderer, { 
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body }
      });
      containerRef.current.appendChild(arButton);
    } else {
      const warning = document.createElement('div');
      warning.textContent = 'WebXR not supported on this browser';
      warning.style.position = 'absolute';
      warning.style.top = '50%';
      warning.style.left = '50%';
      warning.style.transform = 'translate(-50%, -50%)';
      containerRef.current.appendChild(warning);
    }


    // Advanced Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(0, 1, 0)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 1, 100)
    pointLight.position.set(0, 10, 0)
    scene.add(pointLight)

    // Post-processing for enhanced visuals
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    composer.addPass(bloomPass)

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)

    const loadedModels: { [key: string]: THREE.Object3D & { animations?: THREE.AnimationClip[] } } = {}
    const mixers: THREE.AnimationMixer[] = []

    models.forEach((model) => {
      loader.load(
        model.url,
        (gltf) => {
          loadedModels[model.id] = gltf.scene;
          if (gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            mixers.push(mixer);
            gltf.animations.forEach((clip) => {
              const action = mixer.clipAction(clip);
              action.play();
            });
          }
          scene.add(gltf.scene);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
        }
      );
    });


    function createParticleSystem(options: ARViewerProps['particleOptions']) {
      if (!options) return null;

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(options.count * 3);
      const colors = new Float32Array(options.count * 3);

      for (let i = 0; i < options.count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 5;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

        colors[i * 3] = options.color.r;
        colors[i * 3 + 1] = options.color.g;
        colors[i * 3 + 2] = options.color.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: options.size,
        vertexColors: true,
      });

      return new THREE.Points(geometry, material);
    }

    let particleSystem: THREE.Points | null = null
    if (particleOptions) {
      particleSystem = createParticleSystem(particleOptions)
      if (particleSystem) scene.add(particleSystem)
    }

    // Audio
    let audio: THREE.Audio | null = null
    if (audioUrl) {
      const listener = new THREE.AudioListener()
      camera.add(listener)
      audio = new THREE.Audio(listener)
      const audioLoader = new THREE.AudioLoader()
      audioLoader.load(
        audioUrl,
        (buffer) => {
          if (audio) {
            audio.setBuffer(buffer)
            audio.setLoop(true)
            audio.setVolume(0.5)
          }
        },
        undefined,
        (error) => {
          console.error('Error loading audio:', error)
        }
      )
    }

    const raycaster = new THREE.Raycaster()
    const transformControls = new TransformControls(camera, renderer.domElement)
    transformControls.addEventListener('dragging-changed', (event) => {
      renderer.domElement.style.pointerEvents = event.value ? 'none' : 'auto'
    })
    scene.add(transformControls)

    renderer.xr.addEventListener('sessionstart', () => {
      const session = renderer.xr.getSession()
      session.addEventListener('select', onSelect)
    })

    function onSelect(event: any) {
      const controller = event.target
      const intersections = getIntersections(controller)

      if (intersections.length > 0) {
        const intersection = intersections[0]
        const object = intersection.object

        if (object === selectedModel) {
          // Toggle transform mode
          if (transformControls.mode === 'translate') {
            transformControls.setMode('rotate')
          } else if (transformControls.mode === 'rotate') {
            transformControls.setMode('scale')
          } else {
            transformControls.detach()
            setSelectedModel(null)
          }
        } else {
          setSelectedModel(object)
          transformControls.attach(object)
          transformControls.setMode('translate')
        }

        // Trigger animation or sound on tap
        if (audio && !audio.isPlaying) {
          audio.play()
        }
        if (mixers.length > 0) {
          mixers.forEach((mixer) => {
            mixer.time = 0 // Reset animation
            mixer.update(0)
          })
        }
      } else if (selectedModel) {
        // Place the selected model
        const model = loadedModels[selectedModel.name]
        if (model) {
          const clone = model.clone()
          clone.position.set(0, 0, -1).applyMatrix4(controller.matrixWorld)
          scene.add(clone)
          onModelPlaced(selectedModel.name, clone.position)
        }
      }
    }

    function getIntersections(controller: THREE.XRTargetRaySpace) {
      const tempMatrix = new THREE.Matrix4()
      tempMatrix.identity().extractRotation(controller.matrixWorld)

      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld)
      raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix)

      return raycaster.intersectObjects(scene.children, true)
    }

    const clock = new THREE.Clock()

    function animate() {
      renderer.setAnimationLoop((time) => {
        const delta = clock.getDelta()

        mixers.forEach((mixer) => mixer.update(delta))

        if (particleSystem) {
          particleSystem.rotation.y += 0.001
        }

        if (onAnimationUpdate) {
          onAnimationUpdate(time / 1000) // Convert to seconds
        }

        composer.render()
      })
    }

    animate()

    return () => {
      renderer.setAnimationLoop(null)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
        if(arButton) containerRef.current.removeChild(arButton)
      }
    }
  }, [models, onModelPlaced, audioUrl, particleOptions, onAnimationUpdate])

  return <div ref={containerRef} className="w-full h-screen" />
}

