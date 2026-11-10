import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MarketTicker } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickers: MarketTicker[];
  onSelectTicker: (ticker: MarketTicker) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tickers,
  onSelectTicker,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter tickers
  const results = useMemo(() => {
    let list = tickers;
    if (category !== 'All') {
      list = list.filter((t) => t.assetClass.toLowerCase().includes(category.toLowerCase()));
    }

    if (!query.trim()) {
      return list.slice(0, 8); // show popular default symbols
    }

    const q = query.toLowerCase().trim();
    return list.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.sector?.toLowerCase().includes(q)
    );
  }, [tickers, category, query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelectTicker(results[selectedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelectTicker, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[4px] flex items-start justify-center pt-16 px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#FFFFFF] rounded-[16px] shadow-2xl border border-[#E0E3EB] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#2962FF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbols, companies, or asset classes..."
            className="w-full text-[15px] font-medium text-[#131722] placeholder:text-[#737687] outline-none bg-transparent"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-[#F0F3FA] text-[#737687]"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 text-[11px] font-semibold bg-[#F0F3FA] text-[#434656] rounded border border-[#E0E3EB]">
              ESC
            </kbd>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 bg-[#F0F3FA] border-b border-[#E0E3EB] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['All', 'US stocks', 'Crypto', 'Futures', 'Forex', 'ETFs'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setSelectedIndex(0);
              }}
              className={`h-6 px-3 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                category === cat
                  ? 'bg-[#131722] text-[#FFFFFF]'
                  : 'text-[#434656] hover:bg-[#E0E3EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-[#F0F3FA] p-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-[#737687] text-[13px]">
              No instruments match "{query}".
            </div>
          ) : (
            results.map((ticker, idx) => {
              const isBull = ticker.change >= 0;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={ticker.symbol}
                  onClick={() => {
                    onSelectTicker(ticker);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#F0F3FA]' : 'hover:bg-[#F0F3FA]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F0F3FA] border border-[#E0E3EB] flex items-center justify-center font-bold text-[12px] text-[#131722] mono-num">
                      {ticker.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[14px] text-[#131722]">{ticker.symbol}</span>
                        <span className="text-[10px] uppercase font-semibold text-[#737687] bg-[#E0E3EB]/50 px-1.5 py-0.2 rounded">
                          {ticker.assetClass}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#737687] truncate max-w-[260px]">
                        {ticker.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-[13px] text-[#131722] mono-num">
                      {ticker.currency === 'USD' ? '$' : ''}
                      {ticker.price >= 1000
                        ? ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : ticker.price.toFixed(ticker.price < 5 ? 4 : 2)}
                    </div>
                    <div
                      className={`text-[11px] font-bold mono-num inline-flex items-center gap-0.5 ${
                        isBull ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isBull ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>
                        {isBull ? '+' : ''}
                        {ticker.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[#F0F3FA] border-t border-[#E0E3EB] flex items-center justify-between text-[11px] text-[#737687]">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to inspect</span>
          </div>
          <span>Institutional Real-Time Feed</span>
        </div>
      </div>
    </div>
  );
};
