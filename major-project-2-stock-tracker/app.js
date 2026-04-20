// Elements
const searchInput = document.querySelector('#stock-input');
const searchForm = document.querySelector('#stock-form');
const resultCard = document.querySelector('#stock-result-card');
const sharesInput = document.querySelector('#shares-input');
const addToPortfolioBtn = document.querySelector('#addToPortfolio');
const addToWatchlistBtn = document.querySelector('#addToWatchlist');
const refreshBtn = document.querySelector(
  '.card-header .btn.btn-outline-secondary'
);
// API Base URL
const API_URL = 'https://fullstack-stocktracker-backend.onrender.com';

// HUD elements
let portfolioValue = 0; // updated dynamically
let stocksOwned = 0; // updated dynamically

// Results card elements
const stockNameEl = document.querySelector('#stockName');
const stockTickerEl = document.querySelector('#stockTicker');
const stockPriceEl = document.querySelector('#stockPrice');
const stockChangeEl = document.querySelector('#stockChange');

// Portfolio and Watchlist stock containers
const portfolioContainer = document.querySelector('#portfolio-stocks');
const watchlistContainer = document.querySelector('#watchlist-stocks');

// Shared Local Storage Utilities
const STORAGE_KEYS = {
  portfolio: 'portfolioData',
  watchlist: 'watchlistData',
};

// Load portfolio and watchlist (keys must be above here)
let portfolio = loadFromLocalStorage(STORAGE_KEYS.portfolio);
let watchlist = loadFromLocalStorage(STORAGE_KEYS.watchlist);

