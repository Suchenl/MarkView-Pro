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

#### 📊 平台选择建议

**如果你需要支持中国用户访问，推荐顺序：**

1. **🥇 Cloudflare Pages（最推荐 - 特别适合中国用户）**
   - ✅ 中国访问：速度很快（在中国有节点，访问稳定）
   - ✅ 免费且无限制：无流量限制、无构建次数限制
   - ✅ 全球 CDN：覆盖全球，速度快
   - ✅ 配置简单：支持自动部署
   - ✅ 支持自定义域名：免费 SSL 证书
   - ⚠️ 需要 Cloudflare 账号（免费注册）

2. **🥈 Vercel**
   - ✅ 最简单：零配置，自动检测 Vite
   - ✅ 全球 CDN：支持多国家快速访问
   - ⚠️ 免费额度限制：100GB 带宽/月，个人项目通常够用
   - ⚠️ 中国访问：速度一般，某些地区可能需要科学上网访问管理界面
   - ✅ 支持自定义域名：免费 SSL 证书

3. **🥉 GitHub Pages（选项C）**
   - ⚠️ 中国访问：可能较慢或不稳定
   - ⚠️ 需要修改 `vite.config.ts` 配置
   - ⚠️ 步骤相对复杂
   - ✅ 完全免费
   - ✅ 与 GitHub 深度集成
   - ✅ 支持自定义域名：免费 SSL 证书

**如果主要用户在中国，也可以考虑：**
- **阿里云 OSS + CDN**：国内访问最快，需要备案
- **腾讯云 COS + CDN**：国内访问快，需要备案

---

#### 选项 A: Vercel（推荐 - 最简单）

**优点：** 
- 自动检测 Vite 项目，零配置部署
- 全球 CDN，支持多国家快速访问
- 每次 Git 推送自动部署
- 免费额度：100GB 带宽/月（个人项目通常够用）
- 支持自定义域名，免费 SSL 证书

**⚠️ 注意：** 
- 中国访问速度一般，某些地区可能需要科学上网访问管理界面
- 如果主要用户在中国，建议优先考虑 Cloudflare Pages

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
   - 获得一个免费的域名：`https://your-project.vercel.app`
   - **这个域名完全免费，可以直接使用！**

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
5. 获得一个免费的域名：`https://random-name.netlify.app`
   - **这个域名完全免费，可以直接使用！**

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

**⚠️ 注意：** 在中国访问可能较慢或不稳定，如果主要用户在中国，建议选择 Vercel 或 Cloudflare Pages

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
   - 保存后获得一个免费的域名：`https://your-username.github.io/your-repo-name/`
   - **这个域名完全免费，可以直接使用！**

---

#### 选项 D: Cloudflare Pages（最推荐 - 特别适合中国用户）

**📚 先了解：Workers vs Pages 的区别**

| 特性 | **Cloudflare Pages** | **Cloudflare Workers** |
|------|---------------------|----------------------|
| **用途** | 部署静态网站（HTML/CSS/JS） | 运行服务器端代码（API、函数） |
| **适合项目** | React、Vue、Vite、静态站点 | 后端 API、边缘计算、服务器逻辑 |
| **构建** | 自动构建（npm run build） | 不需要构建，直接部署代码 |
| **部署命令** | 不需要（自动） | `npx wrangler deploy` |
| **输出** | 静态文件（dist 文件夹） | JavaScript 函数/代码 |
| **配置界面** | Build command、Output directory | Deploy command、API token |
| **你的项目** | ✅ **适合**（Vite + React 静态网站） | ❌ 不适合 |

**简单理解：**
- **Pages** = 部署网站（前端）
- **Workers** = 运行代码（后端/API）

**你的 MarkView Pro 项目应该使用 Pages，不是 Workers！**

---

**优点：** 
- 🚀 中国访问：速度很快且稳定（在中国有节点）
- 💰 免费且无限制：无流量限制、无构建次数限制
- 🌍 全球 CDN：覆盖全球，速度快
- ⚙️ 配置简单：支持自动部署
- 🔒 支持自定义域名：免费 SSL 证书自动配置
- 📦 支持环境变量和构建配置

**详细步骤：**

