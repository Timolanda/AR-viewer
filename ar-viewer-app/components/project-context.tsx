"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type * as THREE from "three"

interface Asset {
  id: string
  type: "model" | "image" | "video" | "audio"
  url: string
  name: string
}

interface SceneObject {
  id: string
  assetId: string
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: THREE.Vector3
  behaviors: Behavior[]
}

interface Behavior {
  id: string
  type: "trigger" | "animation" | "interaction"
  properties: Record<string, any>
}

interface ProjectState {
  assets: Asset[]
  sceneObjects: SceneObject[]
  selectedObjectId: string | null
  triggers: any[]
  animations: any[]
}

interface ProjectContextType {
  project: ProjectState
  addAsset: (asset: Asset) => void
  addSceneObject: (object: SceneObject) => void
  updateSceneObject: (id: string, updates: Partial<SceneObject>) => void
  removeSceneObject: (id: string) => void
  setSelectedObject: (id: string | null) => void
  addBehavior: (objectId: string, behavior: Behavior) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<ProjectState>({
    assets: [],
    sceneObjects: [],
    selectedObjectId: null,
    triggers: [],
    animations: [],
  })

  const addAsset = (asset: Asset) => {
    setProject((prev) => ({
      ...prev,
      assets: [...prev.assets, asset],
    }))
  }

  const addSceneObject = (object: SceneObject) => {
    setProject((prev) => ({
      ...prev,
      sceneObjects: [...prev.sceneObjects, object],
    }))
  }

  const updateSceneObject = (id: string, updates: Partial<SceneObject>) => {
    setProject((prev) => ({
      ...prev,
      sceneObjects: prev.sceneObjects.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj)),
    }))
  }

  const removeSceneObject = (id: string) => {
    setProject((prev) => ({
      ...prev,
      sceneObjects: prev.sceneObjects.filter((obj) => obj.id !== id),
    }))
  }

  const setSelectedObject = (id: string | null) => {
    setProject((prev) => ({
      ...prev,
      selectedObjectId: id,
    }))
  }

  const addBehavior = (objectId: string, behavior: Behavior) => {
    setProject((prev) => ({
      ...prev,
      sceneObjects: prev.sceneObjects.map((obj) =>
        obj.id === objectId ? { ...obj, behaviors: [...obj.behaviors, behavior] } : obj,
      ),
    }))
  }

  return (
    <ProjectContext.Provider
      value={{
        project,
        addAsset,
        addSceneObject,
        updateSceneObject,
        removeSceneObject,
        setSelectedObject,
        addBehavior,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}

