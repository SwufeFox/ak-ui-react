import { useCallback, useEffect, useState } from 'react'

export type TactileSoundType = 'click' | 'tap' | 'pip' | 'toggle' | 'warn' | 'step'

const STORAGE_KEY = 'ak-tactile-sound'

const listeners = new Set<(enabled: boolean) => void>()

let soundEnabled: boolean = (() => {
  if (typeof window === 'undefined') return true
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === null ? true : stored === 'true'
  } catch {
    return true
  }
})()

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  return audioCtx
}

// 在首次用户指针/按键交互时预热并唤醒 AudioContext，消除移动端或高版本 Chromium 首次点击掉音问题
if (typeof window !== 'undefined') {
  const eagerUnlock = () => {
    const ctx = getAudioContext()
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
  }
  window.addEventListener('pointerdown', eagerUnlock, { capture: true, once: true, passive: true })
  window.addEventListener('keydown', eagerUnlock, { capture: true, once: true, passive: true })
}

/**
 * 检查当前触觉音效是否已开启。
 */
export function isTactileSoundEnabled(): boolean {
  return soundEnabled
}

/**
 * 开启或关闭全局触觉音效，并持久化到本地存储，同时通知所有已订阅的 Hook 实例。
 */
export function setTactileSoundEnabled(enabled: boolean): void {
  if (soundEnabled === enabled) return
  soundEnabled = enabled
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled))
    } catch {
      // ignore storage quota / sandbox errors
    }
  }
  listeners.forEach((listener) => listener(enabled))
}

function synthesizeSound(ctx: AudioContext, type: TactileSoundType, volume: number): void {
  const now = ctx.currentTime
  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(Math.max(0, Math.min(volume, 1)), now)
  masterGain.connect(ctx.destination)

  let duration = 0.05

  switch (type) {
    case 'click': {
      // 机械快门卡扣：双频混叠瞬态微击
      const osc = ctx.createOscillator()
      const clickOsc = ctx.createOscillator()
      const gain = ctx.createGain()
      const clickGain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(980, now)
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.024)

      gain.gain.setValueAtTime(0.7, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028)

      clickOsc.type = 'sine'
      clickOsc.frequency.setValueAtTime(2200, now)
      clickOsc.frequency.exponentialRampToValueAtTime(700, now + 0.008)

      clickGain.gain.setValueAtTime(0.35, now)
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01)

      osc.connect(gain)
      gain.connect(masterGain)
      clickOsc.connect(clickGain)
      clickGain.connect(masterGain)

      osc.start(now)
      osc.stop(now + 0.03)
      clickOsc.start(now)
      clickOsc.stop(now + 0.012)
      duration = 0.035
      break
    }

    case 'tap': {
      // 轻触：低频正弦温润阻尼
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(460, now)
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.022)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800, now)

      gain.gain.setValueAtTime(0.5, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.024)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)

      osc.start(now)
      osc.stop(now + 0.026)
      duration = 0.03
      break
    }

    case 'pip': {
      // 遥测脉冲：干净的窄带双谐波鸣响
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(1320, now)

      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(2640, now)

      gain.gain.setValueAtTime(0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(masterGain)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.042)
      osc2.stop(now + 0.042)
      duration = 0.045
      break
    }

    case 'toggle': {
      // 战术切换：升调二连音
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(540, now)
      osc.frequency.setValueAtTime(820, now + 0.018)

      gain.gain.setValueAtTime(0.5, now)
      gain.gain.setValueAtTime(0.55, now + 0.018)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.048)

      osc.connect(gain)
      gain.connect(masterGain)

      osc.start(now)
      osc.stop(now + 0.05)
      duration = 0.055
      break
    }

    case 'warn': {
      // 战术警示：低频尖锐下潜蜂鸣
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(360, now)
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.065)

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(650, now)
      filter.Q.setValueAtTime(2.5, now)

      gain.gain.setValueAtTime(0.65, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)

      osc.start(now)
      osc.stop(now + 0.075)
      duration = 0.08
      break
    }

    case 'step': {
      // 微步点触：适合连续长按步进与滑块的高速短脉冲
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1400, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.01)

      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012)

      osc.connect(gain)
      gain.connect(masterGain)

      osc.start(now)
      osc.stop(now + 0.014)
      duration = 0.02
      break
    }
  }

  // 释放 masterGain 节点连接，避免在高速连击步进和滑块滑动时累积图节点
  setTimeout(() => {
    try {
      masterGain.disconnect()
    } catch {}
  }, Math.ceil(duration * 1000) + 50)
}

/**
 * 合成并播放罗德岛战术风格纯前端 Web Audio 触觉微反馈音。
 *
 * @param type 音效种类：
 *   - `'click'`: 机械轻脆快门卡扣音（用于标准按钮、卡片）
 *   - `'tap'`: 柔和指尖轻触音（用于轻交互、选项）
 *   - `'pip'`: 终端遥测脉冲提示音（用于槽位、状态选择）
 *   - `'toggle'`: 战术模式二段升调切换音（用于开关、段选器）
 *   - `'warn'`: 告警/危险特征频响（用于错误、边界阻尼）
 *   - `'step'`: 微步棘轮点触音（用于数字步进器长按、滑块滑动）
 * @param volume 音量缩放比例（0 到 1，默认 0.15）
 */
export function playTactileSound(type: TactileSoundType, volume = 0.15): void {
  if (!soundEnabled || typeof window === 'undefined') return

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        if (soundEnabled) {
          synthesizeSound(ctx, type, volume)
        }
      }).catch(() => {})
      return
    }

    synthesizeSound(ctx, type, volume)
  } catch {
    // Web Audio fails gracefully if blocked by autoplay policies
  }
}

/**
 * 触觉音效便捷 Hook，提供当前开启状态、切换及播放函数，并在全局状态变更或多实例间保持自动同步。
 */
export function useTactileSound() {
  const [enabled, setEnabledState] = useState(isTactileSoundEnabled)

  useEffect(() => {
    const handler = (val: boolean) => setEnabledState(val)
    listeners.add(handler)

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        const next = e.newValue === 'true'
        soundEnabled = next
        setEnabledState(next)
        listeners.forEach((l) => l(next))
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      listeners.delete(handler)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const toggle = useCallback(() => {
    const next = !isTactileSoundEnabled()
    setTactileSoundEnabled(next)
    if (next) {
      playTactileSound('toggle')
    }
  }, [])

  const setSound = useCallback((value: boolean) => {
    setTactileSoundEnabled(value)
  }, [])

  const play = useCallback((type: TactileSoundType, volume?: number) => {
    playTactileSound(type, volume)
  }, [])

  return {
    enabled,
    toggle,
    setEnabled: setSound,
    play,
  }
}
