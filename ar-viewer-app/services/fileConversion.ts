import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'

export async function convertToGLTF(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (event) => {
      if (event.target?.result) {
        const buffer = event.target.result as ArrayBuffer
        const loader = file.name.endsWith('.fbx') ? new FBXLoader() : new OBJLoader()
        try {
          const object = await loader.loadAsync(URL.createObjectURL(new Blob([buffer])))
          const exporter = new GLTFExporter()
          exporter.parse(
            object,
            (gltf) => {
              resolve(gltf as ArrayBuffer)
            },
            (error) => {
              reject(error)
            },
            { binary: true }
          )
        } catch (error) {
          reject(error)
        }
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

