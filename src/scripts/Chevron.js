import Vector2 from './Vector2'

const PIXEL_RATIO = window.devicePixelRatio || 1
const avoidanceDist = 60 * PIXEL_RATIO
const avoidanceScalar = 0.001
const alignDist = 100 * PIXEL_RATIO
const alignScalar = 0.01
const color = '#65f0b6'

// Helper Functions
//======================================

function getFib(n) {
  let i = 0
  let c = 0
  while (i < n) {
    i++
    c += i
  }
  return c
}
function getReverseFib(n) {
  let r = 0
  let l = 0
  while (n > r) {
    l++
    r = getFib(l)
  }
  return l
}
function random(min, max) {
  if (min === undefined) {
    min = 0
    max = 1
  } else if (max === undefined) {
    max = min
    min = 0
  }
  return Math.random() * (max - min) + min
}

class Chevron {
  constructor(c) {
    let x = Math.round(random() * c.canvas.width)
    let y = Math.round(random() * c.canvas.height)
    this.pos = new Vector2(x, y)
    this.vel = new Vector2(0, random(1, 2))
    this.vel.rotate(random(0, Math.PI * 2))

    this.maxVelocity = 2
    this.arrowSize = random(20, 40) * PIXEL_RATIO
    this.dotRadius = 4 * PIXEL_RATIO
    this.arrowWeight = 2 * PIXEL_RATIO
    this.arrowLayers = Math.floor(random(3, 8))
    this.arrowCount = getFib(this.arrowLayers)
    this.armWidth = Math.sqrt(2) * (this.arrowSize / 2)

    this.rightArmDir = new Vector2(0, this.armWidth).rotate(Math.PI * -0.25)
    this.leftArmDir = new Vector2(0, this.armWidth).rotate(Math.PI * 0.25)

    this.chevronPos = []
    this.chevronVel = []
    for (let i = 0; i < this.arrowCount; i++) {
      this.chevronPos[i] = new Vector2(x, y)
      this.chevronVel[i] = new Vector2(this.vel.x, this.vel.y)
    }
    this.updateChevrons(1)
  }

  update(c, chevrons) {
    this.updateChevrons(0.05)

    this.separate(chevrons)
    this.align(chevrons)

    // this.vel.limit(this.maxVelocity);
    if (this.vel.magnitude() > this.maxVelocity) {
      this.vel.normalise().multiplyEq(this.maxVelocity)
    }
    this.pos.plusEq(this.vel)

    this.borders(c)
  }

  draw(c) {
    for (let i = 0; i < this.arrowCount; i++) {
      let point = this.chevronPos[i]
      let layer = getReverseFib(i + 1) - 1

      c.translate(point.x, point.y)

      this.rightArmDir.resetRotation()
      this.rightArmDir.rotate(this.chevronVel[i].angle() + Math.PI * 0.25)
      this.leftArmDir.resetRotation()
      this.leftArmDir.rotate(this.chevronVel[i].angle() + Math.PI * 0.75)

      c.strokeStyle = color
      c.fillStyle = color
      c.globalAlpha = 1 - layer / this.arrowLayers // todo: bad perf

      c.beginPath()
      c.arc(0, 0, this.dotRadius / 2, 0, Math.PI * 2)
      c.fill()
      c.closePath()

      c.lineWidth = this.arrowWeight

      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(this.rightArmDir.x, this.rightArmDir.y)
      c.moveTo(0, 0)
      c.lineTo(this.leftArmDir.x, this.leftArmDir.y)
      c.stroke()
      c.closePath()

      c.setTransform(1, 0, 0, 1, 0, 0)
    }
  }

  updateChevrons(sway) {
    let i = 0
    let downLeft = new Vector2(0, this.armWidth).rotate(
      this.vel.angle() + Math.PI * 0.75
    )
    let right = new Vector2(this.arrowSize, 0).rotate(
      this.vel.angle() + Math.PI * 0.5
    )

    for (let layer = 0; layer < this.arrowLayers; layer++) {
      for (let x = 0; x <= layer; x++) {
        let newPos = downLeft
          .multiplyNew(layer)
          .plusNew(right.multiplyNew(x))
          .plusNew(this.pos)
        let curPos = this.chevronPos[i]
        if (sway == 1) {
          this.chevronPos[i] = newPos
        } else if (sway != 0) {
          this.chevronVel[i] = newPos.minusNew(curPos)
          newPos.multiplyEq(sway)
          curPos.multiplyEq(1 - sway)
          this.chevronPos[i] = newPos.plusNew(curPos)
        }
        i++
      }
    }
  }

  separate(chevrons) {
    let result = new Vector2(0, 0)
    let p0 = this.chevronPos[0]

    // loop through other boids
    for (let i = 0; i < chevrons.length; i++) {
      let other = chevrons[i]
      let p1 = other.chevronPos[0]
      let dist = p0.dist(p1)
      // allow for other == this
      if (dist < avoidanceDist && dist > 0) {
        result.minusEq(p1.minusNew(p0))
      }
    }

    result.multiplyEq(avoidanceScalar)
    this.vel.plusEq(result)
  }

  align(chevrons) {
    let result = new Vector2(0, 0)
    let numNeighbours = 0
    let p0 = this.chevronPos[0]

    // loop through other boids
    for (let i = 0; i < chevrons.length; i++) {
      let other = chevrons[i]
      let p1 = other.chevronPos[0]
      let dist = p0.dist(p1)
      // allow for other == this
      if (dist < alignDist && dist > 0) {
        result.plusEq(other.vel)
        numNeighbours++
      }
    }

    if (numNeighbours == 0) return

    result.divideEq(numNeighbours)
    result.multiplyEq(alignScalar)
    this.vel.plusEq(result)
  }

  borders(c) {
    const point = this.pos
    let wall = -this.arrowLayers * this.arrowSize
    if (point.x > c.canvas.width - wall || point.x < wall) {
      this.vel.x *= -1
    }
    if (point.y > c.canvas.height - wall || point.y < wall) {
      this.vel.y *= -1
    }
  }
}

export default Chevron
