"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ModelViewer } from "@/components/3d/model-viewer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Box, Upload, RotateCcw, Eye, FileText } from "lucide-react"
import Link from "next/link"

export default function ThreeDViewerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 md:pt-32">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                <Box className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-balance">
                Interactive 3D Property Viewer
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Explore properties in stunning 3D. Rotate, zoom, and pan to visualize every detail from any angle.
                Upload your SketchUp (.skp) designs for instant 3D preview.
              </p>
            </div>
          </div>
        </section>

        {/* 3D Viewer */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <ModelViewer showUpload={true} initialModel="sample" className="shadow-xl" />
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-10">Viewer Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">360° Rotation</h3>
                  <p className="text-sm text-muted-foreground">
                    Click and drag to rotate the model and view from any angle
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Zoom & Pan</h3>
                  <p className="text-sm text-muted-foreground">
                    Scroll to zoom in/out, right-click and drag to pan around
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">SKP Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload SketchUp (.skp) files to preview your own designs
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              Want a Custom 3D Design for Your Property?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Our expert architects can create detailed 3D visualizations of your dream home. Get started with our floor
              plan consultancy.
            </p>
            <Link href="/get-floor-plan">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <FileText className="mr-2 h-5 w-5" />
                Get Floor Plan & 3D Design
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
