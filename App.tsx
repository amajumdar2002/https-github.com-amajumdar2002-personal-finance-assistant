
import React, { useState, useEffect } from 'react';
import { MarketSummary, AppTab, MarketInsight } from './types';
import MarketCard from './components/MarketCard';
import PriceChart from './components/PriceChart';
import { getMarketInsights } from './services/geminiService';
import { 
  Globe, 
  TrendingUp, 
  PieChart, 
  Search, 
  Menu, 
  X, 
  Loader2, 
  ExternalLink,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

const INITIAL_MARKETS: MarketSummary[] = [
  { region: 'Americas', indexName: 'S&P 500', price: '5,026.61', change: '+25.30', changePercent: '0.51%', status: 'up' },
  { region: 'Europe', indexName: 'STOXX 50', price: '4,765.22', change: '-12.45', changePercent: '0.26%', status: 'down' },
  { region: 'Asia', indexName: 'Nikkei 225', price: '38,487.24', change: '+320.10', changePercent: '0.84%', status: 'up' },
  { region: 'Emerging', indexName: 'MSCI EM', price: '1,015.40', change: '+5.20', changePercent: '0.51%', status: 'up' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [insight, setInsight] = useState<MarketInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMarketAnalysis = async (market: string) => {
    setSelectedMarket(market);
    setLoading(true);
    try {
      const data = await getMarketInsights(market);
      setInsight(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a]">
      {/* Sidebar - Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Globe className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ETF Oracle</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <button 
              onClick={() => setActiveTab(AppTab.DASHBOARD)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === AppTab.DASHBOARD ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <TrendingUp size={20} />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab(AppTab.ANALYZER)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === AppTab.ANALYZER ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <PieChart size={20} />
              <span>ETF Finder</span>
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-xs text-slate-400 mb-2">Portfolio Value</p>
              <p className="text-xl font-bold">$124,560.00</p>
              <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1">
                <TrendingUp size={12} />
                <span>+4.2% today</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-40 glass px-6 py-4 flex items-center justify-between md:px-10">
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          
          <div className="relative flex-1 max-w-md mx-4 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search markets, tickers, or ETFs..." 
              className="w-full bg-slate-800/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-slate-400">Market Status</p>
              <p className="text-sm font-medium text-emerald-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Open
              </p>
            </div>
            <img src="https://picsum.photos/40" className="w-10 h-10 rounded-full border border-white/10" alt="Profile" />
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {activeTab === AppTab.DASHBOARD && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-3xl font-bold">Global Indices</h2>
                    <p className="text-slate-400 mt-1">Real-time performance of major global markets.</p>
                  </div>
                  <button className="text-emerald-400 text-sm font-semibold hover:underline">View All</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {INITIAL_MARKETS.map((market) => (
                    <MarketCard 
                      key={market.indexName} 
                      data={market} 
                      onClick={() => handleMarketAnalysis(market.indexName)}
                    />
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 glass rounded-3xl p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">Market Performance</h3>
                      <p className="text-sm text-slate-400">S&P 500 Intra-day Movement</p>
                    </div>
                    <div className="flex gap-2">
                      {['1D', '1W', '1M', '1Y', 'All'].map(t => (
                        <button key={t} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${t === '1D' ? 'bg-emerald-500 text-white' : 'hover:bg-white/5 text-slate-400'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <PriceChart />
                </div>

                {/* Recommendations/Intelligence Section */}
                <div className="glass rounded-3xl p-8 relative overflow-hidden">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="text-emerald-500" size={20} />
                    AI Market Intelligence
                  </h3>
                  
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-4">
                      <Loader2 className="animate-spin text-emerald-500" size={40} />
                      <p className="text-sm animate-pulse">Scanning global markets for opportunities...</p>
                    </div>
                  ) : insight ? (
                    <div className="space-y-6">
                      <div className="text-sm text-slate-300 leading-relaxed max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="prose prose-invert prose-sm">
                          {insight.summary.split('\n').map((line, i) => (
                            <p key={i} className="mb-2">{line}</p>
                          ))}
                        </div>
                      </div>
                      
                      {insight.sources.length > 0 && (
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-xs text-slate-500 mb-3 uppercase font-bold">Verified Sources</p>
                          <div className="space-y-2">
                            {insight.sources.slice(0, 3).map((source, i) => (
                              <a 
                                key={i} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-slate-400"
                              >
                                <span className="truncate max-w-[180px]">{source.title}</span>
                                <ExternalLink size={12} className="shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                        <ChevronRight size={32} />
                      </div>
                      <p className="text-slate-400 text-sm">Select a market index to generate <br/> real-time AI investment insights.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === AppTab.ANALYZER && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="glass rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-2">ETF Recommendation Engine</h2>
                <p className="text-slate-400 mb-8">Identify the best exchange-traded funds based on specific geographic markets and asset classes.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['Technology', 'Green Energy', 'Healthcare', 'Emerging Markets', 'Dividends', 'Bonds'].map((sector) => (
                    <div 
                      key={sector} 
                      onClick={() => handleMarketAnalysis(sector + " ETF Market")}
                      className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-emerald-400 text-xs font-bold uppercase">{sector}</span>
                        <ChevronRight size={16} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">Curated {sector} Picks</h4>
                      <p className="text-sm text-slate-500">Discover ETFs focused on long-term {sector.toLowerCase()} sector growth.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <button 
        onClick={() => setActiveTab(AppTab.ANALYZER)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white z-50"
      >
        <Search size={24} />
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.3);
        }
      `}} />
    </div>
  );
};

export default App;
