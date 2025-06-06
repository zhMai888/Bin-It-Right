<template>
<<<<<<< HEAD
  <div class="eco-game-home">
    <!-- 背景和标题 -->
    <div class="header">
      <h1>环保卫士</h1>
      <p>保护地球，从游戏开始！</p>
    </div>

    <!-- 用户状态显示 -->
    <div class="user-status">
      <div v-if="!currentUser">
        <button @click="showLogin = true">登录</button>
        <button @click="showRegister = true">注册</button>
      </div>
      <div v-else>
        欢迎, {{ currentUser.username }}! 
        <button @click="logout">退出登录</button>
      </div>
    </div>

    <!-- 主功能区 -->
    <div class="main-area">
      <div class="game-controls">
        <button 
          class="start-btn" 
          @click="startGame"
          :disabled="!currentUser"
        >
          {{ gameStarted ? '继续游戏' : '开始游戏' }}
        </button>
        <button 
          class="exit-btn" 
          @click="exitGame"
          :disabled="!gameStarted"
        >
          退出游戏
        </button>
      </div>

      <!-- 排行榜 -->
      <div class="leaderboard">
        <h2>排行榜</h2>
        <div class="leaderboard-list">
          <div v-for="(user, index) in sortedLeaderboard" :key="user.id" class="leaderboard-item">
            <span class="rank">{{ index + 1 }}</span>
            <span class="username">{{ user.username }}</span>
            <span class="score">{{ user.score }} 分</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 登录模态框 -->
    <div v-if="showLogin" class="modal">
      <div class="modal-content">
        <span class="close" @click="showLogin = false">&times;</span>
        <h2>登录</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="login-username">用户名:</label>
            <input 
              id="login-username" 
              v-model="loginForm.username" 
              required
            />
          </div>
          <div class="form-group">
            <label for="login-password">密码:</label>
            <input 
              id="login-password" 
              type="password" 
              v-model="loginForm.password" 
              required
            />
          </div>
          <button type="submit">登录</button>
        </form>
      </div>
    </div>

    <!-- 注册模态框 -->
    <div v-if="showRegister" class="modal">
      <div class="modal-content">
        <span class="close" @click="showRegister = false">&times;</span>
        <h2>注册</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="register-username">用户名:</label>
            <input 
              id="register-username" 
              v-model="registerForm.username" 
              required
            />
          </div>
          <div class="form-group">
            <label for="register-password">密码:</label>
            <input 
              id="register-password" 
              type="password" 
              v-model="registerForm.password" 
              required
            />
          </div>
          <div class="form-group">
            <label for="register-email">邮箱:</label>
            <input 
              id="register-email" 
              type="email" 
              v-model="registerForm.email" 
              required
            />
          </div>
          <button type="submit">注册</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EcoGameHome',
  data() {
    return {
      currentUser: null,
      gameStarted: false,
      showLogin: false,
      showRegister: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        email: ''
      },
      leaderboard: [
        { id: 1, username: '环保达人', score: 9850 },
        { id: 2, username: '绿色先锋', score: 8720 },
        { id: 3, username: '地球卫士', score: 7650 },
        { id: 4, username: '生态守护者', score: 6540 },
        { id: 5, username: '自然之子', score: 5430 },
        { id: 6, username: '新用户', score: 1230 }
      ],
      // 模拟已注册用户
      registeredUsers: [
        { username: 'test', password: 'test123', email: 'test@example.com' }
      ]
    }
  },
  computed: {
    sortedLeaderboard() {
      return [...this.leaderboard].sort((a, b) => b.score - a.score)
    }
  },
  methods: {
    startGame() {
      if (!this.currentUser) {
        alert('请先登录再开始游戏');
        this.showLogin = true;
        return;
      }
      this.gameStarted = true;
      // 这里可以添加游戏开始的逻辑，比如路由跳转到游戏页面
      console.log('游戏开始');
    },
    exitGame() {
      this.gameStarted = false;
      // 这里可以添加游戏退出的逻辑
      console.log('游戏退出');
    },
    handleLogin() {
      const user = this.registeredUsers.find(
        u => u.username === this.loginForm.username && 
             u.password === this.loginForm.password
      );
      
      if (user) {
        this.currentUser = {
          username: user.username,
          email: user.email
        };
        this.showLogin = false;
        this.loginForm = { username: '', password: '' };
        alert('登录成功！');
      } else {
        alert('用户名或密码错误！');
      }
    },
    handleRegister() {
      const usernameExists = this.registeredUsers.some(
        u => u.username === this.registerForm.username
      );
      
      if (usernameExists) {
        alert('用户名已存在！');
        return;
      }
      
      this.registeredUsers.push({
        username: this.registerForm.username,
        password: this.registerForm.password,
        email: this.registerForm.email
      });
      
      this.leaderboard.push({
        id: this.leaderboard.length + 1,
        username: this.registerForm.username,
        score: 0
      });
      
      this.showRegister = false;
      this.registerForm = { username: '', password: '', email: '' };
      alert('注册成功！请登录。');
      this.showLogin = true;
    },
    logout() {
      this.currentUser = null;
      this.gameStarted = false;
    }
  }
}
</script>

