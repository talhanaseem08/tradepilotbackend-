# Reference UI checklist (Trading History)

Use this to verify parity with the design reference image.

## Chrome

- [ ] Dark-friendly page background (works with app dark mode)
- [ ] Top **promotional strip** (e.g. discount code) — dismissible
- [ ] **Tabs:** “Trading History” (active) · “Open Positions”
- [ ] **Floating** circular support / chat control (bottom-right)

## Trading History table

| Column | Notes |
|--------|--------|
| Share | Icon / action to share or copy row summary |
| Symbol | e.g. EURUSD |
| Type | Buy (green) / Sell (red) |
| Open Date | Open time (formatted) |
| Open | Entry price |
| Closed Date | Exit time |
| Closed | Exit price |
| TP | Take profit level or `—` |
| SL | Stop loss |
| Lots | Size / volume |
| Commission | Fee in `$` |
| Profit | Green positive / red negative |

## Open Positions tab

- [ ] Lists live positions from API (`fetchOpenPositions`)
- [ ] Columns adapted to available fields (pair, side, open time, entry, size, unrealized P/L, etc.)

## Behaviour

- [ ] Pagination when trade list is long
- [ ] Loading and empty states
- [ ] Responsive horizontal scroll on small screens
