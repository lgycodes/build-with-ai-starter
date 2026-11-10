import React from 'react';
import { BenchmarkIndex } from '../types/market';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface IndicesStripProps {
  indices: BenchmarkIndex[];
  onSelectIndex: (index: BenchmarkIndex) => void;
  selectedIndexId?: string;
}

export const IndicesStrip: React.FC<IndicesStripProps> = ({
  indices,
  onSelectIndex,
  selectedIndexId,
}) => {
  // Helper to generate smooth SVG path for sparkline
  const renderSparkline = (data: number[], isPositive: boolean) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 84;
    const height = 28;
    const padding = 2;

    const points = data.map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const strokeColor = isPositive ? '#089981' : '#F23645';
    const gradientId = `spark-grad-${isPositive ? 'bull' : 'bear'}-${data[data.length - 1]}`;

    // Close path for soft fill
    const firstPoint = points[0].split(',');
    const lastPoint = points[points.length - 1].split(',');
    const fillAreaD = `M ${points.join(' L ')} L ${lastPoint[0]},${height} L ${firstPoint[0]},${height} Z`;

    return (
      <svg width={width} height={height} className="overflow-visible shrink-0">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={fillAreaD} fill={`url(#${gradientId})`} />
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 my-2">
      {indices.map((idx) => {
        const isBull = idx.change >= 0;
        const isSelected = selectedIndexId === idx.id;

        return (
          <button
            key={idx.id}
            onClick={() => onSelectIndex(idx)}
            className={`group text-left p-4 rounded-[12px] transition-all cursor-pointer border ${
              isSelected
                ? 'bg-[#FFFFFF] border-[#2962FF] ring-2 ring-[#2962FF]/15 shadow-sm'
                : 'bg-[#FFFFFF] hover:bg-[#F0F3FA]/70 border-[#E0E3EB] hover:border-[#c3c5d8]'
            }`}
          >
            {/* Top row: Circular Badge + Index Title */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                {/* Circular Badge: 32px × 32px with prominent numbers */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-[12px] text-[#FFFFFF] shadow-2xs shrink-0 select-none"
                  style={{ backgroundColor: idx.badgeColor }}
                >
                  {idx.badgeNumber}
                </div>
                <div>
                  <div className="text-[14px] font-semibold tracking-tight text-[#131722] leading-tight group-hover:text-[#2962FF] transition-colors truncate">
                    {idx.name}
                  </div>
                  <div className="text-[11px] text-[#737687] font-medium leading-none mt-0.5">
                    {idx.symbol}
                  </div>
                </div>
              </div>

              {/* Sparkline Indicator: 84px × 28px inline SVG */}
              <div>{renderSparkline(idx.sparkline, isBull)}</div>
            </div>

            {/* Bottom row: Value in data-mono-num + Sentiment percentage pill */}
            <div className="flex items-baseline justify-between pt-1 border-t border-[#F0F3FA]">
              <div className="mono-num text-[15px] font-bold text-[#131722] tracking-tight">
                {idx.price >= 1000
                  ? idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : idx.price.toFixed(idx.price < 10 ? 3 : 2)}
              </div>

              {/* Sentiment badge: Full pill radius, 22px height, 6px horizontal padding */}
              <div
                className={`h-[22px] px-2 rounded-full flex items-center gap-0.5 text-[11px] font-bold mono-num leading-none ${
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
                  {isBull ? '+' : ''}
                  {idx.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
