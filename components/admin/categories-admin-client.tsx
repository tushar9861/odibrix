"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2, FolderOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/ui/image-upload"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  is_active: boolean
  display_order: number
  created_at: string
}

interface CategoriesAdminClientProps {
  initialCategories: Category[]
}

export function CategoriesAdminClient({ initialCategories }: CategoriesAdminClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    is_active: true,
    display_order: 0,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image_url: "",
      is_active: true,
      display_order: categories.length,
    })
    setEditingCategory(null)
    setError(null)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image_url: category.image_url || "",
      is_active: category.is_active ?? true,
      display_order: category.display_order || 0,
    })
    setError(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    const categoryData = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description,
      image_url: formData.image_url,
      is_active: formData.is_active,
      display_order: formData.display_order,
    }

    try {
      if (editingCategory) {
        const { error: updateError } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", editingCategory.id)

        if (updateError) {
          console.error("Update error:", updateError)
          throw new Error(updateError.message || "Failed to update category")
        }

        setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...categoryData } : c)))
      } else {
        const { data, error: insertError } = await supabase.from("categories").insert([categoryData]).select().single()

        if (insertError) {
          console.error("Insert error:", insertError)
          throw new Error(insertError.message || "Failed to create category")
        }

        setCategories([...categories, data])
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      console.error("Error saving category:", err)
      setError(err instanceof Error ? err.message : "Error saving category. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Properties in this category will not be deleted."))
      return

    const supabase = createClient()

    try {
      const { error: deleteError } = await supabase.from("categories").delete().eq("id", id)
      if (deleteError) throw deleteError
      setCategories(categories.filter((c) => c.id !== id))
      router.refresh()
    } catch (err) {
      console.error("Error deleting category:", err)
      alert("Error deleting category")
    }
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage property categories ({categories.length} total)</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" size="lg">
              <Plus className="h-5 w-5" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update category details" : "Create a new property category"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }}
                  placeholder="e.g., Luxury Villas"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., luxury-villas"
                />
                <p className="text-xs text-muted-foreground">Auto-generated from name</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category"
                  rows={3}
                />
              </div>

              <ImageUpload
                label="Category Image"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                onRemove={() => setFormData({ ...formData, image_url: "" })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                  className="bg-transparent"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Add Category"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category.id} className="overflow-hidden group">
              <div className="aspect-video relative bg-muted">
                {category.image_url ? (
                  <img
                    src={category.image_url || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Badge
                  className={`absolute top-2 right-2 ${category.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {category.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{category.name}</h3>
                  <Badge variant="outline">Order: {category.display_order}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {category.description || "No description"}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => openEditDialog(category)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No categories yet. Create your first category!</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Category
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
