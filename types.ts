export type Language = 'fr' | 'en';

export type SiteSettings = Record<string, any>;

export interface Content {
  nav: {
    home: string;
    portfolio: string;
    contact: string;
    cta: string;
  };
  hero: {
    heading: string;
    subheading: string;
    lead: string;
    cta: string;
  };
  services: {
    title: string;
    link: string;
  };
  problems: {
    heading: string;
  };
  pricing: {
    title: string;
  };
  testimonials: {
    title: string;
  };
  clients: {
    title: string;
  };
  contactStrip: {
    heading: string;
    button: string;
  };
  faq: {
    title: string;
  };
  contactPage: {
    title: string;
    name: string;
    email: string;
    message: string;
    submit: string;
    detailsTitle: string;
  };
  portfolioPage: {
    title: string;
  };
  footer: {
    copyright: string;
  };
}