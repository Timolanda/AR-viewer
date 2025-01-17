'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { convertToGLTF } from '../services/fileConversion'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.')
      return
    }

    try {
      const gltfBuffer = await convertToGLTF(file)
      const blob = new Blob([gltfBuffer], { type: 'model/gltf-binary' })
      const url = URL.createObjectURL(blob)
      setConvertedUrl(url)
      setError(null)
    } catch (error) {
      console.error('Error converting file:', error)
      setError('An error occurred while converting the file. Please try again.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AR Model Uploader</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Upload 3D Model (.fbx or .obj)</Label>
          <Input id="file-upload" type="file" accept=".fbx,.obj" onChange={handleFileChange} />
        </div>
        <Button onClick={handleUpload} disabled={!file}>
          Upload and Convert
        </Button>
        {error && <p className="text-red-500">{error}</p>}
        {convertedUrl && (
          <div>
            <p className="text-green-500">File converted successfully!</p>
            <a href={convertedUrl} download="converted_model.glb" className="text-blue-500 underline">
              Download Converted Model
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

