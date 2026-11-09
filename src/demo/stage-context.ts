import { createContext } from 'react'

/** 舞台上下文：当前激活的分类 id。 */
export const StageContext = createContext<{ active: string; overrides: { current: Record<string, Record<string, unknown>> } } | null>(null)
