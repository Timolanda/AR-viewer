import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ARSceneManagerProps {
  models: { id: string; name: string; url: string }[]
  onAddModel: (modelId: string) => void
  onRemoveModel: (modelId: string) => void
}

export default function ARSceneManager({ models, onAddModel, onRemoveModel }: ARSceneManagerProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Scene Manager</h2>
      <ScrollArea className="h-64 mb-4">
        {models.map((model) => (
          <div key={model.id} className="flex items-center justify-between mb-2">
            <Label htmlFor={`model-${model.id}`} className="flex items-center">
              <Input
                type="radio"
                id={`model-${model.id}`}
                name="selectedModel"
                value={model.id}
                checked={selectedModel === model.id}
                onChange={() => setSelectedModel(model.id)}
                className="mr-2"
              />
              {model.name}
            </Label>
            <Button variant="outline" size="sm" onClick={() => onRemoveModel(model.id)}>
              Remove
            </Button>
          </div>
        ))}
      </ScrollArea>
      <Button
        onClick={() => selectedModel && onAddModel(selectedModel)}
        disabled={!selectedModel}
        className="w-full"
      >
        Add Selected Model to Scene
      </Button>
    </div>
  )
}

