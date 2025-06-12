const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const os = require('os');

// 获取本地IP地址
app.get('/get-local-ip', (req, res) => {
  const interfaces = os.networkInterfaces();
  let localIp = '127.0.0.1';
  
  for (const interfaceName in interfaces) {
    const iface = interfaces[interfaceName];
    for (const alias of iface) {
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        localIp = alias.address;
        break;
      }
    }
  }
  
  res.json({ ip: localIp });
});
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = 3000;

// 房间列表
const createdRooms = [];

// 生成 4 位房间号
function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 创建房间
app.get('/create-room', (req, res) => {
  const roomId = generateRoomId();
  createdRooms.push(roomId);
  res.send({ success: true, roomId });
});

// 验证房间是否存在
app.get('/check-room', (req, res) => {
  const { roomId } = req.query;
  const exists = createdRooms.includes(roomId);
  res.send({ success: exists });
});

// 加入房间
app.get('/join-room', (req, res) => {
  const { roomId } = req.query;
  if (createdRooms.includes(roomId)) {
    return res.send({ success: true, message: `成功连接到房间 ${roomId}` });
  }
  return res.send({ success: false, message: `房间 ${roomId} 不存在` });
});

// Socket.IO
io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    if (createdRooms.includes(roomId)) {
      socket.join(roomId);
      console.log(`Socket ${socket.id} 加入了房间 ${roomId}`);

      // 统计当前房间人数
      const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
      const numClients = clientsInRoom ? clientsInRoom.size : 0;
      console.log(numClients);
      
      if (numClients === 1) {
        // 创建通知
        socket.emit('message', `创建房间 ${roomId} 成功`);
      } else {
        // 加入通知
        io.to(roomId).emit('message', `欢迎新成员加入房间 ${roomId}`);
      }
    } else {
      socket.emit('error', `房间 ${roomId} 不存在`);
    }
  });

  socket.on('message', ({ roomId, message }) => {
    io.to(roomId).emit('message', message);
  });
});


// 启动服务器并监听所有网卡
server.listen(port, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
