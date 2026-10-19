import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createAssetLoader, type AssetController, type AssetState, type AssetTask } from '../../core/site.mjs'

const IDLE: AssetState = { status: 'idle', completed: 0, total: 0, errors: [] }

export interface AkAssetLoaderProps {
  /** 要执行的异步任务，按顺序跑。 */
  tasks: AssetTask[]
  /** 进度条读屏名与状态行前缀，默认 `Resources`。 */
  label?: string
  /** 重试按钮文字，默认 `Retry`。 */
  retryLabel?: string
  /** 状态变化时回调。 */
  onChange?: (state: AssetState) => void
  /** Renders the status line. Defaults to `label · status · completed/total`. */
  children?: (state: AssetState) => ReactNode
  /**
   * 默认状态行里状态词的本地化表。控制器给的是英文枚举
   * （`idle` / `loading` / `ready` / `error` / `cancelled`），
   * 不传就用枚举原文——所以默认状态行是英文的。
   *
   * ```tsx
   * <AkAssetLoader label="资源" statusLabels={{ loading: '加载中', ready: '就绪' }} />
   * ```
   */
  statusLabels?: Partial<Record<AssetState['status'], string>>
  /** 附加类名，会拼到组件的 BEM 根类之后。 */
  className?: string
}

export function AkAssetLoader({
  tasks,
  label = 'Resources',
  retryLabel = 'Retry',
  statusLabels,
  onChange,
  children,
  className,
}: AkAssetLoaderProps) {
  const [state, setState] = useState<AssetState>(IDLE)
  const controllerRef = useRef<AssetController | null>(null)
  const onChangeRef = useRef(onChange)

  onChangeRef.current = onChange

  // Create the controller once. Loading itself is owned by the tasks effect below —
  // it also fires on mount (immediately after this one), so loading here as well
  // would run every task twice.
  useEffect(() => {
    const controller = createAssetLoader((next) => {
      setState(next)
      onChangeRef.current?.(next)
    })
    controllerRef.current = controller
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    void controllerRef.current?.load(tasks)
  }, [tasks])

  return (
    <div className={className ? `ak-asset-loader ${className}` : 'ak-asset-loader'} data-state={state.status} aria-busy={state.status === 'loading'}>
      <progress aria-label={label} value={state.completed} max={state.total || 1} />
      <div className="ak-asset-loader__status" role="status" aria-live="polite">
        {children
          ? children(state)
          : `${label} · ${statusLabels?.[state.status] ?? state.status} · ${state.completed}/${state.total}`}
      </div>
      {state.status === 'error' ? (
        <button className="ak-site-control" type="button" onClick={() => void controllerRef.current?.load(tasks)}>
          {retryLabel}
        </button>
      ) : null}
    </div>
  )
}
