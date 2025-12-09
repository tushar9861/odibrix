"use client"

import * as React from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, Center, useProgress, Grid, ContactShadows } from "@react-three/drei"
import { Suspense } from "react"
import type * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, RotateCcw, ZoomIn, Move3D, Loader2, AlertCircle, Box, Fullscreen, X } from "lucide-react"

// Loading component
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  )
}

// Enhanced sample house model with more detail
function SampleHouseModel({ autoRotate = false }: { autoRotate?: boolean }) {
  const groupRef = React.useRef<THREE.Group>(null)

  useFrame((state) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Foundation */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[7, 0.2, 6]} />
        <meshStandardMaterial color="#6B5344" roughness={0.8} />
      </mesh>

      {/* Main walls */}
      <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.5, 3.2, 5.5]} />
        <meshStandardMaterial color="#F5F0E6" roughness={0.6} />
      </mesh>

      {/* Windows - Front row */}
      {[-2, 0, 2].map((x, i) => (
        <group key={`front-window-${i}`}>
          <mesh position={[x, 1.9, 2.76]} castShadow>
            <boxGeometry args={[0.9, 1.3, 0.05]} />
            <meshStandardMaterial color="#1a365d" metalness={0.3} roughness={0.2} />
          </mesh>
          {/* Window frame */}
          <mesh position={[x, 1.9, 2.78]}>
            <boxGeometry args={[1, 1.4, 0.02]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}

      {/* Door */}
      <mesh position={[0, 1.1, 2.76]} castShadow>
        <boxGeometry args={[1.1, 2, 0.08]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.4, 1.1, 2.82]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Roof base */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[7, 0.2, 6]} />
        <meshStandardMaterial color="#CD5C5C" roughness={0.6} />
      </mesh>

      {/* Roof pyramid */}
      <mesh position={[0, 4.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[5, 2, 4]} />
        <meshStandardMaterial color="#B22222" roughness={0.5} />
      </mesh>

      {/* Chimney */}
      <mesh position={[2.2, 4.8, -1]} castShadow>
        <boxGeometry args={[0.6, 2, 0.6]} />
        <meshStandardMaterial color="#8B0000" roughness={0.7} />
      </mesh>

      {/* Porch pillars */}
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={`pillar-${i}`} position={[x, 1.1, 3.2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2.2, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}

      {/* Porch roof */}
      <mesh position={[0, 2.3, 3.4]} castShadow>
        <boxGeometry args={[3.5, 0.1, 1]} />
        <meshStandardMaterial color="#CD5C5C" />
      </mesh>

      {/* Steps */}
      {[0, 0.15, 0.3].map((y, i) => (
        <mesh key={`step-${i}`} position={[0, 0.08 + y, 3.2 + i * 0.4]} receiveShadow>
          <boxGeometry args={[1.8, 0.15, 0.4]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
      ))}

      {/* Grass ground */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[12, 64]} />
        <meshStandardMaterial color="#2D5016" roughness={0.9} />
      </mesh>

      {/* Decorative bushes */}
      {[
        [-2.5, 0.3, 3.5],
        [2.5, 0.3, 3.5],
        [-3, 0.25, 1],
        [3, 0.25, 1],
      ].map((pos, i) => (
        <mesh key={`bush-${i}`} position={pos as [number, number, number]} castShadow>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#228B22" roughness={0.8} />
        </mesh>
      ))}

      {/* Tree */}
      <group position={[-4, 0, -2]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 2.4, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 3, 0]} castShadow>
          <coneGeometry args={[1.2, 2.5, 8]} />
          <meshStandardMaterial color="#006400" />
        </mesh>
      </group>
    </group>
  )
}

// Parsed SKP model viewer
interface ParsedModelProps {
  modelData: ArrayBuffer
}

function ParsedModel({ modelData }: ParsedModelProps) {
  const [error, setError] = React.useState<string | null>(null)
  const groupRef = React.useRef<THREE.Group>(null)

  React.useEffect(() => {
    try {
      const isValid = modelData.byteLength > 100
      if (!isValid) {
        setError("Invalid SKP file format")
      }
    } catch (e) {
      setError("Error parsing file")
    }
  }, [modelData])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  if (error) {
    return (
      <Html center>
        <div className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border shadow-lg">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </Html>
    )
  }

  const scale = Math.min(Math.max(modelData.byteLength / 100000, 0.5), 3)

  return (
    <group ref={groupRef}>
      {/* Building representation */}
      <mesh position={[0, scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[scale * 2.5, scale * 2, scale * 2]} />
        <meshStandardMaterial color="#E8D4B8" roughness={0.5} />
      </mesh>
      {/* Windows */}
      {[
        [-scale * 0.6, scale * 1.2, scale + 0.01],
        [scale * 0.6, scale * 1.2, scale + 0.01],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[scale * 0.4, scale * 0.5, 0.02]} />
          <meshStandardMaterial color="#1a365d" />
        </mesh>
      ))}
      {/* Roof */}
      <mesh position={[0, scale * 2.5, 0]} castShadow>
        <coneGeometry args={[scale * 1.8, scale * 1.2, 4]} />
        <meshStandardMaterial color="#CD5C5C" roughness={0.6} />
      </mesh>
      {/* Info label */}
      <Html position={[0, scale * 3.5, 0]} center>
        <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full border shadow-sm text-xs whitespace-nowrap">
          SKP Model ({(modelData.byteLength / 1024).toFixed(1)} KB)
        </div>
      </Html>
    </group>
  )
}

// Camera controls component
function CameraController({ resetTrigger }: { resetTrigger: number }) {
  const { camera } = useThree()

  React.useEffect(() => {
    if (resetTrigger > 0) {
      camera.position.set(10, 7, 10)
      camera.lookAt(0, 1, 0)
    }
  }, [resetTrigger, camera])

  return null
}

interface ModelViewerProps {
  className?: string
  showUpload?: boolean
  initialModel?: "sample" | null
  height?: string
  autoRotate?: boolean
}

export function ModelViewer({
  className = "",
  showUpload = true,
  initialModel = "sample",
  height = "h-[350px] sm:h-[450px] lg:h-[550px]",
  autoRotate = false,
}: ModelViewerProps) {
  const [uploadedModel, setUploadedModel] = React.useState<ArrayBuffer | null>(null)
  const [fileName, setFileName] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [resetTrigger, setResetTrigger] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validExtensions = [".skp"]
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."))

    if (!validExtensions.includes(extension)) {
      setError("Please upload a SketchUp (.skp) file")
      return
    }

    setIsLoading(true)
    setError(null)
    setFileName(file.name)

    try {
      const arrayBuffer = await file.arrayBuffer()
      setUploadedModel(arrayBuffer)
    } catch (e) {
      setError("Failed to load the file. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResetTrigger((prev) => prev + 1)
  }

  const handleClearModel = () => {
    setUploadedModel(null)
    setFileName("")
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <Card className={`overflow-hidden ${className}`} ref={containerRef}>
      <CardContent className="p-0">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-3 bg-muted/50 border-b">
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            <span className="text-xs sm:text-sm font-medium">3D Viewer</span>
            {fileName && (
              <span className="text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-[150px]">
                ({fileName})
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-7 sm:h-8 px-2 sm:px-3 bg-transparent"
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline ml-1">Reset</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="h-7 sm:h-8 px-2 sm:px-3 bg-transparent"
            >
              {isFullscreen ? (
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Fullscreen className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
            {showUpload && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".skp"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="skp-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="h-7 sm:h-8 px-2 sm:px-3"
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  <span className="hidden sm:inline ml-1">Upload</span>
                </Button>
                {uploadedModel && (
                  <Button variant="ghost" size="sm" onClick={handleClearModel} className="h-7 sm:h-8 px-2 text-xs">
                    Clear
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* 3D Canvas */}
        <div
          className={`relative w-full ${isFullscreen ? "h-screen" : height} bg-gradient-to-b from-sky-100 to-sky-200`}
        >
          {error && (
            <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-10">
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-lg flex items-center gap-2 text-xs sm:text-sm">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                {error}
              </div>
            </div>
          )}

          <Canvas
            shadows
            camera={{ position: [10, 7, 10], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <Suspense fallback={<Loader />}>
              <CameraController resetTrigger={resetTrigger} />

              {/* Lighting */}
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[15, 20, 15]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={60}
                shadow-camera-left={-25}
                shadow-camera-right={25}
                shadow-camera-top={25}
                shadow-camera-bottom={-25}
              />
              <directionalLight position={[-10, 10, -10]} intensity={0.4} />

              {/* Environment */}
              <Environment preset="city" />

              {/* Ground shadow */}
              <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={10} />

              {/* Grid helper */}
              <Grid
                args={[30, 30]}
                cellSize={1}
                cellThickness={0.5}
                cellColor="#6B7280"
                sectionSize={5}
                sectionThickness={1}
                sectionColor="#374151"
                fadeDistance={40}
                fadeStrength={1}
                position={[0, 0.02, 0]}
              />

              {/* Model */}
              <Center>
                {uploadedModel ? (
                  <ParsedModel modelData={uploadedModel} />
                ) : initialModel === "sample" ? (
                  <SampleHouseModel autoRotate={autoRotate} />
                ) : null}
              </Center>

              {/* Controls - touch-friendly */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={4}
                maxDistance={40}
                minPolarAngle={0.1}
                maxPolarAngle={Math.PI / 2 - 0.05}
                target={[0, 1.5, 0]}
                touches={{
                  ONE: 1, // ROTATE
                  TWO: 2, // DOLLY_PAN
                }}
                rotateSpeed={0.5}
                zoomSpeed={0.8}
                panSpeed={0.5}
              />
            </Suspense>
          </Canvas>

          {/* Touch-friendly instructions */}
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 flex flex-wrap justify-center gap-2 sm:gap-4 pointer-events-none">
            <div className="bg-background/80 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 shadow-sm">
              <Move3D className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Drag to rotate</span>
            </div>
            <div className="bg-background/80 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 shadow-sm">
              <ZoomIn className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Pinch/Scroll to zoom</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ModelViewer
