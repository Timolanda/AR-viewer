"use client"
import { useProject } from "./project-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff, Trash2 } from "lucide-react"

export function PropertiesPanel() {
  const { project, updateSceneObject, removeSceneObject } = useProject()
  const selectedObject = project.sceneObjects.find((obj) => obj.id === project.selectedObjectId)

  if (!selectedObject) {
    return <div className="h-full p-4 flex items-center justify-center text-muted-foreground">No object selected</div>
  }

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    updateSceneObject(selectedObject.id, {
      position: {
        ...selectedObject.position,
        [axis]: value,
      },
    })
  }

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    updateSceneObject(selectedObject.id, {
      rotation: {
        ...selectedObject.rotation,
        [axis]: (value * Math.PI) / 180,
      },
    })
  }

  const handleScaleChange = (axis: "x" | "y" | "z", value: number) => {
    updateSceneObject(selectedObject.id, {
      scale: {
        ...selectedObject.scale,
        [axis]: value,
      },
    })
  }

  return (
    <div className="h-full border-l">
      <Tabs defaultValue="transform">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="transform">Transform</TabsTrigger>
          <TabsTrigger value="material">Material</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[calc(100vh-6rem)]">
          <TabsContent value="transform" className="m-0">
            <div className="p-4 space-y-4">
              <Accordion type="single" collapsible defaultValue="position">
                <AccordionItem value="position">
                  <AccordionTrigger>Position</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label>X</Label>
                        <Input
                          type="number"
                          value={selectedObject.position.x}
                          onChange={(e) => handlePositionChange("x", Number.parseFloat(e.target.value))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label>Y</Label>
                        <Input
                          type="number"
                          value={selectedObject.position.y}
                          onChange={(e) => handlePositionChange("y", Number.parseFloat(e.target.value))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label>Z</Label>
                        <Input
                          type="number"
                          value={selectedObject.position.z}
                          onChange={(e) => handlePositionChange("z", Number.parseFloat(e.target.value))}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="rotation">
                  <AccordionTrigger>Rotation</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>X Rotation</Label>
                        <Slider
                          value={[(selectedObject.rotation.x * 180) / Math.PI]}
                          min={0}
                          max={360}
                          step={1}
                          onValueChange={([value]) => handleRotationChange("x", value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Y Rotation</Label>
                        <Slider
                          value={[(selectedObject.rotation.y * 180) / Math.PI]}
                          min={0}
                          max={360}
                          step={1}
                          onValueChange={([value]) => handleRotationChange("y", value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Z Rotation</Label>
                        <Slider
                          value={[(selectedObject.rotation.z * 180) / Math.PI]}
                          min={0}
                          max={360}
                          step={1}
                          onValueChange={([value]) => handleRotationChange("z", value)}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="scale">
                  <AccordionTrigger>Scale</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Uniform Scale</Label>
                        <Slider
                          value={[selectedObject.scale.x]}
                          min={0.1}
                          max={10}
                          step={0.1}
                          onValueChange={([value]) => {
                            handleScaleChange("x", value)
                            handleScaleChange("y", value)
                            handleScaleChange("z", value)
                          }}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedObject.visible}
                    onCheckedChange={(checked) => updateSceneObject(selectedObject.id, { visible: checked })}
                  />
                  <Label>{selectedObject.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</Label>
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeSceneObject(selectedObject.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="material" className="m-0">
            {/* Material properties will be added in the next part */}
          </TabsContent>

          <TabsContent value="behavior" className="m-0">
            {/* Behavior properties will be added in the next part */}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

