import React, { useState } from 'react';
import { MarketTicker } from '../types/market';
import { ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

interface MarketHeatmapProps {
  tickers: MarketTicker[];
  onSelectTicker: (ticker: MarketTicker) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ tickers, onSelectTicker }) => {
  const [filterAsset, setFilterAsset] = useState<string>('US stocks');

  // Filter tickers for heatmap
  const relevantTickers = tickers.filter((t) => t.assetClass === filterAsset);

  // Group by sector
  const sectors = Array.from(new Set(relevantTickers.map((t) => t.sector || 'General')));

  // Color generator based on changePercent:
  // Bullish > 3% -> intense green #089981
  // Bearish < -3% -> intense red #F23645
  const getHeatmapColor = (changePercent: number) => {
    if (changePercent >= 3) return 'bg-[#089981] text-white';
    if (changePercent >= 1.5) return 'bg-[#089981]/85 text-white';
    if (changePercent > 0) return 'bg-[#089981]/50 text-[#131722]';
    if (changePercent === 0) return 'bg-[#E0E3EB] text-[#131722]';
    if (changePercent > -1.5) return 'bg-[#F23645]/50 text-[#131722]';
    if (changePercent > -3) return 'bg-[#F23645]/85 text-white';
    return 'bg-[#F23645] text-white';
  };

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E0E3EB] rounded-[12px] p-5 my-3 shadow-2xs">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E0E3EB] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#131722] text-white flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-[#131722] tracking-tight">
              Market Heatmap & Sector Performance
            </h2>
            <p className="text-[12px] text-[#737687]">
              Sized by capital weighting · Color intensity indicates percentage delta
            </p>
          </div>
        </div>

        {/* Heatmap asset class toggle */}
        <div className="flex items-center gap-1 bg-[#F0F3FA] p-1 rounded-full">
          {['US stocks', 'World stocks', 'Crypto', 'ETFs'].map((cls) => (
            <button
              key={cls}
              onClick={() => setFilterAsset(cls)}
              className={`h-7 px-3 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                filterAsset === cls
                  ? 'bg-[#131722] text-[#FFFFFF] shadow-2xs'
                  : 'text-[#434656] hover:bg-[#E0E3EB]'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-[#737687] my-3">
        <span>Sector Treemap</span>
        <div className="flex items-center gap-1.5 mono-num">
          <span className="text-[#F23645] font-bold">-3%</span>
          <div className="w-4 h-3 bg-[#F23645] rounded-xs" />
          <div className="w-4 h-3 bg-[#F23645]/60 rounded-xs" />
          <div className="w-4 h-3 bg-[#E0E3EB] rounded-xs" />
          <div className="w-4 h-3 bg-[#089981]/60 rounded-xs" />
          <div className="w-4 h-3 bg-[#089981] rounded-xs" />
          <span className="text-[#089981] font-bold">+3%</span>
        </div>
      </div>

      {/* Sectors Grid */}
      <div className="space-y-4">
        {sectors.map((sec) => {
          const secTickers = relevantTickers.filter((t) => (t.sector || 'General') === sec);
          if (secTickers.length === 0) return null;

          return (
            <div key={sec} className="bg-[#F0F3FA]/50 border border-[#E0E3EB] rounded-xl p-3.5">
              <div className="text-[12px] font-bold text-[#131722] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{sec}</span>
                <span className="text-[11px] font-semibold text-[#737687] mono-num">
                  {secTickers.length} {secTickers.length === 1 ? 'Asset' : 'Assets'}
                </span>
              </div>

              {/* Ticker Tile Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {secTickers.map((ticker) => {
                  const isBull = ticker.changePercent >= 0;
                  const heatClass = getHeatmapColor(ticker.changePercent);

                  return (
                    <button
                      key={ticker.symbol}
                      onClick={() => onSelectTicker(ticker)}
                      className={`p-3 rounded-lg flex flex-col justify-between h-[84px] text-left transition-transform hover:scale-[1.02] shadow-2xs cursor-pointer ${heatClass}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-extrabold text-[14px] tracking-tight">
                          {ticker.symbol}
                        </span>
                        <span className="text-[10px] font-medium opacity-85 mono-num">
                          {ticker.volume}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <div className="text-[13px] font-bold mono-num leading-none">
                          {ticker.currency === 'USD' ? '$' : ''}
                          {ticker.price >= 1000 ? ticker.price.toFixed(1) : ticker.price.toFixed(2)}
                        </div>
                        <div className="text-[11px] font-extrabold mono-num mt-1 flex items-center gap-0.5">
                          {isBull ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          <span>
                            {isBull ? '+' : ''}
                            {ticker.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
