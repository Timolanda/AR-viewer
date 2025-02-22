export type TriggerType =
  | "tap"
  | "proximity"
  | "marker"
  | "gesture"
  | "time"
  | "visibility"
  | "collision"
  | "audio"
  | "scene-start"

export type ActionType =
  | "animate"
  | "playSound"
  | "show"
  | "hide"
  | "toggle"
  | "playVideo"
  | "stopVideo"
  | "moveToPosition"
  | "rotateToAngle"
  | "scale"
  | "followPath"
  | "orbit"
  | "bounce"
  | "spin"
  | "hover"
  | "physics"
  | "particle"
  | "changeColor"
  | "changeTexture"
  | "changeMaterial"
  | "playAnimation"
  | "stopAnimation"
  | "resetAnimation"
  | "sequence"
  | "group"
  | "loadScene"
  | "unloadScene"
  | "resetScene"
  | "custom"

export interface Behavior {
  id: string
  name: string
  trigger: TriggerType
  action: ActionType
  target?: string // ID of the target object
  properties: BehaviorProperties
  enabled: boolean
}

export interface BehaviorProperties {
  // Animation Properties
  duration?: number
  delay?: number
  easing?: string
  loop?: boolean
  yoyo?: boolean

  // Transform Properties
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
  scale?: { x: number; y: number; z: number }

  // Path Properties
  path?: { x: number; y: number; z: number }[]
  pathType?: "linear" | "bezier" | "catmull"

  // Physics Properties
  mass?: number
  velocity?: { x: number; y: number; z: number }
  force?: { x: number; y: number; z: number }
  gravity?: boolean
  collision?: boolean

  // Particle Properties
  particleCount?: number
  particleSize?: number
  particleColor?: string
  particleLifetime?: number
  particleSpeed?: number
  particleSpread?: number

  // Material Properties
  color?: string
  texture?: string
  metalness?: number
  roughness?: number
  emissive?: string
  opacity?: number

  // Audio Properties
  audioUrl?: string
  volume?: number
  loop?: boolean

  // Video Properties
  videoUrl?: string
  autoplay?: boolean

  // Proximity Properties
  distance?: number
  fadeDistance?: number

  // Custom Properties
  [key: string]: any
}

