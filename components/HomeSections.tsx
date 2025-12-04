import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Plus, Minus, MessageCircle, Star } from 'lucide-react';
import { Content, Language, SiteSettings } from '../types';
import { supabase } from '../lib/supabaseClient';

interface SectionProps {
  content: Content;
  navigate?: (page: string) => void;
  settings?: SiteSettings;
  lang?: Language;
  setPrefilledMessage?: (msg: string) => void;
}

// Helper to get localized string from settings or fallback
// STRICTLY returns string (or fallback) to avoid React object render errors
const getLoc = (val: any, lang: Language | undefined, fallback: string) => {
  if (val === undefined || val === null) return fallback;
  
  if (typeof val === 'object') {
    // Attempt to extract string based on language
    const localized = (lang ? val[lang] : undefined) || val['en'];
    
    // Check if what we found is actually a string
    if (typeof localized === 'string') {
      return localized || fallback;
    }
    
    return fallback;
  }
  
  return String(val);
};

export const Hero: React.FC<SectionProps> = ({ content, navigate, settings, lang }) => {
  // Map settings to content. Removed hardcoded Unsplash fallback.
  const bgImage = typeof settings?.hero_bg_image === 'string' ? settings.hero_bg_image : null;
  const videoId = typeof settings?.hero_video_url === 'string' ? settings.hero_video_url : null;
  
  // Swapped keys as requested: heading now uses hero_heading_top, subheading uses hero_heading_main
  const heading = getLoc(settings?.hero_heading_top, lang, content.hero.heading);
  const subheading = getLoc(settings?.hero_heading_main, lang, content.hero.subheading);
  const lead = getLoc(settings?.hero_lead_text, lang, content.hero.lead);

  // Check if query params already exist to decide on separator for Vimeo
  const separator = videoId?.includes('?') ? '&' : '?';
  
  return (
    <section className="relative min-h-screen flex items-center pt-20 bg-brand-dark overflow-hidden">
      {/* Background Media */}
      {(bgImage || videoId) && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {videoId && (
            <iframe
              src={`https://player.vimeo.com/video/${videoId}${separator}autoplay=1&loop=1&muted=1&background=1&app_id=58479`}
              className="hidden md:block absolute top-1/2 left-1/2 w-[177.77vh] min-w-full min-h-full h-[56.25vw] -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              title="Hero Background Video"
              style={{ pointerEvents: 'none' }}
            ></iframe>
          )}
          {bgImage && (
            <img 
              src={bgImage} 
              alt="Reach Studio" 
              className={`w-full h-full object-cover opacity-20 ${videoId ? 'md:hidden' : ''}`}
            />
          )}
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-6 text-brand-light">
            {heading}
          </h1>
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-brand-accent mb-8">
            {subheading}
          </h2>
          <p className="text-lg md:text-xl text-brand-beige/80 leading-relaxed max-w-2xl mb-10">
            {lead}
          </p>
          <button 
            onClick={() => navigate?.('contact')}
            className="group bg-brand-light text-brand-dark px-8 py-4 text-sm md:text-base font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all duration-300 flex items-center shadow-lg"
          >
            {content.hero.cta}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export const Services: React.FC<SectionProps & { lang: Language }> = ({ content, navigate, lang, settings, setPrefilledMessage }) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabase
          .from('services')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (data) {
          setServices(data);
        }
      } catch (err) {
        console.error("Error loading services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const title = getLoc(settings?.home_services_title, lang, content.services.title);
  const linkLabel = getLoc(settings?.home_services_cta_label, lang, content.services.link);

  const handleServiceClick = (serviceTitle: string) => {
    if (setPrefilledMessage && navigate) {
      setPrefilledMessage(
        lang === 'fr' 
        ? `Bonjour, je suis intéressé par votre service : ${serviceTitle}.` 
        : `Hello, I am interested in your service: ${serviceTitle}.`
      );
      navigate('contact');
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h3 className="text-3xl font-bold uppercase tracking-tighter mb-12 border-b border-gray-200 pb-4 text-brand-dark">
          {title}
        </h3>
        
        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading services...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              // Extract language specific text using getLoc for safety
              const svcTitle = getLoc(service.title, lang, "");
              const svcDesc = getLoc(service.description, lang, "");

              return (
                <div 
                  key={service.id || idx} 
                  className="group cursor-pointer"
                  onClick={() => handleServiceClick(svcTitle)}
                >
                  <div className="relative overflow-hidden aspect-[4/3] mb-6 rounded-2xl shadow-sm">
                    <img 
                      src={service.image_url} 
                      alt={svcTitle} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-black/0 transition-colors"></div>
                  </div>
                  <h4 className="text-xl font-bold uppercase mb-3 text-brand-dark group-hover:text-brand-accent transition-colors">{svcTitle}</h4>
                  <p className="text-gray-600 leading-relaxed">{svcDesc}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate?.('portfolio')}
            className="text-brand-dark font-bold uppercase tracking-widest border-b-2 border-brand-dark hover:text-brand-accent hover:border-brand-accent transition-colors pb-1"
          >
            {linkLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

export const VideoLoop: React.FC<{ settings?: SiteSettings }> = ({ settings }) => {
  // Default includes the hash needed for the default video
  const defaultVideo = "1039294401?h=d54e6e69ba";
  const videoId = (typeof settings?.home_video_id === 'string' && settings.home_video_id) 
    ? settings.home_video_id 
    : defaultVideo;

  // Check if query params already exist to decide on separator
  const separator = videoId.includes('?') ? '&' : '?';

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="relative w-full aspect-video md:aspect-[21/9] lg:h-[70vh]">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}${separator}autoplay=1&loop=1&muted=1&background=1&app_id=58479`}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          title="Reach Studio Showreel"
          style={{ pointerEvents: 'none' }} // Prevents interaction with background video
        ></iframe>
      </div>
    </section>
  );
};

export const Problems: React.FC<SectionProps> = ({ content, settings, lang }) => {
  const problemsData = settings?.home_problems_section || {};
  const heading = getLoc(problemsData.title, lang, content.problems.heading);
  const imageUrl = problemsData.image_url;

  // Fallback defaults if not in DB
  const defaultItems = lang === 'fr' 
    ? [
        "Vos publications ne font pas assez de vues et ne génèrent pas assez d’engagement",
        "Vous avez le sentiment que votre investissement sur les réseaux ne vous rapporte aucun client",
        "Vous passez votre temps à vérifier si les publications de la semaine ont bien été postées",
        "Les vidéos amateurs de votre entourage ne suffisent plus à l’image de votre marque"
      ]
    : [
        "Your posts don't get enough views or engagement",
        "You feel like your social media investment brings zero clients",
        "You spend time checking if weekly posts were actually posted",
        "Amateur videos from friends aren't enough for your brand anymore"
      ];

  const items = (problemsData.items && lang && problemsData.items[lang]) 
    ? problemsData.items[lang] 
    : defaultItems;

  return (
    <section className="py-20 bg-brand-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Text Card */}
          <div className="bg-white p-8 md:p-12 shadow-xl border-l-4 border-brand-accent h-full flex flex-col justify-center rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-8 text-brand-dark">
              {heading}
            </h3>
            <ul className="space-y-4">
              {items.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0 w-6 h-6 rounded-full bg-brand-beige flex items-center justify-center text-brand-dark">
                    <span className="font-bold text-sm">!</span>
                  </div>
                  <span className="text-gray-700 font-medium">{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Card */}
           <div className="relative shadow-xl overflow-hidden h-full min-h-[400px] rounded-2xl">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Social Media Challenges" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-brand-dark flex items-center justify-center p-8">
                   <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center">
                      <span className="text-white text-4xl font-black">!</span>
                   </div>
                </div>
              )}
           </div>

        </div>
      </div>
    </section>
  );
};

export const Pricing: React.FC<SectionProps & { lang: Language }> = ({ content, navigate, lang, settings }) => {
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const { data } = await supabase
          .from('pricing_tiers')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (data) {
          setTiers(data);
        }
      } catch (err) {
        console.error("Error loading pricing tiers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTiers();
  }, []);

  const title = getLoc(settings?.home_pricing_title, lang, content.pricing.title);
  const subtitle = getLoc(settings?.home_pricing_subtitle, lang, "Choose the perfect plan to elevate your brand presence.");

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-beige/20 -skew-x-12 translate-x-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-center text-brand-dark">
          {title}
        </h3>
        <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
          {subtitle}
        </p>
        
        {loading ? (
          <div className="text-center text-gray-300 py-12">Loading packages...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
            {tiers.map((tier, idx) => {
              const isDark = tier.is_popular;
              const name = getLoc(tier.name, lang, "");
              const price = getLoc(tier.price, lang, "");
              
              let features: string[] = [];
              if (tier.features) {
                if (Array.isArray(tier.features)) {
                  features = tier.features;
                } else if (typeof tier.features === 'object') {
                   features = (lang ? tier.features[lang] : undefined) || tier.features['en'] || [];
                }
              }
              
              return (
                <div 
                  key={tier.id || idx} 
                  className={`
                    relative flex flex-col p-8 md:p-10 transition-all duration-300 rounded-2xl
                    ${isDark 
                      ? 'bg-brand-dark text-white shadow-2xl md:-mt-8 md:mb-8 md:scale-105 z-10 border-brand-dark' 
                      : 'bg-brand-light text-brand-dark border border-brand-beige hover:border-brand-accent/30 hover:shadow-lg hover:-translate-y-2'
                    }
                  `}
                >
                  {isDark && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-accent text-white text-xs font-bold uppercase px-4 py-1.5 tracking-widest rounded-full shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8 text-center">
                    <h4 className={`text-sm font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-brand-accent' : 'text-gray-500'}`}>
                      {name}
                    </h4>
                    <div className={`text-2xl lg:text-3xl font-black leading-tight ${isDark ? 'text-white' : 'text-brand-dark'}`}>
                      {price}
                    </div>
                  </div>

                  <div className={`h-px w-full mb-8 ${isDark ? 'bg-white/10' : 'bg-brand-dark/10'}`}></div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {features.map((feat: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start text-sm md:text-base leading-relaxed">
                        <div className={`mt-1 mr-3 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isDark ? 'bg-brand-accent/20 text-brand-accent' : 'bg-brand-dark/5 text-brand-dark'}`}>
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{typeof feat === 'string' ? feat : JSON.stringify(feat)}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => navigate?.('contact')}
                    className={`
                      w-full py-4 px-6 text-sm font-bold uppercase tracking-widest transition-all duration-300 rounded-xl
                      ${isDark 
                        ? 'bg-brand-accent text-white hover:bg-white hover:text-brand-dark' 
                        : 'bg-transparent border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white'
                      }
                    `}
                  >
                    Select Plan
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export const Testimonials: React.FC<SectionProps & { lang: Language }> = ({ content, lang, settings }) => {
  const [items, setItems] = useState<any[]>([]);
  
  // Dynamic titles
  const title = getLoc(settings?.home_testimonials_title, lang, content.testimonials.title); 
  const subtitle = getLoc(settings?.home_testimonials_subtitle, lang, "");

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setItems(data);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-20 bg-brand-dark text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold uppercase tracking-tighter text-brand-light">
            {title}
          </h3>
          {subtitle && (
            <p className="text-brand-accent uppercase tracking-widest mt-2 text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-accent/30 mb-6">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex text-brand-accent mb-4">
                  {[...Array(item.rating || 5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-lg italic text-brand-beige/80 mb-6 font-light">
                  "{getLoc(item.quote, lang, "")}"
                </p>
                <div>
                  <div className="font-bold uppercase tracking-wide text-brand-light">{item.name}</div>
                  <div className="text-xs text-brand-accent uppercase mt-1">
                    {getLoc(item.role, lang, "")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-center text-brand-beige/50">Loading testimonials...</div>
        )}
      </div>
    </section>
  );
};

export const Clients: React.FC<SectionProps> = ({ content, settings, lang }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await supabase
          .from('clients')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (data) {
          setClients(data);
        }
      } catch (err) {
        console.error("Error loading clients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const title = getLoc(settings?.home_clients_title, lang, content.clients.title);

  const marqueeList = clients.length > 0 
    ? [...clients, ...clients, ...clients, ...clients]
    : [];

  return (
    <section className="py-16 bg-white border-b border-gray-100 overflow-hidden">
       <div className="w-full">
        <p className="text-center text-sm uppercase tracking-widest text-gray-400 mb-12">{title}</p>
        
        <div className="relative w-full overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          
          {loading ? (
             <div className="text-center text-gray-300 py-4">Loading clients...</div>
          ) : (
            <div className="flex w-max animate-marquee">
              {marqueeList.map((client, idx) => (
                <div key={idx} className="flex-shrink-0 px-8 md:px-16 flex items-center justify-center">
                  {client.logo_url ? (
                    <img 
                      src={client.logo_url} 
                      alt={client.name} 
                      className="h-12 md:h-16 w-auto object-contain opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                    />
                  ) : (
                    <span className="text-xl md:text-3xl font-black uppercase text-brand-dark/40 hover:text-brand-accent transition-colors duration-300 cursor-default">
                      {client.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
       </div>
    </section>
  );
};

export const FAQ: React.FC<SectionProps & { lang: Language }> = ({ content, lang, settings }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (data) {
          setItems(data);
        }
      } catch (err) {
        console.error("Error loading FAQs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const title = getLoc(settings?.home_faq_title, lang, content.faq.title);

  return (
    <section className="py-20 bg-brand-light">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h3 className="text-3xl font-bold uppercase tracking-tighter mb-12 text-center text-brand-dark">
          {title}
        </h3>
        
        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading FAQs...</div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => {
              const question = getLoc(item.question, lang, "");
              const answer = getLoc(item.answer, lang, "");

              return (
                <div key={item.id || idx} className="bg-white border border-brand-beige shadow-sm">
                  <button 
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-brand-light/50 transition-colors"
                  >
                    <span className="font-bold text-brand-dark pr-8">{question}</span>
                    {openIndex === idx ? <Minus className="w-5 h-5 text-brand-accent flex-shrink-0" /> : <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  </button>
                  {openIndex === idx && (
                    <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2 border-t border-dashed border-gray-100 mt-2 pt-4">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export const ContactStrip: React.FC<SectionProps> = ({ content, settings, lang }) => {
  const heading = getLoc(settings?.contact_strip_heading, lang, content.contactStrip.heading);
  const btnText = getLoc(settings?.contact_whatsapp_btn, lang, content.contactStrip.button);
  
  // Use settings phone, fallback to button text (if it's a number), then fallback
  const rawPhone = settings?.contact_phone_display || btnText || "";
  // Strip everything except numbers
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');
  const waLink = `https://wa.me/${cleanPhone}`;

  return (
    <section className="py-12 bg-brand-accent text-white">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="flex items-center mb-6 md:mb-0">
          <MessageCircle className="w-8 h-8 mr-4 text-brand-dark" />
          <h3 className="text-2xl font-bold uppercase tracking-tight text-brand-dark">{heading}</h3>
        </div>
        <a 
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="bg-brand-dark text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-colors rounded-full"
        >
          {btnText}
        </a>
      </div>
    </section>
  );
};