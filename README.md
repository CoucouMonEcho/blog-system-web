# blog-system-web

企业级 DDD 微服务博客系统的前端（前台 + 后台），基于 Next.js 14 + TypeScript + Ant Design + Tailwind + TanStack Query + Axios + Zustand。

## 快速开始

1. 安装依赖

```bash
npm i
```

2. 本地开发

```bash
npm run dev
```

3. 生产构建

```bash
npm run build && npm start
```

4. 环境变量

在 `.env.local` 配置：

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 生产部署（阿里云 ECS）

1) 服务器预装

- 开放安全组端口：80/443（Nginx/APISIX），3000（直连调试）
- 克隆或通过 CI 上传本项目到服务器目录 `/opt/blog-system-web`

2) 一键部署（直连模式，无 Nginx/APISIX）

```bash
cd /opt/blog-system-web
chmod +x deploy/linux/npm_env.sh deploy/linux/deploy_web.sh
./deploy/linux/npm_env.sh
APP_PORT=3000 NEXT_PUBLIC_API_BASE_URL=https://api.example.com \
  ./deploy/linux/deploy_web.sh
```

3) 绑定域名（直连 80）

- 在域名 DNS 设置 A 记录指向 ECS 公网 IP
- 在阿里云安全组放行 80 端口
- 在 GitHub Actions Secrets 设置：`APP_PORT=80`
- 本部署脚本已赋予 systemd 低位端口绑定能力（CAP_NET_BIND_SERVICE），无需 root 运行即可监听 80

完成后，访问 `http://你的域名/` 即可直连服务。

（说明：当前仓库不包含 Nginx/APISIX 方案，直连最省内存、配置最少，适用于 1G 可用内存的轻量服务器。）

## GitHub Actions 部署

工作流：`.github/workflows/deploy-web.yml`

需要在仓库 `Secrets and variables -> Actions` 配置以下 Secrets（工作流会先做预检）：

- `SSH_HOST`、`SSH_USERNAME`、`SSH_PRIVATE_KEY`（必需）
- `NEXT_PUBLIC_API_BASE_URL`、`APP_PORT`(默认 3000)

推送到 `main` 或在 Actions 手动触发后，将自动：

- SSH 创建 `/opt/blog-system-web`
- SCP 同步项目文件
- 服务器需预装 Node（可手动执行 `deploy/linux/npm_env.sh`）
- 远程执行 `deploy_web.sh`（直连，监听 `${APP_PORT}`）
- 调用 `/api/health` 验证健康状态

## 目录结构（关键）

```
src/
  app/                # App Router 页面
    (public)/posts/   # 前台文章列表与详情
    admin/            # 后台：仪表盘/文章/评论/统计
    auth/login/       # 登录页（受保护路由入口）
    api/health/       # 本地 API 示例
  components/         # UI 组件（后续补充）
  providers/          # 全局 Provider（AntD/Query）
  services/           # 请求服务（user/content/...）
  stores/             # 状态管理（Zustand）
  types/              # 类型声明
  lib/                # 工具库（axios 实例等）
```

## 与后端服务约定

- 所有请求默认走网关 `http://localhost:8000`，可通过 `NEXT_PUBLIC_API_BASE_URL` 覆盖。
- 鉴权：登录后会将 `access_token` 写入 Cookie，SSR 与 `middleware` 用于保护 `/admin` 与 `/profile``。`