import React, { useState } from 'react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface AnimationTimelineProps {
  duration: number
  currentTime: number
  isPlaying: boolean
  onTimeChange: (time: number) => void
  onPlay: () => void
  onPause: () => void
  onStop: () => void
}

export default function AnimationTimeline({ duration, currentTime, isPlaying, onTimeChange, onPlay, onPause, onStop }: AnimationTimelineProps) {
  //const [currentTime, setCurrentTime] = useState(0)
  //const [isPlaying, setIsPlaying] = useState(false)

  const handleTimeChange = (value: number[]) => {
    const newTime = value[0]
    onTimeChange(newTime)
  }

  const handlePlay = () => {
    //setIsPlaying(true)
    onPlay()
  }

  const handlePause = () => {
    //setIsPlaying(false)
    onPause()
  }

  const handleStop = () => {
    //setIsPlaying(false)
    //setCurrentTime(0)
    onStop()
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Animation Timeline</h2>
      <Slider
        min={0}
        max={duration}
        step={0.1}
        value={[currentTime]}
        onValueChange={handleTimeChange}
        className="mb-4"
      />
      <div className="flex justify-between">
        <Button onClick={isPlaying ? onPause : onPlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={handleStop}>Stop</Button>
      </div>
    </div>
  )
}

