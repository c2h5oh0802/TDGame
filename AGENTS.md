# TDGAME Agent Notes

## Repo Reality (verify before editing)
- This repo is a single-file browser game: `TD.html`.
- There is no build/test/lint pipeline in-repo (no package/lock/config files).
- Game is run directly as `file://.../TD.html`; do not assume a local server.

## High-Risk Areas (recent breakage sources)
- Keep global `camera` defined before any `draw()`/`gameLoop()` usage.
  - Current source of truth: `TD.html` defines `const camera = { x, y, update(...) }` near top-level globals.
- Preserve initial render boot order at file end:
  - `camera.update(player.x, player.y);`
  - `draw();`
- Preserve non-PLAYING render path in `gameLoop` (prevents black screen on start/tutorial/pause states).

## Mandatory Tail Safety for `TD.html`
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
- Clicking `開始守衛` advances to tutorial or gameplay.
- Browser console has no blocking exceptions during load and first interactions.
