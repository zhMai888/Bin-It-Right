const express = require('express');
const os = require('os');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

// 存储已创建的房间号
const createdRooms = [];

// 生成 4 位字母房间号
function generateRoomId() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      // 只取 IPv4 且不是内部地址（internal === false）
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// 连接房间接口
app.all('/join-room', (req, res) => {
  const { roomId } = req.query;
  // 验证房间号是否存在
  const isRoomExists = createdRooms.includes(roomId);
  if (isRoomExists) {
    res.send({ message: `成功连接到房间 ${roomId}`, success: true });
  } else {
    res.send({ message: `房间 ${roomId} 不存在`, success: false });
  }
  res.send({ message: `尝试连接到房间 ${roomId}`, success: true });
});

// 创建房间接口
app.all('/create-room', (req, res) => {
  const roomId = generateRoomId();
  // 将新创建的房间号添加到数组中
  createdRooms.push(roomId);
  res.send({ roomId });
});

// 获取客户端 IP 接口
app.all('/get-client-ip', (req, res) => {
  const ip = getLocalIPAddress();
  res.json({ ip });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});