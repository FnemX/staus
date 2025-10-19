# Linux系统状态监控网站

## 项目概述
这是一个基于Node.js开发的Linux系统状态实时监控网站，能够展示CPU、内存、磁盘和网络等系统资源的使用情况。系统采用前后端分离架构，后端通过systeminformation库获取系统数据，前端使用纯HTML/CSS/JavaScript实现数据可视化展示。项目主要适用于服务器的系统状态监控。

## 功能特性

- **实时监控**：系统状态数据每5秒自动更新
- **完整数据展示**：监控CPU、内存、磁盘和网络状态
- **轻量级实现**：纯HTML/CSS/JavaScript前端，无需外部依赖
- **响应式设计**：适配不同屏幕尺寸的设备
- **简单易用**：直观的界面展示，易于理解系统状态

## 技术栈

### 后端
- **Node.js**：运行环境
- **Express**：Web框架
- **systeminformation**：系统信息获取库

### 前端
- **HTML5**：页面结构
- **CSS3**：样式设计
- **JavaScript**：交互逻辑和图表绘制

## 安装与部署

### 环境要求
- Node.js 14.x 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/FnemX/staus.git
   cd staus
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动服务器**
   ```bash
   npm start
   ```

4. **访问网站**
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

## 自定义配置

### 修改服务器端口
编辑 `server.js` 文件，修改 `PORT` 常量:
```javascript
const PORT = 3001; // 修改为您需要的端口
```

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

FnemX

## 项目地址

[https://github.com/FnemX/staus](https://github.com/FnemX/staus)