<template>
  <div class="game-mode-selection">
    <h1>选择游戏模式</h1>
    <button class="game-btn" @click="goToSinglePlayer">单人游戏</button>
    <button class="game-btn" @click="createRoom(); showJoinInput = false">创建房间</button>
    <span v-if="roomId" class="room-id">房间号: {{ roomId }}</span>
    <button class="game-btn" @click="joinRoom">加入房间</button>
    <div v-if="showJoinInput" class="join-room-input-group">
      <input v-model="joinRoomId" type="text" placeholder="请输入房间码">
      <button class="game-btn" @click="confirmJoinRoom">确定</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';

let socket = null;

export default {
  data() {
    return {
      roomId: null,
      showJoinInput: false,
      joinRoomId: '',
    };
  },
  mounted() {
    socket = io("http://localhost:3000");

    socket.on('message', (msg) => {
      console.log('收到消息:', msg);
    });

    socket.on('error', (err) => {
      console.error('Socket错误:', err);
    });
  },
  methods: {
    goToSinglePlayer() {
      console.log('进入单人模式');
    },
    async createRoom() {
      try {
        const response = await axios.get(`http://localhost:3000/create-room`);
        this.roomId = response.data.roomId;
        socket.emit('join-room', this.roomId);
      } catch (err) {
        console.error('创建房间失败:', err);
      }
    },
    joinRoom() {
      this.showJoinInput = true;
    },
    async confirmJoinRoom() {
      try {
        const response = await axios.get(`http://localhost:3000/join-room`, {
          params: { roomId: this.joinRoomId }
        });

        if (response.data.success) {
          socket.emit('join-room', this.joinRoomId); 
          console.log('成功加入房间:', this.joinRoomId);
        } else {
          alert(response.data.message);
        }
      } catch (err) {
        console.error('加入房间失败:', err);
      }
    }
  }
};
</script>

<style scoped>
.game-mode-selection {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.room-id {
  margin-top: 10px;
  padding: 18px 0;
  font-size: 1.25em;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  box-shadow: 0 2px 12px rgba(67, 233, 123, 0.10);
  background: white;
  color: #000;
  width: 200px;
}
.join-room-input-group {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.join-room-input-group input {
  padding: 18px 0;
  font-size: 1.25em;
  border: none;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(67, 233, 123, 0.10);
}
button {
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
  width: 200px;
}
button:hover {
  background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
  transform: scale(1.06);
}
</style>
