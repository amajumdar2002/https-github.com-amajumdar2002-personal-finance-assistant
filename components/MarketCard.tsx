
import React from 'react';
import { MarketSummary } from '../types';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';

interface MarketCardProps {
  data: MarketSummary;
  onClick: () => void;
}

const MarketCard: React.FC<MarketCardProps> = ({ data, onClick }) => {
  const isUp = data.status === 'up';
  const isDown = data.status === 'down';

  return (
    <div 
      onClick={onClick}
      className="glass p-5 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{data.region}</h3>
          <h2 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">{data.indexName}</h2>
        </div>
        <div className={`p-2 rounded-lg ${isUp ? 'bg-emerald-500/10 text-emerald-500' : isDown ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-500'}`}>
          {isUp ? <ArrowUpIcon size={20} /> : isDown ? <ArrowDownIcon size={20} /> : <MinusIcon size={20} />}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{data.price}</span>
        <span className={`text-sm font-medium ${isUp ? 'text-emerald-500' : isDown ? 'text-red-500' : 'text-slate-400'}`}>
          {isUp ? '+' : ''}{data.changePercent}
        </span>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
        <span>Real-time Data</span>
        <span className="group-hover:translate-x-1 transition-transform">Analyze &rarr;</span>
      </div>
    </div>
  );
};

export default MarketCard;
