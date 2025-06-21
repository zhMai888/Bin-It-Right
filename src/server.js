const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');
const dgram = require('dgram');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3030 });
const wss2 = new WebSocket.Server({ port: 3031 });


// 配置中间件
app.use(cors());
app.use(express.json());

var remoteIp = null;
// 房间管理
let currentRoomId = null;

// 创建HTTP服务器和Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 公共函数：获取本地IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const ignoredInterfaces = ['vmware', 'virtualbox', 'loopback', 'veth', 'vethernet'];
  for (const name in interfaces) {
    const nameLower = name.toLowerCase();
    if (ignoredInterfaces.some(ign => nameLower.includes(ign))) {
      continue;
    }
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
}



function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 创建UDP服务器
const udpServer = dgram.createSocket('udp4');
const UDP_PORT = 33333;

udpServer.on('listening', () => {
  udpServer.setBroadcast(true);
  console.log(`UDP 服务端已启动，监听端口 ${UDP_PORT}`);
});

udpServer.on('message', (msg, rinfo) => {
  if (rinfo.port == 33333) {
    console.log(`接收到广播消息来自 ${rinfo.address}:${rinfo.port} 内容: ${msg.toString()}`);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'udp_response',
          data: rinfo.address
        }));
      }
    });
  }
  if (msg.toString() === currentRoomId) {
    remoteIp = rinfo.address;
    const response = getLocalIP();
    udpServer.send(response, UDP_PORT, rinfo.address, () => {
      //websocket让前端跳转
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'udp_response',
            data: 'startOnlineGame'
          }));
        }
      });
      console.log(`回复服务端 IP: ${response}`);
      console.log("开始游戏");
    });
  }else if(msg.toString() === 'ready') {
    // remoteIp = rinfo.address;
    // const response = '';
    
      //websocket让前端跳转
    wss2.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'udp_responseReady',
          data: `remoteReady from ${rinfo.address}`
        }));
      }
    });    
  }else if(msg.toString() === 'finish') {
    // remoteIp = rinfo.address;
    // const response = '';
    
      //websocket让前端跳转
    wss2.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'udp_responseFinish',
          data: `remoteFinish from ${rinfo.address}`
        }));
      }
    });  
  }
});

// 启动UDP服务器
udpServer.bind(UDP_PORT, '0.0.0.0');

// Express路由
app.all('/get-local-ip', (req, res) => {
  res.json({ ip: getLocalIP() });
});

app.all('/send-udp-broadcast', (req, res) => {
  const client = dgram.createSocket('udp4');
  let localIp = getLocalIP();

  client.bind({ address: localIp }, () => {
    client.setBroadcast(true);
    const roomId = req.query.roomId || req.body.roomId;
    if (!roomId) {
      return res.status(400).json({ success: false, message: '未提供房间码' });
    }
    const message = Buffer.from(roomId);

    client.send(message, 0, message.length, UDP_PORT, '255.255.255.255', (err) => {
      client.close();
      if (err) {
        console.error('发送UDP广播时出错:', err);
        res.status(500).json({ success: false, message: '发送UDP广播失败' });
      } else {
        res.json({ success: true, message: `UDP广播从 ${localIp} 发送成功` });
      }
    });
  });
});

app.all('/send-score', (req, res) => {
  const score = req.query.score || req.body.score; // 获取分数
  const targetIp = remoteIp;    // 获取目标IP

  if (!targetIp || !score) {
    return res.status(400).json({ 
      success: false, 
      message: 'IP和Score不能为空' 
    });
  }

  const client = dgram.createSocket('udp4');
  const port = 33333;
  const message = score.toString(); // 直接发送分数（字符串格式）

  client.send(message, port, targetIp, (err) => {
    client.close(); // 发送后关闭socket
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: `发送分数到 ${targetIp}:${port} 失败`,
        error: err.message 
      });
    }
    res.json({ 
      success: true, 
      message: `已发送分数 ${score} 到 ${targetIp}:${port}` 
    });
  });
});


app.all('/send-ready', (req, res) => {
  const targetIp = remoteIp;    // 获取目标IP

  const client = dgram.createSocket('udp4');
  const port = 33333;
  const message = 'ready'; 

  client.send(message, port, targetIp, (err) => {
    client.close(); // 发送后关闭socket
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: `发送ready失败`,
        error: err.message 
      });
    }
    res.json({ 
      success: true, 
      message: `已发送ready到 ${targetIp}:${port}` 
    });
  });
});

app.all('/send-finish', (req, res) => {
  const targetIp = remoteIp;    // 获取目标IP

  const client = dgram.createSocket('udp4');
  const port = 33333;
  const message = 'finish'; 

  client.send(message, port, targetIp, (err) => {
    client.close(); // 发送后关闭socket
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: `发送finish失败`,
        error: err.message 
      });
    }
    res.json({ 
      success: true, 
      message: `已发送finish到 ${targetIp}:${port}` 
    });
  });
});



app.get('/create-room', (req, res) => {
  currentRoomId = generateRoomId();
  res.send({ success: true, roomId: currentRoomId });
});

app.get('/check-room', (req, res) => {
  const { roomId } = req.query;
  const exists = currentRoomId === roomId;
  res.send({ success: exists });
});

app.get('/join-room', (req, res) => {
  const roomId = req.query.roomId || req.body.roomId;
  if (currentRoomId === roomId) {
    return res.send({ success: true, message: `成功连接到房间 ${roomId}` });
  }
  return res.send({ success: false, message: `房间 ${roomId} 不存在` });
});

// Socket.IO
io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    if (currentRoomId === roomId) {
      socket.join(roomId);
      console.log(`Socket ${socket.id} 加入了房间 ${roomId}`);

      const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
      const numClients = clientsInRoom ? clientsInRoom.size : 0;
      
      if (numClients === 1) {
        socket.emit('message', `创建房间 ${roomId} 成功`);
      } else {
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

// 启动HTTP服务器
const HTTP_PORT = 3000;
server.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${HTTP_PORT}`);
});