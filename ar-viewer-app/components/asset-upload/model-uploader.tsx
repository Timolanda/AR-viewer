"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, File, AlertCircle } from "lucide-react"
import { convertToGLTF } from "@/lib/model-conversion"

// Supported 3D file formats
const SUPPORTED_FORMATS = [
  // Common 3D formats
  ".glb",
  ".gltf",
  ".fbx",
  ".obj",
  ".stl",
  ".dae",
  ".3ds",
  ".ply",
  // CAD formats
  ".step",
  ".stp",
  ".iges",
  ".igs",
  // Blender
  ".blend",
  // Maya
  ".ma",
  ".mb",
  // 3ds Max
  ".max",
  // Cinema 4D
  ".c4d",
  // SketchUp
  ".skp",
  // Wavefront Materials
  ".mtl",
  // Draco compressed
  ".drc",
  // USD formats
  ".usd",
  ".usda",
  ".usdc",
  ".usdz",
]

interface ModelUploaderProps {
  onUploadComplete: (modelUrl: string, metadata: any) => void
  maxFileSize?: number // in bytes
}

export function ModelUploader({ onUploadComplete, maxFileSize = 100 * 1024 * 1024 }: ModelUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      setProgress(0)
      setError(null)

      try {
        // Validate file size
        if (file.size > maxFileSize) {
          throw new Error(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit`)
        }

        // Start processing
        setProgress(10)

        // Convert to GLTF if needed
        let processedFile: File | ArrayBuffer = file
        if (!file.name.toLowerCase().endsWith(".glb") && !file.name.toLowerCase().endsWith(".gltf")) {
          setProgress(30)
          processedFile = await convertToGLTF(file)
          setProgress(60)
        }

        // In a real application, you would upload to your server here
        // For now, we'll create an object URL
        const url = URL.createObjectURL(new Blob([processedFile], { type: "model/gltf-binary" }))

        setProgress(90)

        // Get additional metadata
        const metadata = {
          originalName: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        }

        setProgress(100)
        onUploadComplete(url, metadata)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process file")
      } finally {
        setUploading(false)
      }
    },
    [maxFileSize, onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: SUPPORTED_FORMATS.reduce(
      (acc, format) => {
        acc[`model/${format.replace(".", "")}`] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    multiple: false,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8
          ${isDragActive ? "border-primary bg-primary/10" : "border-border"}
          transition-colors duration-200 ease-in-out
          cursor-pointer
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <Progress value={progress} className="w-full max-w-xs" />
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop the file here" : "Drag & drop a 3D model or click to select"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Supports: {SUPPORTED_FORMATS.join(", ")}</p>
                <p className="text-xs text-muted-foreground mt-1">Max file size: {maxFileSize / 1024 / 1024}MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" disabled={uploading}>
          <File className="h-4 w-4 mr-2" />
          Browse Files
        </Button>
        <Button
          variant="outline"
          disabled={uploading}
          onClick={() => window.open("https://example.com/model-guidelines", "_blank")}
        >
          Upload Guidelines
        </Button>
      </div>
    </div>
  )
}

