import React, { useState, useMemo, useEffect } from 'react';
import { MarketTicker, CandlePoint, OrderBookRow } from '../types/market';
import { generateCandlestickData } from '../data/mockMarketData';
import {
  X,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Layers,
  DollarSign,
  CheckCircle,
} from 'lucide-react';

interface SymbolDetailDrawerProps {
  ticker: MarketTicker | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onExecutePaperTrade: (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number) => void;
}

export const SymbolDetailDrawer: React.FC<SymbolDetailDrawerProps> = ({
  ticker,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onExecutePaperTrade,
}) => {
  const [timeframe, setTimeframe] = useState<string>('1D');
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [hoveredCandle, setHoveredCandle] = useState<CandlePoint | null>(null);

  // Paper trade state
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  // Generate candle data when ticker changes
  const candleData = useMemo(() => {
    if (!ticker) return [];
    return generateCandlestickData(ticker.price, 32);
  }, [ticker?.symbol, ticker?.price]);

  // Simulated Order Book
  const orderBook = useMemo<{ bids: OrderBookRow[]; asks: OrderBookRow[] }>(() => {
    if (!ticker) return { bids: [], asks: [] };
    const p = ticker.price;
    const bids: OrderBookRow[] = [];
    const asks: OrderBookRow[] = [];
    let bidTotal = 0;
    let askTotal = 0;

    for (let i = 1; i <= 5; i++) {
      const bidPrice = p * (1 - 0.0008 * i);
      const bidSize = Math.floor(100 + Math.random() * 850);
      bidTotal += bidSize;
      bids.push({ price: bidPrice, size: bidSize, total: bidTotal, percent: 0 });

      const askPrice = p * (1 + 0.0008 * i);
      const askSize = Math.floor(100 + Math.random() * 850);
      askTotal += askSize;
      asks.push({ price: askPrice, size: askSize, total: askTotal, percent: 0 });
    }

    const maxTotal = Math.max(bidTotal, askTotal) || 1;
    bids.forEach((b) => (b.percent = (b.total / maxTotal) * 100));
    asks.forEach((a) => (a.percent = (a.total / maxTotal) * 100));

    return { bids, asks };
  }, [ticker?.symbol, ticker?.price]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!ticker) return null;

  const isBull = ticker.change >= 0;

  const handleOrderSubmit = () => {
    if (tradeShares <= 0) return;
    onExecutePaperTrade(ticker.symbol, tradeType, tradeShares, ticker.price);
    setTradeSuccessMsg(`Simulated ${tradeType} for ${tradeShares} shares executed at $${ticker.price.toFixed(2)}`);
    setTimeout(() => setTradeSuccessMsg(null), 3500);
  };

  // Dimensions for SVG Chart
  const svgWidth = 640;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 25;

  const minPrice = Math.min(...candleData.map((c) => c.low));
  const maxPrice = Math.max(...candleData.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const getY = (val: number) => {
    return svgHeight - paddingY - ((val - minPrice) / priceRange) * (svgHeight - 2 * paddingY);
  };

  const activeCandle = hoveredCandle || (candleData.length > 0 ? candleData[candleData.length - 1] : null);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/35 backdrop-blur-[2px] transition-opacity">
      <div
        className="w-full max-w-2xl bg-[#FFFFFF] h-full shadow-2xl flex flex-col overflow-y-auto thin-scrollbar border-l border-[#E0E3EB] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E0E3EB] flex items-center justify-between sticky top-0 bg-[#FFFFFF] z-20">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[20px] font-extrabold text-[#131722] tracking-tight">
                  {ticker.symbol}
                </span>
                <span className="text-[12px] font-semibold text-[#737687] bg-[#F0F3FA] px-2 py-0.5 rounded-full">
                  {ticker.assetClass}
                </span>
                {ticker.sector && (
                  <span className="text-[12px] text-[#737687] font-medium hidden sm:inline">
                    · {ticker.sector}
                  </span>
                )}
              </div>
              <div className="text-[13px] text-[#434656] font-normal leading-tight mt-0.5">
                {ticker.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(ticker.symbol)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'border-[#F7931A] bg-[#F7931A]/10 text-[#F7931A]'
                  : 'border-[#E0E3EB] text-[#737687] hover:text-[#131722] hover:bg-[#F0F3FA]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-[#F7931A]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-[#E0E3EB] text-[#737687] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price & Sentiment Strip */}
        <div className="px-6 py-4 bg-[#F0F3FA] border-b border-[#E0E3EB] flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase text-[#737687] tracking-wider mb-0.5">
              Live Real-Time Quote
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-[28px] font-extrabold text-[#131722] mono-num tracking-tight">
                {ticker.currency === 'USD' ? '$' : ''}
                {ticker.price >= 1000
                  ? ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : ticker.price.toFixed(ticker.price < 5 ? 4 : 2)}
              </span>

              {/* Sentiment badge */}
              <div
                className={`h-[24px] px-2.5 rounded-full inline-flex items-center gap-1 text-[12px] font-bold mono-num leading-none ${
                  isBull ? 'text-[#089981] bg-[#089981]/15' : 'text-[#F23645] bg-[#F23645]/15'
                }`}
              >
                {isBull ? <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" /> : <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                <span>
                  {isBull ? '+' : ''}
                  {ticker.change.toFixed(2)} ({isBull ? '+' : ''}
                  {ticker.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Intraday 24h High / Low Bar */}
          <div className="w-full sm:w-56">
            <div className="flex justify-between text-[11px] font-semibold text-[#737687] mb-1 mono-num">
              <span>L: ${ticker.low24h.toFixed(2)}</span>
              <span>H: ${ticker.high24h.toFixed(2)}</span>
            </div>
            <div className="h-2 w-full bg-[#E0E3EB] rounded-full overflow-hidden relative">
              <div
                className="absolute top-0 bottom-0 bg-[#2962FF] rounded-full"
                style={{
                  left: '15%',
                  width: '70%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Chart Viewport & Timeframe Switcher */}
        <div className="p-6 border-b border-[#E0E3EB]">
          {/* Chart Controls */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 bg-[#F0F3FA] p-1 rounded-full">
              {['1D', '5D', '1M', '6M', '1Y', '5Y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`h-6 px-2.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-[#131722] text-[#FFFFFF] shadow-2xs'
                      : 'text-[#737687] hover:text-[#131722]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#F0F3FA] p-1 rounded-full">
              <button
                onClick={() => setChartType('candle')}
                className={`h-6 px-2.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  chartType === 'candle' ? 'bg-[#131722] text-[#FFFFFF]' : 'text-[#737687]'
                }`}
              >
                Candles
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`h-6 px-2.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  chartType === 'line' ? 'bg-[#131722] text-[#FFFFFF]' : 'text-[#737687]'
                }`}
              >
                Area
              </button>
            </div>
          </div>

          {/* Inspection Tooltip data */}
          {activeCandle && (
            <div className="flex items-center gap-4 text-[11px] font-medium mono-num text-[#737687] mb-2 p-1.5 bg-[#F0F3FA]/70 rounded-md">
              <span>Time: <strong className="text-[#131722]">{activeCandle.time}</strong></span>
              <span>O: <strong className="text-[#131722]">${activeCandle.open.toFixed(2)}</strong></span>
              <span>H: <strong className="text-[#089981]">${activeCandle.high.toFixed(2)}</strong></span>
              <span>L: <strong className="text-[#F23645]">${activeCandle.low.toFixed(2)}</strong></span>
              <span>C: <strong className="text-[#131722]">${activeCandle.close.toFixed(2)}</strong></span>
            </div>
          )}

          {/* Interactive SVG Chart */}
          <div className="w-full bg-[#FFFFFF] border border-[#E0E3EB] rounded-[10px] p-2 relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
              onMouseLeave={() => setHoveredCandle(null)}
            >
              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((ratio) => {
                const y = paddingY + ratio * (svgHeight - 2 * paddingY);
                return (
                  <line
                    key={ratio}
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#F0F3FA"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Price axis labels */}
              <text x={svgWidth - 5} y={getY(maxPrice) + 4} textAnchor="end" className="fill-[#737687] text-[10px] font-mono">
                ${maxPrice.toFixed(2)}
              </text>
              <text x={svgWidth - 5} y={getY(minPrice) + 4} textAnchor="end" className="fill-[#737687] text-[10px] font-mono">
                ${minPrice.toFixed(2)}
              </text>

              {/* Line chart mode */}
              {chartType === 'line' && (
                <>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2962FF" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2962FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d={`M ${paddingX},${svgHeight - paddingY} ${candleData
                      .map((c, i) => {
                        const x = paddingX + (i / (candleData.length - 1)) * (svgWidth - 2 * paddingX);
                        const y = getY(c.close);
                        return `L ${x},${y}`;
                      })
                      .join(' ')} L ${svgWidth - paddingX},${svgHeight - paddingY} Z`}
                    fill="url(#areaGradient)"
                  />
                  {/* Line */}
                  <path
                    d={`M ${candleData
                      .map((c, i) => {
                        const x = paddingX + (i / (candleData.length - 1)) * (svgWidth - 2 * paddingX);
                        const y = getY(c.close);
                        return `${x},${y}`;
                      })
                      .join(' L ')}`}
                    fill="none"
                    stroke="#2962FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Candlestick chart mode */}
              {chartType === 'candle' &&
                candleData.map((c, i) => {
                  const x = paddingX + (i / (candleData.length - 1)) * (svgWidth - 2 * paddingX);
                  const isUp = c.close >= c.open;
                  const color = isUp ? '#089981' : '#F23645';
                  const top = getY(Math.max(c.open, c.close));
                  const bottom = getY(Math.min(c.open, c.close));
                  const candleHeight = Math.max(2, bottom - top);
                  const wickTop = getY(c.high);
                  const wickBottom = getY(c.low);
                  const candleWidth = Math.max(4, (svgWidth - 2 * paddingX) / candleData.length - 4);

                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredCandle(c)}
                    >
                      {/* High-Low Wick */}
                      <line
                        x1={x}
                        y1={wickTop}
                        x2={x}
                        y2={wickBottom}
                        stroke={color}
                        strokeWidth="1.2"
                      />
                      {/* Body */}
                      <rect
                        x={x - candleWidth / 2}
                        y={top}
                        width={candleWidth}
                        height={candleHeight}
                        fill={color}
                        rx="1"
                      />
                    </g>
                  );
                })}
            </svg>
          </div>
        </div>

        {/* Institutional Metrics Matrix */}
        <div className="p-6 border-b border-[#E0E3EB]">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#737687] mb-3">
            Financial Fundamentals & Valuation
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
            <div className="p-3 bg-[#F0F3FA] rounded-lg">
              <span className="text-[#737687] block text-[11px]">Market Cap</span>
              <span className="font-bold text-[#131722] mono-num">{ticker.marketCap || '$120.4B'}</span>
            </div>
            <div className="p-3 bg-[#F0F3FA] rounded-lg">
              <span className="text-[#737687] block text-[11px]">P/E (TTM)</span>
              <span className="font-bold text-[#131722] mono-num">{ticker.peRatio ? `${ticker.peRatio}x` : '28.4x'}</span>
            </div>
            <div className="p-3 bg-[#F0F3FA] rounded-lg">
              <span className="text-[#737687] block text-[11px]">Beta</span>
              <span className="font-bold text-[#131722] mono-num">{ticker.beta || '1.14'}</span>
            </div>
            <div className="p-3 bg-[#F0F3FA] rounded-lg">
              <span className="text-[#737687] block text-[11px]">EPS (Diluted)</span>
              <span className="font-bold text-[#131722] mono-num">{ticker.eps ? `$${ticker.eps}` : '$4.28'}</span>
            </div>
            <div className="p-3 bg-[#F0F3FA] rounded-lg">
              <span className="text-[#737687] block text-[11px]">52-Wk High</span>
              <span className="font-bold text-[#131722] mono-num">${ticker.high52w || (ticker.price * 1.18).toFixed(2)}</span>
            </div>
            <div className="p-3 bg-[#F0F3FA] rounded-lg">
              <span className="text-[#737687] block text-[11px]">52-Wk Low</span>
              <span className="font-bold text-[#131722] mono-num">${ticker.low52w || (ticker.price * 0.76).toFixed(2)}</span>
            </div>
            <div className="p-3 bg-[#F0F3FA] rounded-lg">
              <span className="text-[#737687] block text-[11px]">Target Consensus</span>
              <span className="font-bold text-[#089981] mono-num">${ticker.targetPrice || (ticker.price * 1.15).toFixed(2)}</span>
            </div>
            <div className="p-3 bg-[#F0F3FA] rounded-lg">
              <span className="text-[#737687] block text-[11px]">Analyst Rating</span>
              <span className="font-bold text-[#131722]">{ticker.analystRating || 'Buy'}</span>
            </div>
          </div>
        </div>

        {/* Order Book Level 2 Simulation */}
        <div className="p-6 border-b border-[#E0E3EB]">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#737687] mb-3 flex items-center justify-between">
            <span>Order Book Depth (L2)</span>
            <span className="text-[11px] font-normal text-[#2962FF]">Spread: 0.04 (0.02%)</span>
          </h4>

          <div className="grid grid-cols-2 gap-4 text-[12px] mono-num">
            {/* Bids Column */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-[#737687] pb-1 border-b border-[#E0E3EB]">
                <span>Bid ($)</span>
                <span>Size</span>
              </div>
              <div className="space-y-1 mt-1.5">
                {orderBook.bids.map((b, idx) => (
                  <div key={idx} className="relative flex justify-between py-0.5 px-1 rounded overflow-hidden">
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-[#089981]/12 -z-0"
                      style={{ width: `${b.percent}%` }}
                    />
                    <span className="font-semibold text-[#089981] relative z-10">${b.price.toFixed(2)}</span>
                    <span className="text-[#434656] relative z-10">{b.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Asks Column */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-[#737687] pb-1 border-b border-[#E0E3EB]">
                <span>Ask ($)</span>
                <span>Size</span>
              </div>
              <div className="space-y-1 mt-1.5">
                {orderBook.asks.map((a, idx) => (
                  <div key={idx} className="relative flex justify-between py-0.5 px-1 rounded overflow-hidden">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#F23645]/12 -z-0"
                      style={{ width: `${a.percent}%` }}
                    />
                    <span className="font-semibold text-[#F23645] relative z-10">${a.price.toFixed(2)}</span>
                    <span className="text-[#434656] relative z-10">{a.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Paper Trade Simulator Module */}
        <div className="p-6 bg-[#FAFAFC]">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#737687] mb-3 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#2962FF]" />
            <span>Simulated Paper Trade Terminal</span>
          </h4>

          {tradeSuccessMsg && (
            <div className="mb-3 p-3 bg-[#089981]/10 border border-[#089981]/25 rounded-lg text-[#089981] text-[12px] font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{tradeSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-[#737687] mb-1">
                Order Type
              </label>
              <div className="flex rounded-full bg-[#E0E3EB]/70 p-0.5">
                <button
                  type="button"
                  onClick={() => setTradeType('BUY')}
                  className={`flex-1 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                    tradeType === 'BUY'
                      ? 'bg-[#089981] text-[#FFFFFF] shadow-2xs'
                      : 'text-[#434656]'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('SELL')}
                  className={`flex-1 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                    tradeType === 'SELL'
                      ? 'bg-[#F23645] text-[#FFFFFF] shadow-2xs'
                      : 'text-[#434656]'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#737687] mb-1">
                Quantity (Shares)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={tradeShares}
                onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full h-[36px] px-3 bg-[#FFFFFF] border border-[#E0E3EB] focus:border-[#2962FF] rounded-lg text-[13px] mono-num font-semibold outline-none"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={handleOrderSubmit}
                className={`w-full h-[36px] rounded-full text-[13px] font-bold text-[#FFFFFF] shadow-xs cursor-pointer transition-all active:scale-[0.98] ${
                  tradeType === 'BUY' ? 'bg-[#089981] hover:bg-[#07806d]' : 'bg-[#F23645] hover:bg-[#d82b39]'
                }`}
              >
                Execute {tradeType} (${(tradeShares * ticker.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
