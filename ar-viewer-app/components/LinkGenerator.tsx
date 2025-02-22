import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LinkGeneratorProps {
  arLink: string
}

export default function LinkGenerator({ arLink }: LinkGeneratorProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(arLink)
  }

  return (
    <div className="flex flex-col space-y-4">
      <Input value={arLink} readOnly />
      <Button onClick={handleCopyLink}>Copy Link</Button>
      <QRCodeSVG value={arLink} size={256} />
    </div>
  )
}

