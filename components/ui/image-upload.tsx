"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  label?: string
  accept?: string
}

export function ImageUpload({ value, onChange, onRemove, label = "Image", accept = "image/*" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = async () => {
    if (value && onRemove) {
      try {
        // Try to delete from Blob storage
        await fetch("/api/upload/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        })
      } catch (err) {
        console.error("Failed to delete image:", err)
      }
      onRemove()
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border group">
          <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button type="button" variant="destructive" size="sm" onClick={handleRemove}>
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors hover:border-accent hover:bg-accent/5
            ${isUploading ? "opacity-50 pointer-events-none" : ""}
            ${error ? "border-destructive" : "border-border"}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm font-medium">Click to upload image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 10MB</p>
            </div>
          )}
        </div>
      )}

      <Input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
