const express = require('express');
const si = require('systeminformation');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// 日志存储配置
const LOG_DIR = path.join(__dirname, 'logs');
const MAX_LOG_HOURS = 12; // 日志保留小时数（半天）保留7天的日志

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// 日志存储对象
let systemLogs = {
  cpu: [],
  memory: [],
  disk: [],
  network: [],
  ports: []
};

// 日志记录函数
function logSystemData(type, data) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp: timestamp,
    data: data
  };
  
  // 添加到内存中的日志
  if (systemLogs[type]) {
    systemLogs[type].push(logEntry);
    
    // 限制日志数量，最多保留1000条记录
    if (systemLogs[type].length > 1000) {
      systemLogs[type] = systemLogs[type].slice(-1000);
    }
  }
  
  // 写入文件日志（每天一个文件）
  const today = new Date().toISOString().split('T')[0];
  const logFile = path.join(LOG_DIR, `${type}_${today}.json`);
  
  try {
    let existingLogs = [];
    if (fs.existsSync(logFile)) {
      const fileContent = fs.readFileSync(logFile, 'utf8');
      existingLogs = JSON.parse(fileContent);
    }
    
    existingLogs.push(logEntry);
    
    // 限制文件中的日志数量
    if (existingLogs.length > 500) {
      existingLogs = existingLogs.slice(-500);
    }
    
    fs.writeFileSync(logFile, JSON.stringify(existingLogs, null, 2));
  } catch (error) {
    console.error(`写入日志文件错误 (${type}):`, error.message);
  }
}

// 清理旧日志文件
function cleanupOldLogs() {
  try {
    if (!fs.existsSync(LOG_DIR)) return;
    
    const files = fs.readdirSync(LOG_DIR);
    const now = new Date();
    const cutoffTime = now.getTime() - (MAX_LOG_HOURS * 60 * 60 * 1000);
    
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(LOG_DIR, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
          console.log(`清理旧日志文件: ${file}`);
        }
      }
    });
  } catch (error) {
    console.error('清理旧日志失败:', error);
  }
}

// 启动时清理旧日志
cleanupOldLogs();
// 每小时定时清理旧日志
setInterval(cleanupOldLogs, 60 * 60 * 1000);

// 设置静态文件目录
app.use(express.static('public'));

// API端点：获取CPU信息
app.get('/api/cpu', async (req, res) => {
  try {
    const cpuData = await si.cpu();
    const cpuTemperature = await si.cpuTemperature();
    const cpuLoad = await si.currentLoad();
    const responseData = {
      info: cpuData,
      temperature: cpuTemperature,
      load: cpuLoad
    };
    
    // 记录CPU日志
    logSystemData('cpu', {
      load: cpuLoad.currentLoad,
      temperature: cpuTemperature.main,
      cores: cpuLoad.cpus ? cpuLoad.cpus.length : 0
    });
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API端点：获取内存信息
app.get('/api/memory', async (req, res) => {
  try {
    const memoryData = await si.mem();
    
    // 记录内存日志
    logSystemData('memory', {
      total: memoryData.total,
      used: memoryData.used,
      free: memoryData.free,
      usage: Math.round((memoryData.used / memoryData.total) * 100)
    });
    
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
    const responseData = {
      layout: diskLayout,
      fsSize: fsSize
    };
    
    // 记录磁盘日志
    if (fsSize && fsSize.length > 0) {
      const mainDisk = fsSize[0]; // 主要磁盘
      logSystemData('disk', {
        total: mainDisk.size,
        used: mainDisk.used,
        free: mainDisk.available,
        usage: Math.round((mainDisk.used / mainDisk.size) * 100),
        mount: mainDisk.mount
      });
    }
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API端点：获取网络信息
app.get('/api/network', async (req, res) => {
  try {
    const networkInterfaces = await si.networkInterfaces();
    const networkStats = await si.networkStats();
    const responseData = {
      interfaces: networkInterfaces,
      stats: networkStats
    };
    
    // 记录网络日志
    if (networkStats && networkStats.length > 0) {
      const mainInterface = networkStats[0]; // 主要网络接口
      logSystemData('network', {
        rx_bytes: mainInterface.rx_bytes,
        tx_bytes: mainInterface.tx_bytes,
        rx_sec: mainInterface.rx_sec,
        tx_sec: mainInterface.tx_sec
      });
    }
    
    res.json(responseData);
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

// API端点：检测端口状态
app.get('/api/ports', async (req, res) => {
  try {
    const net = require('net');
    
    // 检测8000端口（游戏端口）
    const checkPort = (port) => {
      return new Promise((resolve) => {
        const socket = new net.Socket();
        const timeout = 2000; // 2秒超时
        
        socket.setTimeout(timeout);
        socket.on('connect', () => {
          socket.destroy();
          resolve({ port: port, status: 'open', name: port === 8000 ? '游戏端口' : `端口${port}` });
        });
        
        socket.on('timeout', () => {
          socket.destroy();
          resolve({ port: port, status: 'timeout', name: port === 8000 ? '游戏端口' : `端口${port}` });
        });
        
        socket.on('error', () => {
          resolve({ port: port, status: 'closed', name: port === 8000 ? '游戏端口' : `端口${port}` });
        });
        
        socket.connect(port, '127.0.0.1');
      });
    };
    
    // 检测多个端口
    const portsToCheck = [8000, 22, 80, 3001]; // 游戏端口和常用端口
    const portResults = await Promise.all(portsToCheck.map(checkPort));
    
    // 记录端口状态日志
    const portStatus = {};
    portResults.forEach(result => {
      portStatus[result.port] = result.status;
    });
    
    logSystemData('ports', portStatus);
    
    res.json(portResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API端点：获取监控日志
app.get('/api/logs', async (req, res) => {
  try {
    const { type, date } = req.query;
    
    if (!type) {
      return res.status(400).json({ error: '缺少日志类型参数' });
    }
    
    let logs = [];
    
    if (date) {
      // 获取指定日期的日志文件
      const logFile = path.join(LOG_DIR, `${type}_${date}.json`);
      if (fs.existsSync(logFile)) {
        const fileContent = fs.readFileSync(logFile, 'utf8');
        logs = JSON.parse(fileContent);
      }
    } else {
      // 获取内存中的最新日志
      logs = systemLogs[type] || [];
    }
    
    res.json({
      type: type,
      date: date || 'current',
      count: logs.length,
      logs: logs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API端点：获取可用的日志文件列表
app.get('/api/logs/files', async (req, res) => {
  try {
    const files = fs.readdirSync(LOG_DIR);
    const logFiles = files.filter(file => file.endsWith('.json'));
    
    const fileList = logFiles.map(file => {
      const [type, date] = file.replace('.json', '').split('_');
      return {
        filename: file,
        type: type,
        date: date,
        size: fs.statSync(path.join(LOG_DIR, file)).size
      };
    });
    
    res.json({
      total: fileList.length,
      files: fileList
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器
const PORT = 3001; // 从3000修改为3001
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`服务器适配TGW1914服务器状态监控使用`);
  console.log(`监控日志存储在: ${LOG_DIR}`);
  console.log(`日志保留时间: ${MAX_LOG_HOURS}小时（半天）`);
});