<style scoped>
.eco-game-home {
  font-family: 'Segoe UI', 'Arial', sans-serif;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  color: #222; /* 主字体颜色加深 */
  background: linear-gradient(135deg, #e0f7fa 0%, #f0f8ff 100%);
  min-height: 100vh;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border-radius: 18px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding: 32px 20px 24px 20px;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(67, 233, 123, 0.15);
  position: relative;
  overflow: hidden;
}

.header h1 {
  margin: 0;
  font-size: 2.8em;
  letter-spacing: 2px;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(0,0,0,0.08);
  color: #ffffffe5;
}

.header p {
  margin: 16px 0 0;
  font-size: 1.3em;
  opacity: 0.95;
  color: #ffffffe5;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.18);
}

.user-status {
  text-align: right;
  margin-bottom: 20px;
}

.user-status button {
  margin-left: 10px;
  padding: 7px 18px;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: #ffffffe5;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(67, 233, 123, 0.12);
  transition: background 0.3s, transform 0.2s;
}

.user-status button:hover {
  background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
  transform: translateY(-2px) scale(1.04);
}

.main-area {
  display: flex;
  gap: 30px;
}

.game-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.game-controls button {
  padding: 18px 0;
  font-size: 1.25em;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 12px rgba(67, 233, 123, 0.10);
  transition: all 0.3s;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: #ffffffe5;
}

.game-controls button:disabled {
  background: #6b69699a;
  color: #ffffffe5;
  cursor: not-allowed;
  opacity: 0.7;
}

.start-btn:not(:disabled):hover,
.exit-btn:not(:disabled):hover {
  background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
  transform: scale(1.06);
}

.exit-btn {
  background: linear-gradient(90deg, #ff5858 0%, #f09819 100%);
}

.exit-btn:not(:disabled):hover {
  background: linear-gradient(90deg, #f09819 0%, #ff5858 100%);
}

.leaderboard {
  flex: 1;
  background: rgba(255,255,255,0.95);
  padding: 28px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(56, 249, 215, 0.10);
  color: #234; /* 更深的灰蓝色 */
}

.leaderboard h2 {
  margin-top: 0;
  color: #2e8b57;
  text-align: center;
  font-size: 1.6em;
  letter-spacing: 1px;
}

.leaderboard-list {
  margin-top: 20px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  margin-bottom: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(67, 233, 123, 0.06);
  font-size: 1.08em;
  position: relative;
  color: #234;
}

.leaderboard-item:nth-child(1) {
  background: linear-gradient(90deg, #ffd700 70%, #fffbe6 100%);
  font-weight: bold;
  color: #b8860b;
  text-shadow: 0 1px 2px #fffbe6, 0 0 8px #ffd70044;
}

.leaderboard-item:nth-child(2) {
  background: linear-gradient(90deg, #c0c0c0 70%, #f5f5f5 100%);
  font-weight: bold;
  color: #757575;
  text-shadow: 0 1px 2px #f5f5f5, 0 0 8px #c0c0c044;
}

.leaderboard-item:nth-child(3) {
  background: linear-gradient(90deg, #ce9760 70%, #fff3e0 100%);
  font-weight: bold;
  color: #a0522d;
  text-shadow: 0 1px 2px #fff3e0, 0 0 8px #cd7f3244;
}

.rank {
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 10px;
}

.username {
  flex: 1;
  margin-left: 10px;
}

.score {
  font-weight: bold;
  color: #2e8b57;
}

.modal {
  position: fixed;
=======
    <div class="game-container" @click.self="clearSelection">
      <!-- 上边区域 -->
      <div>
        <span class="score1">♻️</span>
        <span class="score2">{{score}}</span>
      </div>
      <div>
        <span class="score3">BEST: {{best_score}}</span>
      </div>
      <div class="leasetime" :style="leasetimeStyle">{{leasetime}}s</div>
      <!-- 垃圾区域 -->
      <div
        v-for="(item, index) in garbageList"
        :key="item.id"
        class="garbage"
        :class="{ selected: selectedGarbage === item.id }"
        :style="{ left: item.x + 'px', top: item.y + 'px' }"
        @click.stop="selectGarbage(item.id)"
      >
        <span v-if="!garbageMap.get(item.id) || !garbageMap.get(item.id).landed">🗑️</span>
        <span v-else><img src="../assets/turnover.png" alt="" class="turnover"></span>
      </div>

  
      <!-- 抛垃圾的手 -->
      <div class="hand" :style="{ bottom: handBottom + 'px' }">🤾</div>
  
      <!-- 垃圾桶 -->
      <div class="bins">
        <div
          v-for="bin in bins"
          :key="bin.id"
          class="bin"
          @click="throwGarbage(bin.type)"
        >
          <img :src="bin.img" :alt="bin.label" draggable="false" style="width: 200px; height: 250px;">
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
  </template>
  
  <script>
  import Firework from '@/components/fireworks/fireworks.vue'
  export default {
    components: {
      Firework
    },
    data() {
      return {
        bins: [
          { id: 1, type: 'shop', label: '商店' , img: ""},
          { id: 2, type: 'recycle', label: '可回收' , img: require('../assets/recyclable.png')},
          { id: 3, type: 'nonerecyle', label: '不可回收' , img: require("../assets/non-recyclable.png")},
          { id: 4, type: 'hazardous', label: '有害' , img: require("../assets/hazardous_waste.png")},
          { id: 5, type: 'kichen', label: '厨余' , img: require("../assets/kitchen_waste.png")}
        ],
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
        change_speed: 0.15,
        score: 20,
        best_score: 30,
        leasetime: 3,
        gameOver: false,
        showTimeout: false,
        showFirework: false,
      };
    },
    mounted() {
      window.addEventListener('resize', this.updateCenter);
      this.updateCenter();
      if (this.garbageList.length === 0) {
          this.throwMultipleGarbage();
      }
      let that = this
      setInterval(() => {
        if (this.leasetime > 0) {
          this.leasetime--;
        } else if (this.leasetime === 0 && !this.showTimeout && !this.gameOver) {
          that.triggerTimeout();
        }
      }, 1000);

      setInterval(() => {
          if (this.garbageList.length === 0) {
          this.throwMultipleGarbage();
          }
      }, 7000);

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
      updateCenter() {
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
      },
      triggerTimeout() {
        this.gameOver = true;
        this.showTimeout = true;
        cancelAnimationFrame(this.animationFrameId);
        setTimeout(()=>{
          this.showFirework = this.score >= this.best_score;
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

              // 2秒后移除
              setTimeout(() => {
                this.removeGarbage(g.id);
              }, 2000);
            }
          }

          this.animationFrameId = requestAnimationFrame(animate);
        };

        animate();
      },
  
      throwMultipleGarbage() {
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

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
            let garbageCount = Math.floor(Math.random() * 2) + 2;
            for (let j = 0; j < garbageCount; j++) {
                setTimeout(() => {
                this.generateGarbage();
                }, j * 200);
            }
            }, i * 1500);
        }
      },

      generateGarbage() {
        const type = this.garbageTypes[Math.floor(Math.random() * 4)];
        const id = this.idCounter++;
        const startX = 80;
        const startY = this.currentStartY + 15;
  
        const gravity = 0.5 * (this.change_speed * this.change_speed );
        const timeToFall = 2 * Math.abs(this.currentVy) / gravity;
        const vx = (Math.random() * 5 + 6) * this.change_speed;
        const vy = this.currentVy * 0.7 * this.change_speed;
  
        const garbage = {
          id,
          type,
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
        this.selectedGarbage = this.selectedGarbage === id ? null : id;
      },
      clearSelection() {
        this.selectedGarbage = null;
      },
      throwGarbage(binType) {
        if (this.selectedGarbage == null) return;
        const index = this.garbageList.findIndex(g => g.id === this.selectedGarbage);
        if (index !== -1) {
          const g = this.garbageList[index];
          if (g.type === binType) {
            alert('✅ 分类正确！');
          } else {
            alert('❌ 分类错误！');
          }
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
    background: #f0fff0;
  }
  
  /* 手的位置固定在左下角 */
  .hand {
    position: absolute;
    bottom: 80px;
    left: 40px;
    font-size: 40px;
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
  }
  .bin:hover {
    filter: brightness(120%);
  }
  .turnover {
    width: 100px;
    height: 60px;
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
>>>>>>> 4d241d54b5bbabe603489ddf10f22f7494695603
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
<<<<<<< HEAD
  background: rgba(0, 0, 0, 0.35);
=======
  background-color: rgba(0, 0, 0, 0.6); 
>>>>>>> 4d241d54b5bbabe603489ddf10f22f7494695603
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
<<<<<<< HEAD
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal-content {
  background: white;
  padding: 28px 24px 20px 24px;
  border-radius: 14px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.18);
  animation: popIn 0.3s;
}

@keyframes popIn {
  from { transform: scale(0.92); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 26px;
  cursor: pointer;
  color: #aaa;
  transition: color 0.2s;
}

.close:hover {
  color: #2e8b57;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  font-weight: bold;
  color: #2e8b57;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1.5px solid #b2dfdb;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1em;
  transition: border 0.2s;
  color: #234;
  background: #f8fcfb;
}

.form-group input:focus {
  border: 1.5px solid #43e97b;
  outline: none;
}

form button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(67, 233, 123, 0.10);
  transition: background 0.3s, transform 0.2s;
}

form button:hover {
  background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
  transform: scale(1.04);
}

@media (max-width: 768px) {
  .main-area {
    flex-direction: column;
    gap: 18px;
  }
  .header {
    font-size: 1em;
    padding: 18px 8px 12px 8px;
  }
  .leaderboard, .game-controls {
    padding: 12px;
  }
}
</style>
=======
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

</style>
  
>>>>>>> 4d241d54b5bbabe603489ddf10f22f7494695603
