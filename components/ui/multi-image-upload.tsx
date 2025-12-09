"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, Loader2 } from "lucide-react"
import Image from "next/image"

interface MultiImageUploadProps {
  values: string[]
  onChange: (urls: string[]) => void
  label?: string
  maxImages?: number
}

export function MultiImageUpload({ values = [], onChange, label = "Images", maxImages = 10 }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (values.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    setIsUploading(true)
    setError(null)

    const newUrls: string[] = []

    try {
      for (const file of Array.from(files)) {
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
        newUrls.push(data.url)
      }

      onChange([...values, ...newUrls])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = async (index: number) => {
    const urlToRemove = values[index]

    try {
      // Try to delete from Blob storage
      await fetch("/api/upload/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToRemove }),
      })
    } catch (err) {
      console.error("Failed to delete image:", err)
    }

    const newValues = values.filter((_, i) => i !== index)
    onChange(newValues)
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {values.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
            <Image src={url || "/placeholder.svg"} alt={`Image ${index + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {values.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`
              aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer
              transition-colors hover:border-accent hover:bg-accent/5
              ${isUploading ? "opacity-50 pointer-events-none" : "border-border"}
            `}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            ) : (
              <>
                <Plus className="w-8 h-8 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add Image</span>
              </>
            )}
          </div>
        )}
      </div>

      <Input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />

      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        {values.length}/{maxImages} images uploaded
      </p>
    </div>
  )
}