1. **访问 [Cloudflare Dashboard](https://dash.cloudflare.com)** 并登录

2. **找到 Pages 入口**
   
   你当前看到的可能是 "Account home" 或 "Domains" 页面。要部署项目，需要进入 **Pages**：
   
   **方法 1：通过左侧导航栏**
   - 在左侧导航栏找到 **"BUILD"** 部分（可能需要点击展开）
   - 在 "BUILD" 下找到 **"Pages"** 并点击
   - 或者直接点击左侧导航栏中的 **"Developer Platform"** 标签（在顶部标签栏）
   
   **方法 2：通过顶部标签栏**
   - 在页面顶部，你会看到三个标签："Domains"、"Developer Platform"、"Zero Trust"
   - 点击 **"Developer Platform"** 标签
   - 然后点击 **"Pages"** 或 **"Create application"** → **"Pages"**

3. **创建新项目**
   - 进入 Pages 后，点击 **"Create a project"** 或 **"Create application"** 按钮
   - **重要：** 确保选择的是 **"Pages"**，而不是 **"Workers"**！
   - 选择 **"Connect to Git"** 或 **"Deploy with Git"**

**⚠️ 重要：区分 Pages 和 Workers**

如果你看到的配置界面包含：
- ❌ **"Deploy command: npx wrangler deploy"** → 这是 **Workers**（用于服务器端代码）
- ❌ **"API token"** 配置 → 这是 **Workers**

**正确的 Pages 配置界面应该包含：**
- ✅ **"Build command: npm run build"**
- ✅ **"Build output directory: dist"**
- ✅ **"Framework preset: Vite"**
- ✅ **没有 "Deploy command" 或 "API token"**

**如果你看到的是 Workers 配置界面：**
1. 返回上一页
2. 确保点击的是 **"Pages"**，不是 **"Workers"**
3. 或者直接访问：`https://dash.cloudflare.com/pages`
4. 然后点击 **"Create a project"** → **"Connect to Git"**

4. **连接 Git 仓库**
   - 选择你的 Git 提供商（GitHub、GitLab 或 Bitbucket）
   - 授权 Cloudflare 访问你的仓库
   - 选择你的项目仓库（如 `MarkView-Pro`）

5. **配置构建设置**
   - **Project name**: 输入项目名称（如：`markview-pro`）
   - **Production branch**: 选择 `main` 或 `master`
   - **Framework preset**: 选择 **"None"**（因为 Cloudflare 可能没有单独的 "Vite" 选项，只有 "VitePress"）
   - **Build command**: 手动填写 `npm run build`
   - **Build output directory**: 手动填写 `dist`（注意：不要写 `/dist` 或 `./dist`，只写 `dist`）
   - **Root directory**: 留空（如果项目在仓库根目录）

**⚠️ 注意：** 如果 Framework preset 下拉菜单中没有 "Vite" 选项，只有 "VitePress"：
- **不要选择 "VitePress"**（那是用于文档站点的）
- 选择 **"None"**，然后手动填写 Build command 和 Build output directory

6. **部署**
   - 点击 **"Save and Deploy"** 或 **"Deploy site"**
   - 等待构建完成（通常 2-5 分钟）

7. **获得免费域名**
   - 部署完成后，你会看到一个类似这样的免费域名：
     ```
     https://markview-pro.pages.dev
     ```
   - **这个域名完全免费，可以直接使用和分享！**

**如果找不到 Pages 入口：**
- 确保你登录的是正确的 Cloudflare 账号
- 尝试直接访问：`https://dash.cloudflare.com/pages`
- 或者点击左侧导航栏的 "Recents"（如果有最近使用的 Pages 项目）

**⚠️ 常见构建错误及解决方案：**

**错误：Build failed - Wrangler 相关错误**

如果看到类似这样的错误：
```
The build failed due to an error...
If are uploading a directory of assets...
```

**解决方案：**

1. **检查构建配置**
   - 进入 Cloudflare Pages 项目设置 → **"Settings"** → **"Builds & deployments"**
   - 确认以下配置：
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`（注意：不要有斜杠，直接写 `dist`）
     - **Root directory**: 留空（如果项目在仓库根目录）
     - **Node.js version**: 选择 `18` 或 `20`（推荐）

2. **检查 Framework preset**
   - 在项目设置中，确认 **"Framework preset"** 选择了 **"Vite"**
   - 如果没有，可以手动设置或选择 **"None"** 然后手动配置

3. **清理并重新部署**
   - 在项目设置中，找到 **"Retry deployment"** 或删除失败的部署
   - 重新触发部署

4. **如果仍然失败，尝试手动配置**
   - 在项目根目录创建 `wrangler.toml` 文件（如果 Cloudflare 要求）：
     ```toml
     name = "markview-pro"
     compatibility_date = "2024-01-01"
     
     [site]
     bucket = "./dist"
     ```
   - 或者，更简单的方法：确保 **Build output directory** 设置为 `dist`（不带斜杠）

5. **检查本地构建**
   - 在本地运行 `npm run build`，确保构建成功
   - 检查 `dist` 文件夹是否包含 `index.html` 和所有资源文件

6. **如果问题持续，尝试使用直接上传方式**
   - 在 Cloudflare Pages 中，选择 **"Upload assets"** 而不是 **"Connect to Git"**
   - 手动上传 `dist` 文件夹的内容

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

### 免费域名 vs 自定义域名

#### 💰 不需要购买域名！

**所有平台都提供免费的二级域名，完全不需要购买域名！**

部署完成后，每个平台都会自动分配一个免费的域名：

| 平台 | 免费域名格式 | 示例 |
|------|------------|------|
| **Vercel** | `your-project.vercel.app` | `markview-pro.vercel.app` |
| **Cloudflare Pages** | `your-project.pages.dev` | `markview-pro.pages.dev` |
| **Netlify** | `random-name.netlify.app` | `amazing-markview-123.netlify.app` |
| **GitHub Pages** | `your-username.github.io/your-repo` | `username.github.io/markview-pro` |

**这些免费域名：**
- ✅ 完全免费，永久使用
- ✅ 自动配置 HTTPS（SSL 证书）
- ✅ 全球 CDN 加速
- ✅ 可以直接使用，无需任何额外配置

**自定义域名是可选的**，如果你：
- 想要更专业的域名（如 `markview.com`）
- 已有自己的域名
- 想要品牌化

那么可以配置自定义域名。但如果只是想部署网站，**使用免费域名就完全够用了！**

---

### 自定义域名（可选）

**✅ 所有主流平台都支持自定义域名，并且都提供免费的 SSL 证书（HTTPS）！**

**⚠️ 重要提示：**
- **自定义域名是可选的**，不是必须的！
- 如果你不想花钱，**直接使用平台提供的免费域名就完全够用了**！
- 自定义域名需要你自己购买域名（通常每年 $10-15 左右）
- 购买域名后，可以配置到任何平台上使用

**如果你真的想要免费的自定义域名（不推荐）：**
- 有一些免费的域名服务，但通常有限制或广告
- 例如：Freenom（.tk, .ml, .ga 等免费域名），但可靠性较低
- **建议：直接使用平台提供的免费二级域名，更稳定可靠**

#### 1. Cloudflare Pages（推荐）

**步骤：**
1. 进入 Cloudflare Dashboard → Pages → 你的项目
2. 点击 "Custom domains" → "Set up a custom domain"
3. 输入你的域名（如：`example.com` 或 `www.example.com`）
4. Cloudflare 会自动配置 DNS 和 SSL 证书
5. 如果域名已在 Cloudflare 管理，配置会立即生效
6. 如果域名在其他服务商，按照提示配置 DNS 记录

**优点：**
- 自动配置 DNS 和 SSL
- 如果域名在 Cloudflare，配置最简单
- 免费 SSL 证书自动续期

---

#### 2. Vercel

**步骤：**
1. 进入 Vercel Dashboard → 你的项目 → Settings
2. 点击 "Domains" 标签
3. 输入你的域名（如：`example.com`）
4. 按照提示配置 DNS 记录：
   - 添加 A 记录指向 Vercel 的 IP
   - 或添加 CNAME 记录指向 Vercel 提供的域名
5. Vercel 会自动配置 SSL 证书（通常几分钟内完成）

**DNS 配置示例：**
```
类型: A
名称: @
值: 76.76.21.21

类型: CNAME
名称: www
值: cname.vercel-dns.com
```

---

#### 3. Netlify

**步骤：**
1. 进入 Netlify Dashboard → 你的站点 → Domain settings
2. 点击 "Add custom domain"
3. 输入你的域名
4. 按照提示配置 DNS：
   - 添加 A 记录或 CNAME 记录
5. Netlify 会自动配置 SSL 证书

**DNS 配置示例：**
```
类型: A
名称: @
值: 75.2.60.5

类型: CNAME
名称: www
值: your-site.netlify.app
```

---

#### 4. GitHub Pages

**步骤：**
1. 在仓库根目录创建 `CNAME` 文件（注意：文件名没有扩展名）
2. 文件内容为你的域名，例如：
   ```
   example.com
   ```
   或
   ```
   www.example.com
   ```
3. 提交并推送到仓库：
   ```bash
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```
4. 进入 GitHub 仓库 → Settings → Pages
5. 在 "Custom domain" 输入框中输入你的域名
6. 配置 DNS 记录：
   - 添加 A 记录指向 GitHub Pages 的 IP：
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - 或添加 CNAME 记录指向 `your-username.github.io`

**⚠️ 注意：** GitHub Pages 的 SSL 证书配置可能需要一些时间，通常几分钟到几小时。

---

#### 5. Cloudflare Pages（域名在其他服务商）

如果你的域名不在 Cloudflare 管理：

**步骤：**
1. 在 Cloudflare Pages 中添加自定义域名
2. 按照提示配置 DNS 记录：
   - 添加 CNAME 记录：
     ```
     类型: CNAME
     名称: @ 或 www
     值: your-project.pages.dev
     ```
3. 等待 DNS 传播（通常几分钟到几小时）
4. Cloudflare 会自动配置 SSL 证书

---

### 域名配置检查清单

配置自定义域名后，确认：
- [ ] DNS 记录已正确配置
- [ ] 等待 DNS 传播完成（可用 `nslookup` 或在线工具检查）
- [ ] SSL 证书已自动配置（通常几分钟内）
- [ ] 网站可以通过自定义域名访问
- [ ] HTTPS 正常工作（浏览器显示锁图标）
- [ ] 如果配置了 www 和根域名，两者都能访问

### 常见问题

**Q: 需要购买 SSL 证书吗？**
A: 不需要！所有平台都提供免费的 SSL 证书（Let's Encrypt），会自动配置和续期。

**Q: 配置自定义域名需要多长时间？**
A: DNS 传播通常需要几分钟到几小时，SSL 证书配置通常几分钟内完成。

**Q: 可以同时使用多个域名吗？**
A: 可以！大多数平台支持添加多个域名，都会自动配置 SSL。

**Q: 根域名（example.com）和 www（www.example.com）都要配置吗？**
A: 建议都配置，大多数平台支持自动重定向（如将 example.com 重定向到 www.example.com）。

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

### 问题 3.1: Cloudflare Pages 构建失败 - Wrangler 错误

**错误信息：**
```
Build failed... If are uploading a directory of assets...
```

**原因：** Cloudflare Pages 配置不正确，误用了 Wrangler（Workers 工具）

**解决步骤：**

1. **检查构建输出目录配置**
   - 进入 Cloudflare Pages 项目 → Settings → Builds & deployments
   - 确认 **Build output directory** 设置为 `dist`（不要有斜杠 `/dist` 或 `./dist`）
   - 确认 **Build command** 为 `npm run build`

2. **检查 Framework preset**
   - 在项目设置中，确认选择了 **"Vite"** 或 **"None"**
   - 如果选择了错误的 preset，改为 **"Vite"**

3. **检查 Node.js 版本**
   - 在构建设置中，选择 Node.js 版本为 **18** 或 **20**

4. **重新部署**
   - 删除失败的部署
   - 重新触发部署（Retry deployment）

5. **如果仍然失败，检查本地构建**
   ```bash
   # 确保本地构建成功
   npm run build
   
   # 检查 dist 文件夹
   ls dist/
   # 应该看到 index.html 和 assets 文件夹
   ```

6. **最后手段：手动上传**
   - 如果 Git 部署一直失败，可以尝试：
   - 在 Cloudflare Pages 中选择 "Upload assets"
   - 手动上传 `dist` 文件夹的内容

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

