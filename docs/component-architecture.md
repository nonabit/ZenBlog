# 组件架构与目录规范

## 目标

通过 `pages -> features -> shared` 分层降低耦合，避免重复实现，保证路由层薄、业务层聚合、共享层稳定。

## 目录职责

```text
src/
├─ pages/        # 路由入口，只做参数组装与页面装配
├─ features/     # 业务特性层，按 home/blog/projects/about 划分
└─ shared/       # 跨特性复用层（layout/navigation/ui/i18n 等）
```

## 依赖边界

1. `pages -> features/shared` 允许。
2. `features -> shared` 允许。
3. `shared -> features/pages` 禁止。
4. `featureA -> featureB` 直接依赖禁止；若有复用需求，下沉到 `shared`。

## 组件归类规则

1. 仅单个业务使用的组件放在 `features/<feature>/components`。
2. 多业务复用组件放在 `shared/components`。
3. 数据查询与映射逻辑必须放在 `features/<feature>/server/*.server.ts`。
4. `pages` 中禁止编写复杂数据清洗与大型 JSX。

## 命名约定

1. 交互组件：`*.client.tsx`。
2. 服务端查询：`*.server.ts`。
3. 类型定义：`*.types.ts` 或 `types.ts`。
4. 避免语义不清命名（如 `Fusion*`），优先业务语义命名（如 `HomeLanding`、`BlogListSection`）。

## 校验方式

执行：

```bash
bun run check:arch
```

该脚本会检测：

1. `shared` 是否违规依赖 `features/pages`。
2. `features` 是否存在跨 feature 直接依赖。
