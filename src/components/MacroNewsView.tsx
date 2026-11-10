import React from 'react';
import { MarketTicker } from '../types/market';
import { Landmark, TrendingUp, Calendar, Newspaper, ArrowUpRight } from 'lucide-react';

interface MacroNewsViewProps {
  tickers: MarketTicker[];
  onSelectTicker: (ticker: MarketTicker) => void;
}

export const MacroNewsView: React.FC<MacroNewsViewProps> = ({ tickers, onSelectTicker }) => {
  const yieldCurveData = [
    { maturity: '1M', yield: 4.58 },
    { maturity: '3M', yield: 4.52 },
    { maturity: '6M', yield: 4.45 },
    { maturity: '1Y', yield: 4.38 },
    { maturity: '2Y', yield: 4.31 },
    { maturity: '5Y', yield: 4.34 },
    { maturity: '10Y', yield: 4.44 },
    { maturity: '30Y', yield: 4.61 },
  ];

  const newsItems = [
    {
      id: '1',
      title: 'Federal Reserve Policy Shift: FOMC Holds Benchmark at 4.50% - 4.75% Band',
      source: 'Federal Reserve Wire',
      time: '18m ago',
      category: 'Monetary Policy',
      impact: 'High',
    },
    {
      id: '2',
      title: 'Treasury Yield Curve Normalizes with 10Y-2Y Spread Reaching +13 Basis Points',
      source: 'Fixed Income Desk',
      time: '42m ago',
      category: 'Bonds',
      impact: 'Medium',
    },
    {
      id: '3',
      title: 'Semiconductor Capital Equipment Orders Surge 14% on Next-Gen Node Deployments',
      source: 'Tech Institutional Daily',
      time: '1h ago',
      category: 'Equities',
      impact: 'High',
    },
    {
      id: '4',
      title: 'Crude Inventory Draws Surprise Markets with 3.4M Barrel Contraction in Cushing Hub',
      source: 'Energy Commodities Report',
      time: '2h ago',
      category: 'Commodities',
      impact: 'Medium',
    },
  ];

  return (
    <div className="w-full my-3 space-y-4">
      {/* Top row: US Treasury Yield Curve + Central Bank Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Treasury Yield Curve */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E0E3EB] rounded-[12px] p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E3EB] mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2962FF]/10 text-[#2962FF] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#131722] tracking-tight">
                  US Sovereign Yield Curve Structure
                </h3>
                <p className="text-[12px] text-[#737687]">
                  Benchmark maturities from 1-month paper to 30-year long bond
                </p>
              </div>
            </div>
            <span className="text-[12px] font-bold text-[#089981] bg-[#089981]/10 px-2.5 py-1 rounded-full mono-num">
              Spread (10Y - 2Y): +13 bps
            </span>
          </div>

          {/* Visual Yield Curve Bars */}
          <div className="grid grid-cols-8 gap-2 items-end h-44 pt-6 pb-2 px-2 bg-[#F0F3FA] rounded-xl border border-[#E0E3EB]">
            {yieldCurveData.map((pt) => {
              const heightPercent = ((pt.yield - 3.8) / (4.8 - 3.8)) * 100;
              return (
                <div key={pt.maturity} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[11px] font-bold text-[#131722] mono-num mb-1">
                    {pt.yield.toFixed(2)}%
                  </span>
                  <div
                    className="w-full bg-[#2962FF] group-hover:bg-[#0049db] rounded-t-sm transition-all"
                    style={{ height: `${Math.max(15, heightPercent)}%` }}
                  />
                  <span className="text-[11px] font-semibold text-[#737687] mt-2">
                    {pt.maturity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Central Banks Policy Matrix */}
        <div className="bg-[#FFFFFF] border border-[#E0E3EB] rounded-[12px] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E0E3EB] mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#131722] text-white flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#131722]">Central Bank Policy</h3>
                <p className="text-[11px] text-[#737687]">Key policy benchmark targets</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Federal Reserve (Fed)', rate: '4.62%', bias: 'Neutral / Pause', flag: '🇺🇸' },
                { name: 'European Central Bank (ECB)', rate: '3.25%', bias: 'Dovish', flag: '🇪🇺' },
                { name: 'Bank of England (BoE)', rate: '4.75%', bias: 'Neutral', flag: '🇬🇧' },
                { name: 'Bank of Japan (BoJ)', rate: '0.25%', bias: 'Hawkish Tilt', flag: '🇯🇵' },
              ].map((cb) => (
                <div
                  key={cb.name}
                  className="p-3 bg-[#F0F3FA] rounded-lg flex items-center justify-between text-[12px]"
                >
                  <div>
                    <div className="font-semibold text-[#131722] flex items-center gap-1.5">
                      <span>{cb.flag}</span>
                      <span>{cb.name}</span>
                    </div>
                    <div className="text-[11px] text-[#737687]">{cb.bias}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[14px] font-bold text-[#131722] mono-num">{cb.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Market Wire */}
      <div className="bg-[#FFFFFF] border border-[#E0E3EB] rounded-[12px] p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E0E3EB] mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#131722] text-white flex items-center justify-center">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#131722]">
                Macroeconomic Wire & Research Dispatches
              </h3>
              <p className="text-[12px] text-[#737687]">Real-time market movers and catalyst reports</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#737687]">Live Feed</span>
        </div>

        <div className="divide-y divide-[#F0F3FA]">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F0F3FA] px-2 rounded-lg transition-colors cursor-pointer group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase text-[#2962FF] bg-[#2962FF]/10 px-2 py-0.2 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-[#737687]">{item.source}</span>
                  <span className="text-[11px] text-[#737687]">· {item.time}</span>
                </div>
                <h4 className="text-[14px] font-semibold text-[#131722] group-hover:text-[#2962FF] transition-colors">
                  {item.title}
                </h4>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E0E3EB] text-[#434656]">
                  {item.impact} Impact
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#737687] group-hover:text-[#2962FF] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
