const express = require('express');
const si = require('systeminformation');
const app = express();
const port = 3000;

// 设置静态文件目录
app.use(express.static('public'));

// API端点：获取CPU信息
app.get('/api/cpu', async (req, res) => {
  try {
    const cpuData = await si.cpu();
    const cpuTemperature = await si.cpuTemperature();
    const cpuLoad = await si.currentLoad();
    res.json({
      info: cpuData,
      temperature: cpuTemperature,
      load: cpuLoad
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API端点：获取内存信息
app.get('/api/memory', async (req, res) => {
  try {
    const memoryData = await si.mem();
    res.json(memoryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API端点：获取磁盘信息
app.get('/api/disk', async (req, res) => {
  try {
    const diskLayout = await si.diskLayout();
    const fsSize = await si.fsSize();
    res.json({
      layout: diskLayout,
      fsSize: fsSize
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API端点：获取网络信息
app.get('/api/network', async (req, res) => {
  try {
    const networkInterfaces = await si.networkInterfaces();
    const networkStats = await si.networkStats();
    res.json({
      interfaces: networkInterfaces,
      stats: networkStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API端点：获取系统信息
app.get('/api/system', async (req, res) => {
  try {
    const osInfo = await si.osInfo();
    const uptime = await si.time();
    res.json({
      os: osInfo,
      uptime: uptime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器
const PORT = 3001; // 从3000修改为3001
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});