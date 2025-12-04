import React, { useEffect, useState } from 'react';
import { Content, SiteSettings } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

interface Props {
  content: Content;
  settings?: SiteSettings;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  video_url: string;
}

const Portfolio: React.FC<Props> = ({ content, settings }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setItems(data);
        }
      } catch (err: any) {
        console.error('Error fetching portfolio:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <main className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16 text-center text-brand-dark">
          {content.portfolioPage.title}
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-brand-accent" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <p>Error loading portfolio items. Please try again later.</p>
            <p className="text-sm mt-2 opacity-70">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div key={item.id} className="group flex flex-col">
                <div className="relative w-full aspect-[9/16] bg-brand-light overflow-hidden shadow-lg border border-brand-beige mb-4">
                  <iframe 
                    src={item.video_url} 
                    className="w-full h-full"
                    frameBorder="0" 
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                    title={item.title}
                  ></iframe>
                </div>
                <div className="text-xs text-brand-accent font-bold uppercase tracking-widest mb-1">{item.category}</div>
                <h3 className="text-lg font-bold uppercase text-brand-dark leading-tight">{item.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Portfolio;