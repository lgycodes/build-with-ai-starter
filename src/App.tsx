import React, { useState, useEffect, useCallback } from 'react';
import {
  AssetClassType,
  MarketTicker,
  BenchmarkIndex,
  PriceAlert,
} from './types/market';
import {
  INITIAL_BENCHMARK_INDICES,
  INITIAL_TICKERS,
} from './data/mockMarketData';
import { TopNav } from './components/TopNav';
import { AssetClassTabs } from './components/AssetClassTabs';
import { IndicesStrip } from './components/IndicesStrip';
import { MarketBreadthBar } from './components/MarketBreadthBar';
import { MarketTable } from './components/MarketTable';
import { SymbolDetailDrawer } from './components/SymbolDetailDrawer';
import { SearchModal } from './components/SearchModal';
import { MarketHeatmap } from './components/MarketHeatmap';
import { WatchlistView } from './components/WatchlistView';
import { MacroNewsView } from './components/MacroNewsView';
import { GetStartedModal } from './components/GetStartedModal';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<string>('markets');
  const [selectedAsset, setSelectedAsset] = useState<AssetClassType>('US stocks');
  const [tickers, setTickers] = useState<MarketTicker[]>(INITIAL_TICKERS);
  const [benchmarkIndices, setBenchmarkIndices] = useState<BenchmarkIndex[]>(INITIAL_BENCHMARK_INDICES);
  const [selectedTicker, setSelectedTicker] = useState<MarketTicker | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState<boolean>(false);
  const [liveStreaming, setLiveStreaming] = useState<boolean>(true);
  const [flashedTickerSymbol, setFlashedTickerSymbol] = useState<string | null>(null);

  // Watchlist stored in localStorage
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mp_watchlist');
      return saved ? JSON.parse(saved) : ['NVDA', 'AAPL', 'BTC/USD', 'SPY'];
    } catch {
      return ['NVDA', 'AAPL', 'BTC/USD', 'SPY'];
    }
  });

  // Price alerts
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('mp_alerts');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'alert-1',
              symbol: 'NVDA',
              targetPrice: 155.0,
              condition: 'ABOVE',
              createdAt: new Date().toISOString(),
            },
            {
              id: 'alert-2',
              symbol: 'BTC/USD',
              targetPrice: 95000.0,
              condition: 'ABOVE',
              createdAt: new Date().toISOString(),
            },
          ];
    } catch {
      return [];
    }
  });

  // Save watchlist & alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mp_watchlist', JSON.stringify(watchlistSymbols));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [watchlistSymbols]);

  useEffect(() => {
    try {
      localStorage.setItem('mp_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [alerts]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market tick simulation
  useEffect(() => {
    if (!liveStreaming) return;

    const interval = setInterval(() => {
      setTickers((prevTickers) => {
        // Pick 1 to 2 random tickers to update
        const randIdx = Math.floor(Math.random() * prevTickers.length);
        const target = prevTickers[randIdx];
        if (!target) return prevTickers;

        // Subtle realistic price perturbation (+/- 0.05% to 0.35%)
        const deltaFactor = (Math.random() - 0.49) * 0.007;
        const newPrice = Math.max(0.01, target.price * (1 + deltaFactor));
        const priceDelta = newPrice - target.price;
        const newChange = target.change + priceDelta;
        const newChangePercent = (newChange / (newPrice - newChange)) * 100;
        const newSparkline = [...target.sparkline.slice(1), newPrice];

        setFlashedTickerSymbol(target.symbol);
        setTimeout(() => setFlashedTickerSymbol(null), 900);

        // Check alerts
        alerts.forEach((alert) => {
          if (alert.symbol === target.symbol && !alert.triggered) {
            if (
              (alert.condition === 'ABOVE' && newPrice >= alert.targetPrice) ||
              (alert.condition === 'BELOW' && newPrice <= alert.targetPrice)
            ) {
              console.log(`Alert triggered for ${alert.symbol}: $${newPrice.toFixed(2)}`);
            }
          }
        });

        const updated = [...prevTickers];
        updated[randIdx] = {
          ...target,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
          high24h: Math.max(target.high24h, newPrice),
          low24h: Math.min(target.low24h, newPrice),
          sparkline: newSparkline,
        };

        return updated;
      });

      // Also occasionally tick a benchmark index
      if (Math.random() > 0.4) {
        setBenchmarkIndices((prevIndices) => {
          const randIdx = Math.floor(Math.random() * prevIndices.length);
          const target = prevIndices[randIdx];
          if (!target) return prevIndices;

          const deltaFactor = (Math.random() - 0.49) * 0.004;
          const newPrice = target.price * (1 + deltaFactor);
          const priceDelta = newPrice - target.price;
          const newChange = target.change + priceDelta;
          const newChangePercent = (newChange / (newPrice - newChange)) * 100;

          const updated = [...prevIndices];
          updated[randIdx] = {
            ...target,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            sparkline: [...target.sparkline.slice(1), newPrice],
          };
          return updated;
        });
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [liveStreaming, alerts]);

  // Keep selectedTicker in sync if updated by live stream
  useEffect(() => {
    if (selectedTicker) {
      const current = tickers.find((t) => t.symbol === selectedTicker.symbol);
      if (current && current.price !== selectedTicker.price) {
        setSelectedTicker(current);
      }
    }
  }, [tickers, selectedTicker]);

  const toggleWatchlist = useCallback((symbol: string) => {
    setWatchlistSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  }, []);

  const handleSelectIndex = (benchmark: BenchmarkIndex) => {
    // Map benchmark to a ticker representation for the drawer
    const tickerFromIndex: MarketTicker = {
      symbol: benchmark.symbol,
      name: benchmark.name,
      assetClass: 'US stocks',
      price: benchmark.price,
      change: benchmark.change,
      changePercent: benchmark.changePercent,
      high24h: benchmark.high,
      low24h: benchmark.low,
      volume: 'Benchmark Index',
      sparkline: benchmark.sparkline,
      currency: 'USD',
    };
    setSelectedTicker(tickerFromIndex);
  };

  const handleAddAlert = (symbol: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => {
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      symbol,
      targetPrice,
      condition,
      createdAt: new Date().toISOString(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleRemoveAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleExecutePaperTrade = (
    symbol: string,
    type: 'BUY' | 'SELL',
    shares: number,
    price: number
  ) => {
    console.log(`Executed paper trade: ${type} ${shares} shares of ${symbol} at $${price}`);
  };

  // Filter tickers for current asset class in the Markets view
  const currentAssetTickers = tickers.filter((t) => t.assetClass === selectedAsset);

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col antialiased text-[#181b24]">
      {/* Top Navigation Bar (Fixed 64px, bottom hairline divider #E0E3EB) */}
      <TopNav
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        watchlistCount={watchlistSymbols.length}
        liveStreaming={liveStreaming}
        setLiveStreaming={setLiveStreaming}
      />

      {/* Main Viewport Container: 12-column responsive layout, max-width 1440px */}
      <main className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-3 flex-1">
        {/* Screen 1: Markets (Default Institutional Environment) */}
        {activeScreen === 'markets' && (
          <div>
            {/* Asset Class Pill Navigation (US stocks, World stocks, Crypto, Futures, etc.) */}
            <AssetClassTabs
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
            />

            {/* Benchmark Indices Cards & Summaries with 32px circular badges ("500", "100", "30", etc.) */}
            <IndicesStrip
              indices={benchmarkIndices}
              onSelectIndex={handleSelectIndex}
              selectedIndexId={selectedTicker?.symbol}
            />

            {/* Institutional Market Breadth & Sentiment Indicator */}
            <MarketBreadthBar />

            {/* Financial Data Table with 36px header, 48px rows, 2-tier ticker cells, sentiment badges */}
            <MarketTable
              tickers={currentAssetTickers}
              onSelectTicker={setSelectedTicker}
              watchlistSymbols={watchlistSymbols}
              onToggleWatchlist={toggleWatchlist}
              flashedTickerSymbol={flashedTickerSymbol}
              selectedAsset={selectedAsset}
            />
          </div>
        )}

        {/* Screen 2: Heatmap View */}
        {activeScreen === 'heatmap' && (
          <MarketHeatmap
            tickers={tickers}
            onSelectTicker={setSelectedTicker}
          />
        )}

        {/* Screen 3: Watchlist & Alerts View */}
        {activeScreen === 'watchlist' && (
          <WatchlistView
            tickers={tickers}
            watchlistSymbols={watchlistSymbols}
            onToggleWatchlist={toggleWatchlist}
            onSelectTicker={setSelectedTicker}
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onRemoveAlert={handleRemoveAlert}
          />
        )}

        {/* Screen 4: Macro & Economic News */}
        {activeScreen === 'macro' && (
          <MacroNewsView
            tickers={tickers}
            onSelectTicker={setSelectedTicker}
          />
        )}
      </main>

      {/* Global Command Palette / Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tickers={tickers}
        onSelectTicker={setSelectedTicker}
      />

      {/* Detailed Symbol Drawer (Interactive Candlestick chart, Order book depth, Key stats, Paper trade) */}
      <SymbolDetailDrawer
        ticker={selectedTicker}
        onClose={() => setSelectedTicker(null)}
        isWatchlisted={selectedTicker ? watchlistSymbols.includes(selectedTicker.symbol) : false}
        onToggleWatchlist={toggleWatchlist}
        onExecutePaperTrade={handleExecutePaperTrade}
      />

      {/* "Get started" / Institutional Workspace Access Modal */}
      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />

      {/* Institutional Footer */}
      <footer className="w-full border-t border-[#E0E3EB] bg-[#FFFFFF] py-6 px-4 md:px-8 mt-auto text-[12px] text-[#737687]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-[#131722] text-[13px]">Market Precision</span>
            <span>·</span>
            <span>Sub-Millisecond Institutional Financial Architecture</span>
          </div>

          <div className="flex items-center gap-6 text-[12px]">
            <button
              onClick={() => setActiveScreen('markets')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Markets
            </button>
            <button
              onClick={() => setActiveScreen('heatmap')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Heatmap
            </button>
            <button
              onClick={() => setActiveScreen('watchlist')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Watchlist
            </button>
            <button
              onClick={() => setActiveScreen('macro')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Macro & News
            </button>
            <span className="mono-num text-[#434656]">LATENCY: 0.8ms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
