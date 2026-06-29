# TradePilot — chart / trading-history reference (`fyp/charts`)

This folder holds **specs and sample data** that match the **Trading History** UI reference (dark table: Share, Symbol, Type, dates, Open/Closed, TP, SL, Lots, Commission, Profit, tabs for Open Positions, promo strip, support FAB).

## Contents

| Path | Purpose |
|------|---------|
| `spec/SCREENSHOT_CHECKLIST.md` | Checklist mapped to the reference image |
| `mock-data/trades-sample.json` | Example rows for Storybook / fixtures / tests |

## Live implementation

The **in-app** screen is **`Trade Journal`** in the React app:

`frontend/src/pages/trade-journal/TradeJournal.tsx`

It includes:

- Promo banner (dismissible)
- **Tabs:** Trading History \| Open Positions
- **History table:** columns aligned with the reference (optional API fields show `—` until backend sends them)
- **Profit** green / red; **Buy/Sell** styling
- **Share** row action (copy summary)
- **Floating** support button → `/chat`
- Dates formatted **UTC+5** (`Asia/Karachi`), **12-hour** clock

## Backend fields

Optional fields on each trade (`TradeRecord` in `src/lib/api.ts`): `opened_at`, `closed_at`, `take_profit`, `stop_loss`, `lots`, `commission`. If your gateway persists these, they will populate automatically.
