const dgram = require('dgram');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const ignoredInterfaces = ['vmware', 'virtualbox', 'loopback', 'veth', 'vethernet'];
  for (const name in interfaces) {
    
    const nameLower = name.toLowerCase();
    if (ignoredInterfaces.some(ign => nameLower.includes(ign))) {
      continue; // 忽略虚拟网卡
    }

    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
}

const udpServer = dgram.createSocket('udp4');
const PORT = 33333;

udpServer.on('listening', () => {
    udpServer.setBroadcast(true);
    console.log(`UDP 服务端已启动，监听端口 ${PORT}`);
});

udpServer.on('message', (msg, rinfo) => {
  console.log(`接收到广播消息来自 ${rinfo.address}:${rinfo.port} 内容: ${msg.toString()}`);
  const response = getLocalIP();
  udpServer.send(response, rinfo.port, rinfo.address, () => {
    console.log(`回复服务端 IP: ${response}`);
  });
});

udpServer.bind(PORT,'0.0.0.0');
