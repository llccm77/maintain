# 宿舍维修管理系统

## 项目简介

宿舍维修管理系统是一个基于 Vue 3 + Django 5 构建的现代化 Web 应用程序，旨在为学校宿舍管理提供高效的维修报修流程管理解决方案。系统通过数字化手段建立完整的宿舍维修管理体系，提高维修效率和服务质量。

## 技术架构

### 前端技术栈
- **Vue 3.5.18** - 响应式前端框架
- **Element Plus 2.8.8** - 现代化 UI 组件库
- **Vue Router 4.5.1** - 前端路由管理
- **Pinia 2.2.8** - 状态管理
- **Axios 1.11.0** - HTTP 客户端
- **ECharts 5.5.1** - 数据可视化图表
- **Vite 7.0.6** - 现代化构建工具

### 后端技术栈
- **Django 5.2.6** - Python Web 框架
- **MySQL** - 关系型数据库
- **PyMySQL 1.1.2** - Python MySQL 驱动
- **Django CORS Headers** - 跨域资源共享支持
- **SimpleUI** - Django 管理后台美化主题

### 开发环境要求
- **Node.js**: ^20.19.0 || >=22.12.0
- **Python**: 3.9+
- **MySQL**: 8.0+

## 项目结构

```
maintain/
├── backend/                    # Django 后端
│   ├── dormitory_repair/       # 核心应用模块
│   │   ├── models.py          # 数据模型
│   │   ├── views.py           # 视图逻辑
│   │   ├── admin.py           # 管理后台配置
│   │   └── urls.py            # URL 路由
│   ├── myproject/             # Django 项目配置
│   │   ├── settings.py        # 项目设置
│   │   ├── urls.py            # 主路由配置
│   │   └── wsgi.py            # WSGI 配置
│   ├── simpleui/              # SimpleUI 主题包
│   └── manage.py              # Django 管理脚本
├── front/                     # Vue 前端
│   ├── src/
│   │   ├── api/               # API 接口封装
│   │   ├── components/        # 可复用组件
│   │   ├── views/             # 页面组件
│   │   ├── router/            # 路由配置
│   │   ├── stores/            # 状态管理
│   │   └── utils/             # 工具函数
│   ├── package.json           # 前端依赖配置
│   └── vite.config.js         # Vite 构建配置
├── requirements.txt           # Python 依赖
└── README.md                  # 项目文档
```

## 核心功能模块

### 1. 用户管理
- 用户登录/注销
- 基于角色的权限控制
- 用户信息管理

### 2. 宿舍管理
- 宿舍信息的增删改查
- 楼栋、房间号、楼层管理
- 学生住宿分配管理

### 3. 学生管理
- 学生信息维护
- 宿舍分配与取消
- 学生住宿状态跟踪

### 4. 报修工单管理
- 工单的创建、分配、处理
- 工单状态流转管理
- 故障类型和优先级设置
- 维修进度跟踪

### 5. 数据统计
- 系统核心指标展示
- 工单统计分析
- 可视化数据报表

### 6. 系统设置
- SimpleUI 界面定制
- 系统参数配置
- 管理后台个性化

## 快速开始

### 环境准备

1. **安装 Node.js**
   ```bash
   # 确保 Node.js 版本符合要求
   node --version  # 应该是 20.19.0+ 或 22.12.0+
   npm --version
   ```

2. **安装 Python**
   ```bash
   # 确保 Python 版本为 3.9+
   python --version  # 或 python3 --version
   pip --version     # 或 pip3 --version
   ```

3. **安装 MySQL**
   ```bash
   # macOS (使用 Homebrew)
   brew install mysql
   brew services start mysql
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server
   sudo systemctl start mysql
   
   # 创建数据库
   mysql -u root -p
   CREATE DATABASE myproject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### 后端启动

1. **进入后端目录**
   ```bash
   cd backend
   ```

2. **创建虚拟环境（推荐）**
   ```bash
   # 创建虚拟环境
   python -m venv venv
   
   # 激活虚拟环境
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **安装依赖**
   ```bash
   pip install -r ../requirements.txt
   ```

