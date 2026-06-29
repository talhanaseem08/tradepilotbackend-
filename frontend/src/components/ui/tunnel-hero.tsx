import { cn } from "@/lib/utils"
import { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from "three"

type TunnelCanvasMode = "fullscreen" | "container"

type ThreeContext = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  material: THREE.ShaderMaterial
  mesh: THREE.Mesh
  geometry: THREE.PlaneGeometry
}

/**
 * Uses a media query listener so state only changes when the breakpoint flips.
 */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const update = (matches: boolean) => setIsMobile(matches)
    update(mq.matches)

    const handleChange = (event: MediaQueryListEvent) => update(event.matches)

    try {
      mq.addEventListener("change", handleChange)
      return () => mq.removeEventListener("change", handleChange)
    } catch {
      mq.addListener(handleChange)
      return () => mq.removeListener(handleChange)
    }
  }, [breakpoint])

  return isMobile
}

const vertexShader = `void main(){ gl_Position = vec4(position, 1.0); }`

const fragmentShader = `
uniform float iTime;
uniform vec3 iResolution;

#define TAU 6.2831853071795865
#define TUNNEL_LAYERS 96
#define RING_POINTS 128
#define POINT_SIZE 1.8
#define POINT_COLOR_A vec3(1.0)
#define POINT_COLOR_B vec3(0.7)
#define SPEED 0.7

float sq(float x){ return x*x; }

vec2 AngRep(vec2 uv, float angle){
  vec2 polar = vec2(atan(uv.y, uv.x), length(uv));
  polar.x = mod(polar.x + angle/2.0, angle) - angle/2.0;
  return polar.y * vec2(cos(polar.x), sin(polar.x));
}

float sdCircle(vec2 uv, float r){ return length(uv) - r; }

vec3 MixShape(float sd, vec3 fill, vec3 target){
  float blend = smoothstep(0.0, 1.0/iResolution.y, sd);
  return mix(fill, target, blend);
}

vec2 TunnelPath(float x){
  vec2 offs = vec2(
    0.2 * sin(TAU * x * 0.5) + 0.4 * sin(TAU * x * 0.2 + 0.3),
    0.3 * cos(TAU * x * 0.3) + 0.2 * cos(TAU * x * 0.1)
  );
  offs *= smoothstep(1.0, 4.0, x);
  return offs;
}

void main(){
  vec2 res = iResolution.xy / iResolution.y;
  vec2 uv = gl_FragCoord.xy / iResolution.y - res/2.0;
  vec3 color = vec3(0.0);
  float repAngle = TAU / float(RING_POINTS);
  float pointSize = POINT_SIZE / (2.0 * iResolution.y);
  float camZ = iTime * SPEED;
  vec2 camOffs = TunnelPath(camZ);

  for(int i = 1; i <= TUNNEL_LAYERS; i++){
    float pz = 1.0 - (float(i) / float(TUNNEL_LAYERS));
    pz -= mod(camZ, 4.0 / float(TUNNEL_LAYERS));
    vec2 offs = TunnelPath(camZ + pz) - camOffs;
    float ringRad = 0.15 * (1.0 / sq(pz * 0.8 + 0.4));
    if(abs(length(uv + offs) - ringRad) < pointSize * 1.5){
      vec2 aruv = AngRep(uv + offs, repAngle);
      float pdist = sdCircle(aruv - vec2(ringRad, 0), pointSize);
      vec3 ptColor = (mod(float(i/2), 2.0) == 0.0) ? POINT_COLOR_A : POINT_COLOR_B;
      float shade = (1.0 - pz);
      color = MixShape(pdist, ptColor * shade, color);
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
`

function createThreeForCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): ThreeContext {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  })

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(width, height, false)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(width, height, 1) },
    },
    vertexShader,
    fragmentShader,
  })

  const geometry = new THREE.PlaneGeometry(2, 2)
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  return { renderer, scene, camera, material, mesh, geometry }
}

function disposeThree(ctx: ThreeContext) {
  try {
    ctx.scene.remove(ctx.mesh)
    ctx.geometry.dispose()
    ctx.material.dispose()
    ctx.renderer.dispose()
  } catch {
    // Ignore disposal noise during unmount.
  }
}

