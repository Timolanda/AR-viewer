"use client"
import { Button } from "@/components/ui/button"
import { Move, RotateCw, Maximize, Play, Share2, Download, QrCode } from "lucide-react"

export default function Toolbar() {
  return (
    <div className="h-12 border-b bg-background px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Move className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Play className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <QrCode className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

