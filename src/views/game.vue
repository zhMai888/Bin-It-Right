<template>
  <div class="game-container" @click.self="clearSelection">
    <!-- 开始游戏前的提示 -->
    <GameIntro v-if="!gameIntro" :onConfirmed="handleIntroComplete" />
    <div v-if="gameIntro">
      <!-- 开始游戏倒计时 -->
      <Countdown />
      <div v-if="gameStarted">
        <!-- 上边区域 -->
        <div>
          <span class="score1">♻️</span>
          <span class="score2">{{score}}</span>
        </div>
        <div>
          <span class="score3">BEST: {{best_score}}</span>
        </div>
        <div class="leasetime" :style="leasetimeStyle">{{leasetime}}s</div>
        <!-- 奖励显示区域 -->
        <transition
          name="fade"
          @after-leave="onLeave"
        >
          <img src="../assets/bonusTime.png" alt="Bonus Time" class="bonus" v-if="this.binggoNum > 9">
        </transition>
        <transition
          name="fade"
          @after-leave="onLeave"
        >
          <span
            v-if="this.binggoNum > 4"
            class="score4"
            :class="{ animated: animateScore }"
            @animationend="animateScore = false"
          >
            X {{ binggoNum }}
          </span>
        </transition>
        <!-- 垃圾区域 -->
        <div
          v-for="(item, index) in garbageList"
          :key="item.id"
          class="garbage"
          :class="{ selected: selectedGarbage === item.id, 'fade-out': item.fade }"
          :style="{ left: item.x + 'px', top: item.y + 'px' }"
          @click.stop="selectGarbage(item.id)"
        >
          <img
            v-if="!garbageMap.get(item.id) || !garbageMap.get(item.id).landed"
            :src="item.img"
            alt="trash"
            style="width: 100px; height: 100px; pointer-events: none;"
            draggable = false;
          >
          <img
            v-else
            src="../assets/turnover.png"
            alt=""
            class="turnover"
            draggable = false;
          >
        </div>


        <!-- 抛垃圾的手 -->
        <div
          class="hand"
          :style="{ left: handLeft + 'px', bottom: handBottom + 'px' }"
          :class="handClasses"
        >
          <img :src="hand" alt="" style="width: 250px; height: 130px;" draggable="false">
        </div>

        <!-- 垃圾桶 -->
        <div class="bins">
          <div
            v-for="bin in bins"
            :key="bin.id"
            class="bin"
            :class="{ 'has-emotion': bin.emotion }"
            @click="throwGarbage(bin.type)"
          >
            <img :src="bin.img" :alt="bin.label" draggable="false" style="width: 200px; height: 250px;">
            <div class="bin-emotion" v-if="bin.emotion" :style="{ color: bin.correct ? 'green' : 'red' }">
              {{ bin.emotion }}
            </div>
          </div>
        </div>
        <div v-if="gameOver" class="overlay">
          <div v-if="showTimeout" class="timeout-text">
            <p v-if="best_score>=score"><span class="timeout-clock">⏰</span> Time out!</p>
            <p v-else><span class="timeout-clock2">🎉</span> Congratulations!</p>
          </div>
          <Firework
            v-if="showFirework"
            :particleCount="180"
            :angle="90"
            :spread="130"
            :startVelocity="55"
            :ticks="1000"
            :colors="['#ff4b4b', '#ffd700', '#00e5ff', '#00ff7f', '#ff69b4']"
            :x="centerX"
            :y="centerY"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Firework from '@/components/fireworks/fireworks.vue'
