import { useEffect, useRef } from 'react'
import { createParticleField, type ParticleController, type ParticleOptions } from '../../core/site.mjs'

export interface AkParticleFieldProps extends ParticleOptions {
  className?: string
}

export function AkParticleField({ className, pattern, paused, ...options }: AkParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<ParticleController | null>(null)
  const optionsRef = useRef(options)

  optionsRef.current = options

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const controller = createParticleField(canvas, { ...optionsRef.current, pattern, paused })
    controllerRef.current = controller
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (paused) controllerRef.current?.pause()
    else controllerRef.current?.resume()
  }, [paused])

  useEffect(() => {
    if (pattern) controllerRef.current?.setPattern(pattern)
  }, [pattern])

  return <canvas ref={canvasRef} className={className ? `ak-particle-field ${className}` : 'ak-particle-field'} aria-hidden="true" />
}
