import React from 'react';
import { Content, Language, SiteSettings } from '../types';
import { Hero, Services, Problems, Pricing, Testimonials, Clients, ContactStrip, FAQ, VideoLoop } from '../components/HomeSections';

interface Props {
  content: Content;
  navigate: (page: string) => void;
  lang: Language;
  settings: SiteSettings;
  setPrefilledMessage: (msg: string) => void;
}

const Home: React.FC<Props> = ({ content, navigate, lang, settings, setPrefilledMessage }) => {
  return (
    <main>
      <Hero content={content} navigate={navigate} settings={settings} lang={lang} />
      <Services 
        content={content} 
        navigate={navigate} 
        lang={lang} 
        settings={settings} 
        setPrefilledMessage={setPrefilledMessage}
      />
      <VideoLoop settings={settings} />
      <Problems content={content} settings={settings} lang={lang} />
      <Pricing content={content} navigate={navigate} lang={lang} settings={settings} />
      <Testimonials content={content} lang={lang} settings={settings} />
      <Clients content={content} settings={settings} />
      <ContactStrip content={content} settings={settings} lang={lang} />
      <FAQ content={content} lang={lang} settings={settings} />
    </main>
  );
};

export default Home;