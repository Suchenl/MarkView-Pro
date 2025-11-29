# MarkView Pro 完整部署指南

本指南将帮助你将 MarkView Pro 部署到静态网站托管服务。

## 📋 前置要求

- Node.js 16+ 已安装
- Git 已安装（可选，用于版本控制）
- 一个静态网站托管服务账号（Vercel、Netlify、GitHub Pages 等）

## 🚀 部署步骤

### 步骤 1: 准备项目

1. **确保项目已清理**
   ```bash
   # 检查项目结构
   ls -la
   ```

2. **清理冗余文件（可选）**
   
   在部署前，可以删除以下本地开发相关的文件：
   
   **可以删除的文件/文件夹：**
   - `quick_start_win/` - Windows 本地开发启动脚本
   - `MarkView.lnk` - Windows 快捷方式文件
   - `.env.local` - 本地环境变量文件（如果存在）
   - `node_modules/` - 依赖包（部署时不需要，但保留在 Git 中用于开发）
   
   **保留的文件：**
   - 所有源代码文件（`.tsx`, `.ts`, `.html` 等）
   - `package.json` 和 `package-lock.json` - 用于安装依赖
   - `vite.config.ts` - 构建配置
   - `tsconfig.json` - TypeScript 配置
   - `README.md` - 项目说明
   - `.gitignore` - Git 忽略配置

3. **安装依赖**
   ```bash
   npm install
   ```

4. **本地测试**
   ```bash
   npm run dev
   ```
   访问 `http://localhost:5183` 确认项目正常运行。

### 步骤 2: 构建生产版本

```bash
npm run build
```

构建完成后，会在项目根目录生成 `dist` 文件夹，包含所有静态文件。

### 步骤 2.5: 上传项目到 GitHub 仓库（可选）

如果你还没有将项目上传到 GitHub，可以按照以下步骤操作：

#### 1. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: 输入仓库名称（如：`MarkView-Pro`）
   - **Description**: 可选，填写项目描述
   - **Visibility**: 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"（如果项目已有 README）
4. 点击 "Create repository"

#### 2. 初始化 Git（如果项目还没有 Git）

在项目根目录打开终端，检查是否已初始化 Git：

```bash
# 检查 Git 状态
git status
```

如果显示 "not a git repository"，需要初始化：

```bash
# 初始化 Git 仓库
git init
```

#### 3. 检查 .gitignore 文件

确保项目根目录有 `.gitignore` 文件，并且包含以下内容（Vite 项目通常已自动生成）：

```
# 依赖
node_modules/
dist/

# 环境变量
.env
.env.local
.env.*.local

# 日志
*.log
npm-debug.log*

# 编辑器
.vscode/
.idea/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# 本地开发文件
quick_start_win/
MarkView.lnk
```

如果没有 `.gitignore` 文件，可以创建一个并添加上述内容。

#### 4. 添加文件到 Git

```bash
# 添加所有文件（.gitignore 中的文件会被自动忽略）
git add .

# 查看将要提交的文件
git status
```

#### 5. 提交代码

```bash
# 提交代码（首次提交）
git commit -m "Initial commit: MarkView Pro project"
```

如果是后续更新：

```bash
git commit -m "Update: 描述你的更改内容"
```

#### 6. 添加远程仓库并推送

GitHub 创建仓库后会显示推送代码的命令，通常如下：

```bash
# 添加远程仓库（将 YOUR_USERNAME 和 YOUR_REPO_NAME 替换为你的实际信息）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 或者使用 SSH（如果已配置 SSH 密钥）
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# 将代码推送到 GitHub（首次推送）
git branch -M main
git push -u origin main
```

**注意：** 如果 GitHub 仓库创建时包含了 README 或 LICENSE，需要先拉取：

```bash
# 先拉取远程仓库内容
git pull origin main --allow-unrelated-histories

# 解决可能的冲突后，再推送
git push -u origin main
```

#### 7. 验证上传成功

1. 访问你的 GitHub 仓库页面
2. 确认所有文件都已上传
3. 检查 `dist` 文件夹是否被正确忽略（不应该出现在仓库中）

#### 常见问题

**问题：推送时要求输入用户名和密码**

**解决：** 使用 Personal Access Token 代替密码，或配置 SSH 密钥：
- 生成 SSH 密钥：`ssh-keygen -t ed25519 -C "your_email@example.com"`
- 将公钥添加到 GitHub：Settings → SSH and GPG keys → New SSH key

**问题：提示 "remote origin already exists"**

**解决：** 先删除再添加：
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**问题：推送被拒绝（push rejected）**

**解决：** 如果远程仓库有内容，需要先拉取：
```bash
git pull origin main --allow-unrelated-histories
# 解决冲突后
git push -u origin main
```

---

### 步骤 3: 选择部署平台

#### 选项 A: Vercel（推荐 - 最简单）

**优点：** 自动检测 Vite 项目，零配置部署

