import React, { useState, useMemo } from 'react';
import { MarketTicker } from '../types/market';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpDown,
  Star,
  Search,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';

interface MarketTableProps {
  tickers: MarketTicker[];
  onSelectTicker: (ticker: MarketTicker) => void;
  watchlistSymbols: string[];
  onToggleWatchlist: (symbol: string) => void;
  flashedTickerSymbol?: string | null;
  selectedAsset: string;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'volume' | 'marketCap';
type SortDirection = 'asc' | 'desc';

export const MarketTable: React.FC<MarketTableProps> = ({
  tickers,
  onSelectTicker,
  watchlistSymbols,
  onToggleWatchlist,
  flashedTickerSymbol,
  selectedAsset,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [tableSearch, setTableSearch] = useState<string>('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const parseMarketCap = (cap?: string): number => {
    if (!cap) return 0;
    const clean = cap.replace('$', '').toUpperCase();
    if (clean.endsWith('T')) return parseFloat(clean) * 1e12;
    if (clean.endsWith('B')) return parseFloat(clean) * 1e9;
    if (clean.endsWith('M')) return parseFloat(clean) * 1e6;
    return parseFloat(clean) || 0;
  };

  const parseVolume = (vol: string): number => {
    if (!vol) return 0;
    const clean = vol.replace('$', '').toUpperCase();
    if (clean.endsWith('B')) return parseFloat(clean) * 1e9;
    if (clean.endsWith('M')) return parseFloat(clean) * 1e6;
    if (clean.endsWith('K')) return parseFloat(clean) * 1e3;
    return parseFloat(clean) || 0;
  };

  const filteredAndSortedTickers = useMemo(() => {
    let result = [...tickers];

    // Filter by quick filter tabs
    if (filterType === 'gainers') {
      result = result.filter((t) => t.changePercent > 0);
    } else if (filterType === 'losers') {
      result = result.filter((t) => t.changePercent < 0);
    } else if (filterType === 'active') {
      result = result.sort((a, b) => parseVolume(b.volume) - parseVolume(a.volume)).slice(0, 8);
    } else if (filterType === 'megacap') {
      result = result.filter((t) => parseMarketCap(t.marketCap) >= 500e9);
    }

    // Filter by table search input
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      result = result.filter(
        (t) => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'symbol') {
        comparison = a.symbol.localeCompare(b.symbol);
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'changePercent') {
        comparison = a.changePercent - b.changePercent;
      } else if (sortField === 'volume') {
        comparison = parseVolume(a.volume) - parseVolume(b.volume);
      } else if (sortField === 'marketCap') {
        comparison = parseMarketCap(a.marketCap) - parseMarketCap(b.marketCap);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tickers, filterType, sortField, sortDirection, tableSearch]);

  const renderSparkline = (data: number[], isPositive: boolean) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 68;
    const height = 22;
    const padding = 2;

    const points = data.map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const strokeColor = isPositive ? '#089981' : '#F23645';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={`M ${points.join(' L ')}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E0E3EB] rounded-[12px] overflow-hidden my-3 shadow-2xs">
      {/* Sub-toolbar: Filter Segmented Pills + Quick Table Search */}
      <div className="p-3.5 border-b border-[#E0E3EB] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFFFF]">
        {/* Segmented Filter Controls */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'gainers', label: 'Top Gainers' },
            { id: 'losers', label: 'Top Losers' },
            { id: 'active', label: 'Most Active' },
            { id: 'megacap', label: 'Mega Cap (> $500B)' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterType(pill.id)}
              className={`h-[28px] px-3 rounded-full text-[12px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                filterType === pill.id
                  ? 'bg-[#131722] text-[#FFFFFF] font-semibold shadow-2xs'
                  : 'bg-[#F0F3FA] text-[#434656] hover:bg-[#E0E3EB]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Search input in table toolbar */}
        <div className="relative w-full sm:w-60 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#737687]" />
          <input
            type="text"
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            placeholder={`Filter ${selectedAsset}...`}
            className="w-full h-8 pl-8 pr-3 bg-[#F0F3FA] hover:bg-[#E0E3EB]/70 focus:bg-[#FFFFFF] border border-transparent focus:border-[#2962FF] rounded-full text-[12px] text-[#131722] placeholder:text-[#737687] outline-none transition-colors"
          />
        </div>
      </div>

      {/* Financial Table Viewport */}
      <div className="w-full overflow-x-auto thin-scrollbar">
        <table className="w-full text-left border-collapse">
          {/* Header: Height 36px, label-sm uppercase, color #787B86, right-aligned numeric */}
          <thead>
            <tr className="h-[36px] bg-[#F0F3FA] border-b border-[#E0E3EB] text-[11px] font-semibold text-[#737687] tracking-wider uppercase select-none">
              <th className="pl-4 pr-2 w-10 text-center">
                <span className="sr-only">Watchlist</span>
              </th>
              <th className="px-3 min-w-[180px]">
                <button
                  onClick={() => handleSort('symbol')}
                  className="flex items-center gap-1 hover:text-[#131722] transition-colors font-semibold uppercase cursor-pointer"
                >
                  <span>Symbol & Name</span>
                  <ArrowUpDown className="w-3 h-3 text-[#737687]" />
                </button>
              </th>
              <th className="px-3 text-right min-w-[100px]">
                <button
                  onClick={() => handleSort('price')}
                  className="inline-flex items-center gap-1 hover:text-[#131722] transition-colors font-semibold uppercase cursor-pointer"
                >
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3 text-[#737687]" />
                </button>
              </th>
              <th className="px-3 text-right min-w-[100px]">Change ($)</th>
              <th className="px-3 text-right min-w-[110px]">
                <button
                  onClick={() => handleSort('changePercent')}
                  className="inline-flex items-center gap-1 hover:text-[#131722] transition-colors font-semibold uppercase cursor-pointer"
                >
                  <span>Change (%)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#737687]" />
                </button>
              </th>
              <th className="px-3 text-right min-w-[90px] hidden sm:table-cell">24h High</th>
              <th className="px-3 text-right min-w-[90px] hidden sm:table-cell">24h Low</th>
              <th className="px-3 text-right min-w-[90px]">
                <button
                  onClick={() => handleSort('volume')}
                  className="inline-flex items-center gap-1 hover:text-[#131722] transition-colors font-semibold uppercase cursor-pointer"
                >
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3 text-[#737687]" />
                </button>
              </th>
              <th className="px-3 text-right min-w-[100px] hidden md:table-cell">
                <button
                  onClick={() => handleSort('marketCap')}
                  className="inline-flex items-center gap-1 hover:text-[#131722] transition-colors font-semibold uppercase cursor-pointer"
                >
                  <span>Market Cap</span>
                  <ArrowUpDown className="w-3 h-3 text-[#737687]" />
                </button>
              </th>
              <th className="px-3 text-center min-w-[90px] hidden lg:table-cell">Trend</th>
              <th className="pr-4 pl-2 text-right w-12">
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>

          {/* Rows: Height 44px–48px, alternating transparent backgrounds with #F0F3FA hover state */}
          <tbody className="divide-y divide-[#F0F3FA] text-[13px]">
            {filteredAndSortedTickers.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-[#737687] text-[14px]">
                  No instruments found matching <span className="font-semibold text-[#131722]">"{tableSearch}"</span>.
                </td>
              </tr>
            ) : (
              filteredAndSortedTickers.map((ticker) => {
                const isBull = ticker.change >= 0;
                const isWatchlisted = watchlistSymbols.includes(ticker.symbol);
                const isFlashed = flashedTickerSymbol === ticker.symbol;

                return (
                  <tr
                    key={ticker.symbol}
                    onClick={() => onSelectTicker(ticker)}
                    className={`h-[48px] group transition-colors cursor-pointer select-none ${
                      isFlashed
                        ? isBull
                          ? 'bg-[#089981]/15 transition-none'
                          : 'bg-[#F23645]/15 transition-none'
                        : 'hover:bg-[#F0F3FA]'
                    }`}
                  >
                    {/* Watchlist star toggle */}
                    <td
                      className="pl-4 pr-1 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(ticker.symbol);
                      }}
                    >
                      <button
                        className="p-1 rounded-md text-[#c3c5d8] hover:text-[#F7931A] transition-colors focus:outline-none"
                        aria-label={`Toggle watchlist for ${ticker.symbol}`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isWatchlisted
                              ? 'fill-[#F7931A] text-[#F7931A]'
                              : 'group-hover:text-[#737687]'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Ticker Symbol & Name (Two-tier layout: bold 13px above company name 11px muted gray) */}
                    <td className="px-3">
                      <div className="flex items-center gap-2.5">
                        <div>
                          <div className="font-bold text-[13px] text-[#131722] group-hover:text-[#2962FF] transition-colors leading-tight">
                            {ticker.symbol}
                          </div>
                          <div className="text-[11px] text-[#737687] font-normal truncate max-w-[150px] sm:max-w-[210px] leading-tight">
                            {ticker.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price in data-mono-num tabular lining figures */}
                    <td className="px-3 text-right mono-num font-bold text-[#131722]">
                      {ticker.currency === 'USD' ? '$' : ''}
                      {ticker.price >= 1000
                        ? ticker.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : ticker.price.toFixed(ticker.price < 5 ? 4 : 2)}
                    </td>

                    {/* Change in dollars */}
                    <td
                      className={`px-3 text-right mono-num font-semibold ${
                        isBull ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isBull ? '+' : ''}
                      {ticker.currency === 'USD' ? '$' : ''}
                      {Math.abs(ticker.change).toFixed(ticker.price < 5 ? 4 : 2)}
                    </td>

                    {/* Change % (Spec: Sentiment Badges & Deltas - pill radius, 22px height, 6px horizontal padding) */}
                    <td className="px-3 text-right">
                      <div className="inline-flex justify-end">
                        <div
                          className={`h-[22px] px-2 rounded-full inline-flex items-center gap-0.5 text-[11px] font-bold mono-num leading-none ${
                            isBull
                              ? 'text-[#089981] bg-[#089981]/12'
                              : 'text-[#F23645] bg-[#F23645]/12'
                          }`}
                        >
                          {isBull ? (
                            <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                          )}
                          <span>
                            {isBull ? '+' : '−'}
                            {Math.abs(ticker.changePercent).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 24h High */}
                    <td className="px-3 text-right mono-num text-[#434656] text-[12px] hidden sm:table-cell">
                      {ticker.high24h.toFixed(ticker.high24h < 5 ? 4 : 2)}
                    </td>

                    {/* 24h Low */}
                    <td className="px-3 text-right mono-num text-[#434656] text-[12px] hidden sm:table-cell">
                      {ticker.low24h.toFixed(ticker.low24h < 5 ? 4 : 2)}
                    </td>

                    {/* Volume */}
                    <td className="px-3 text-right mono-num text-[#131722] font-medium text-[12px]">
                      {ticker.volume}
                    </td>

                    {/* Market Cap */}
                    <td className="px-3 text-right mono-num text-[#434656] text-[12px] hidden md:table-cell">
                      {ticker.marketCap || '—'}
                    </td>

                    {/* Sparkline Indicator */}
                    <td className="px-3 text-center hidden lg:table-cell">
                      <div className="flex justify-center">
                        {renderSparkline(ticker.sparkline, isBull)}
                      </div>
                    </td>

                    {/* Quick Open Indicator */}
                    <td className="pr-4 pl-2 text-right">
                      <ExternalLink className="w-3.5 h-3.5 text-[#c3c5d8] group-hover:text-[#2962FF] transition-colors inline-block" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary Stats */}
      <div className="h-10 px-4 bg-[#F0F3FA] border-t border-[#E0E3EB] flex items-center justify-between text-[11px] font-medium text-[#737687]">
        <div className="mono-num">
          Showing {filteredAndSortedTickers.length} instruments in {selectedAsset}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Data delayed by 0s · Real-time Institutional Feed</span>
          <span className="font-semibold text-[#131722]">TABULAR-NUMS ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