import Countdown from '@/components/countdown/countdown.vue'
import GameIntro from '@/components/gameIntro/gameIntro.vue';
export default {
  components: {
    Firework,
    Countdown,
    GameIntro
  },
  data() {
    return {
      gameIntro: false,
      gameStarted: false,
      bins: [
        { id: 1, type: 'shop', label: '商店' , img: "", emotion: null},
        { id: 2, type: 'recycle', label: '可回收' , img: require('../assets/bin/recyclable.png'), emotion: null},
        { id: 3, type: 'nonerecyle', label: '不可回收' , img: require("../assets/bin/non-recyclable.png"), emotion: null},
        { id: 4, type: 'hazardous', label: '有害' , img: require("../assets/bin/hazardous_waste.png"), emotion: null},
        { id: 5, type: 'kichen', label: '厨余' , img: require("../assets/bin/kitchen_waste.png"), emotion: null}
      ],
      trash: [
        {id: 1, img: require("../assets/trash/bananapeel.png"), typeid: 5},
        {id: 2, img: require("../assets/trash/bone.png"), typeid: 5},
        {id: 3, img: require("../assets/trash/cigarette.png"), typeid: 4},
        {id: 4, img: require("../assets/trash/eggshell.png"), typeid: 5},
        {id: 5, img: require("../assets/trash/fishbone.png"), typeid: 5},
        {id: 6, img: require("../assets/trash/lighter.png"), typeid: 3},
        {id: 7, img: require("../assets/trash/orangepeel.png"), typeid: 5},
        {id: 8, img: require("../assets/trash/shabbyclothes.png"), typeid: 2},
        {id: 9, img: require("../assets/trash/tissue.png"), typeid: 3},
        {id: 10, img: require("../assets/trash/watermelonpeel.png"), typeid: 5},
      ],
      happy: ['😄','😆','ヾ(≧▽≦*)o','\^o^/','<(￣︶￣)↗[GOOD!]','(´▽`ʃ♡ƪ)','fantastic','unbelievable'],
      sad: ['😢', '💔','💢','(╥﹏╥)','(｡•́︿•̀｡)','(¬_¬")', '＞﹏＜','(╯︵╰,)', 'sad', 'careful'],
      hand: require('../assets/hand.png'),
      isHandShaking: false,
      handLeft: -300,
      showHand: false,
      centerX: window.innerWidth / 2,
      centerY: window.innerHeight / 2,
      currentStartY: 0,
      lastStartBottom: 0,
      garbageList: [],
      garbageMap: new Map(), 
      selectedGarbage: null,
      garbageTypes: ['shop', 'recycle', 'nonerecyle', 'hazardous', 'kichen'],
      idCounter: 1,
      animationFrameId: null,
      change_speed: 0.1,
      score: 0,
      best_score: 0,
      leasetime: 64,  // 多4秒用来平衡倒计时时间
      gameOver: false,
      showTimeout: false,
      showFirework: false,
      binggoNum: 0,   // 连续正确次数
      factors: 1,      // 奖励系数
      showBingo: false,
      animateScore: false
    };
  },
  watch: {
    binggoNum(newVal, oldVal) {
      if (newVal > 4 && newVal !== oldVal) {
        // 重置动画类（即使重复数值也能再次动画）
        this.animateScore = false;
        this.$nextTick(() => {
          this.animateScore = true;
        });
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateCenter);
    this.updateCenter();
    let that = this
    setInterval(() => {
      if (this.leasetime > 0 && this.gameIntro) {
        this.leasetime--;
      } else if (this.leasetime === 0 && !this.showTimeout && !this.gameOver) {
        that.triggerTimeout();
      }
    }, 1000);

    setInterval(() => {
        if (this.garbageList.length === 0 && this.gameStarted && !this.gameOver) {
          this.throwMultipleGarbage();
        }
    }, 2000);

    this.startAnimation();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.updateCenter);
  },
  computed: {
    handBottom() {
      return window.innerHeight - this.currentStartY;
    },
    handClasses() {
      return {
        shaking: this.isHandShaking
      }
    },
    leasetimeStyle() {
      const time = this.leasetime;
      let color = '#1abc9c';

      if (time <= 10) {
        color = '#c0392b';
      } else if (time <= 30) {
        color = '#f1c40f';
      }

      return {
        color: color,
        transition: 'color 0.5s'
      };
    }
  },
  methods: {
    handleIntroComplete() {
      this.gameIntro = true;
      setTimeout(() => {
        this.gameStarted = true;
      }, 4000);
    },
    onLeave() {
    },
    updateCenter() {
      this.centerX = window.innerWidth / 2;
      this.centerY = window.innerHeight / 2;
    },
    triggerTimeout() {
      this.gameOver = true;
      this.showTimeout = true;
      cancelAnimationFrame(this.animationFrameId);
      setTimeout(()=>{
        this.showFirework = this.score > this.best_score;
      }, 1000);
      setTimeout(() => {
        this.showTimeout = false;
        this.showFirework = false;
      }, 5000);
    },
    mixColor(c1, c2, ratio) {
      const hex = (color) => {
        color = color.replace('#', '');
        return [
          parseInt(color.substring(0, 2), 16),
          parseInt(color.substring(2, 4), 16),
          parseInt(color.substring(4, 6), 16)
        ];
      };
      const [r1, g1, b1] = hex(c1);
      const [r2, g2, b2] = hex(c2);
      const r = Math.round(r1 * ratio + r2 * (1 - ratio));
      const g = Math.round(g1 * ratio + g2 * (1 - ratio));
      const b = Math.round(b1 * ratio + b2 * (1 - ratio));
      return `rgb(${r}, ${g}, ${b})`;
    },
    startAnimation() {
      const gravity = 0.25 * (this.change_speed * this.change_speed);

      const animate = () => {
        for (const g of this.garbageList) {
          const meta = this.garbageMap.get(g.id);
          if (!meta) continue;

          // 如果已落地，跳过动画更新
          if (meta.landed) continue;

          meta.time += 1;
          g.x += meta.vx;
          meta.vy += gravity;
          g.y += meta.vy;

          // 落地检测
          if (g.y >= window.innerHeight - 60) { // 减60避免手直接贴边
            g.y = window.innerHeight - 60; // 保持在地面高度
            if (this.selectedGarbage === g.id) {
              this.clearSelection();
            }
            meta.landed = true;

            this.$set(g, 'fade', true); // 添加淡出效果
            // 2.5秒后移除
            setTimeout(() => {
              this.removeGarbage(g.id);
            }, 4500);
          }
        }

        this.animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    },
    shakeHand() {
      return new Promise(resolve => {
        this.isHandShaking = true;
        setTimeout(() => {
          this.isHandShaking = false;
          resolve();
        }, 600);
      });
    },

    async throwMultipleGarbage() {
      const handMinBottom = 0.2;
      const handMaxBottom = 0.5;
      const screenHeight = window.innerHeight;

      let startBottom;
      do {
        startBottom = Math.random() * (handMaxBottom - handMinBottom) * screenHeight + handMinBottom * screenHeight;
      } while (Math.abs(startBottom - this.lastStartBottom) < 0.1 * screenHeight);

      this.lastStartBottom = startBottom;
      this.currentStartY = (screenHeight - startBottom);

      const maxHeightMin = screenHeight * 0.05;
      const maxHeightMax = Math.min(this.currentStartY, screenHeight / 2);
      const maxHeight = Math.random() * (maxHeightMax - maxHeightMin) + maxHeightMin;

      const gravity = 0.5;
      const heightDelta = this.currentStartY - maxHeight;
      this.currentVy = -Math.sqrt(2 * gravity * heightDelta);

      // 伸手
      this.handLeft = -300;
      this.showHand = true;

      setTimeout(() => {
        this.handLeft = -20;  
      }, 50);
      await new Promise(res => setTimeout(res, 400));

      for (let i = 0; i < 3; i++) {
        await this.shakeHand();

        // 生成垃圾
        let garbageCount = Math.floor(Math.random() * 2) + 2;
        for (let j = 0; j < garbageCount; j++) {
          setTimeout(() => {
            this.generateGarbage();
          }, j * 200);
        }

        if (i < 2) {
          await new Promise(res => setTimeout(res, 650)); 
        }
      }
      // 收手
      setTimeout(async () => {
        this.handLeft = -300;
        await new Promise(res => setTimeout(res, 400));
        this.showHand = false;
      }, 1000);
    },

    generateGarbage() {
      const selectedTrash = this.trash[Math.floor(Math.random() * this.trash.length)];
      const id = this.idCounter++;
      const startX = 100;
      const startY = this.currentStartY + 15 - 130;

      const gravity = 0.5 * (this.change_speed * this.change_speed );
      const timeToFall = 2 * Math.abs(this.currentVy) / gravity;
      const vx = (Math.random() * 5 + 6) * this.change_speed;
      const vy = this.currentVy * 0.75 * this.change_speed;

      const garbage = {
        id,
        type: this.garbageTypes[selectedTrash.typeid - 1],  // typeid从1开始
        img: selectedTrash.img,  // 添加垃圾图片
        x: startX,
        y: startY
      };

      this.garbageList.push(garbage);
      this.garbageMap.set(id, {
        vx,
        vy,
        time: 0
      });
    },
    selectGarbage(id) {
      const meta = this.garbageMap.get(id);
      if (meta && meta.landed) {
        return; 
      }
      this.selectedGarbage = this.selectedGarbage === id ? null : id;
    },
    clearSelection() {
      this.selectedGarbage = null;
    },
    throwGarbage(binType) {
      if (this.selectedGarbage == null) return;

      const matchedBin = this.bins.find(b => b.type === binType);
      if (!matchedBin) return;

      // 清空所有垃圾桶表情，避免表情转移
      this.bins.forEach(b => b.emotion = null);

      const index = this.garbageList.findIndex(g => g.id === this.selectedGarbage);
      if (index !== -1) {
        const g = this.garbageList[index];

        if (g.type === binType) {
          this.score += this.factors;
          this.binggoNum += 1;
          matchedBin.emotion = this.happy[Math.floor(Math.random() * this.happy.length)];
          matchedBin.correct = true;
        } else {
          this.score -= 1;
          this.binggoNum = 0;
          this.factors = 1;
          matchedBin.emotion = this.sad[Math.floor(Math.random() * this.sad.length)];
          matchedBin.correct = false;
        }

        if (this.binggoNum >= 10) {
          this.factors = 2;
        }

        setTimeout(() => {
          matchedBin.emotion = null; 
          matchedBin.correct = null;
        }, 1500);

        this.removeGarbage(g.id);
        this.selectedGarbage = null;
      }
    },
    removeGarbage(id) {
      this.garbageList = this.garbageList.filter(g => g.id !== id);
      this.garbageMap.delete(id);
    }
  }
};
</script>

<style scoped>
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url('../assets/gameBackground.png') no-repeat;
  background-size: 100% 100%;
}

