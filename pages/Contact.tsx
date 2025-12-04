import React, { useEffect, useState } from 'react';
import { Content, SiteSettings, Language } from '../types';
import { Phone, Mail, MapPin } from 'lucide-react';

interface Props {
  content: Content;
  settings?: SiteSettings;
  lang?: Language;
  initialMessage?: string;
}

const Contact: React.FC<Props> = ({ content, settings, lang, initialMessage }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  // Helper to safely extract string from potentially localized setting
  const getSafe = (val: any) => {
    if (val === undefined || val === null) return undefined;
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      if (lang && typeof val[lang] === 'string') return val[lang];
      if (typeof val['en'] === 'string') return val['en'];
      // Fallback: assume first value is string
      const v = Object.values(val)[0];
      if (typeof v === 'string') return v;
    }
    return undefined;
  };

  const phone = getSafe(settings?.contact_phone_display) || "+32 (0) 476 76 63 12";
  const email = getSafe(settings?.contact_email) || "hello@reach-studio.be";
  const address = getSafe(settings?.contact_address) || "Bruxelles, Belgique";

  return (
    <main className="pt-32 pb-20 min-h-screen bg-brand-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Info Side */}
          <div className="bg-brand-dark text-white p-12 md:w-2/5 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">{content.contactPage.detailsTitle}</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-4 text-brand-accent mt-1" />
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">WhatsApp / Phone</div>
                    <div className="text-lg font-medium">{phone}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-4 text-brand-accent mt-1" />
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Email</div>
                    <div className="text-lg font-medium">{email}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 text-brand-accent mt-1" />
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Location</div>
                    <div className="text-lg font-medium">{address}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 md:mt-0 pt-12 border-t border-white/10">
               <p className="text-brand-beige/80 text-sm leading-relaxed">
                 {/* Reusing hero lead text if available, or static snippet */}
                 {content.hero.lead.substring(0, 100)}...
               </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-12 md:w-3/5">
            <h1 className="text-3xl font-bold uppercase tracking-tight mb-8 text-brand-dark">{content.contactPage.title}</h1>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">{content.contactPage.name}</label>
                <input 
                  type="text" 
                  className="w-full bg-brand-light border-b-2 border-gray-200 p-3 focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">{content.contactPage.email}</label>
                <input 
                  type="email" 
                  className="w-full bg-brand-light border-b-2 border-gray-200 p-3 focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">{content.contactPage.message}</label>
                <textarea 
                  rows={4}
                  className="w-full bg-brand-light border-b-2 border-gray-200 p-3 focus:outline-none focus:border-brand-accent transition-colors"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-dark text-white font-bold uppercase tracking-widest py-4 hover:bg-brand-accent transition-colors"
              >
                {content.contactPage.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;