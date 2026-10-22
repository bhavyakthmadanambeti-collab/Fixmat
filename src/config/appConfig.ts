/**
 * FixMate AI - Central Application Configuration
 * Developed by Bhavyakth (Founder & App Developer)
 * 
 * IMPORTANT:
 * When the Android application is officially published to the Google Play Store,
 * update the PLAY_STORE_URL below or set VITE_PLAY_STORE_URL in your environment.
 */

export const APP_CONFIG = {
  appName: 'FixMate AI',
  tagline: 'See the problem. Get an estimate. Find the right expert.',
  developer: 'Bhavyakth',
  developerTitle: 'Founder & App Developer',
  developerCredit: 'Developed by Bhavyakth',
  packageId: 'com.bhavyakth.fixmateai',
  
  /**
   * Primary Store Link Configuration
   * Can be overridden by VITE_PLAY_STORE_URL or VITE_APP_STORE_URL environment variables.
   */
  PLAY_STORE_URL:
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PLAY_STORE_URL) ||
    'https://play.google.com/store/apps/details?id=com.bhavyakth.fixmateai',

  APP_STORE_URL:
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_APP_STORE_URL) ||
    'https://apps.apple.com/app/fixmate-ai/id6478901234',

  /**
   * Custom Deep Link Scheme for installed Android & iOS native apps
   */
  customScheme: 'fixmateai',
  domain: typeof window !== 'undefined' ? window.location.origin : 'https://fixmateai.app',
};

/**
 * Generate deep link for opening specific items in the installed Android app or web fallback
 */
export function generateDeepLink(
  path: 'booking' | 'provider' | 'diagnosis' | 'chat' | 'home',
  id?: string
): { webUrl: string; appIntentUrl: string; customSchemeUrl: string } {
  const targetPath = id ? `${path}/${id}` : path;
  const webUrl = `${APP_CONFIG.domain}/#/${targetPath}`;
  const customSchemeUrl = `${APP_CONFIG.customScheme}://${targetPath}`;
  
  // Android Intent URI for seamless native app launching with web fallback
  const appIntentUrl = `intent://${targetPath}#Intent;scheme=${APP_CONFIG.customScheme};package=${APP_CONFIG.packageId};S.browser_fallback_url=${encodeURIComponent(
    webUrl
  )};end`;

  return { webUrl, appIntentUrl, customSchemeUrl };
}
