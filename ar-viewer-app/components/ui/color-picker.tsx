"use client"

import { useState, useCallback } from "react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleColorChange = useCallback(
    (newColor: string) => {
      onChange(newColor)
      setIsOpen(false)
    },
    [onChange],
  )

  return (
    <div>
      <div
        style={{
          width: "32px",
          height: "32px",
          backgroundColor: color,
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            background: "white",
            border: "1px solid #ccc",
            padding: "8px",
          }}
        >
          <input type="color" value={color} onChange={(e) => handleColorChange(e.target.value)} />
        </div>
      )}
    </div>
  )
}

