import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from './components/Layout';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import { CONTENT } from './constants';
import { Language, SiteSettings } from './types';
import { useSiteSettings } from './hooks/useSiteSettings';

// Helper to get localized setting safe
const getLocSetting = (settings: SiteSettings, key: string, lang: Language, fallback: string) => {
  const val = settings[key];
  if (!val) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val[lang] || val['en'] || fallback;
  }
  return fallback;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fr');
  const [currentPage, setCurrentPage] = useState('home');
  const [prefilledMessage, setPrefilledMessage] = useState('');
  const { settings, loading: settingsLoading } = useSiteSettings();

  // Simple Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Handle SEO Metadata updates
  useEffect(() => {
    const defaultTitle = lang === 'fr' 
      ? 'Reach Studio - Agence Réseaux Sociaux' 
      : 'Reach Studio - Social Media Agency';
    
    const defaultDesc = lang === 'fr'
      ? 'Reach Studio est une agence digitale spécialisée dans la création de contenu et la gestion complète des réseaux sociaux pour les entreprises.'
      : 'Reach Studio is a digital agency specializing in content creation and full social media management for businesses.';

    const defaultKeywords = lang === 'fr'
      ? 'réseaux sociaux, création de contenu, agence digitale, image de marque, marketing'
      : 'social media, content creation, digital agency, branding, marketing';

    // 1. Update Title
    const title = getLocSetting(settings, 'site_title', lang, defaultTitle);
    document.title = title;

    // 2. Update Description
    const description = getLocSetting(settings, 'site_description', lang, defaultDesc);
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update Keywords
    const keywords = getLocSetting(settings, 'site_keywords', lang, defaultKeywords);
    let metaKeywords = document.querySelector("meta[name='keywords']");
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

  }, [settings, lang]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            content={CONTENT[lang]} 
            navigate={setCurrentPage} 
            lang={lang} 
            settings={settings}
            setPrefilledMessage={setPrefilledMessage}
          />
        );
      case 'portfolio':
        return <Portfolio content={CONTENT[lang]} settings={settings} />;
      case 'contact':
        return (
          <Contact 
            content={CONTENT[lang]} 
            settings={settings} 
            lang={lang} 
            initialMessage={prefilledMessage}
          />
        );
      default:
        return (
          <Home 
            content={CONTENT[lang]} 
            navigate={setCurrentPage} 
            lang={lang} 
            settings={settings}
            setPrefilledMessage={setPrefilledMessage}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark selection:bg-brand-accent/30 selection:text-brand-dark bg-brand-light">
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        content={CONTENT[lang]} 
        navigate={setCurrentPage}
        currentPage={currentPage}
        settings={settings}
      />
      
      <div className="flex-grow">
        {renderPage()}
      </div>

      <Footer content={CONTENT[lang]} settings={settings} lang={lang} />
    </div>
  );
};

export default App;