/* 手的位置 */
.hand {
  position: absolute;
  bottom: 80px;
  left: -300px;
  transition: left 0.4s ease;
  z-index: 10;
}

@keyframes hand-throw {
  0% {
    transform: translateY(0) rotate(0deg);
    animation-timing-function: ease-in;
  }
  30% {
    transform: translateY(20px) rotate(15deg);
    animation-timing-function: ease-out;
  }
  60% {
    transform: translateY(-30px) rotate(-20deg);
    animation-timing-function: ease-in-out;
  }
  90% {
    transform: translateY(5px) rotate(5deg);
    animation-timing-function: ease-out;
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}


.hand.shaking {
  animation: hand-throw 1s ease forwards;
  animation-iteration-count: 2;
  animation-delay: 0.1s; 
}


/* 垃圾样式 */
.garbage {
  position: absolute;
  font-size: 60px;
  cursor: pointer;
  transition: transform 0.2s;
  pointer-events: auto;
  user-select: none;
  -webkit-user-drag: none;
}
.garbage.selected {
  transform: scale(1.5);
  filter: brightness(130%);
}

.garbage.fade-out {
  opacity: 0;
  transition: opacity 4s ease;
}

/* 垃圾桶区域 */
.bins {
  position: absolute;
  bottom: 185px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  width: 80%;
  z-index: -1;
}
.bin {
  width: 100px;
  height: 60px;
  color: black;
  text-align: center;
  line-height: 60px;
  cursor: pointer;
  font-weight: bold;
  margin: 0 10px;
  user-select: none;
  transition: background 0.3s;
  position: relative;
}
.bin:hover {
  filter: brightness(120%);
}
.turnover {
  width: 100px;
  height: 60px;
  pointer-events: none;
}
.score1{
  position: absolute;
  font-weight: bolder;
  top: 20px;
  left: 20px;
  font-size: 60px;
  z-index: 10;
  user-select: none;
}
.score2{
  position: absolute;
  font-weight: bolder;
  top: 22px;
  left: 120px;
  font-size: 70px;
  background: linear-gradient(to bottom, #4caf50, #2196f3);
  background-clip: text;             
  -webkit-background-clip: text;    
  color: transparent;
  -webkit-text-fill-color: transparent; 
  z-index: 10;
  user-select: none;
}
.score3{
  position: absolute;
  font-weight: bolder;
  top: 110px;
  left: 25px;
  font-size: 35px;
  background: linear-gradient(to bottom, #4caf50, #2196f3);
  background-clip: text;             
  -webkit-background-clip: text;    
  color: transparent;
  -webkit-text-fill-color: transparent; 
  z-index: 10;
  user-select: none;
}
@font-face {
  font-family: 'HongLeiXingShu';
  src: url('../assets/font/HongLeiXingShu.OTF') format('truetype');
}
.score4{
  position: absolute;
  font-weight: bolder;
  font-family: "HongLeiXingShu";
  top: 300px;
  right: 60px;
  font-size: 60px;
  background: linear-gradient(to bottom, #951f18, #67140b);
  background-clip: text;             
  -webkit-background-clip: text;    
  color: transparent;
  -webkit-text-fill-color: transparent; 
  z-index: 10;
  user-select: none;
  transition: transform 0.3s ease;
}

.score4.animated {
  animation: pulse 0.3s ease;
}

.bonus {
  position: absolute;
  top: 200px;
  right: 20px;
  width: 200px;
  height: 100px;
  z-index: 10;
  transition: transform 0.3s ease;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
.leasetime {
  position: absolute;
  font-weight: bolder;
  top: 22px;
  right: 25px;
  font-size: 60px;
  z-index: 10;
  user-select: none;
}
.overlay {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.6); 
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}
.timeout-text {
position: absolute;
bottom: -100px;
left: 50%;
transform: translateX(-50%);
font-size: 80px;
font-weight: bold;
color: #e74c3c;
text-shadow: 2px 2px 5px rgba(0,0,0,0.4);
animation: timeout-move 1s forwards;
z-index: 100;
}
.timeout-clock {
display: inline-block;
animation: clock-shake 0.5s ease-in-out 1s 1;
}
.timeout-clock2 {
display: inline-block;
}

.firework-canvas {
position: fixed;
top: 0;
left: 0;
pointer-events: none;
z-index: 10001;
}

.bin-emotion {
  position: absolute;
  bottom: 130%;
  left: 150%;
  transform: translateX(-50%) scale(0.8);
  font-size: 32px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  background: #fff;
  border-radius: 16px;
  padding: 4px 12px;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}


.bin-emotion::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -6px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 14px solid #fff;
}

.bin.has-emotion .bin-emotion {
  opacity: 1;
  transform: translateX(-50%) scale(1.1);
  animation: bubble-pop 0.4s ease-out;
}


@keyframes timeout-move {
0% {
  bottom: -100px;
  opacity: 0;
}
100% {
  bottom: 50%;
  opacity: 1;
  transform: translate(-50%, 50%);
}
}

@keyframes clock-shake {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(10deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(10deg); }
  80% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
}

@keyframes bubble-pop {
  0% {
    transform: translateX(-50%) scale(0.6);
    opacity: 0;
  }
  60% {
    transform: translateX(-50%) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}


</style>