<template>
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
          @click="goToGame"
          :disabled="!currentUser"
        >
          开始游戏
        </button>
        <button 
          class="pokedex-btn"
          @click="goToPokedex"
        >
          图鉴
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
    goToGame() {
      if (!this.currentUser) {
        alert('请先登录再开始游戏');
        this.showLogin = true;
        return;
      }
      // 跳转到游戏界面
      this.$router.push({ name: 'Game' });
    },
    goToPokedex() {
      // 跳转到图鉴界面
      this.$router.push({ name: 'Pokedex' });
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
  width: 900px;
  min-height: 650px;
  max-width: 900px;
  margin: 0 auto;
  padding: 0;
  color: #222;
  /* 背景全屏显示且固定，组件居中，背景不随内容缩放 */
  position: relative;
  z-index: 1;
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

.pokedex-btn {
  padding: 18px 0;
  font-size: 1.25em;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 12px rgba(67, 233, 123, 0.10);
  transition: all 0.3s;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  color: #ffffffe5;
  margin-bottom: 10px;
}

.pokedex-btn:hover {
  background: linear-gradient(90deg, #00f2fe 0%, #4facfe 100%);
  transform: scale(1.06);
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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
<style>
body, html, #app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  /* 背景图全屏显示且固定 */
  background: url('/src/assets/background/1000.jpg') no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
}
</style>
