import { useCallback, useEffect, useState } from 'react'

export type TactileSoundType =
  | 'click'
  | 'tap'
  | 'pip'
  | 'toggle'
  | 'warn'
  | 'denied'
  | 'step'
  | 'open'
  | 'screen_in'
  | 'close'
  | 'screen_out'
  | 'confirm'
  | 'action'
  | 'elite'
  | 'rarity_six'
  | 'select'
  | 'equip'
  | 'tab'
  | 'sweep'
  | 'tick'
  | 'dial'

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
let noiseBufferCache: AudioBuffer | null = null

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

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!noiseBufferCache || noiseBufferCache.sampleRate !== ctx.sampleRate) {
    const length = Math.floor(ctx.sampleRate * 1.0)
    noiseBufferCache = ctx.createBuffer(1, length, ctx.sampleRate)
    const channel = noiseBufferCache.getChannelData(0)
    for (let i = 0; i < length; i++) {
      channel[i] = Math.random() * 2 - 1
    }
  }
  return noiseBufferCache
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
    case 'open':
    case 'screen_in': {
      // 全息快门展开：次低音液压下潜 + FM调频伺服扫频 + 谐振带通噪声气流 + 双音高频全息余韵
      const subOsc = ctx.createOscillator()
      const subGain = ctx.createGain()
      const subFilter = ctx.createBiquadFilter()
      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(150, now)
      subOsc.frequency.exponentialRampToValueAtTime(36, now + 0.13)
      subFilter.type = 'lowpass'
      subFilter.frequency.setValueAtTime(220, now)
      subGain.gain.setValueAtTime(0.75, now)
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
      subOsc.connect(subFilter)
      subFilter.connect(subGain)
      subGain.connect(masterGain)
      subOsc.start(now)
      subOsc.stop(now + 0.16)

      // 伺服扫频 + FM 调制颤音
      const sweepOsc = ctx.createOscillator()
      const sweepGain = ctx.createGain()
      const sweepFilter = ctx.createBiquadFilter()
      const fmMod = ctx.createOscillator()
      const fmGain = ctx.createGain()

      fmMod.type = 'sine'
      fmMod.frequency.setValueAtTime(120, now)
      fmGain.gain.setValueAtTime(150, now)
      fmGain.gain.exponentialRampToValueAtTime(1, now + 0.1)
      fmMod.connect(fmGain)
      fmGain.connect(sweepOsc.frequency)

      sweepOsc.type = 'sawtooth'
      sweepOsc.frequency.setValueAtTime(240, now)
      sweepOsc.frequency.exponentialRampToValueAtTime(1500, now + 0.09)
      sweepFilter.type = 'bandpass'
      sweepFilter.frequency.setValueAtTime(500, now)
      sweepFilter.frequency.exponentialRampToValueAtTime(2600, now + 0.09)
      sweepFilter.Q.setValueAtTime(3.8, now)
      sweepGain.gain.setValueAtTime(0.32, now)
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

      sweepOsc.connect(sweepFilter)
      sweepFilter.connect(sweepGain)
      sweepGain.connect(masterGain)
      fmMod.start(now)
      sweepOsc.start(now)
      fmMod.stop(now + 0.13)
      sweepOsc.stop(now + 0.13)

      // 全息快门释压气流
      const noise = ctx.createBufferSource()
      noise.buffer = getNoiseBuffer(ctx)
      noise.loop = true
      const noiseFilter = ctx.createBiquadFilter()
      const noiseGain = ctx.createGain()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.setValueAtTime(800, now)
      noiseFilter.frequency.exponentialRampToValueAtTime(3200, now + 0.08)
      noiseFilter.Q.setValueAtTime(2.5, now)
      noiseGain.gain.setValueAtTime(0.25, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(masterGain)
      noise.start(now)
      noise.stop(now + 0.1)

      // 高频数字全息余韵
      const shim1 = ctx.createOscillator()
      const shim2 = ctx.createOscillator()
      const shimGain = ctx.createGain()
      shim1.type = 'triangle'
      shim1.frequency.setValueAtTime(2400, now)
      shim2.type = 'sine'
      shim2.frequency.setValueAtTime(3600, now)
      shimGain.gain.setValueAtTime(0.001, now)
      shimGain.gain.setValueAtTime(0.2, now + 0.02)
      shimGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
      shim1.connect(shimGain)
      shim2.connect(shimGain)
      shimGain.connect(masterGain)
      shim1.start(now + 0.02)
      shim2.start(now + 0.02)
      shim1.stop(now + 0.22)
      shim2.stop(now + 0.22)
      duration = 0.22
      break
    }

    case 'close':
    case 'screen_out': {
      // 气阀光圈闭锁：下潜声调 + 气阀机械阻尼 + 闭锁落位
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.075)
      gain.gain.setValueAtTime(0.48, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
      osc.connect(gain)
      gain.connect(masterGain)
      osc.start(now)
      osc.stop(now + 0.085)

      const noise = ctx.createBufferSource()
      noise.buffer = getNoiseBuffer(ctx)
      noise.loop = true
      const noiseFilter = ctx.createBiquadFilter()
      const noiseGain = ctx.createGain()
      noiseFilter.type = 'lowpass'
      noiseFilter.frequency.setValueAtTime(650, now)
      noiseFilter.frequency.exponentialRampToValueAtTime(120, now + 0.05)
      noiseGain.gain.setValueAtTime(0.38, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(masterGain)
      noise.start(now)
      noise.stop(now + 0.055)

      const sub = ctx.createOscillator()
      const subG = ctx.createGain()
      sub.type = 'sine'
      sub.frequency.setValueAtTime(110, now)
      sub.frequency.exponentialRampToValueAtTime(32, now + 0.055)
      subG.gain.setValueAtTime(0.5, now)
      subG.gain.exponentialRampToValueAtTime(0.001, now + 0.065)
      sub.connect(subG)
      subG.connect(masterGain)
      sub.start(now)
      sub.stop(now + 0.07)
      duration = 0.09
      break
    }

    case 'confirm':
    case 'action': {
      // 罗德岛战术确认关键音：FM金属微击瞬态 + 双和弦晶体谐振 + 战术下潜低音微冲
      // 1. FM 调制金属撞击瞬态 (3:1 调制比产生纯正金属钟声泛音)
      const fmCarrier = ctx.createOscillator()
      const fmMod = ctx.createOscillator()
      const fmModGain = ctx.createGain()
      const fmOutGain = ctx.createGain()

      fmCarrier.type = 'sine'
      fmCarrier.frequency.setValueAtTime(1320, now)
      fmMod.type = 'sine'
      fmMod.frequency.setValueAtTime(440, now)

      fmModGain.gain.setValueAtTime(800, now)
      fmModGain.gain.exponentialRampToValueAtTime(1, now + 0.035)

      fmOutGain.gain.setValueAtTime(0.52, now)
      fmOutGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045)

      fmMod.connect(fmModGain)
      fmModGain.connect(fmCarrier.frequency)
      fmCarrier.connect(fmOutGain)
      fmOutGain.connect(masterGain)

      fmMod.start(now)
      fmCarrier.start(now)
      fmMod.stop(now + 0.05)
      fmCarrier.stop(now + 0.05)

      // 2. 带通滤波瞬态噪音声相
      const noise = ctx.createBufferSource()
      noise.buffer = getNoiseBuffer(ctx)
      noise.loop = true
      const noiseFilter = ctx.createBiquadFilter()
      const noiseGain = ctx.createGain()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.setValueAtTime(2600, now)
      noiseFilter.Q.setValueAtTime(5.0, now)
      noiseGain.gain.setValueAtTime(0.42, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)
      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(masterGain)
      noise.start(now)
      noise.stop(now + 0.03)

      // 3. 双和弦清脆晶体鸣响 (C6: 1046.5Hz + G6: 1568Hz 五度和弦)
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const chimeGain = ctx.createGain()
      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(1046.5, now)
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(1568, now)
      chimeGain.gain.setValueAtTime(0.62, now)
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)
      osc1.connect(chimeGain)
      osc2.connect(chimeGain)
      chimeGain.connect(masterGain)
      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.15)
      osc2.stop(now + 0.15)

      // 4. 战术底鼓微冲 (180Hz -> 42Hz)
      const kick = ctx.createOscillator()
      const kickGain = ctx.createGain()
      kick.type = 'sine'
      kick.frequency.setValueAtTime(180, now)
      kick.frequency.exponentialRampToValueAtTime(42, now + 0.07)
      kickGain.gain.setValueAtTime(0.78, now)
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
      kick.connect(kickGain)
      kickGain.connect(masterGain)
      kick.start(now)
      kick.stop(now + 0.085)
      duration = 0.16
      break
    }

    case 'elite':
    case 'rarity_six': {
      // 标志性金色6星干员共鸣晶响：快速四音层叠琶音 + FM高八度泛音 + 水晶微晶扩散余韵
      const notes = [1174.66, 1479.98, 1760.0, 2349.32] // D6, F#6, A6, D7 (D大调纯正明亮和弦)
      notes.forEach((freq, i) => {
        const t = now + i * 0.032
        const osc = ctx.createOscillator()
        const harm = ctx.createOscillator()
        const noteGain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, t)

        harm.type = 'sine'
        harm.frequency.setValueAtTime(freq * 2, t)

        noteGain.gain.setValueAtTime(0.001, now)
        noteGain.gain.setValueAtTime(0.48, t)
        noteGain.gain.exponentialRampToValueAtTime(0.001, t + 0.26)

        osc.connect(noteGain)
        harm.connect(noteGain)
        noteGain.connect(masterGain)

        osc.start(t)
        harm.start(t)
        osc.stop(t + 0.28)
        harm.stop(t + 0.28)
      })

      // 顶部超高频水晶微鸣
      const highChime = ctx.createOscillator()
      const highGain = ctx.createGain()
      highChime.type = 'sine'
      highChime.frequency.setValueAtTime(4698.6, now + 0.1) // D8
      highGain.gain.setValueAtTime(0.001, now)
      highGain.gain.setValueAtTime(0.25, now + 0.1)
      highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
      highChime.connect(highGain)
      highGain.connect(masterGain)
      highChime.start(now + 0.1)
      highChime.stop(now + 0.36)

      // 环绕型高频带通粒子散华
      const noise = ctx.createBufferSource()
      noise.buffer = getNoiseBuffer(ctx)
      noise.loop = true
      const sparkleFilter = ctx.createBiquadFilter()
      const sparkleGain = ctx.createGain()
      sparkleFilter.type = 'bandpass'
      sparkleFilter.frequency.setValueAtTime(3000, now)
      sparkleFilter.frequency.setValueAtTime(3200, now + 0.06)
      sparkleFilter.frequency.exponentialRampToValueAtTime(7500, now + 0.28)
      sparkleFilter.Q.setValueAtTime(5.5, now)
      sparkleGain.gain.setValueAtTime(0.001, now)
      sparkleGain.gain.setValueAtTime(0.2, now + 0.06)
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32)
      noise.connect(sparkleFilter)
      sparkleFilter.connect(sparkleGain)
      sparkleGain.connect(masterGain)
      noise.start(now + 0.06)
      noise.stop(now + 0.34)

      duration = 0.38
      break
    }

    case 'select':
    case 'equip': {
      // 战术锁定/装备短促微鸣：快速 1180Hz -> 2400Hz 变频锁定 + FM调制微啸
      const osc = ctx.createOscillator()
      const fmMod = ctx.createOscillator()
      const fmGain = ctx.createGain()
      const gain = ctx.createGain()

      fmMod.type = 'sine'
      fmMod.frequency.setValueAtTime(600, now)
      fmGain.gain.setValueAtTime(300, now)
      fmGain.gain.exponentialRampToValueAtTime(1, now + 0.02)
      fmMod.connect(fmGain)
      fmGain.connect(osc.frequency)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1180, now)
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.016)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.setValueAtTime(0.58, now + 0.002)
      gain.gain.setValueAtTime(0.62, now + 0.016)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

      osc.connect(gain)
      gain.connect(masterGain)

      fmMod.start(now)
      osc.start(now)
      fmMod.stop(now + 0.05)
      osc.stop(now + 0.055)
      duration = 0.06
      break
    }

    case 'tab':
    case 'sweep': {
      // 伺服切页 / 分类扫频：FM调制伺服滑音 + 带通滤波气动扫频
      const glide = ctx.createOscillator()
      const fmMod = ctx.createOscillator()
      const fmGain = ctx.createGain()
      const gGain = ctx.createGain()

      fmMod.type = 'sine'
      fmMod.frequency.setValueAtTime(85, now)
      fmGain.gain.setValueAtTime(140, now)
      fmGain.gain.exponentialRampToValueAtTime(1, now + 0.04)
      fmMod.connect(fmGain)
      fmGain.connect(glide.frequency)

      glide.type = 'sine'
      glide.frequency.setValueAtTime(480, now)
      glide.frequency.exponentialRampToValueAtTime(1020, now + 0.045)
      gGain.gain.setValueAtTime(0.38, now)
      gGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055)

      glide.connect(gGain)
      gGain.connect(masterGain)
      fmMod.start(now)
      glide.start(now)
      fmMod.stop(now + 0.06)
      glide.stop(now + 0.06)

      const noise = ctx.createBufferSource()
      noise.buffer = getNoiseBuffer(ctx)
      noise.loop = true
      const bp = ctx.createBiquadFilter()
      const nGain = ctx.createGain()
      bp.type = 'bandpass'
      bp.frequency.setValueAtTime(1000, now)
      bp.frequency.exponentialRampToValueAtTime(2800, now + 0.045)
      bp.Q.setValueAtTime(3.2, now)
      nGain.gain.setValueAtTime(0.32, now)
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055)
      noise.connect(bp)
      bp.connect(nGain)
      nGain.connect(masterGain)
      noise.start(now)
      noise.stop(now + 0.06)

      duration = 0.07
      break
    }

    case 'tick':
    case 'dial':
    case 'step': {
      // 微步棘轮点触 / 步进器长按高频点击
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const hp = ctx.createBiquadFilter()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1850, now)
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.008)
      hp.type = 'highpass'
      hp.frequency.setValueAtTime(1200, now)
      gain.gain.setValueAtTime(0.42, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012)
      osc.connect(hp)
      hp.connect(gain)
      gain.connect(masterGain)
      osc.start(now)
      osc.stop(now + 0.014)

      const noise = ctx.createBufferSource()
      noise.buffer = getNoiseBuffer(ctx)
      noise.loop = true
      const nFilter = ctx.createBiquadFilter()
      const nGain = ctx.createGain()
      nFilter.type = 'highpass'
      nFilter.frequency.setValueAtTime(2400, now)
      nGain.gain.setValueAtTime(0.2, now)
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008)
      noise.connect(nFilter)
      nFilter.connect(nGain)
      nGain.connect(masterGain)
      noise.start(now)
      noise.stop(now + 0.01)

      duration = 0.02
      break
    }

    case 'warn':
    case 'denied': {
      // 工业告警 / 操作拒绝：双音不协和微差颤音蜂鸣 + FM微频震颤
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const jLfo = ctx.createOscillator()
      const jGain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      jLfo.type = 'sine'
      jLfo.frequency.setValueAtTime(48, now)
      jGain.gain.setValueAtTime(32, now)
      jLfo.connect(jGain)
      jGain.connect(osc1.frequency)
      jGain.connect(osc2.frequency)

      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(260, now)
      osc1.frequency.exponentialRampToValueAtTime(160, now + 0.09)

      osc2.type = 'square'
      osc2.frequency.setValueAtTime(277, now) // 小二度不协和双音差频
      osc2.frequency.exponentialRampToValueAtTime(172, now + 0.09)

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(720, now)
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.09)
      filter.Q.setValueAtTime(3.0, now)

      gain.gain.setValueAtTime(0.65, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)

      jLfo.start(now)
      osc1.start(now)
      osc2.start(now)
      jLfo.stop(now + 0.1)
      osc1.stop(now + 0.1)
      osc2.stop(now + 0.1)
      duration = 0.11
      break
    }

    case 'click': {
      // 机械快门卡扣：双频混叠瞬态微击 + 瞬态高频微爆
      const osc = ctx.createOscillator()
      const clickOsc = ctx.createOscillator()
      const gain = ctx.createGain()
      const clickGain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1050, now)
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.024)
      gain.gain.setValueAtTime(0.65, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028)

      clickOsc.type = 'sine'
      clickOsc.frequency.setValueAtTime(2400, now)
      clickOsc.frequency.exponentialRampToValueAtTime(650, now + 0.008)
      clickGain.gain.setValueAtTime(0.4, now)
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01)

      const noise = ctx.createBufferSource()
      noise.buffer = getNoiseBuffer(ctx)
      noise.loop = true
      const noiseFilter = ctx.createBiquadFilter()
      const noiseGain = ctx.createGain()
      noiseFilter.type = 'highpass'
      noiseFilter.frequency.setValueAtTime(2200, now)
      noiseGain.gain.setValueAtTime(0.3, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01)
      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(masterGain)
      noise.start(now)
      noise.stop(now + 0.012)

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
      osc.frequency.setValueAtTime(420, now)
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.022)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(750, now)

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
      osc1.frequency.setValueAtTime(1440, now)

      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(2880, now)

      gain.gain.setValueAtTime(0.42, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.042)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(masterGain)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.045)
      osc2.stop(now + 0.045)
      duration = 0.05
      break
    }

    case 'toggle': {
      // 战术切换：升调二连音
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(540, now)
      osc.frequency.setValueAtTime(920, now + 0.018)

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
  }

  // 释放 masterGain 节点连接，避免在高速连击步进和滑块滑动时累积图节点
  setTimeout(() => {
    try {
      masterGain.disconnect()
    } catch {}
  }, Math.ceil(duration * 1000) + 60)
}

