import Chevron from './Chevron'

// Variables
//======================================

let chevronCount
let c
let chevrons = []

const PIXEL_RATIO = window.devicePixelRatio || 1

// Setup
//======================================

function setup() {
  const canvas = document.createElement('canvas')
  canvas.className = 'background'
  document.body.appendChild(canvas)
  c = canvas.getContext('2d')
  setSizes()
  setupEventListeners()

  chevronCount = Math.max(
    Math.min(window.innerWidth * window.innerHeight * 0.00002, 30),
    10
  )

  // initialise chevrons
  for (let i = 0; i < chevronCount; i++) {
    chevrons.push(new Chevron(c))
  }
}

const setupEventListeners = () => {
  window.addEventListener('resize', onResize)
}

const onResize = () => {
  setSizes()
}

const setSizes = () => {
  const canvas = c.canvas
  const width = window.innerWidth
  const height = window.innerHeight
  canvas.width = width * PIXEL_RATIO
  canvas.style.width = `${width}px`
  canvas.height = height * PIXEL_RATIO
  canvas.style.height = `${height}px`
}

// Global Draw
//======================================

function draw() {
  c.fillStyle = '#fff'
  c.globalAlpha = 1
  c.fillRect(0, 0, c.canvas.width, c.canvas.height)

  for (let i = 0; i < chevronCount; i++) {
    chevrons[i].draw(c)
  }
}

// Global Update
//======================================

function update() {
  for (let i = 0; i < chevronCount; i++) {
    chevrons[i].update(c, chevrons)
  }
}

// Loop
//======================================

const loop = () => {
  update()
  draw()
  window.requestAnimationFrame(loop)
}

const init = () => {
  setup()
  window.requestAnimationFrame(loop)
}

window.addEventListener('load', init)
