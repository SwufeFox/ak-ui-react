import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createAssetLoader, type AssetController, type AssetState, type AssetTask } from '../../core/site.mjs'

const IDLE: AssetState = { status: 'idle', completed: 0, total: 0, errors: [] }

export interface AkAssetLoaderProps {
  tasks: AssetTask[]
  label?: string
  retryLabel?: string
  onChange?: (state: AssetState) => void
  /** Renders the status line. Defaults to `label · status · completed/total`. */
  children?: (state: AssetState) => ReactNode
  className?: string
}

export function AkAssetLoader({ tasks, label = 'Resources', retryLabel = 'Retry', onChange, children, className }: AkAssetLoaderProps) {
  const [state, setState] = useState<AssetState>(IDLE)
  const controllerRef = useRef<AssetController | null>(null)
  const onChangeRef = useRef(onChange)

  onChangeRef.current = onChange

  useEffect(() => {
    const controller = createAssetLoader((next) => {
      setState(next)
      onChangeRef.current?.(next)
    })
    controllerRef.current = controller
    void controller.load(tasks)
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    void controllerRef.current?.load(tasks)
  }, [tasks])

  return (
    <div className={className ? `ak-asset-loader ${className}` : 'ak-asset-loader'} data-state={state.status} aria-busy={state.status === 'loading'}>
      <progress aria-label={label} value={state.completed} max={state.total || 1} />
      <div className="ak-asset-loader__status" role="status" aria-live="polite">
        {children ? children(state) : `${label} · ${state.status} · ${state.completed}/${state.total}`}
      </div>
      {state.status === 'error' ? (
        <button className="ak-site-control" type="button" onClick={() => void controllerRef.current?.load(tasks)}>
          {retryLabel}
        </button>
      ) : null}
    </div>
  )
}
