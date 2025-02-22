"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BehaviorEditorProps {
  behavior: any
  onChange: (updates: any) => void
}

export default function BehaviorEditor({ behavior, onChange }: BehaviorEditorProps) {
  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Trigger Type</Label>
        <Select value={behavior.triggerType} onValueChange={(value) => onChange({ ...behavior, triggerType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select trigger type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tap">Tap</SelectItem>
            <SelectItem value="proximity">Proximity</SelectItem>
            <SelectItem value="marker">Image Marker</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Action</Label>
        <Select value={behavior.action} onValueChange={(value) => onChange({ ...behavior, action: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="animate">Animate</SelectItem>
            <SelectItem value="playSound">Play Sound</SelectItem>
            <SelectItem value="show">Show Object</SelectItem>
            <SelectItem value="hide">Hide Object</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {behavior.action === "animate" && (
        <div className="space-y-2">
          <Label>Animation Properties</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Duration (s)</Label>
              <Input
                type="number"
                value={behavior.duration}
                onChange={(e) => onChange({ ...behavior, duration: e.target.value })}
              />
            </div>
            <div>
              <Label>Easing</Label>
              <Select value={behavior.easing} onValueChange={(value) => onChange({ ...behavior, easing: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select easing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="easeIn">Ease In</SelectItem>
                  <SelectItem value="easeOut">Ease Out</SelectItem>
                  <SelectItem value="easeInOut">Ease In Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

