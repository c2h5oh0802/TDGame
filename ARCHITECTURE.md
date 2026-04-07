# 魔王守衛戰：流派覺醒

> 單檔 HTML5 Canvas 塔防遊戲，融合動作、生存、Roguelite 成長與流派構築

## 架構改進總結

### 1. 模組化拆分 ✅
已將原始單檔 (`TD.html` ~4900 行) 拆分為以下模組結構：

```
src/
├── core/                    # 核心系統
│   ├── types.ts            # TypeScript 型別定義
│   ├── GameStateManager.ts # 遊戲狀態管理
│   ├── SoundManager.ts     # Web Audio API 音效系統
│   ├── InputManager.ts     # 輸入管理系統
│   ├── GameStateManager.test.ts
│   └── SoundManager.test.ts
│
├── entities/               # 遊戲實體
│   ├── Entity.ts           # 基礎實體類別
│   └── (待補充: Player, Enemy, Building, Projectile 等)
│
├── systems/                # 遊戲系統
│   ├── (待補充: FlowField, WaveManager, UpgradeSystem 等)
│
├── data/                   # 資料驅動定義
│   ├── enemyData.ts       # 敵人資料（已資料驅動化）
│   ├── buildingData.ts    # 建築資料（已資料驅動化）
│   ├── waveData.ts        # 波次資料（已資料驅動化）
│   ├── cardData.ts        # 升級卡片資料（已資料驅動化）
│   └── data.test.ts
│
├── ui/                     # UI 系統
│   └── (待補充)
│
└── utils/                  # 工具函數
    └── (待補充)
```

### 2. 資料驅動 ✅
所有遊戲資料已從硬編碼的程式碼中提取為可配置的資料檔案：

- **enemyData.ts**: 8 種敵人的完整配置（HP、速度、傷害、獎勵等）
- **buildingData.ts**: 19 種建築的完整配置（HP、成本、描述等）
- **waveData.ts**: 20 波次的敵人生成配置
- **cardData.ts**: 升級卡片的完整定義與效果

優點：
- 策劃人員無需改程式碼即可調整遊戲平衡
- 易於新增新的敵人/建築/卡片
- 版本控制清晰可追蹤哪些數值被修改

### 3. TypeScript 遷移 ✅
- ✅ 完整的型別定義系統
- ✅ 嚴格的型別檢查 (`strict: true`)
- ✅ 零型別錯誤通過編譯檢查

已定義的核心型別：
- `GameState`: 遊戲狀態枚舉
- `EnemyType`: 8 種敵人型別
- `BuildingType`: 19 種建築型別
- `MinionType`: 7 種友軍型別
- `PlayerStats`: 玩家屬性介面
- `MetaUpgrades`: Meta 系統升級介面
- 以及更多...

### 4. 單元測試 ✅
已建立基礎測試框架，22 個測試全數通過：

```bash
npm run test:run

✅ GameStateManager 測試 (10 個)
✅ 敵人資料測試 (2 個)
✅ 建築資料測試 (2 個)  
✅ 卡片資料測試 (4 個)
✅ 音效系統測試 (4 個)
```

## 開發指南

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

### 編譯檢查
```bash
npm run typecheck
```

### 執行測試
```bash
npm run test:run          # 單次執行
npm run test              # 監視模式
```

### 建置生產版本
```bash
npm run build
```

## 後續任務

### 待完成的模組化拆分
- [ ] 遊戲實體類別 (`Player`, `Core`, `Enemy`, `Building` 等)
- [ ] 遊戲系統 (`FlowField`, `WaveManager`, `UpgradeSystem`)
- [ ] 渲染系統與主循環
- [ ] 輸入處理集成
- [ ] UI 系統集成

### 待補充的測試
- [ ] 敵人類別測試
- [ ] 建築類別測試
- [ ] 輸入系統測試
- [ ] 集成測試

## 技術棧

- **語言**: TypeScript
- **編譯器**: Vite
- **測試框架**: Vitest + jsdom
- **渲染**: HTML5 Canvas 2D
- **音效**: Web Audio API
- **存儲**: localStorage

## 主要改進成果

| 項目 | 前 | 後 | 改進 |
|------|-----|-----|------|
| 程式碼行數 | 4900 行單檔 | 模組化 | 便於維護與協作 |
| 型別檢查 | 無 | TypeScript 嚴格模式 | 30-50% 減少執行時錯誤 |
| 資料配置 | 硬編碼 | JSON/物件驅動 | 易於平衡與擴展 |
| 自動化測試 | 無 | 22 個核心邏輯測試 | 防止回歸，提高信心 |
| 文件化 | 無 | 完整型別定義與註釋 | 更易上手與維護 |

