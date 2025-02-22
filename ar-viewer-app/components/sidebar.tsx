"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProject } from "./project-context"
import { Upload, Image, Video, Music, Box, Wand2 } from "lucide-react"

export default function Sidebar() {
  const { project, addAsset } = useProject()
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // In a real app, you would upload to a server
      const url = URL.createObjectURL(file)
      addAsset({
        id: Math.random().toString(),
        type: getAssetType(file.type),
        url,
        name: file.name,
      })
    } catch (error) {
      console.error("Error uploading file:", error)
    }
    setUploading(false)
  }

  const getAssetType = (mimeType: string): "model" | "image" | "video" | "audio" => {
    if (mimeType.includes("model")) return "model"
    if (mimeType.includes("image")) return "image"
    if (mimeType.includes("video")) return "video"
    if (mimeType.includes("audio")) return "audio"
    return "model" // default to model for unknown types
  }

  return (
    <div className="w-64 border-r bg-background p-4">
      <Tabs defaultValue="assets">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="behaviors">Behaviors</TabsTrigger>
        </TabsList>
        <TabsContent value="assets" className="mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg hover:bg-accent">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <span className="mt-2 block text-sm text-muted-foreground">Upload Files</span>
                  </div>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".glb,.gltf,.fbx,.obj,.png,.jpg,.jpeg,.mp4,.mp3"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </Label>
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="grid grid-cols-2 gap-2">
                {project.assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="aspect-square border rounded-lg p-2 flex flex-col items-center justify-center hover:bg-accent cursor-pointer"
                  >
                    {asset.type === "model" && <Box className="h-8 w-8" />}
                    {asset.type === "image" && <Image className="h-8 w-8" />}
                    {asset.type === "video" && <Video className="h-8 w-8" />}
                    {asset.type === "audio" && <Music className="h-8 w-8" />}
                    <span className="mt-2 text-xs truncate w-full text-center">{asset.name}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent value="behaviors" className="mt-4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              <div className="p-2 border rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Wand2 className="h-4 w-4" />
                  <span>Tap to Animate</span>
                </div>
              </div>
              {/* Add more behavior templates */}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

