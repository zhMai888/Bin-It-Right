<script src="../api/user.js"></script>
<template>
  <div class="eco-game-home">
    <!-- 背景和标题 -->
    <div class="header">
      <h1>Bin it Right！</h1>
      <p>For A Better future</p>
    </div>

    <div class="main-area">
      <!-- 左侧：游戏按钮 -->
      <div class="left-panel">
        <div class="game-controls">
          <div class="start-btn" 
            @click="goToGame"
            :disabled="!currentUser">
            <div>Game Start</div>
          </div>          
          <div class="pokedex-btn"
            @click="goToPokedex" >
            <div>Archive</div>     
          </div>
        </div>
      </div>

      <!-- 中间：排行榜 -->
      <div class="center-panel">
        <div class="leaderboard">
          <h2>Ranking List</h2>
          <div class="leaderboard-list">
            <div
              v-for="(user, index) in sortedLeaderboard"
              :key="user.id"
              class="leaderboard-item"
              :class="{ 'current-user': currentUser && user.username === currentUser.username }"
            >
              <span class="rank">{{ user.id }}</span>
              <span class="username">{{ user.username }}</span>
              <span class="score">{{ user.score }} 分</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：登录注册 -->
      <div class="right-panel">
        <div class="user-status">
          <div v-if="!currentUser">
            <div @click="showLogin = true" class="loginB">Login In</div>
            <div @click="showRegister = true" class="signUp">Sign Up</div>
          </div>
          <div v-else>
            <div class="loginB">Welcome <br>{{ currentUser.username }} </div>
            <div @click="logout" class="signUp">Log Out</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 登录模态框 -->
    <div v-if="showLogin" class="modal">
      <div class="modal-content">
        <span class="close" @click="showLogin = false">&times;</span>
        <h2>Log In</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="login-username">Username:</label>
            <input 
              id="login-username" 
              v-model="loginForm.username" 
              required
            />
          </div>
          <div class="form-group">
            <label for="login-password">Password:</label>
            <input 
              id="login-password" 
              type="password" 
              v-model="loginForm.password" 
              required
            />
          </div>
          <button type="submit">Log in</button>
        </form>
      </div>
    </div>

    <!-- 注册模态框 -->
    <div v-if="showRegister" class="modal">
      <div class="modal-content">
        <span class="close" @click="showRegister = false">&times;</span>
        <h2>Sign up</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="register-username">Username:</label>
            <input 
              id="register-username" 
              v-model="registerForm.username" 
              required
            />
          </div>
          <div class="form-group">
            <label for="register-password">Password:</label>
            <input 
              id="register-password" 
              type="password" 
              v-model="registerForm.password" 
              required
            />
          </div>
          <div class="form-group">
            <label for="register-email">Email:</label>
            <input 
              id="register-email" 
              type="email" 
              v-model="registerForm.email" 
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Login, Register, getAllUsers } from '@/api/user';

export default {
  name: 'EcoGameHome',
  data() {
    return {
      currentUser: null,
      showLogin: false,
      showRegister: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        email: '',
        bestScore:0
      },
      leaderboard: []  // 由后端获取动态刷新
    };
  },
  created() {
    // 尝试恢复登录状态
    const savedUser = localStorage.getItem('eco_current_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
    this.refreshLeaderboard();
  },
  methods: {
    goToGame() {
      if (!this.currentUser) {
        alert('Please log in or register first!');
        this.showLogin = true;
        return;
      }
      this.$router.push({ name: 'GameModeSelection' });
    },
    goToPokedex() {
      this.$router.push({ name: 'Pokedex' });
    },

    // 通过后端接口刷新排行榜
    refreshLeaderboard() {
      getAllUsers()
          .then(res => {
            // 假设返回格式是 [{username, bestScore}, ...]
            // 给数据加个 id，且排序（bestScore降序）
            // console.log(res)
            this.leaderboard = res.data
                .map((u, idx) => ({
                  id: idx + 1,
                  username: u.username,
                  score: u.bestScore || 0
                }))
                .sort((a, b) => b.score - a.score);
          })
          .catch(err => {
            alert('刷新排行榜失败: ' + (err.response?.data?.message || err.message));
          });
    },

    handleLogin() {
      Login(this.loginForm)
          .then(res => {
            console.log(res)
            const user = res.data.user;
            if (user && user.username) {
              this.currentUser = {
                id: user.rank,
                username: user.username,
                score: user.bestScore || 0,
              };
              localStorage.setItem('eco_current_user', JSON.stringify(this.currentUser));
              this.showLogin = false;
              this.loginForm = { username: '', password: '' };
              alert(`登录成功！您的当前排名为第 ${user.rank} 名`);
              this.refreshLeaderboard();
            } else {
              alert('登录失败：用户名或密码错误');
            }
          })
          .catch(err => {
            alert('登录失败: ' + (err.response?.data?.message || err.message));
          });
    },

    handleRegister() {
      Register(this.registerForm)
          .then(res => {
            alert('注册成功！请登录');
            this.showRegister = false;
            this.registerForm = { username: '', password: '', email: '' };
            this.showLogin = true;
            this.refreshLeaderboard();
          })
          .catch(err => {
            alert('注册失败: ' + (err.response?.data?.message || err.message));
          });
    },

    logout() {
      this.currentUser = null;
      localStorage.removeItem('eco_current_user');
      this.refreshLeaderboard();
    }
  },
  computed: {
    sortedLeaderboard() {
      // 取前五名
      const sorted = [...this.leaderboard].sort((a, b) => b.score - a.score);
      const top5 = sorted.slice(0, 5);

      // 如果当前用户不在前五，就把它也 push 进来，且保持它的 id（rank）
      if (
          this.currentUser &&
          !top5.some(u => u.username === this.currentUser.username)
      ) {
        top5.push({
          id: this.currentUser.id,
          username: this.currentUser.username,
          score: this.currentUser.score,
        });
      }
      // console.log(top5)
      return top5;
    }
  }
};
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
  /*background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);*/
  color: rgb(0, 242, 255);
  border-radius: 18px;
  /* box-shadow: 0 4px 24px rgba(67, 233, 123, 0.15); */
  position: relative;
  overflow: hidden;
}

