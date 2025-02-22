"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack } from "lucide-react"

export default function Timeline() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const duration = 10 // seconds

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const reset = () => {
    setCurrentTime(0)
    setIsPlaying(false)
  }

  return (
    <div className="h-24 border-t bg-background p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="ghost" size="icon" onClick={togglePlayback}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={reset}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <Slider value={[currentTime]} max={duration} step={0.1} onValueChange={([value]) => setCurrentTime(value)} />
        </div>
        <div className="text-sm tabular-nums">
          {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
        </div>
      </div>
      <ScrollArea className="h-8">{/* Timeline tracks would go here */}</ScrollArea>
    </div>
  )
}

