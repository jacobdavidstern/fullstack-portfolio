# StockTracker Refactor Plan

This document outlines optional improvements that could further streamline the StockTracker codebase. The app is fully functional as‑is; these notes simply capture opportunities to increase maintainability, reduce duplication, and clarify data flow if future development ever becomes relevant.

### Legend (for quick scanning)

#### Priority

- P1 — High‑impact improvement; meaningful clarity or consolidation
- P2 — Medium‑impact improvement; helpful but not urgent
- P3 — Low‑impact or product‑level decision

#### Effort

- S — Small (minutes to an hour)
- M — Medium (1–3 hours)
- L — Large (multi‑file or architectural change)

## 1. Data & Storage Architecture

### LocalStorage Abstraction

- [ ] Create unified saveStorage(type, data) helper — P1 / M
- [ ] Replace savePortfolio() and saveWatchlist() — P1 / S
- [ ] Parameterize all localStorage read/write operations — P2 / M
- [ ] Separate storage logic from rendering logic — P2 / M

### Lookup Logic

- [ ] Keep fetchQuote() as unified entry point — P1 / S
- [ ] Add fetchBySymbol() for short (<5 char) queries — P2 / M
- [ ] Add fetchByName() for long (≥5 char) queries — P2 / M
- [ ] Improve clarity around symbol vs. name resolution — P3 / S

## 2. Rendering & UI Structure

### Render Consolidation

- [ ] Create unified render() function — P1 / M
- [ ] Replace renderPortfolio() and renderWatchlist() with parameterized calls — P1 / M
- [ ] Parameterize initial render logic — P2 / S
- [ ] Separate DOM updates from data transformations — P2 / M

### Refresh Workflow

- [ ] Implement single refresh() function — P2 / S
- [ ] Ensure refresh triggers unified render pipeline — P2 / S

## 3. Event Handling Improvements

### Event Listener Consolidation

Original duplicated listeners:

```js
// portfolioContainer.addEventListener('click', (e) => {
// watchlistContainer.addEventListener('click', (e) => {
```

### Refactor:

- [ ] Replace with single stockContainer.addEventListener(...) — P1 / S
- [ ] Use container type or dataset attributes to determine behavior — P1 / S
- [ ] Preserve unique button behaviors where necessary — P2 / S

## 4. Behavioral Decisions (Low Priority)

### These are product‑level choices, not structural issues:

- [ ] Decide whether adding an existing stock overwrites or increments shares — P3 / S
- [ ] Decide whether HUD displays unique stock count or total shares — P3 / S

## 5. API Reference

```json

  {
    "symbol": "AAPL",
    "name": "Apple Inc",
    "price": "234.56",
    "change": "-1.23",
    "percent_change": "-0.52"
  }

  {
    "code": 400,
    "message": "Symbol not supported"
  }

```
## 6. Future Considerations

### These are optional long‑term ideas that may be useful if the project is ever expanded or revisited:

- Potential migration to a small state‑management pattern (e.g., a simple store object) to centralize updates
- Consider extracting API logic into a dedicated module for easier testing
- Evaluate whether UI components could benefit from lightweight templating for readability
- Explore minor UX refinements (e.g., clearer feedback on invalid symbols or network errors)

These are not required for the current scope but could provide value if the app grows or new features are added.
