# 参与贡献

在给项目贡献之前，请先了解以下内容。

## 开发

项目采用 Monorepo 结构，使用 pnpm 作为包管理器。

```sh
# 需配置 github ssh key 才能正常拉取子仓库代码
git clone git@github.com:LabelPeak/studio.git

cd studio

## 创建一个新分支
git checkout -b feat/a-new-feature

# 开发预览
pnpm i
pnpm dev:client
```

若需要给一个子包安装依赖

```sh
# 给 client 包安装依赖
pnpm i deps-name --filter client
```

## Github flow 贡献流程

- fork 本项目，将本项目 clone 至本地
- 创建 feature/fix 分支
- 开发过程中可以使用 `git pull` 或 `git reset` 来同步上游分支代码
- 提交代码到 forked 仓库，commit message 撰写请参照 [Angular Commits 规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits)
- 发起 pr