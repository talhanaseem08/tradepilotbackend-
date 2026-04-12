# EdrawMax Build Guide (Exact Layout)

Use this with the visual reference image:
- `docs/component-diagram-lollipop.svg`

## 1) Canvas and grid

- Canvas: landscape (A3 or similar wide page)
- Turn on grid and snap
- Keep 3 horizontal bands:
  - Band 1: Frontend + Gateway
  - Band 2: Trading, NLP, Agent
  - Band 3: MongoDB, Redis, External APIs

## 2) Box placement (approx coordinates)

Treat top-left as `(0,0)`.

1. Frontend: `(120,170)` size `240x90`
2. Gateway Service: `(470,150)` size `320x120`
3. Trading Service: `(210,380)` size `310x120`
4. NLP Service: `(590,380)` size `260x120`
5. Agent Service: `(940,380)` size `300x120`
6. MongoDB: `(300,620)` size `260x105`
7. Redis: `(680,620)` size `280x105`
8. External APIs: `(1110,590)` size `430x190`

Inside External APIs write:
- OANDA
- Binance/CCXT
- News Sources
- Ollama

## 3) Connector order (clean routing)

Add these in order:

1. Frontend -> Gateway (`HTTP /api`)
2. Gateway -> Trading (`REST proxy`)
3. Gateway -> NLP (`REST proxy`)
4. Gateway -> Agent (`REST proxy`)
5. Gateway -> MongoDB
6. Gateway -> Redis
7. Trading -> MongoDB
8. Trading -> Redis
9. Agent -> MongoDB
10. Agent -> Redis
11. Trading -> NLP (`sentiment`)
12. Trading -> External APIs
13. NLP -> External APIs
14. Agent -> External APIs

Tip: Use orthogonal connectors (right-angle) for a neater look.

## 4) Lollipop/socket notation (UML)

Use these symbols from UML Component library:
- Provided interface: **lollipop** (circle)
- Required interface: **socket** (half-circle)

Add at least these 4 assembly connectors exactly:

1. `Frontend (socket IWebFrontDoor)` -> `Gateway (lollipop IWebFrontDoor)`
2. `Gateway (socket ITradingApi)` -> `Trading (lollipop ITradingApi)`
3. `Gateway (socket INlpApi)` -> `NLP (lollipop INlpApi)`
4. `Gateway (socket IAgentApi)` -> `Agent (lollipop IAgentApi)`

Then optionally add:
- `Gateway/Trading/Agent/NLP (sockets IMongoStore/IRedisBus)` -> `MongoDB/Redis (lollipops)`

## 5) Styling (to avoid clutter)

- Component border: `1.5-2px`
- Keep consistent box heights per row
- Use short edge labels only
- Keep arrow direction left-to-right and top-to-bottom
- Do not cross lines through box centers
