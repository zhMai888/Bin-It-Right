<template>
  <div class="game-mode-selection">
    <h1>选择游戏模式</h1>
    <button class="game-btn" @click="goToSinglePlayer">单人游戏</button>
    <button class="game-btn" @click="createRoom(); showJoinInput = false">创建房间</button>
    <span v-if="roomId" class="room-id" style="display: block;">房间号: {{ roomId }}</span>
    <button class="game-btn" @click="joinRoom">加入房间</button>
    <div v-if="showJoinInput" class="join-room-input-group">
      <input v-model="joinRoomId" type="text" placeholder="请输入房间码">
      <button class="game-btn" @click="confirmJoinRoom()">确定</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';
const ws = new WebSocket('ws://localhost:3030');



// function getLocalIP() {
//   return new Promise((resolve) => {
//     const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
//     if (!RTCPeerConnection) {
//       resolve('localhost');
//       return;
//     }
//     const pc = new RTCPeerConnection({ iceServers: [] });
//     pc.createDataChannel('');
//     pc.createOffer().then((offer) => pc.setLocalDescription(offer));
//     pc.onicecandidate = (event) => {
//       if (!event.candidate) return;
//       const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
//       const match = event.candidate.candidate.match(ipRegex);
//       if (match) {
//         resolve(match[1]);
//         pc.close();
//       }
//     };
//   });
// }
async function getLocalNetworkIP() {
  try {
    const response = await axios.get('http://localhost:3000/get-local-ip');
    return response.data.ip;
  } catch (error) {
    console.error('获取局域网 IP 失败:', error);
    return '127.0.0.1';
  }
}
let socket;

async function initSocket() {
  const ip = await getLocalNetworkIP();
  socket = io(`http://${ip}:3000`);
}

initSocket();

export default {
  data() {
    return {
      roomId: null,
      showJoinInput: false,
      joinRoomId: ''
    }
  },
  methods: {
    goToSinglePlayer() {
      // 跳转到单人游戏页面
      this.$router.push( '/game/local');
    },
    async createRoom() {
      try {
        const ip = await getLocalNetworkIP();
        const response = await axios.get(`http://${ip}:3000/create-room`);
        this.roomId = response.data.roomId;
        socket.emit('join_room', this.roomId);
      } catch (error) {
        console.error('创建房间失败:', error);
      }
    },
    joinRoom() {
      this.showJoinInput = true;
    },
    async confirmJoinRoom() {
      try {
        const ip = await getLocalNetworkIP();
        // 发送 UDP 广播，并将输入值作为房间码传递
        await axios.get(`http://${ip}:3000/send-udp-broadcast`, {
          params: {
            roomId: this.joinRoomId
          }
        });
        ws.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'udp_response') {
            console.log('收到UDP回复:', data.data);
            const server_ip = data.data;
            try {
              const response = await axios.get(`http://${server_ip}:3000/join-room`, {
                params: {
                  roomId: this.joinRoomId
                }
              });
              if (response.data.success) {
                socket.emit('join-room', this.joinRoomId);
                // 加入房间成功后的逻辑
                console.log("加入房间成功");//已经连接到另一台机器的后端
                
              } else {
                console.error('加入房间失败:', response.data.message);
              }
            } catch (error) {
              console.error('加入房间时出错:', error);
            }
          }
        };
      } catch (error) {
        console.error('加入房间时出错:', error);
      }
    }
  }
}
</script>

<style scoped>
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

.game-mode-selection {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.game-mode-selection .room-id {
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
  margin-top: -10px;
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