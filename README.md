<br>

<p align="center">
<img src="https://api.iconify.design/fluent-emoji:dog-face.svg" style="width:100px;" />
</p>

# Dormitory Management Api

基于 `Nitro` 和 `Arco Design Vue-Pro` 搭建的一站式宿舍管理系统。该系统旨在提供一个方便、高效的宿舍管理解决方案，帮助管理员和学生更好地管理宿舍信息。

# Nitro starter

Look at the [nitro quick start](https://nitro.unjs.io/guide#quick-start) to learn more how to get started.

# 使用指南

## 环境要求
- Node.js >= 18.16.0
- Docker Desktop
- pnpm

## 快速开始
```bash
# server
pnpm install
pnpm run dev
pnpm run build # 打包部署

# client
cd client
pnpm install
pnpm run dev
pnpm run build # 打包部署
```

# Docker Desktop

> 数据库初始化，初始管理员账号密码为：admin/admin123

```bash
# 启动服务
docker compose up -d 

# 查看服务状态
docker compose ps

# 停止服务
docker compose down
```

# 系统设计

### 1. 用户管理模块
基于 `Users` 表：

- 用户登录/注册页面
- 用户信息管理页面
- 用户角色分配（支持admin/student/maintenance/dorm_staff四种角色）
- 个人信息维护页面
### 2. 宿舍楼管理模块
基于 `Buildings` 表：

- 宿舍楼列表页面
- 宿舍楼信息管理
- 宿舍楼与宿管员关联管理
### 3. 宿舍管理模块
基于 `Dorms` 表：

- 宿舍列表页面
- 宿舍信息管理（宿舍号、容量等）
- 宿舍分配管理
### 4. 学生住宿管理模块
基于 `Student_Dorm` 表：

- 学生入住登记页面
- 学生住宿信息查询
- 学生调宿管理
- 退宿管理
### 5. 宿舍检查管理模块
基于 `Dorm_Inspections` 表：

- 宿舍检查记录页面
- 宿舍检查登记
- 检查结果统计分析
### 6. 晚归管理模块
基于 `Late_Returns` 表：

- 晚归登记页面
- 晚归记录查询
- 晚归统计分析
### 7. 维修管理模块
基于 `Repairs` 表：

- 维修申请页面
- 维修工单管理
- 维修进度跟踪
- 维修统计分析
### 8. 仪表盘
根据 `dashboard.ts` 的接口定义：

- 总体概览（楼栋数、宿舍数、学生数、待处理维修数）
- 入住趋势分析
- 维修工单统计