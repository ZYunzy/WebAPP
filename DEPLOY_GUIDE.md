# 🚀 快速部署到 GitHub Pages

## 步骤1：配置 Git 身份

在项目根目录打开终端（PowerShell），执行：

```powershell
# 仅为当前项目配置
git config user.name "你的名字"
git config user.email "your.email@example.com"

# 验证配置
git config user.name
git config user.email
```

## 步骤2：检查远程仓库

```powershell
# 查看远程仓库
git remote -v

# 如果没有，添加远程仓库
git remote add origin https://github.com/zyunzy/SlumMapping.git
```

## 步骤3：提交所有更改

```powershell
# 查看当前状态
git status

# 添加所有文件
git add .

# 提交（建议换成描述性的提交信息）
git commit -m "完成前端页面开发 - 基于Leaflet.js的交互式地图"

# 查看提交历史
git log --oneline -5
```

## 步骤4：推送到 GitHub

```powershell
# 首次推送并设置上游分支
git push -u origin main

# 之后只需
git push
```

如果遇到认证问题：
- HTTPS 方式：需要使用 GitHub Personal Access Token (PAT)
- SSH 方式：需要配置 SSH 密钥

### 获取 GitHub PAT
1. 登录 GitHub
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. Generate new token → 勾选 `repo` 权限
4. 复制生成的 token（只显示一次）
5. 推送时用 token 作为密码

## 步骤5：启用 GitHub Pages

### 方法 A：通过网页设置（推荐）

1. 访问 https://github.com/zyunzy/SlumMapping
2. 点击 **Settings**（设置）
3. 左侧菜单找到 **Pages**
4. 在 "Source" 部分：
   - Branch: 选择 `main`
   - Folder: 选择 `/root` （根目录）
   - 点击 **Save**
5. 等待几分钟，页面会显示访问地址

### 方法 B：通过命令行设置

```powershell
# 创建 gh-pages 分支（可选）
git checkout -b gh-pages
git push -u origin gh-pages

# 切回 main 分支
git checkout main
```

## 步骤6：配置前端路径（重要！）

因为你的前端文件在 `frontend/` 目录，有两个选择：

### 选项 A：移动 index.html 到根目录

```powershell
# 复制或移动 frontend/index.html 到根目录
Copy-Item frontend\index.html .

# 修改 index.html 中的路径
# 将 css/style.css 改为 frontend/css/style.css
# 将 js/config.js 改为 frontend/js/config.js
# 等等...
```

### 选项 B：让用户访问 frontend 目录（推荐）

用户访问时使用：
```
https://zyunzy.github.io/SlumMapping/frontend/
```

或者创建根目录的 index.html 重定向：

```powershell
# 在根目录创建 index.html
@"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=frontend/">
    <title>Redirecting...</title>
</head>
<body>
    <p>正在跳转到地图页面...</p>
    <p>如果没有自动跳转，请点击: <a href="frontend/">这里</a></p>
</body>
</html>
"@ | Out-File -FilePath index.html -Encoding UTF8

git add index.html
git commit -m "添加根目录重定向"
git push
```

## 步骤7：访问你的网站

部署完成后（通常需要 1-5 分钟），访问：

```
https://zyunzy.github.io/SlumMapping/
```

或直接访问前端：

```
https://zyunzy.github.io/SlumMapping/frontend/
```

## 🔄 后续更新流程

每次修改后：

```powershell
# 1. 查看修改
git status

# 2. 添加文件
git add .

# 3. 提交
git commit -m "描述你的修改"

# 4. 推送
git push

# 等待 1-2 分钟，刷新网页查看更新
```

## ✅ 验证清单

- [ ] Git 身份已配置
- [ ] 远程仓库已添加
- [ ] 代码已推送到 GitHub
- [ ] GitHub Pages 已启用
- [ ] 网站可以正常访问
- [ ] 地图可以正常显示
- [ ] 图层切换正常工作

## 🐛 常见问题

### Q: 推送时提示 "Permission denied"
A: 检查 GitHub 登录凭据，使用 PAT 而不是密码

### Q: 网站显示 404
A: 等待几分钟让 GitHub 部署，确认 Pages 设置正确

### Q: 地图不显示
A: 检查浏览器控制台（F12），查看是否有资源加载错误

### Q: 样式丢失
A: 检查 HTML 中的 CSS/JS 路径是否正确

### Q: 想要使用自定义域名
A: 在 GitHub Pages 设置中添加 Custom domain，并配置 DNS

## 📱 测试你的网站

部署后建议在以下环境测试：

- [ ] Chrome / Edge
- [ ] Firefox
- [ ] Safari (如果有 Mac)
- [ ] 手机浏览器
- [ ] 不同屏幕尺寸

## 🎉 完成！

恭喜！你的地图网站已经上线了！

接下来可以：
- 添加真实数据
- 自定义样式和配色
- 添加更多功能
- 分享给朋友

---

需要帮助？
- 查看 [GitHub Pages 文档](https://docs.github.com/pages)
- 查看 [Leaflet 文档](https://leafletjs.com/)
- 在项目 Issues 中提问
