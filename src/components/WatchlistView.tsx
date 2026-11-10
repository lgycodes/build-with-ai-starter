import React, { useState } from 'react';
import { MarketTicker, PriceAlert } from '../types/market';
import {
  Star,
  Trash2,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface WatchlistViewProps {
  tickers: MarketTicker[];
  watchlistSymbols: string[];
  onToggleWatchlist: (symbol: string) => void;
  onSelectTicker: (ticker: MarketTicker) => void;
  alerts: PriceAlert[];
  onAddAlert: (symbol: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => void;
  onRemoveAlert: (alertId: string) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  tickers,
  watchlistSymbols,
  onToggleWatchlist,
  onSelectTicker,
  alerts,
  onAddAlert,
  onRemoveAlert,
}) => {
  const [newAlertSymbol, setNewAlertSymbol] = useState(watchlistSymbols[0] || 'NVDA');
  const [newAlertPrice, setNewAlertPrice] = useState<number>(150);
  const [newAlertCondition, setNewAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

  const watchlistedTickers = tickers.filter((t) => watchlistSymbols.includes(t.symbol));

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertSymbol || newAlertPrice <= 0) return;
    onAddAlert(newAlertSymbol, newAlertPrice, newAlertCondition);
  };

  return (
    <div className="w-full my-3 space-y-4">
      {/* Watchlist Header & Summary Card */}
      <div className="bg-[#FFFFFF] border border-[#E0E3EB] rounded-[12px] p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E0E3EB] gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center">
              <Star className="w-5 h-5 fill-[#F7931A]" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#131722] tracking-tight">
                My Institutional Watchlist
              </h2>
              <p className="text-[12px] text-[#737687]">
                Tracking {watchlistedTickers.length} selected assets with real-time quote streaming
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#737687]">
              Persistent in LocalStorage
            </span>
          </div>
        </div>

        {/* Watchlist items table */}
        {watchlistedTickers.length === 0 ? (
          <div className="py-16 text-center">
            <Star className="w-8 h-8 text-[#c3c5d8] mx-auto mb-2" />
            <div className="text-[15px] font-bold text-[#131722]">Your watchlist is empty</div>
            <div className="text-[12px] text-[#737687] max-w-sm mx-auto mt-1 mb-4">
              Click the star icon next to any ticker in the Markets table to pin it to your personal watchlist.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto thin-scrollbar mt-3">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="h-9 border-b border-[#E0E3EB] text-[11px] font-semibold text-[#737687] uppercase tracking-wider">
                  <th className="px-3">Asset</th>
                  <th className="px-3 text-right">Price</th>
                  <th className="px-3 text-right">Change (%)</th>
                  <th className="px-3 text-right">24h Range</th>
                  <th className="px-3 text-right">Market Cap</th>
                  <th className="px-3 text-center">Rating</th>
                  <th className="pr-3 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3FA] text-[13px]">
                {watchlistedTickers.map((ticker) => {
                  const isBull = ticker.change >= 0;

                  return (
                    <tr
                      key={ticker.symbol}
                      onClick={() => onSelectTicker(ticker)}
                      className="h-12 hover:bg-[#F0F3FA] transition-colors cursor-pointer group"
                    >
                      <td className="px-3">
                        <div className="font-bold text-[#131722] group-hover:text-[#2962FF] transition-colors">
                          {ticker.symbol}
                        </div>
                        <div className="text-[11px] text-[#737687] truncate max-w-[180px]">
                          {ticker.name}
                        </div>
                      </td>
                      <td className="px-3 text-right mono-num font-bold text-[#131722]">
                        {ticker.currency === 'USD' ? '$' : ''}
                        {ticker.price >= 1000
                          ? ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : ticker.price.toFixed(2)}
                      </td>
                      <td className="px-3 text-right">
                        <div className="inline-flex justify-end">
                          <div
                            className={`h-[22px] px-2 rounded-full inline-flex items-center gap-0.5 text-[11px] font-bold mono-num leading-none ${
                              isBull
                                ? 'text-[#089981] bg-[#089981]/12'
                                : 'text-[#F23645] bg-[#F23645]/12'
                            }`}
                          >
                            {isBull ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            <span>
                              {isBull ? '+' : ''}
                              {ticker.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 text-right mono-num text-[11px] text-[#737687]">
                        ${ticker.low24h.toFixed(2)} - ${ticker.high24h.toFixed(2)}
                      </td>
                      <td className="px-3 text-right mono-num text-[12px] text-[#434656]">
                        {ticker.marketCap || '—'}
                      </td>
                      <td className="px-3 text-center">
                        <span className="text-[11px] font-semibold text-[#131722] bg-[#F0F3FA] px-2 py-0.5 rounded-full">
                          {ticker.analystRating || 'Buy'}
                        </span>
                      </td>
                      <td
                        className="pr-3 pl-2 text-right"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(ticker.symbol);
                        }}
                      >
                        <button
                          className="p-1.5 rounded-md text-[#737687] hover:text-[#F23645] hover:bg-[#F23645]/10 transition-colors"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Price Alerts Card */}
      <div className="bg-[#FFFFFF] border border-[#E0E3EB] rounded-[12px] p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E0E3EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2962FF]/10 text-[#2962FF] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#131722] tracking-tight">
                Active Price Alerts & Telemetry Triggers
              </h3>
              <p className="text-[12px] text-[#737687]">
                Instant browser notification when quotes cross your execution thresholds
              </p>
            </div>
          </div>
        </div>

        {/* Add alert form */}
        <form onSubmit={handleCreateAlert} className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#737687] mb-1">
              Symbol
            </label>
            <select
              value={newAlertSymbol}
              onChange={(e) => setNewAlertSymbol(e.target.value)}
              className="w-full h-9 px-3 bg-[#F0F3FA] border border-[#E0E3EB] rounded-lg text-[13px] font-semibold text-[#131722] outline-none"
            >
              {tickers.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.symbol} ({t.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#737687] mb-1">
              Condition
            </label>
            <select
              value={newAlertCondition}
              onChange={(e) => setNewAlertCondition(e.target.value as 'ABOVE' | 'BELOW')}
              className="w-full h-9 px-3 bg-[#F0F3FA] border border-[#E0E3EB] rounded-lg text-[13px] font-semibold text-[#131722] outline-none"
            >
              <option value="ABOVE">Price Rises Above (≥)</option>
              <option value="BELOW">Price Falls Below (≤)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#737687] mb-1">
              Target Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={newAlertPrice}
              onChange={(e) => setNewAlertPrice(parseFloat(e.target.value) || 0)}
              className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#E0E3EB] rounded-lg text-[13px] mono-num font-semibold text-[#131722] outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full h-9 rounded-full bg-[#131722] hover:bg-[#2A2E39] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Set Alert</span>
            </button>
          </div>
        </form>

        {/* Existing Alerts */}
        <div className="space-y-2">
          {alerts.length === 0 ? (
            <div className="py-6 text-center text-[#737687] text-[12px]">
              No active alerts. Configure a threshold above to be notified during live tick updates.
            </div>
          ) : (
            alerts.map((al) => (
              <div
                key={al.id}
                className="p-3 bg-[#F0F3FA] rounded-lg flex items-center justify-between text-[13px]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-[#131722]">{al.symbol}</span>
                  <span className="text-[12px] text-[#434656]">
                    triggers when price is {al.condition === 'ABOVE' ? '≥' : '≤'}{' '}
                    <strong className="mono-num text-[#131722]">${al.targetPrice.toFixed(2)}</strong>
                  </span>
                </div>
                <button
                  onClick={() => onRemoveAlert(al.id)}
                  className="p-1 text-[#737687] hover:text-[#F23645] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
