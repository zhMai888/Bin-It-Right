const dgram = require('dgram');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
}

const udpServer = dgram.createSocket('udp4');
const PORT = 3000;

udpServer.on('listening', () => {
  console.log(`UDP 服务端已启动，监听端口 ${PORT}`);
});

udpServer.on('message', (msg, rinfo) => {
  console.log(`接收到广播消息来自 ${rinfo.address}:${rinfo.port} 内容: ${msg.toString()}`);
  const response = getLocalIP();
  udpServer.send(response, rinfo.port, rinfo.address, () => {
    console.log(`回复服务端 IP: ${response}`);
  });
});

udpServer.bind(PORT);