/**
 * 合成并播放罗德岛战术风格纯前端 Web Audio 触觉微反馈音。
 *
 * @param type 音效种类：
 *   - `'open'` / `'screen_in'`: 全息快门展开与液压下沉音（终端全屏入场）
 *   - `'close'` / `'screen_out'`: 气阀光圈闭锁音（终端全屏退场）
 *   - `'confirm'` / `'action'`: 罗德岛战术确认（高频撞击 + 双和弦 + 次低音）
 *   - `'elite'` / `'rarity_six'`: 6星黄金干员共鸣晶响（水晶层叠琶音）
 *   - `'select'` / `'equip'`: 战术锁定/装备短促微鸣（1200Hz -> 2400Hz 变频锁定）
 *   - `'tab'` / `'sweep'`: 伺服切页 / 分类扫频
 *   - `'tick'` / `'dial'` / `'step'`: 微步棘轮点触（数字步进器、滑块滑动）
 *   - `'warn'` / `'denied'`: 工业告警 / 操作拒绝不协和颤音
 *   - `'click'`: 机械轻脆快门卡扣音（用于标准按钮、卡片）
 *   - `'tap'`: 柔和指尖轻触音（用于轻交互、选项）
 *   - `'pip'`: 终端遥测脉冲提示音（用于槽位、状态选择）
 *   - `'toggle'`: 战术模式二段升调切换音（用于开关、段选器）
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