1. **访问 [vercel.com](https://vercel.com)** 并登录（支持 GitHub 账号）

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 Git 仓库（如果没有，先推送到 GitHub）
   - Vercel 会自动检测到 Vite 项目

3. **配置（通常不需要修改）**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 1-2 分钟）
   - 获得一个 `https://your-project.vercel.app` 的 URL

5. **自动更新**
   - 每次推送到 Git 仓库，Vercel 会自动重新部署

**手动部署（不使用 Git）：**
```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目目录执行
vercel

# 按照提示操作
```

---

#### 选项 B: Netlify

**优点：** 支持拖拽部署，简单直观

**方法 1: 拖拽部署**
1. 访问 [netlify.com](https://netlify.com) 并登录
2. 进入 Dashboard，找到 "Sites" 区域
3. 直接将 `dist` 文件夹拖拽到页面
4. 等待上传和部署完成
5. 获得一个 `https://random-name.netlify.app` 的 URL

**方法 2: Git 集成**
1. 访问 [netlify.com](https://netlify.com) 并登录
2. 点击 "Add new site" → "Import an existing project"
3. 连接你的 Git 仓库
4. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击 "Deploy site"

**方法 3: Netlify CLI**
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod --dir=dist
```

---

#### 选项 C: GitHub Pages

**优点：** 免费，与 GitHub 集成

1. **安装 gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **更新 package.json**
   在 `scripts` 中添加：
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **配置 vite.config.ts**
   添加 `base` 配置（如果使用自定义域名，可以省略）：
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/', // 替换为你的仓库名
     // ... 其他配置
   });
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

5. **启用 GitHub Pages**
   - 进入 GitHub 仓库设置
   - 找到 "Pages" 选项
   - Source 选择 "gh-pages" 分支
   - 保存后访问 `https://your-username.github.io/your-repo-name/`

---

#### 选项 D: Cloudflare Pages

**优点：** 全球 CDN，速度快

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 "Pages" → "Create a project"
3. 连接 Git 仓库
4. 配置：
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
5. 点击 "Save and Deploy"

---

#### 选项 E: 其他静态托管服务

**阿里云 OSS / 腾讯云 COS**
1. 构建项目：`npm run build`
2. 将 `dist` 文件夹内容上传到 OSS/COS
3. 配置静态网站托管
4. 绑定自定义域名（可选）

**AWS S3 + CloudFront**
1. 创建 S3 存储桶
2. 上传 `dist` 文件夹内容
3. 启用静态网站托管
4. 配置 CloudFront 分发（可选，用于 CDN）

---

## 🔧 部署后配置

### 自定义域名

大多数平台都支持自定义域名：

1. **Vercel/Netlify**
   - 进入项目设置
   - 找到 "Domains" 选项
   - 添加你的域名
   - 按照提示配置 DNS

2. **GitHub Pages**
   - 在仓库根目录创建 `CNAME` 文件
   - 内容为你的域名（如：`example.com`）
   - 配置 DNS 指向 GitHub Pages

### 环境变量

本项目不需要环境变量，但如果将来需要：
- Vercel: 项目设置 → Environment Variables
- Netlify: Site settings → Environment variables
- GitHub Pages: 不支持环境变量（需要使用其他方式）

### HTTPS

所有主流平台都自动提供 HTTPS 证书，无需额外配置。

---

## 📝 部署检查清单

部署前确认：
- [ ] 项目本地运行正常
- [ ] `npm run build` 成功执行
- [ ] `dist` 文件夹包含所有必要文件
- [ ] 没有控制台错误
- [ ] 所有功能测试通过

部署后验证：
- [ ] 网站可以正常访问
- [ ] 所有页面和功能正常
- [ ] 图片和资源正确加载
- [ ] 移动端显示正常
- [ ] 控制台没有错误

---

## 🐛 常见问题

### 问题 1: 部署后页面空白

**原因：** 路由配置问题（SPA 应用）

**解决：**
- Vercel: 创建 `vercel.json`：
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- Netlify: 创建 `public/_redirects`：
  ```
  /*    /index.html   200
  ```

### 问题 2: 资源路径错误

**原因：** `base` 配置不正确

**解决：** 检查 `vite.config.ts` 中的 `base` 配置，确保与部署路径匹配。

### 问题 3: 构建失败

**原因：** 依赖问题或构建配置错误

**解决：**
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 问题 4: 样式丢失

**原因：** CSS 文件未正确加载

**解决：** 检查 `index.html` 中的 CSS 引用路径。

---

## 🔄 更新部署

### 自动更新（推荐）

如果使用 Git 集成：
1. 修改代码
2. 提交并推送到 Git
3. 平台自动检测并重新部署

### 手动更新

1. 修改代码
2. 重新构建：`npm run build`
3. 重新部署到平台

---

## 📊 性能优化建议

1. **启用压缩**
   - 大多数平台自动启用 Gzip/Brotli 压缩

2. **CDN 加速**
   - Vercel、Netlify、Cloudflare 都提供全球 CDN

3. **缓存策略**
   - 静态资源设置长期缓存
   - HTML 文件不缓存或短期缓存

4. **代码分割**
   - Vite 自动进行代码分割
   - 确保路由懒加载（如果使用路由）

---

## 🎉 完成！

部署完成后，你的 MarkView Pro 就可以在互联网上访问了！

如有问题，请查看：
- [Vercel 文档](https://vercel.com/docs)
- [Netlify 文档](https://docs.netlify.com)
- [GitHub Pages 文档](https://docs.github.com/pages)

