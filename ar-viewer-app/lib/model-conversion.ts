import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader"
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"

export async function convertToGLTF(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (event) => {
      if (!event.target?.result) {
        reject(new Error("Failed to read file"))
        return
      }

      const buffer = event.target.result as ArrayBuffer
      const extension = file.name.split(".").pop()?.toLowerCase()
      let object: THREE.Object3D | null = null

      try {
        // Load the model based on its extension
        switch (extension) {
          case "fbx":
            object = await new FBXLoader().loadAsync(URL.createObjectURL(new Blob([buffer])))
            break
          case "obj":
            object = await new OBJLoader().loadAsync(URL.createObjectURL(new Blob([buffer])))
            break
          case "stl":
            const geometry = await new STLLoader().loadAsync(URL.createObjectURL(new Blob([buffer])))
            const material = new THREE.MeshStandardMaterial()
            object = new THREE.Mesh(geometry, material)
            break
          case "dae":
            const collada = await new ColladaLoader().loadAsync(URL.createObjectURL(new Blob([buffer])))
            object = collada.scene
            break
          case "ply":
            const plyGeometry = await new PLYLoader().loadAsync(URL.createObjectURL(new Blob([buffer])))
            const plyMaterial = new THREE.MeshStandardMaterial()
            object = new THREE.Mesh(plyGeometry, plyMaterial)
            break
          default:
            throw new Error(`Unsupported file format: .${extension}`)
        }

        // Export to GLTF
        const exporter = new GLTFExporter()
        exporter.parse(
          object,
          (gltf) => {
            resolve(gltf as ArrayBuffer)
          },
          (error) => {
            reject(error)
          },
          { binary: true },
        )
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

