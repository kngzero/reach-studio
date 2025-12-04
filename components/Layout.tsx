import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Instagram, Linkedin, Mail } from 'lucide-react';
import { Language, Content, SiteSettings } from '../types';

interface LayoutProps {
  children?: React.ReactNode;
  lang: Language;
  setLang: (lang: Language) => void;
  content: Content;
  navigate: (page: string) => void;
  currentPage: string;
  settings?: SiteSettings;
}

export const Navbar: React.FC<LayoutProps> = ({ lang, setLang, content, navigate, currentPage, settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to get dynamic label or fallback to static content
  const getNavLabel = (key: string, fallback: string) => {
    if (settings && settings[`nav_${key}_label`]) {
      const val = settings[`nav_${key}_label`];
      // Check if it's an object with language keys
      if (typeof val === 'object' && val !== null) {
         const localized = val[lang] || val['en'];
         return (typeof localized === 'string' ? localized : fallback) || fallback;
      }
      return (typeof val === 'string' ? val : fallback) || fallback;
    }
    return fallback;
  };

  const navLinks = [
    { label: getNavLabel('home', content.nav.home), page: 'home' },
    { label: getNavLabel('portfolio', content.nav.portfolio), page: 'portfolio' },
  ];

  const contactLabel = getNavLabel('contact', content.nav.contact);
  const ctaLabel = getNavLabel('cta', content.nav.cta);

  // Check if we are over the dark hero section (Home page + not scrolled)
  const isDarkHero = !scrolled && currentPage === 'home';

  // Determine logo URL
  // If dark hero (transparent bg): prefer "site_logo_light" (light logo)
  // If scrolled (white bg): prefer "site_logo_dark" (dark logo)
  // Fallback to "site_logo" if "site_logo_light" is missing for backward compatibility or data variance
  let logoUrl: string | null = null;
  const logoLight = (typeof settings?.site_logo_light === 'string' ? settings.site_logo_light : (typeof settings?.site_logo === 'string' ? settings.site_logo : null));
  const logoDark = typeof settings?.site_logo_dark === 'string' ? settings.site_logo_dark : null;

  if (isDarkHero) {
    logoUrl = logoLight || logoDark;
  } else {
    logoUrl = logoDark || logoLight;
  }

  // Navbar text color
  const navTextColor = isDarkHero ? 'text-white' : 'text-brand-dark';
  const navHoverColor = 'text-brand-accent';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-light/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={() => navigate('home')} 
          className={`cursor-pointer font-black text-2xl tracking-tighter uppercase flex items-center ${navTextColor}`}
        >
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Reach Studio" 
              className="h-10 w-auto object-contain" 
            />
          ) : (
            <span>Reach Studio</span>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => navigate(link.page)}
              className={`text-sm font-medium tracking-wide uppercase transition-colors hover:${navHoverColor} ${currentPage === link.page ? 'text-brand-accent' : navTextColor}`}
            >
              {link.label}
            </button>
          ))}
          
          <div className={`h-4 w-px ${isDarkHero ? 'bg-white/20' : 'bg-brand-dark/20'}`}></div>

          <button
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className={`flex items-center text-sm font-semibold hover:${navHoverColor} transition-colors ${navTextColor}`}
          >
            <Globe className="w-4 h-4 mr-1" />
            {lang.toUpperCase()}
          </button>

          <button 
            onClick={() => navigate('contact')}
            className={`${isDarkHero ? 'bg-white text-brand-dark hover:bg-brand-accent hover:text-white' : 'bg-brand-dark text-white hover:bg-brand-accent'} px-5 py-2 text-sm font-bold uppercase tracking-wider transition-colors`}
          >
            {ctaLabel}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-2 ${navTextColor}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-light shadow-lg py-4 px-4 flex flex-col space-y-4">
           {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => {
                navigate(link.page);
                setIsOpen(false);
              }}
              className={`text-left text-lg font-medium ${currentPage === link.page ? 'text-brand-accent' : 'text-brand-dark'}`}
            >
              {link.label}
            </button>
          ))}
          {/* Mobile specific Contact link since it's hidden from navLinks for desktop */}
          <button
            onClick={() => {
              navigate('contact');
              setIsOpen(false);
            }}
            className={`text-left text-lg font-medium ${currentPage === 'contact' ? 'text-brand-accent' : 'text-brand-dark'}`}
          >
            {contactLabel}
          </button>

          <div className="h-px w-full bg-brand-dark/10 my-2"></div>
          <button
            onClick={() => {
              setLang(lang === 'fr' ? 'en' : 'fr');
              setIsOpen(false);
            }}
            className="text-left font-semibold flex items-center text-brand-dark"
          >
            <Globe className="w-4 h-4 mr-2" />
            {lang === 'fr' ? 'English' : 'Français'}
          </button>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC<{ content: Content; settings?: SiteSettings; lang?: Language }> = ({ content, settings, lang }) => {
  // Safe extraction helper
  const getSafeString = (val: any) => {
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null) {
      if (lang && typeof val[lang] === 'string') return val[lang];
      if (typeof val['en'] === 'string') return val['en'];
      // Fallback to first value if string
      const first = Object.values(val)[0];
      if (typeof first === 'string') return first;
    }
    return null;
  };

  const email = getSafeString(settings?.contact_email) || "hello@reach-studio.be";
  const copyright = getSafeString(settings?.footer_copyright) || content.footer.copyright;

  return (
    <footer className="bg-brand-dark text-brand-light py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
             <div className="font-black text-xl tracking-tighter uppercase mb-2">Reach Studio</div>
             <p className="text-brand-accent text-sm">{email}</p>
          </div>
          
          <div className="flex space-x-6 mb-6 md:mb-0">
            {typeof settings?.social_instagram === 'string' && settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noreferrer" className="hover:text-brand-accent transition-colors"><Instagram className="w-5 h-5" /></a>
            )}
            {typeof settings?.social_linkedin === 'string' && settings.social_linkedin && (
              <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="hover:text-brand-accent transition-colors"><Linkedin className="w-5 h-5" /></a>
            )}
            {typeof settings?.social_vimeo === 'string' && settings.social_vimeo && (
              <a href={settings.social_vimeo} target="_blank" rel="noreferrer" className="hover:text-brand-accent transition-colors"><Instagram className="w-5 h-5" /></a>
            )}
            {(!settings?.social_instagram && !settings?.social_linkedin) && (
              <>
                 <a href="#" className="hover:text-brand-accent transition-colors"><Instagram className="w-5 h-5" /></a>
                 <a href="#" className="hover:text-brand-accent transition-colors"><Linkedin className="w-5 h-5" /></a>
              </>
            )}
            <a href={`mailto:${email}`} className="hover:text-brand-accent transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
        <div className="border-t border-brand-light/10 mt-8 pt-8 text-center md:text-left text-sm text-brand-light/50">
          {copyright}
        </div>
      </div>
    </footer>
  );
};