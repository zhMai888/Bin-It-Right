<template>
    <canvas
      ref="fireCanvas"
      class="fire-canvas"
      :width="width * pixelRatio"
      :height="height * pixelRatio"
      :style="{ width: width + 'px', height: height + 'px', zIndex: zIndex }"
    ></canvas>
  </template>
  
  <script>
  const minBrowserRefreshTime =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (cb) {
      setTimeout(cb, 1000 / 60)
    }
  
  let fireCanvasBox = null
  
  export default {
    props: {
      particleCount: {
        type: [Number, String],
        default: 150
      },
      angle: {
        type: [Number, String],
        default: 90
      },
      spread: {
        type: [Number, String],
        default: 100
      },
      startVelocity: {
        type: [Number, String],
        default: 45
      },
      decay: {
        type: [Number, String],
        default: 0.9
      },
      ticks: {
        type: [Number, String],
        default: 150
      },
      zIndex: {
        type: [Number, String],
        default: 1
      },
      colors: {
        type: Array,
        default: () => ['#5BC0EB', '#2176AE', '#FDE74C', '#9BC53D', '#E55934', '#FA7921', '#FF4242']
      },
      canvasId: {
        type: String,
        default: 'fireCanvas'
      },
      width: {
        type: [Number, String],
        default: () => window.innerWidth
      },
      height: {
        type: [Number, String],
        default: () => window.innerHeight
      },
      x: {
        type: [Number, String],
        default: () => window.innerWidth / 2
      },
      y: {
        type: [Number, String],
        default: () => window.innerHeight * 0.4
      }
    },
    data() {
      return {
        pixelRatio: window.devicePixelRatio || 1
      }
    },
    mounted() {
      this.initCanvas()
    },
    methods: {
      parseInt16(hex) {
        return parseInt(hex, 16)
      },
      initCanvas() {
        const canvas = this.$refs.fireCanvas
        if (!canvas) return
  
        fireCanvasBox = canvas.getContext('2d')
        fireCanvasBox.scale(this.pixelRatio, this.pixelRatio)
        fireCanvasBox.save()
  
        this.fireworksDraw()
      },
      fireworksDraw() {
        let ribbon = []
        let particleCount = this.particleCount
  
        while (particleCount--) {
          const rads = this.angle * (Math.PI / 180)
          const spreadRad = this.spread * (Math.PI / 180)
          const colorStr = this.colors[particleCount % this.colors.length].replace(/[^0-9a-f]/gi, '')
          const colorHex = colorStr.length < 6
            ? colorStr[0] + colorStr[0] + colorStr[1] + colorStr[1] + colorStr[2] + colorStr[2]
            : colorStr
  
          ribbon.push({
            x: this.x,
            y: this.y,
            depth: 0.5 * Math.random() + 0.6,
            wobble: 10 * Math.random(),
            velocity: 0.5 * this.startVelocity + Math.random() * this.startVelocity,
            angle2D: -rads + (0.5 * spreadRad - Math.random() * spreadRad),
            tiltAngle: Math.random() * Math.PI,
            color: {
              r: this.parseInt16(colorHex.substring(0, 2)),
              g: this.parseInt16(colorHex.substring(2, 4)),
              b: this.parseInt16(colorHex.substring(4, 6))
            },
            tick: 0,
            totalTicks: this.ticks,
            decay: this.decay,
            random: Math.random() + 5,
            tiltSin: 0,
            tiltCos: 0,
            wobbleX: 0,
            wobbleY: 0
          })
        }
  
        const drawRibbon = () => {
          if (!fireCanvasBox) return
  
          fireCanvasBox.clearRect(0, 0, this.width, this.height)
          fireCanvasBox.restore()
  
          ribbon = ribbon.filter(e => {
            e.x += Math.cos(e.angle2D) * e.velocity
            e.y += Math.sin(e.angle2D) * e.velocity + 5 * e.depth
            e.wobble += 0.1
            e.velocity *= e.decay
            e.tiltAngle += 0.02 * Math.random() + 0.12
            e.tiltSin = Math.sin(e.tiltAngle)
            e.tiltCos = Math.cos(e.tiltAngle)
            e.random = Math.random() + 4
            e.wobbleX = e.x + 10 * Math.cos(e.wobble) * e.depth
            e.wobbleY = e.y + 10 * Math.sin(e.wobble) * e.depth
  
            const alpha = 1 - e.tick++ / e.totalTicks
            fireCanvasBox.fillStyle = `rgba(${e.color.r}, ${e.color.g}, ${e.color.b}, ${alpha})`
  
            fireCanvasBox.beginPath()
            fireCanvasBox.moveTo(Math.floor(e.x), Math.floor(e.y))
            fireCanvasBox.lineTo(Math.floor(e.wobbleX), Math.floor(e.y + e.random * e.tiltSin))
            fireCanvasBox.lineTo(Math.floor(e.wobbleX + e.random * e.tiltCos), Math.floor(e.wobbleY + e.random * e.tiltSin))
            fireCanvasBox.lineTo(Math.floor(e.x + e.random * e.tiltCos), Math.floor(e.wobbleY))
            fireCanvasBox.closePath()
            fireCanvasBox.fill()
  
            return e.tick < e.totalTicks
          })
  
          ribbon.length ? minBrowserRefreshTime(drawRibbon) : (fireCanvasBox = null)
        }
  
        minBrowserRefreshTime(drawRibbon)
      }
    }
  }
  </script>
  
  <style>
  .fire-canvas {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  </style>
  