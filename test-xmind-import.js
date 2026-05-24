const fs = require('fs');
const path = require('path');

// 测试 XMind 文件路径
const testFile = '/Users/andy/Desktop/02 AI+产品/HarmonyOS 开发.xmind';

console.log('Testing XMind import...');
console.log('File:', testFile);
console.log('File exists:', fs.existsSync(testFile));

if (fs.existsSync(testFile)) {
  const stats = fs.statSync(testFile);
  console.log('File size:', stats.size, 'bytes');

  // 读取文件前几个字节，检查是否是 ZIP 格式
  const buffer = fs.readFileSync(testFile);
  const header = buffer.slice(0, 4);
  console.log('File header (hex):', header.toString('hex'));
  console.log('Is ZIP file:', header[0] === 0x50 && header[1] === 0x4B);
}
