<template>
  <div class="game-mode-selection">
    <div class="header">
      <button class="return-btn" @click="$router.go(-1)">
        <img src="../assets/returnBack2.png" alt="return">
      </button>
      <h1>Select Game Mode</h1>
    </div>
    <button class="game-btn" @click="goToSinglePlayer">Single Player</button>
    <button class="game-btn" @click="createRoom(); showJoinInput = false">Create Room</button>
    <span v-if="roomId" class="room-id" style="display: block;">Room ID: {{ roomId }}</span>
    <button class="game-btn" @click="joinRoom">Join Room</button>
    <div v-if="showJoinInput" class="join-room-input-group">
      <input v-model="joinRoomId" type="text" placeholder="Enter room code">
      <button class="game-btn" @click="confirmJoinRoom()">Confirm</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';

async function getLocalNetworkIP() {
  try {
    const response = await axios.get('http://localhost:3000/get-local-ip');
    return response.data.ip;
  } catch (error) {
    console.error('Failed to get local network IP:', error);
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
      joinRoomId: '',
      ws : null
    }
  },
  mounted() {
    this.ws = new WebSocket('ws://localhost:3030');
    console.log('GameModeSelection websocket started on port 3030');

  },
  beforeDestroy(){
    if (this.ws) {
      console.log('Closing GameModeSelection websocket on 3030');
      this.ws.close();
    }
  },
  methods: {
    goToSinglePlayer() {
      // Navigate to single player page
      this.$router.push( '/game/local');
    },
    async createRoom() {
      try {
        const ip = await getLocalNetworkIP();
        const response = await axios.get(`http://${ip}:3000/create-room`);
        this.roomId = response.data.roomId;
        socket.emit('join_room', this.roomId);
        console.log(`local join to ${this.roomId} through socket`);
        // If websocket receives udp_response with data 'startOnlineGame', navigate to online game page
        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('Received UDP message:', data);
          if (data.type === 'udp_response' && data.data === 'startOnlineGame') {
            this.$router.push('/game/online');
            this.ws.close();
          }
        };
      } catch (error) {
        console.error('Failed to create room:', error);
      }
    },
    joinRoom() {
      this.showJoinInput = true;
    },
    async confirmJoinRoom() {
      try {
        const ip = await getLocalNetworkIP();
        // Send UDP broadcast with the input value as room code
        await axios.get(`http://${ip}:3000/send-udp-broadcast`, {
          params: {
            roomId: this.joinRoomId
          }
        });
        this.ws.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'udp_response') {
            console.log('Received UDP response:', data.data);
            const server_ip = data.data;
            try {
              const response = await axios.get(`http://${server_ip}:3000/join-room`, {
                params: {
                  roomId: this.joinRoomId
                }
              });
              if (response.data.success) {
                socket.emit('join-room', this.joinRoomId);
                // Logic after successfully joining the room
                console.log("Successfully joined the room"); // Already connected to another machine's backend
                this.$router.push('/game/online');
                this.ws.close(); // Close WebSocket connection

                this.ws.close();
              } else {
                console.error('Failed to join room:', response.data.message);
              }
            } catch (error) {
              console.error('Error joining room:', error);
            }
          }
        };
      } catch (error) {
        console.error('Error joining room:', error);
      }
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

.return-btn {
  position: absolute;
  left: 0;
  background: none;
  border: none;
  padding: 0;
  width: auto;
  box-shadow: none;
}

.return-btn img {
  width: 40px;
  height: 40px;
}

.return-btn:hover {
  transform: scale(1.1);
  background: none;
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