4. **配置数据库**
   
   编辑 `myproject/settings.py` 中的数据库配置（如有需要）：
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'myproject',
           'USER': 'root',
           'PASSWORD': '123456',  # 修改为你的密码
           'HOST': 'localhost',
           'PORT': '3306',
           'OPTIONS': {
               'charset': 'utf8mb4',
           },
       }
   }
   ```

5. **执行数据库迁移**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **创建管理员账户**
   ```bash
   python manage.py createsuperuser
   ```

7. **启动开发服务器**
   ```bash
   python manage.py runserver
   ```
   
   后端服务将在 `http://127.0.0.1:8000` 启动

8. **访问管理后台**
   
   打开浏览器访问：`http://127.0.0.1:8000/admin/`
   使用刚创建的管理员账户登录

### 前端启动

1. **新开终端，进入前端目录**
   ```bash
   cd front
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   前端服务将在 `http://localhost:5173` 启动，并自动打开浏览器

### 验证安装

1. **后端验证**
   - 访问 `http://127.0.0.1:8000/admin/` 确认管理后台正常
   - 访问 `http://127.0.0.1:8000/api/` 相关接口确认 API 正常

2. **前端验证**
   - 访问 `http://localhost:5173` 确认前端页面正常加载
   - 检查浏览器控制台无错误信息

3. **前后端通信验证**
   - 在前端页面尝试登录功能
   - 确认数据能正常在前后端之间传输

## 开发指南

### API 接口说明

系统提供以下主要 API 接口：

- `GET /api/auth/` - 用户认证相关接口
- `GET /api/dormitory/` - 宿舍管理接口
- `GET /api/student/` - 学生管理接口
- `GET /api/repair/` - 报修工单接口
- `GET /api/system/` - 系统设置接口

### 前端开发

**开发服务器配置：**
- 端口：5173
- 自动打开浏览器
- 热重载支持
- 代理配置已设置，前端请求会自动转发到后端

**构建生产版本：**
```bash
npm run build
```

**预览生产版本：**
```bash
npm run preview
```

### 后端开发

**Django 管理命令：**
```bash
# 创建新应用
python manage.py startapp app_name

# 生成迁移文件
python manage.py makemigrations

# 应用迁移
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 收集静态文件（生产环境）
python manage.py collectstatic
```

## 数据库设计

### 核心数据模型

1. **Dormitory（宿舍）**
   - building_name: 楼栋名称
   - room_number: 房间号
   - floor: 楼层

2. **Student（学生）**
   - student_id: 学号
   - name: 姓名
   - phone: 联系电话
   - dormitory: 分配宿舍（外键）

3. **RepairOrder（报修工单）**
   - title: 工单标题
   - description: 问题描述
   - student: 报修学生（外键）
   - dormitory: 宿舍（外键）
   - status: 工单状态
   - fault_type: 故障类型
   - priority: 优先级

## 部署说明

### 开发环境部署
按照上述"快速开始"步骤即可完成开发环境的部署。

### 生产环境部署

1. **前端构建**
   ```bash
   cd front
   npm run build
   ```

2. **后端配置**
   - 修改 `settings.py` 中的 `DEBUG = False`
   - 配置 `ALLOWED_HOSTS`
   - 设置安全的 `SECRET_KEY`
   - 配置静态文件服务

3. **Web 服务器**
   - 推荐使用 Nginx + Gunicorn 部署
   - 配置反向代理和静态文件服务

## 故障排除

### 常见问题

1. **数据库连接错误**
   - 检查 MySQL 服务是否启动
   - 验证数据库配置信息
   - 确认数据库已创建

2. **前端无法访问后端 API**
   - 检查 CORS 配置
   - 验证代理配置
   - 确认后端服务正常运行

3. **依赖安装失败**
   - 更新 pip/npm 到最新版本
   - 检查网络连接
   - 尝试使用国内镜像源

### 调试技巧

1. **后端调试**
   ```bash
   # 启用详细日志
   python manage.py runserver --verbosity=2
   
   # Django Shell 调试
   python manage.py shell
   ```

2. **前端调试**
   - 使用浏览器开发者工具
   - 检查 Network 面板的 API 请求
   - 查看 Console 面板的错误信息

## 贡献指南

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目仓库：[GitHub Repository URL]
- 邮箱：[your-email@example.com]
- 文档：[Documentation URL]

---

**最后更新：** 2025-09-09
**版本：** v1.0.0