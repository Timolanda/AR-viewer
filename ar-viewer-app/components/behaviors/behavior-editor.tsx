"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Behavior, TriggerType, ActionType } from "./behavior-types"
import { ColorPicker } from "../ui/color-picker"

interface BehaviorEditorProps {
  behavior: Behavior
  onChange: (updates: Partial<Behavior>) => void
  onDelete: () => void
}

export function BehaviorEditor({ behavior, onChange, onDelete }: BehaviorEditorProps) {
  const triggers: { value: TriggerType; label: string }[] = [
    { value: "tap", label: "Tap" },
    { value: "proximity", label: "Proximity" },
    { value: "marker", label: "Image Marker" },
    { value: "gesture", label: "Gesture" },
    { value: "time", label: "Time-based" },
    { value: "visibility", label: "Visibility" },
    { value: "collision", label: "Collision" },
    { value: "audio", label: "Audio Detection" },
    { value: "scene-start", label: "Scene Start" },
  ]

  const actions: { value: ActionType; label: string }[] = [
    { value: "animate", label: "Animate" },
    { value: "playSound", label: "Play Sound" },
    { value: "show", label: "Show" },
    { value: "hide", label: "Hide" },
    { value: "toggle", label: "Toggle Visibility" },
    { value: "playVideo", label: "Play Video" },
    { value: "moveToPosition", label: "Move To Position" },
    { value: "rotateToAngle", label: "Rotate To Angle" },
    { value: "scale", label: "Scale" },
    { value: "followPath", label: "Follow Path" },
    { value: "orbit", label: "Orbit" },
    { value: "bounce", label: "Bounce" },
    { value: "spin", label: "Spin" },
    { value: "hover", label: "Hover" },
    { value: "physics", label: "Physics" },
    { value: "particle", label: "Particle Effect" },
    { value: "changeColor", label: "Change Color" },
    { value: "changeTexture", label: "Change Texture" },
    { value: "changeMaterial", label: "Change Material" },
    { value: "playAnimation", label: "Play Animation" },
    { value: "sequence", label: "Sequence" },
    { value: "group", label: "Group Actions" },
    { value: "custom", label: "Custom Script" },
  ]

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Behavior Name</Label>
        <Input
          value={behavior.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter behavior name"
        />
      </div>

      <div className="space-y-2">
        <Label>Trigger</Label>
        <Select value={behavior.trigger} onValueChange={(value: TriggerType) => onChange({ trigger: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select trigger" />
          </SelectTrigger>
          <SelectContent>
            {triggers.map((trigger) => (
              <SelectItem key={trigger.value} value={trigger.value}>
                {trigger.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Action</Label>
        <Select value={behavior.action} onValueChange={(value: ActionType) => onChange({ action: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            {actions.map((action) => (
              <SelectItem key={action.value} value={action.value}>
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="properties">
          <AccordionTrigger>Properties</AccordionTrigger>
          <AccordionContent>
            {behavior.action === "animate" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={behavior.properties.duration}
                    onChange={(e) =>
                      onChange({
                        properties: { ...behavior.properties, duration: Number.parseFloat(e.target.value) },
                      })
                    }
                    min={0}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Delay (seconds)</Label>
                  <Input
                    type="number"
                    value={behavior.properties.delay}
                    onChange={(e) =>
                      onChange({
                        properties: { ...behavior.properties, delay: Number.parseFloat(e.target.value) },
                      })
                    }
                    min={0}
                    step={0.1}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={behavior.properties.loop}
                    onCheckedChange={(checked) =>
                      onChange({
                        properties: { ...behavior.properties, loop: checked },
                      })
                    }
                  />
                  <Label>Loop</Label>
                </div>
              </div>
            )}

            {behavior.action === "particle" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Particle Count</Label>
                  <Slider
                    value={[behavior.properties.particleCount || 1000]}
                    min={100}
                    max={10000}
                    step={100}
                    onValueChange={([value]) =>
                      onChange({
                        properties: { ...behavior.properties, particleCount: value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Particle Size</Label>
                  <Slider
                    value={[behavior.properties.particleSize || 0.1]}
                    min={0.01}
                    max={1}
                    step={0.01}
                    onValueChange={([value]) =>
                      onChange({
                        properties: { ...behavior.properties, particleSize: value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Particle Color</Label>
                  <ColorPicker
                    color={behavior.properties.particleColor || "#ffffff"}
                    onChange={(color) =>
                      onChange({
                        properties: { ...behavior.properties, particleColor: color },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {behavior.action === "physics" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mass</Label>
                  <Input
                    type="number"
                    value={behavior.properties.mass}
                    onChange={(e) =>
                      onChange({
                        properties: { ...behavior.properties, mass: Number.parseFloat(e.target.value) },
                      })
                    }
                    min={0.1}
                    step={0.1}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={behavior.properties.gravity}
                    onCheckedChange={(checked) =>
                      onChange({
                        properties: { ...behavior.properties, gravity: checked },
                      })
                    }
                  />
                  <Label>Enable Gravity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={behavior.properties.collision}
                    onCheckedChange={(checked) =>
                      onChange({
                        properties: { ...behavior.properties, collision: checked },
                      })
                    }
                  />
                  <Label>Enable Collision</Label>
                </div>
              </div>
            )}

            {/* Add more action-specific property editors here */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center justify-between pt-4">
        <Switch checked={behavior.enabled} onCheckedChange={(checked) => onChange({ enabled: checked })} />
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete Behavior
        </Button>
      </div>
    </div>
  )
}

