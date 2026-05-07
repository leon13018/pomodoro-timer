'use strict'

// 2π × 88 ≈ 552.92；用於計算 SVG 圓弧的 stroke-dashoffset
const CIRCUMFERENCE = 2 * Math.PI * 88

const CONFIG = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
  pomodorosBeforeLongBreak: 4,
}

const STATE = {
  phase: 'work',
  secondsLeft: CONFIG.work,
  totalSeconds: CONFIG.work,
  isRunning: false,
  completedPomodoros: 0,
  intervalId: null,
}

const el = {
  tabBtns:        document.querySelectorAll('.tab-btn'),
  timeDisplay:    document.getElementById('time-display'),
  progressArc:    document.getElementById('progress-arc'),
  pomodoroDots:   document.getElementById('pomodoro-dots'),
  btnStart:       document.getElementById('btn-start'),
  btnReset:       document.getElementById('btn-reset'),
  btnSkip:        document.getElementById('btn-skip'),
  settingsToggle: document.getElementById('settings-toggle'),
  settingsPanel:  document.getElementById('settings-panel'),
  setWork:        document.getElementById('set-work'),
  setShort:       document.getElementById('set-short'),
  setLong:        document.getElementById('set-long'),
  setOnTop:       document.getElementById('set-ontop'),
  btnApply:       document.getElementById('btn-apply'),
}

// 預先建立 4 個點元素，updateDots() 只切換 class，不重建 DOM
const dotEls = Array.from({ length: CONFIG.pomodorosBeforeLongBreak }, () => {
  const dot = document.createElement('div')
  dot.className = 'dot'
  el.pomodoroDots.appendChild(dot)
  return dot
})

// ── 輔助函式 ────────────────────────────────────────────────────

// CONFIG 是可變的（使用者可修改），所以在呼叫時才讀取而非快取
function phaseDuration(phase) {
  if (phase === 'work')  return CONFIG.work
  if (phase === 'short') return CONFIG.shortBreak
  return CONFIG.longBreak
}

function formatTime(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function stopTimer() {
  clearInterval(STATE.intervalId)
  STATE.isRunning = false
}

// ── Web Audio API ──────────────────────────────────────────────

// Chromium 要求 AudioContext 必須在使用者互動後才能建立
let audioCtx = null
function getAudioContext() {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function playTone(ctx, frequency, startDelay, duration, type, gain) {
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()
  osc.connect(gainNode)
  gainNode.connect(ctx.destination)

  osc.type = type
  osc.frequency.value = frequency

  const t0 = ctx.currentTime + startDelay
  const t1 = t0 + duration

  // 淡入淡出防止爆音（click artifact）
  gainNode.gain.setValueAtTime(0, t0)
  gainNode.gain.linearRampToValueAtTime(gain, t0 + 0.02)
  gainNode.gain.setValueAtTime(gain, t1 - 0.06)
  gainNode.gain.linearRampToValueAtTime(0, t1)

  osc.start(t0)
  osc.stop(t1)
}

function playAlertSound(type) {
  const ctx = getAudioContext()
  if (type === 'work') {
    playTone(ctx, 440, 0.0,  0.18, 'sine', 0.4)
    playTone(ctx, 554, 0.25, 0.18, 'sine', 0.4)
  } else {
    // 疊加三角波增加泛音，讓音色更圓潤
    playTone(ctx, 392, 0.0, 0.5, 'sine',     0.3)
    playTone(ctx, 392, 0.0, 0.5, 'triangle', 0.1)
  }
}

// ── 計時器控制 ──────────────────────────────────────────────────

function startTimer() {
  if (STATE.isRunning) return
  STATE.isRunning = true
  el.btnStart.textContent = '暫停'

  STATE.intervalId = setInterval(() => {
    STATE.secondsLeft -= 1
    updateDisplay()
    if (STATE.secondsLeft <= 0) {
      stopTimer()
      handlePhaseComplete()
    }
  }, 1000)
}

function pauseTimer() {
  stopTimer()
  el.btnStart.textContent = '繼續'
}

function resetTimer() {
  stopTimer()
  STATE.secondsLeft = STATE.totalSeconds
  el.btnStart.textContent = '開始'
  updateDisplay()
}

function skipPhase() {
  stopTimer()
  handlePhaseComplete()
}

function handlePhaseComplete() {
  if (STATE.phase === 'work') {
    STATE.completedPomodoros += 1
    playAlertSound('work')
    const isLongBreak = STATE.completedPomodoros % CONFIG.pomodorosBeforeLongBreak === 0
    window.electronAPI?.showNotification(
      '番茄完成！',
      isLongBreak
        ? `已完成 ${STATE.completedPomodoros} 個番茄，享受長休息吧`
        : '工作時間結束，短暫休息一下'
    )
    enterPhase(isLongBreak ? 'long' : 'short')
  } else {
    playAlertSound('break')
    window.electronAPI?.showNotification('休息結束', '準備好了嗎？開始下一個番茄！')
    enterPhase('work')
  }
  updateDots()
}

function enterPhase(phase) {
  STATE.phase = phase
  STATE.secondsLeft = STATE.totalSeconds = phaseDuration(phase)
  el.btnStart.textContent = '開始'
  document.body.classList.toggle('break-mode', phase !== 'work')
  updateTabs()
  updateDisplay()
}

// ── UI 更新 ─────────────────────────────────────────────────────

function updateDisplay() {
  el.timeDisplay.textContent = formatTime(STATE.secondsLeft)
  const progress = STATE.secondsLeft / STATE.totalSeconds
  el.progressArc.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress)
}

function updateTabs() {
  el.tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.phase === STATE.phase)
  })
}

function updateDots() {
  const thisRound = STATE.completedPomodoros % CONFIG.pomodorosBeforeLongBreak
  dotEls.forEach((dot, i) => dot.classList.toggle('filled', i < thisRound))
}

// ── 事件綁定 ────────────────────────────────────────────────────

el.btnStart.addEventListener('click', () => {
  getAudioContext()  // 首次點擊才建立 AudioContext，滿足 autoplay policy
  STATE.isRunning ? pauseTimer() : startTimer()
})

el.btnReset.addEventListener('click', resetTimer)
el.btnSkip.addEventListener('click', skipPhase)

el.tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.phase === STATE.phase) return
    stopTimer()
    enterPhase(btn.dataset.phase)
    // 不呼叫 updateDots()：手動切換不改變已完成的番茄數
  })
})

el.settingsToggle.addEventListener('click', () => {
  el.settingsPanel.hidden = !el.settingsPanel.hidden
})

el.btnApply.addEventListener('click', () => {
  const w = parseInt(el.setWork.value, 10)
  const s = parseInt(el.setShort.value, 10)
  const l = parseInt(el.setLong.value, 10)

  if ([w, s, l].some(v => isNaN(v) || v < 1)) {
    alert('請輸入有效的時長（至少 1 分鐘）')
    return
  }

  CONFIG.work = w * 60
  CONFIG.shortBreak = s * 60
  CONFIG.longBreak = l * 60

  window.electronAPI?.toggleAlwaysOnTop(el.setOnTop.checked)

  stopTimer()
  enterPhase(STATE.phase)

  el.settingsPanel.hidden = true
})

// ── 初始化 ──────────────────────────────────────────────────────
updateTabs()
updateDisplay()
updateDots()