function useTunnelCanvas(mode: TunnelCanvasMode) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<ThreeContext | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const pausedRef = useRef(false)
  const resizeQueuedRef = useRef(false)

  const animate = useCallback((time: number) => {
    if (!contextRef.current) return

    rafRef.current = window.requestAnimationFrame(animate)

    if (pausedRef.current) {
      lastTimeRef.current = time
      return
    }

    const seconds = time * 0.001
    const delta = seconds - (lastTimeRef.current || seconds)
    lastTimeRef.current = seconds

    contextRef.current.material.uniforms.iTime.value += delta * 0.5
    contextRef.current.renderer.render(
      contextRef.current.scene,
      contextRef.current.camera
    )
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === "undefined") return

    const container = mode === "container" ? canvas.parentElement : null
    if (mode === "container" && !container) return

    const readSize = () => {
      if (mode === "fullscreen") {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      }

      return {
        width: container!.clientWidth,
        height: container!.clientHeight,
      }
    }

    const initial = readSize()
    const ctx = createThreeForCanvas(
      canvas,
      Math.max(initial.width, 1),
      Math.max(initial.height, 1)
    )
    contextRef.current = ctx

    const syncSize = () => {
      if (!contextRef.current) return

      const next = readSize()
      const width = Math.max(next.width, 1)
      const height = Math.max(next.height, 1)

      contextRef.current.renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
      )
      contextRef.current.renderer.setSize(width, height, false)
      ;(
        contextRef.current.material.uniforms.iResolution.value as THREE.Vector3
      ).set(width, height, 1)
    }

    const queueResize = () => {
      if (resizeQueuedRef.current) return
      resizeQueuedRef.current = true

      window.requestAnimationFrame(() => {
        resizeQueuedRef.current = false
        syncSize()
      })
    }

    const handleVisibility = () => {
      pausedRef.current = document.hidden
    }

    let cleanupResize = () => {}

    if (mode === "fullscreen") {
      window.addEventListener("resize", queueResize)
      cleanupResize = () => window.removeEventListener("resize", queueResize)
    } else {
      const observer = new ResizeObserver(() => queueResize())
      observer.observe(container!)
      cleanupResize = () => observer.disconnect()
    }

    document.addEventListener("visibilitychange", handleVisibility)
    handleVisibility()
    rafRef.current = window.requestAnimationFrame(animate)

    return () => {
      cleanupResize()
      document.removeEventListener("visibilitychange", handleVisibility)

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current)
      }

      if (contextRef.current) {
        disposeThree(contextRef.current)
        contextRef.current = null
      }
    }
  }, [animate, mode])

  return canvasRef
}

export default function TunnelShowcase() {
  const canvasRef = useTunnelCanvas("fullscreen")
  const isMobile = useIsMobile()

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <canvas ref={canvasRef} className="fixed inset-0 size-full" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className={cn("inline-flex flex-col", isMobile ? "gap-2" : "gap-4")}>
          <div className="inline-block">
            <h1
              className={cn(
                "bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text font-black tracking-tighter text-transparent",
                isMobile ? "text-3xl" : "text-6xl md:text-8xl"
              )}
            >
              TUNNEL
            </h1>
            <div
              className={cn(
                "mt-2 h-1 w-full bg-gradient-to-r from-transparent via-white to-transparent",
                !isMobile && "mt-4"
              )}
            />
          </div>
          <p
            className={cn(
              "max-w-2xl font-light text-gray-300",
              isMobile ? "px-4 text-sm leading-relaxed" : "text-lg md:text-xl"
            )}
          >
            Experience an infinite journey through space and time with this
            mesmerizing <span className="font-medium text-white">Three.js</span>{" "}
            tunnel effect that responds to your{" "}
            {isMobile ? "touch" : "movement"}.
          </p>
        </div>
      </div>
    </div>
  )
}

export function TunnelTheme() {
  const canvasRef = useTunnelCanvas("container")
  const isMobile = useIsMobile()

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg bg-black">
      <canvas ref={canvasRef} className="size-full" />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className={cn("mb-2 font-bold", isMobile ? "text-2xl" : "mb-4 text-4xl")}>
            TUNNEL
          </h2>
          <p className={cn("opacity-80", isMobile ? "text-sm" : "text-lg")}>
            {isMobile ? "Touch to interact" : "Experience the infinite journey"}
          </p>
        </div>
      </div>
    </div>
  )
}

export function TunnelBackdrop({
  className,
  canvasClassName,
}: {
  className?: string
  canvasClassName?: string
}) {
  const canvasRef = useTunnelCanvas("container")

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-black",
        className
      )}
    >
      <canvas ref={canvasRef} className={cn("size-full opacity-95", canvasClassName)} />
    </div>
  )
}
