import type { HomePageContent, Branding } from '../backend';

export const DEFAULT_BRANDING: Branding = {
  heroBadge: 'ABHISHEK YADAV PRESENT',
  brandName: 'PIXEL NOVA DIGITALS',
  tagLine: '100% Free AI Tools',
  logoFile: '/assets/IMG_20260211_093115.png',
};

export const DEFAULT_HOMEPAGE_CONTENT: HomePageContent = {
  heroTitle: 'AI-Powered Creative Tools for Everyone',
  heroSubtitle: 'Transform your ideas into reality with our suite of free AI tools. Generate images, videos, and voiceovers instantly—no signup required to start creating.',
  freeSection: 'All our tools are completely free to use. No hidden costs, no subscriptions.',
  premiumSection: 'Sign in to save your generation history and access it anytime.',
  branding: DEFAULT_BRANDING,
};

export function mergeWithDefaults(content: HomePageContent | null): HomePageContent {
  if (!content) return DEFAULT_HOMEPAGE_CONTENT;
  
  // Deep merge branding object
  const branding: Branding = {
    heroBadge: content.branding?.heroBadge || DEFAULT_BRANDING.heroBadge,
    brandName: content.branding?.brandName || DEFAULT_BRANDING.brandName,
    tagLine: content.branding?.tagLine || DEFAULT_BRANDING.tagLine,
    logoFile: content.branding?.logoFile || DEFAULT_BRANDING.logoFile,
  };
  
  return {
    heroTitle: content.heroTitle || DEFAULT_HOMEPAGE_CONTENT.heroTitle,
    heroSubtitle: content.heroSubtitle || DEFAULT_HOMEPAGE_CONTENT.heroSubtitle,
    freeSection: content.freeSection || DEFAULT_HOMEPAGE_CONTENT.freeSection,
    premiumSection: content.premiumSection || DEFAULT_HOMEPAGE_CONTENT.premiumSection,
    branding,
  };
}
