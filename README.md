# 魔王守衛戰：流派覺醒

> 單檔 HTML5 Canvas 塔防遊戲，融合動作、生存、Roguelite 成長與流派構築

## 🎮 線上遊玩

- GitHub Pages：`https://c2h5oh0802.github.io/TDGame/TD.html`

## 📁 專案結構（已進行架構現代化）

### 核心模組 (TypeScript)

```
src/
├── core/            # 核心系統（GameState、Sound、Input 等）
├── entities/        # 遊戲實體類別
├── systems/         # 遊戲系統（尋路、波次、升級等）
├── data/            # 資料驅動配置（敵人、建築、波次、卡片）
├── ui/              # UI 系統
└── utils/           # 工具函數
```

### 舊版相容檔案

- `TD.html`：遊戲主程式（遺留）
- `index.html`：入口轉跳頁

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev        # 啟動 Vite 開發伺服器
```

### 執行測試

```bash
npm run test:run   # 執行所有單元測試
npm run test       # 監視模式（開發時使用）
```

### 編譯檢查

```bash
npm run typecheck  # TypeScript 嚴格檢查
```

### 建置生產版本

```bash
npm run build      # 編譯為最適化的生產版本
npm run preview    # 預覽生產版本
```

## 🎮 遊戲操作

### 基本操作

- `W / A / S / D`：移動
- `滑鼠左鍵（按住）`：攻擊 / 建造
- `F`：靠近建築時升級/修復
- `X`：靠近建築時拆除
- `Z`：切換小兵模式（主動 → 防守 → 跟隨）
- `空白鍵`：提早開始下一波
- `ESC`：暫停遊戲

### Roguelite 系統

- **貨幣**：靈魂 (👻)
- **進度存檔**：localStorage（Key：`tdgameMeta`）
- **升級類型**：
  - 可疊加升級：攻擊、速度、血量、核心血量、開局金幣、靈魂倍率
  - 一次性解鎖：起始建築、額外卡槽、召喚上限、幸運祝福、無盡模式

## 📊 技術棧

| 項目 | 技術 |
|------|------|
| **語言** | TypeScript |
| **編譯器** | Vite |
| **測試** | Vitest + jsdom |
| **渲染** | HTML5 Canvas 2D |
| **音效** | Web Audio API |
| **儲存** | localStorage |

## ✨ 架構改進亮點

### 1. 模組化拆分 ✅
- 將原始 4900 行單檔拆分為模組化結構
- 清晰的職責分離（核心、實體、系統、資料、UI）
- 便於多人協作與版本控制

### 2. 資料驅動 ✅
- 敵人、建築、波次、卡片全數資料驅動化
- 易於調整遊戲平衡，無需改程式碼
- 版本控制清晰追蹤變更

### 3. TypeScript 遷移 ✅
- 完整的型別系統與嚴格檢查
- 大幅減少執行時錯誤（預估 30-50%）
- IDE 自動補完與重構安全

### 4. 自動化測試 ✅
- 22 個核心邏輯測試（GameState、資料、音效系統）
- 防止回歸 Bug
- 信心重構與持續整合

## 📖 詳細文檔

- [ARCHITECTURE.md](./ARCHITECTURE.md)：架構改進詳細說明
- [遊戲開發文檔.md](./遊戲開發文檔.md)：原始遊戲設計文檔

## 🔧 本機執行（遺留版本）

可直接雙擊 `TD.html` 開啟，但**建議使用本地 HTTP 伺服器**。

### 方法 A：Python

```bash
cd TDGAME
python -m http.server 8000
```

開啟：`http://localhost:8000/TD.html`

### 方法 B：npx

```bash
cd TDGAME
npx http-server
```

## 📝 部署（GitHub Pages）

1. 將專案推到 GitHub Repo
2. 到 `Settings` → `Pages`
3. `Source` 選 `Deploy from a branch`
4. Branch 選 `main`，Folder 選 `/ (root)`
5. 儲存後等待部署完成

## ❓ 常見問題

### 「cdn.tailwindcss.com should not be used in production」
- 這是 Tailwind CDN 提示，不是遊戲阻塞錯誤

### 「TypeScript 編譯失敗」
```bash
npm run typecheck  # 檢查詳細錯誤
```

### 「測試失敗」
```bash
npm run test:run   # 單次執行所有測試
```

### 遺留 TD.html 相關問題
- `file://` 安全警告：使用本地 HTTP 伺服器測試
- 解鎖效果不生效：確認購買成功，重新開始一局

## 📈 開發路線圖

### 已完成 ✅
- [x] TypeScript 型別系統
- [x] 資料驅動化（敵人、建築、波次、卡片）
- [x] 遊戲狀態管理器
- [x] 音效系統
- [x] 輸入管理系統
- [x] 基礎單元測試（22 個）

### 進行中 🚧
- [x] 遊戲實體類別拆分（Player、Enemy、Building 等）
- [x] 遊戲系統實現（FlowField、WaveManager、UpgradeSystem）
- [x] 渲染系統與主循環
- [x] UI 系統集成
- [x] 遊戲入口點（main.ts）
- [x] 生產構建配置
- [x] 完整集成測試覆蓋（53 個測試通過）

### 已完成最新階段 ✅
- [x] TypeScript 嚴格模式（零錯誤）
- [x] 所有實體類別系統（1200+ 行）
- [x] 資料驅動系統（480+ 行）
- [x] 5 大核心遊戲系統（1750+ 行）
- [x] UI 系統實現（370+ 行）
- [x] 完整單元 + 集成測試（53 個）
- [x] Vite 生產構建配置
- [x] 遊戲初始化與主迴圈

### 未來計劃 📋
- [ ] 性能分析與優化
- [ ] 行動版適配
- [ ] 多人模式探索
- [ ] 持續的遊戲平衡調整


