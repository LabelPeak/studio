# 参与贡献

在给项目贡献之前，请先了解以下内容。

## 开发

项目采用 Monorepo 结构，使用 pnpm 作为包管理器。

> [!WARNING]
> 现阶段开发，接口使用 vite 代理请求到 Apifox local mock 数据，所以需要本地打开 Apifox 客户端。
> 
> 预计在 UI 开发周期结束后会关闭代理。
>
> 如需修改数据，请至 Apifox 项目中的高级 Mock 中修改样例。具体配置在 `apps/client/vite.config.ts` 中查看。

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

## 项目目录介绍

- `apps/client` 主包，Studio 本体
  - `src/assets` 一些用到组件中的静态资产，比如图片
  - `src/components` 通用组件，需要在多个场景使用的组件，子目录名字大驼峰
  - `src/configs` 一些配置，包括路由
  - `src/hooks` 一些 React Hooks，包括 Zustand 全局状态和功能性 hook
  - `src/i18n` 国际化字典配置
  - `src/interfaces` 数据模型的类型定义
  - `src/pages` 页面组件，子目录名小写，蛇形，可以放一些页面中专有的组件
  - `src/services` 接口的定义

## Github flow 贡献流程

- fork 本项目，将本项目 clone 至本地
- 创建 feature/fix 分支
- 开发过程中可以使用 `git pull` 或 `git reset` 来同步上游分支代码
- 提交代码到 forked 仓库，commit message 撰写请参照 [Angular Commits 规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits)
- 发起 pr