.header h1 {
  margin: 0;
  font-size: 2.8em;
  letter-spacing: 2px;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(0,0,0,0.08);
  color: #318d4ae5;
}

.header p {
  margin: 16px 0 0;
  font-size: 1.3em;
  opacity: 0.95;
  color: #d6ff008c;
  text-shadow: 0 2px 8px rgb(143 29 29 / 92%);
}

.user-status {
  text-align: center;
  margin-bottom: 0;
  margin-top: 30px;
}

.user-status div {
  
  padding: 7px 18px;
  
  color: #43e97b;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(67, 233, 123, 0.12);
  transition: background 0.3s, transform 0.2s;
}
.loginB{
  background-image: url('/src/assets/start/sign_in.png');
  height: 150px;
  width: 200px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 80px;
}
.signUp {
  background-image: url('/src/assets/start/sign_up.png');
  height: 150px;
  width: 200px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-status div div:hover {
  
  transform: translateY(-2px) scale(1.04);
}

.main-area {
  display: flex;
  flex-direction: row;
  gap: 250px;
  justify-content: center;
  align-items: flex-start;
}

.left-panel, .center-panel, .right-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.left-panel {
  flex: 1;
  min-width: 180px;
  
}

.center-panel {
  flex: 2;
  min-width: 350px;
  max-width: 500px;
  align-items: stretch;
  /* margin-left: 200px;
  margin-right: 200px; */
}

.right-panel {
  flex: 1;
  min-width: 180px;
  max-width: 220px;
}

.game-controls {
  display: flex;
  flex-direction: column;
  gap: 18px;
  justify-content: flex-end;
}

.game-controls div {
  
  font-size: 1.2em;
  border: none;
  
  cursor: pointer;
  font-weight: bold;
  
  transition: all 0.3s;
  /* background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%); */
  color: #43e97b;
  text-shadow: #f54747 0px 0px 8px;
}
.start-btn {
  text-align: center;
  
  background-image: url('/src/assets/start/button1.png');
  width: 150px;
  height: 150px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  
}
.start-btn div{
  transform: rotate(30deg);
}

.game-control div disabled {
  /* background: #6b69699a; */
  color: #ffffffe5;
  cursor: not-allowed;
  opacity: 0.7;
}

.start-btn:not(:disabled):hover {
  transform: scale(1.06);
}

.pokedex-btn {
  width: 150px;
  height: 150px;
  margin-left: 80px; /* 向右偏移，可根据需要调整 */

  font-size: 1.25em;
  background-image: url('/src/assets/start/button2.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;

  cursor: pointer;
  font-weight: bold;

  transition: all 0.3s;

  color: #ffffffe5;
  margin-bottom: 10px;
}

.pokedex-btn:hover {
  
  transform: scale(1.06);
}
.pokedex-btn div {
  transform: rotate(50deg);
  color: #43e97b;
  text-shadow: #f54747 0px 0px 8px;
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

.leaderboard-item.current-user {
  border: 2px solid #43e97b;
  background: linear-gradient(90deg, #e0ffe7 60%, #b2f7ef 100%);
  box-shadow: 0 0 8px #43e97b55;
  font-weight: bold;
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
  /* 背景图全屏显示且固定，宽度拉伸，高度适应 */
  background: url('/src/assets/background/main_background.png') no-repeat center center fixed;
  background-size: 100vw 100vh;
  overflow: hidden;
}
</style>
