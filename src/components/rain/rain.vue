<template>
    <canvas ref="canvas" class="rain-canvas"></canvas>
  </template>
  
  <script>
  export default {
    name: "RainEffect",
    data() {
      return {
        ctx: null,
        raindrops: [],
        animationFrameId: null,
        width: window.innerWidth,
        height: window.innerHeight,
        raindropCount: 300,
      };
    },
    mounted() {
      this.setupCanvas();
      this.createRaindrops();
      this.animate();
      window.addEventListener("resize", this.onResize);
    },
    beforeUnmount() {
      window.removeEventListener("resize", this.onResize);
      cancelAnimationFrame(this.animationFrameId);
    },
    methods: {
      setupCanvas() {
        const canvas = this.$refs.canvas;
        canvas.width = this.width;
        canvas.height = this.height;
        this.ctx = canvas.getContext("2d");
      },
      createRaindrops() {
        this.raindrops = [];
        for (let i = 0; i < this.raindropCount; i++) {
          this.raindrops.push({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            length: 10 + Math.random() * 20,
            speed: 2 + Math.random() * 4,
            opacity: 0.2 + Math.random() * 0.5,
          });
        }
      },
      drawRaindrop(raindrop) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(174,194,224,${raindrop.opacity})`;
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.moveTo(raindrop.x, raindrop.y);
        ctx.lineTo(raindrop.x, raindrop.y + raindrop.length);
        ctx.stroke();
      },
      animate() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
  
        for (let raindrop of this.raindrops) {
          this.drawRaindrop(raindrop);
          raindrop.y += raindrop.speed;
          if (raindrop.y > this.height) {
            raindrop.y = -raindrop.length;
            raindrop.x = Math.random() * this.width;
            raindrop.speed = 2 + Math.random() * 4;
            raindrop.length = 10 + Math.random() * 20;
            raindrop.opacity = 0.2 + Math.random() * 0.5;
          }
        }
  
        this.animationFrameId = requestAnimationFrame(this.animate);
      },
      onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.setupCanvas();
        this.createRaindrops();
      },
    },
  };
  </script>
  
  <style scoped>
  .rain-canvas {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
  }
  </style>
  