function loadFromLocalStorage(storeKey) {
  try {
    return JSON.parse(localStorage.getItem(storeKey)) || [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(storeKey, data) {
  localStorage.setItem(storeKey, JSON.stringify(data));
}

function clearStorage(storeKey) {
  localStorage.removeItem(storeKey);
}

// Helpers
function fmtCurrency(n) {
  const x = Number(n);
  if (Number.isNaN(x)) return '$0.00';
  return `$${x.toFixed(2)}`;
}

// Accepts price strings like "+1.23 (0.50%)", returns raw numbers
function netChangeTextToNumber(text) {
  if (typeof text === 'number') return text;
  const match = String(text).match(/([+\-]?\d+(\.\d+)?)/); // eslint-disable-line
  return match ? Number(match[1]) : 0;
}

// Render the main result card from TwelveData /quote payload
function renderStock(data) {
  stockNameEl.textContent = data.name;
  stockTickerEl.textContent = data.symbol;

  // Prefer 'price', fallback to 'close' after market hours
  const rawPrice = data.price ?? data.close;
  const currentPrice = parseFloat(rawPrice);
  stockPriceEl.textContent = `$${currentPrice.toFixed(2)}`;

  const change = parseFloat(data.change);
  const percent = parseFloat(data.percent_change);
  stockChangeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${percent.toFixed(2)}%)`;

  stockChangeEl.classList.remove('text-success', 'text-danger');
  stockChangeEl.classList.add(change >= 0 ? 'text-success' : 'text-danger');
}

// Build one stock row
function buildStockRow(stock, index) {
  const changeClass =
    Number(stock.change) >= 0 ? 'text-success' : 'text-danger';
  const totalValue = Number(stock.shares || 0) * Number(stock.price || 0);

  const row = document.createElement('div');
  row.className = 'list-group-item';
  row.innerHTML = `
    <div class="row align-items-center g-3">
      <!-- Stock name + ticker -->
      <div class="col-md-3">
        <div class="fw-semibold" style="font-size:1.2rem;">${stock.name || stock.symbol}</div>
        <div class="text-muted" style="font-size:1rem;">${stock.symbol}</div>
      </div>

      <!-- Current price -->
      <div class="col-md-2">
        <div class="fw-bold" style="font-size:1.4rem;">${fmtCurrency(stock.price || 0)}</div>
      </div>

      <!-- Daily change -->
      <div class="col-md-2">
        <div class="${changeClass}" style="font-size:1rem;">
          ${Number(stock.change || 0) >= 0 ? '+' : ''}${Number(stock.change || 0).toFixed(2)}
        </div>
      </div>

      <!-- Shares owned -->
      <div class="col-md-2">
        <div style="font-size:1.2rem;">${Number(stock.shares || 0)} shares</div>
      </div>

      <!-- Total value -->
      <div class="col-md-2">
        <div style="font-size:1.2rem;">${fmtCurrency(totalValue)}</div>
      </div>

      <!-- Action buttons -->
      <div class="col-md-1 d-flex justify-content-end">
        <div class="d-flex gap-1"> <!-- gap-1 = ~0.25rem -->
          <button class="btn btn-sm btn-primary" data-action="lookup" data-index="${index}">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
          <button class="btn btn-sm btn-danger" data-action="delete" data-index="${index}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  return row;
}

// Render entire portfolio
function renderPortfolio() {
  portfolioContainer.innerHTML = '';
  if (!portfolio.length) {
    portfolioContainer.innerHTML = `<div class="list-group-item text-muted">No stocks in portfolio. Search stocks to add.</div>`;
    return;
  }
  portfolio.forEach((stock, index) => {
    portfolioContainer.appendChild(buildStockRow(stock, index));
  });
}

// Render entire watchlist
function renderWatchlist() {
  watchlistContainer.innerHTML = '';
  if (!watchlist.length) {
    watchlistContainer.innerHTML = `<div class="list-group-item text-muted">No stocks in watchlist. Search stocks to add.</div>`;
    return;
  }
  watchlist.forEach((stock, index) => {
    watchlistContainer.appendChild(buildStockRow(stock, index));
  });
}

// Persist and re-render portfolio
function savePortfolio() {
  localStorage.setItem(STORAGE_KEYS.portfolio, JSON.stringify(portfolio));
  renderPortfolio();
}

// Persist and re-render watchlist
function saveWatchlist() {
  localStorage.setItem(STORAGE_KEYS.watchlist, JSON.stringify(watchlist));
  renderWatchlist();
}

// First fetch ticker quote, then fallback to fetch a name quote
async function fetchQuote(input) {
  try {
    // 1. Try symbol first
    const response = await fetch(
      `${API_URL}/api/stock/quote?symbol=${encodeURIComponent(input)}`
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data; // stock quote
  } catch (err) {
    console.log('Symbol not found, falling back to name:', err);

    try {
      // 2. Fallback: search by name
      const response = await fetch(
        `${API_URL}/api/stock/search?name=${encodeURIComponent(input)}`
      );
      const data = await response.json();

      const matches = data.data?.filter(
        (s) =>
          s.name &&
          s.name.toLowerCase().startsWith(input.toLowerCase()) &&
          s.country === 'United States' &&
          ['NASDAQ', 'NYSE'].includes(s.exchange)
      );

      const match = matches?.[0];
      if (!match) return null;

      // 3. Once we have a symbol, fetch its quote again
      return await fetchQuote(match.symbol);
    } catch (nameErr) {
      console.error('Name lookup failed:', nameErr);
      return null;
    }
  }
}

// HUD Update
function updateHUD() {
  let totalValue = 0;
  let totalShares = 0;

  for (const stock of portfolio) {
    if (stock.shares > 0 && !isNaN(stock.price)) {
      totalShares += stock.shares;
      totalValue += stock.shares * stock.price;
    }
  }

  portfolioValue = totalValue;
  stocksOwned = totalShares;

  const sharesEl = document.getElementById('hud-shares');
  const valueEl = document.getElementById('hud-value');
  if (!sharesEl || !valueEl) {
    console.warn('HUD elements not found in DOM');
    return;
  }
  sharesEl.textContent = `${stocksOwned} shares`;
  valueEl.textContent = fmtCurrency(portfolioValue);
}

// Events
// Search form submit
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = searchInput.value.trim();
  if (!input) return;

  try {
    // Clear UI
    stockNameEl.textContent = '';
    stockTickerEl.textContent = '';
    stockPriceEl.textContent = '';
    stockChangeEl.textContent = '';

    // Lookup stock
    const quote = await fetchQuote(input);
    if (!quote) throw new Error('No matching stock found');

    renderStock(quote);
    resultCard.classList.remove('d-none');
  } catch (err) {
    console.error(err);
    stockNameEl.textContent = 'Stock symbol not found';
    stockTickerEl.textContent = '';
    stockPriceEl.textContent = '';
    stockChangeEl.textContent = '';
  }
});

// Add current result and selected shares to portfolio
addToPortfolioBtn.addEventListener('click', () => {
  const symbol = stockTickerEl.textContent.trim().toUpperCase();
  const name = stockNameEl.textContent.trim();
  const price = Number(String(stockPriceEl.textContent).replace(/[$,]/g, ''));
  const change = netChangeTextToNumber(stockChangeEl.textContent);
  const shares = Number(sharesInput.value);

  if (!symbol) return;

  const exists = portfolio.find((s) => s.symbol === symbol);
  if (exists) {
    // Optional: update price/change on re-add
    exists.price = price;
    exists.change = change;
  } else {
    portfolio.push({ symbol, name, price, change, shares });
  }
  savePortfolio();
  updateHUD();
});

// Add current result to watchlist, meaning portfolio with 0 shares
addToWatchlistBtn.addEventListener('click', () => {
  const symbol = stockTickerEl.textContent.trim().toUpperCase();
  const name = stockNameEl.textContent.trim();
  const price = Number(String(stockPriceEl.textContent).replace(/[$,]/g, ''));
  const change = netChangeTextToNumber(stockChangeEl.textContent);

  if (!symbol) return;

  const exists = watchlist.find((s) => s.symbol === symbol);
  if (exists) {
    // Optional: update price/change on re-add
    exists.price = price;
    exists.change = change;
  } else {
    watchlist.push({ symbol, name, price, change, shares: 0 });
  }
  saveWatchlist();
  updateHUD();
});

// Portfolio actions: lookup / delete (uses event delegation)
portfolioContainer.addEventListener('click', (e) => {
  // Trigger delete
  const btn = e.target.closest('button');
  if (!btn) return;
  const index = Number(btn.dataset.index);
  const action = btn.dataset.action;

  if (action === 'delete') {
    portfolio.splice(index, 1);
    savePortfolio();
    updateHUD();
    return;
  }
  // Trigger search for this symbol
  if (action === 'lookup') {
    const stock = portfolio[index];
    if (!stock) return;
    searchInput.value = stock.symbol;
    const fakeSubmit = new Event('submit', { bubbles: true, cancelable: true });
    searchForm.dispatchEvent(fakeSubmit);
  }
});

// Watchlist actions: lookup / delete (uses event delegation)
watchlistContainer.addEventListener('click', (e) => {
  // Trigger delete
  const btn = e.target.closest('button');
  if (!btn) return;
  const index = Number(btn.dataset.index);
  const action = btn.dataset.action;

  if (action === 'delete') {
    watchlist.splice(index, 1);
    saveWatchlist();
    updateHUD();
    return;
  }
  // Trigger search for this symbol
  if (action === 'lookup') {
    const stock = watchlist[index];
    if (!stock) return;
    searchInput.value = stock.symbol;
    const fakeSubmit = new Event('submit', { bubbles: true, cancelable: true });
    searchForm.dispatchEvent(fakeSubmit);
  }
});

// Refresh all prices
if (refreshBtn) {
  refreshBtn.addEventListener('click', async () => {
    try {
      // Refresh portfolio
      if (portfolio.length) {
        for (let i = 0; i < portfolio.length; i++) {
          const sym = portfolio[i].symbol;
          try {
            const data = await fetchQuote(sym);
            if (!data) {
              console.warn(`No data returned for ${sym}`);
              continue; // skip this stock
            }
            const rawPrice = data.price ?? data.close;
            portfolio[i].price = Number(rawPrice);
            portfolio[i].change = Number(data.change);
            portfolio[i].name = portfolio[i].name || data.name;
          } catch (e) {
            console.warn(`Portfolio failed to refresh ${sym}:`, e.message);
          }
        }
        savePortfolio();
        updateHUD();
      }

      // Refresh watchlist
      if (watchlist.length) {
        for (let i = 0; i < watchlist.length; i++) {
          const sym = watchlist[i].symbol;
          try {
            const data = await fetchQuote(sym);
            if (!data) {
              console.warn(`No data returned for ${sym}`);
              continue; // skip this stock
            }
            const rawPrice = data.price ?? data.close;
            watchlist[i].price = Number(rawPrice);
            watchlist[i].change = Number(data.change);
            watchlist[i].name = watchlist[i].name || data.name;
          } catch (e) {
            console.warn(`Watchlist failed to refresh ${sym}:`, e.message);
          }
        }
        saveWatchlist();
      }
    } finally {
      refreshBtn.disabled = false;
    }
  });
}

// Init
// Render portfolio and watchlist
renderPortfolio();
renderWatchlist();

// Update HUD
document.addEventListener('DOMContentLoaded', () => {
  updateHUD();
});

// Reset Profile button DEV ONLY
const resetBtn = document.getElementById('resetProfile');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEYS.portfolio);
    portfolio = [];
    renderPortfolio();
    localStorage.removeItem(STORAGE_KEYS.watchlist);
    watchlist = [];
    renderWatchlist();
    updateHUD();
    console.warn('Portfolio reset');
  });
}
