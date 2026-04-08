# TDGAME Agent Notes

## Repo Reality (verify before editing)
- This repo is a single-file browser game: `index.html`.
- There is no build/test/lint pipeline in-repo (no package/lock/config files).
- Game is run directly as `file://.../index.html`; do not assume a local server.

## High-Risk Areas (recent breakage sources)
- Keep global `camera` defined before any `draw()`/`gameLoop()` usage.
   - Current source of truth: `index.html` defines `const camera = { x, y, update(...) }` near top-level globals.
- Preserve initial render boot order at file end:
   - `camera.update(player.x, player.y);`
   - `draw();`
- Preserve non-PLAYING render path in `gameLoop` (prevents black screen on start/tutorial/pause states).

## Mandatory Tail Safety for `index.html`
- After any edit near file end, re-read the last ~30 lines.
- File must end with exactly one set of closing tags in this order:
   - `</script>`
   - `</body>`
   - `</html>`
- Never leave duplicate closing tags or truncated blocks (common cause of `Unexpected end of input`).

## UI/Event Wiring Constraints
- Start flow depends on inline handlers in HTML (`onclick="startGame()"`, `onclick="closeTutorial()"`).
- Any syntax/runtime error in script prevents these globals from existing and makes buttons look "no response".

## Editing Workflow for Agents
- Prefer minimal targeted patches; avoid large tail rewrites unless required.
- If runtime is broken, fix in this order:
   1. Syntax errors
   2. Missing/undefined globals (`camera`, `startGame`, `draw`, `gameLoop`)
   3. State/render-loop continuity
- Remove temporary debug instrumentation before finishing (`console.log`, temporary broad `try/catch`).

## Non-Blocking Noise
- Tailwind CDN warning (`cdn.tailwindcss.com should not be used in production`) is expected here and not the cause of black screen bugs.

## Done Check (manual)
- Page load shows start screen (not black).
- Clicking `開始守衛` (Start Guardian) advances to tutorial or gameplay. 【UI顯示繁體中文】
- Browser console has no blocking exceptions during load and first interactions.

## UI Display Language - All Player-Facing Text is Traditional Chinese (繁體中文)
**Important Note**: All text displayed to players in the game UI must be in Traditional Chinese (繁體中文).

### Examples of Player-Facing UI Elements (All in Traditional Chinese):
- **Start Screen**:
  - `魔王守衛戰：流派覺醒` (Game title)
  - `開始守衛` (Start Game button)
  - `靈魂商店` (Soul Shop)
  - `角色選擇` (Character Selection)
  
- **In-Game HUD**:
  - `等級: 1` (Level)
  - `💰 金幣: 30` (Gold)
  - `魔王 HP: 100/100` (Player HP)
  - `核心 HP: 1000/1000` (Core HP)
  - `小兵模式: ⚔️ 主動出擊` (Minion Mode: Aggressive)
  
- **Character Names & Skills**:
  - `黑暗魔王` (Dark Lord)
  - `深淵召喚師` (Abyss Summoner)
  - `毀滅領主` (Destruction Lord)
  - `守護者` (Sentinel)
  - `召喚骷髏` (Summon Skeleton)
  - `毀滅光束` (Destruction Beam)
  - `堡壘化` (Fortify)
  
- **Game States & Overlays**:
  - `升級！選擇一項卡片` (Level Up! Choose a Card)
  - `遊戲暫停` (Game Paused)
  - `勝利` (Victory)
  - `遊戲結束` (Game Over)
  
- **Soul Shop Items**:
  - `永久強化 (可疊加)` (Permanent Upgrades - Stackable)
  - `永久解鎖 (一次性)` (Permanent Unlocks - One-time)
  - `角色解鎖` (Character Unlocks)
  
- **Interactive Hints**:
  - `靠近建築物按 [F] 升級/修復 | 按 [X] 拆除` (Near building: Press [F] to upgrade/repair | [X] to demolish)
  - `小兵模式: 按 Z 切換` (Minion Mode: Press Z to toggle)
  - `按 [空白鍵] 提早叫下一波` (Press [Space] to skip to next wave)

### Code Standards:
- When adding new UI text, **always use Traditional Chinese (繁體中文)**.
- Do NOT use Simplified Chinese (簡體中文) or English in player-facing UI.
- For non-UI comments in code, English is acceptable.
- Building names, enemy names, card descriptions - all must be Traditional Chinese.
