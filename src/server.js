const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');
const dgram = require('dgram');
app.use(cors({
  origin: ['http://localhost:8080', 'http://10.252.114.134:8080']
}));

//express socket共同使用3000端口

app.use(cors());
app.use(express.json());

const server = http.createServer(app); // ⬅️ 创建 http.Server
const io = new Server(server, {
  cors: {
    origin: '*', // 或更精细的白名单配置
    methods: ['GET', 'POST']
  }
});

// ✅ 启动服务监听端口，使用同一个 server 实例
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 获取本地IP地址
app.all('/get-local-ip', (req, res) => {
  const interfaces = os.networkInterfaces();
  const ignoredInterfaces = ['vmware', 'virtualbox', 'loopback', 'veth', 'vethernet'];

  let localIp = '127.0.0.1';
  
  for (const interfaceName in interfaces) {

    const nameLower = interfaceName.toLowerCase();
    if (ignoredInterfaces.some(ign => nameLower.includes(ign))) {
      continue; // 忽略虚拟网卡
    }
    
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === 'IPv4' && iface.address !== '127.0.0.1' && !iface.internal) {
        localIp = iface.address;
        break;
      }
    }
  }
  
  res.json({ ip: localIp });
});



app.all('/send-udp-broadcast', (req, res) => {
  const client = dgram.createSocket('udp4');
  client.bind(() => {
    client.setBroadcast(true);
  });
  const message = Buffer.from('FIND_SERVER');
  client.send(message, 0, message.length, 33333, '255.255.255.255', (err) => {
    client.close();
    if (err) {
      console.error('发送UDP广播时出错:', err);
      res.status(500).json({ success: false, message: '发送UDP广播失败' });
    } else {
      res.json({ success: true, message: 'UDP广播发送成功' });
    }
  });
});




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


// // 创建UDP服务器
// const udpServer = dgram.createSocket('udp4');

// udpServer.on('message', (message, remote) => {
//   if (message.toString() === 'FIND_SERVER') {
//     const interfaces = os.networkInterfaces();
//     let localIp = '127.0.0.1';
    
//     for (const interfaceName in interfaces) {
//       const iface = interfaces[interfaceName];
//       for (const alias of iface) {
//         if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
//           localIp = alias.address;
//           break;
//         }
//       }
//     }
    
//     const response = Buffer.from(localIp);
//     udpServer.send(response, 0, response.length, remote.port, remote.address, (err) => {
//       if (err) {
//         console.error('发送UDP响应时出错:', err);
//       }
//     });
//   }
// });

// udpServer.on('listening', () => {
//   const address = udpServer.address();
//   console.log(`UDP服务器监听在 ${address.address}:${address.port}`);
// });

// // 启动UDP服务器
// udpServer.bind(33333);


