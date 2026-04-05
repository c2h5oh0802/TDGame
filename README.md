# 魔王守衛戰：流派覺醒

單檔 HTML5 Canvas 塔防遊戲，融合動作、生存、Roguelite 成長與流派構築。

## 線上遊玩

- GitHub Pages：`https://c2h5oh0802.github.io/TDGame/TD.html`

## 專案結構

- `TD.html`：遊戲主程式（核心邏輯、UI、音效、Meta 系統都在此檔）
- `index.html`：入口轉跳頁（自動導向 `TD.html`）
- `遊戲開發文檔.md`：設計與系統說明

## 本機執行

可直接雙擊 `TD.html` 開啟，但**建議使用本地 HTTP 伺服器**，可避免 `file://` 安全限制造成的行為差異。

### 方法 A：Python

```bash
cd TDGAME
python -m http.server 8000
```

開啟：`http://localhost:8000/TD.html`

### 方法 B：Node (npx)

```bash
cd TDGAME
npx http-server
```

## 操作方式

- `W / A / S / D`：移動
- `滑鼠左鍵（按住）`：攻擊 / 建造
- `F`：靠近建築時升級/修復
- `X`：靠近建築時拆除
- `Z`：切換小兵模式
- `空白鍵`：提早開始下一波
- `ESC`：暫停

## Roguelite / 靈魂商店

- 貨幣：`靈魂 (👻)`
- 儲存：`localStorage`（Key：`tdgameMeta`）
- 升級類型：
  - 可疊加升級（攻擊、速度、血量、核心血量、開局金幣、靈魂倍率）
  - 一次性解鎖（起始建築、額外卡槽、召喚上限、幸運祝福、無盡模式）

### 靈魂獲取公式

```text
(波數 × 5) + (擊殺 ÷ 10) + (Boss × 100) × 靈魂倍數
```

## 部署（GitHub Pages）

1. 將專案推到 GitHub Repo
2. 到 `Settings` -> `Pages`
3. `Source` 選 `Deploy from a branch`
4. Branch 選 `main`，Folder 選 `/ (root)`
5. 儲存後等待部署完成

預設網址格式：

- `https://<你的帳號>.github.io/<repo>/`

## 常見問題

- `cdn.tailwindcss.com should not be used in production`
  - 這是 Tailwind CDN 提示，不是遊戲阻塞錯誤。
- `file://` 相關安全警告
  - 建議改用本地 HTTP 伺服器測試。
- 解鎖看起來沒生效
  - 先確認已購買成功，並重新開始一局（部分效果在新局套用）。

## 開發注意事項

- 本專案為單檔遊戲，改動 `TD.html` 時請避免大範圍無關重構。
- 檔尾需保持正確結尾：
  - `</script>`
  - `</body>`
  - `</html>`
