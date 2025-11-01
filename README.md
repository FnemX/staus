# TGW1914 服务器状态监控系统

## 项目概述
这是一个专门为TGW1914服务器设计的系统状态实时监控网站，基于Node.js开发，支持Linux和Windows系统。系统能够实时展示CPU、内存、磁盘和网络等系统资源的使用情况，并提供历史数据趋势分析。采用前后端分离架构，后端通过systeminformation库获取系统数据，前端使用纯HTML/CSS/JavaScript实现数据可视化展示。

## 🚀 最新功能特性

### 📊 数据可视化增强
- **实时监控**：系统状态数据每5秒自动更新
- **历史数据叠加**：图表加载新数据时保留历史内容，显示趋势变化
- **网络图表优化**：网络信息使用折线图展示，更清晰显示流量趋势
- **智能数据采样**：自动控制数据量，避免图表过于拥挤

### 🔧 系统管理优化
- **日志保留策略**：12小时自动清理机制，控制存储空间
- **实时数据记录**：CPU、内存、磁盘、网络数据自动记录
- **错误处理机制**：完善的异常处理和用户提示
- **性能优化**：内存和文件存储双重限制

### 🎨 用户体验改进
- **响应式设计**：适配不同屏幕尺寸的设备
- **深色主题**：现代化UI设计，减轻视觉疲劳
- **交互效果**：平滑的过渡动画和悬停效果
- **直观展示**：清晰的界面布局，易于理解系统状态

## 🛠️ 技术栈

### 后端技术
- **Node.js**：运行环境
- **Express**：Web框架
- **systeminformation**：系统信息获取库
- **文件系统API**：日志存储和管理

### 前端技术
- **HTML5**：页面结构和语义化标签
- **CSS3**：现代化样式设计和动画效果
- **JavaScript ES6+**：交互逻辑和动态图表绘制
- **SVG图形**：高性能数据可视化

### 数据管理
- **JSON文件存储**：系统日志数据持久化
- **内存缓存**：实时数据快速访问
- **自动清理机制**：存储空间优化

## 📥 安装与部署

### 环境要求
- **Node.js**: 14.x 或更高版本
- **npm**: 包管理器
- **系统权限**: 普通用户权限即可运行

### 🚀 快速开始

1. **下载项目**
   ```bash
   # 克隆仓库
   git clone https://github.com/FnemX/staus.git
   cd staus
   
   # 或直接下载zip文件解压
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动监控服务**
   ```bash
   npm start
   ```

4. **访问监控界面**
   打开浏览器，访问 `http://localhost:3001`

### 🔧 运行状态验证
启动后控制台将显示：
```
服务器运行在 http://localhost:3001
服务器适配TGW1914服务器状态监控使用
监控日志存储在: C:\Users\yueyu\Desktop\tgw stauts\logs
日志保留时间: 12小时（半天）
```

### Windows系统部署

Windows系统上的部署步骤与Linux类似：

1. **安装Node.js**
   - 访问 [Node.js官网](https://nodejs.org/) 下载Windows安装包
   - 运行安装程序，按照向导完成安装

2. **下载项目文件**
   - 从GitHub下载项目zip文件并解压
   - 或者使用Git Bash克隆仓库

3. **安装依赖**
   ```cmd
   npm install
   ```

4. **启动服务器**
   ```cmd
   npm start
   ```

5. **访问网站**
   打开浏览器，访问 `http://localhost:3001`

## 在Linux系统上部署

### 1. 安装Node.js

**Debian/Ubuntu系统**:
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS/RHEL系统**:
```bash
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
```

### 2. 复制项目文件
使用SCP命令将项目文件复制到Linux服务器:
```bash
scp -r staus/* user@your-server-ip:/path/to/destination/
```

### 3. 安装依赖
```bash
cd /path/to/destination/
npm install
```

### 4. 启动服务
直接启动:
```bash
npm start
```

后台运行:
```bash
nohup npm start > app.log 2>&1 &
```

## 主要文件说明

- `server.js`: 后端服务器代码，提供API接口
- `public/index.html`: 前端页面，展示系统监控数据
- `package.json`: 项目配置和依赖管理

## API接口说明

- `GET /api/cpu`: 获取CPU使用情况
- `GET /api/memory`: 获取内存使用情况
- `GET /api/disk`: 获取磁盘使用情况
- `GET /api/network`: 获取网络使用情况
- `GET /api/system`: 获取系统基本信息

## ⚙️ 系统配置

### 服务器端口配置
编辑 `server.js` 文件，修改端口常量：
```javascript
const port = 3001; // 修改为您需要的端口
```

### 日志保留策略
编辑 `server.js` 文件，调整日志保留时间：
```javascript
const MAX_LOG_HOURS = 12; // 修改为需要的保留小时数
```

### 数据存储限制
- **内存缓存**: 最多1000条记录
- **文件存储**: 每个日志文件最多500条记录
- **自动清理**: 每小时执行一次旧日志清理

## 🔄 更新日志

### 最新版本 v1.0.0
- ✅ 网络图表改为折线图显示
- ✅ 历史数据叠加显示功能
- ✅ 12小时日志自动清理机制
- ✅ 智能数据采样控制
- ✅ 完善的错误处理机制

### 主要改进
1. **数据可视化**: 网络流量使用折线图，更清晰显示趋势
2. **历史数据**: 图表加载新数据时保留历史内容
3. **存储优化**: 12小时自动清理，控制存储空间
4. **性能优化**: 智能采样避免数据过多
5. **用户体验**: 平滑动画和交互效果

## 系统权限说明

在Linux系统上，某些系统信息可能需要较高权限才能访问。建议以普通用户身份运行，系统会自动获取可访问的信息。

## 防火墙设置

如果服务器启用了防火墙，需要开放相应端口:
```bash
# 对于ufw防火墙
sudo ufw allow 3001/tcp

# 对于firewalld防火墙
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

## License

[GPL-3.0](LICENSE)

## 作者

XNTX

## 项目地址

[https://github.com/FnemX/staus](https://github.com/FnemX/staus)
