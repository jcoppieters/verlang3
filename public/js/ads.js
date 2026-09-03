/**
 * Google AdSense loader.
 *
 * The AdSense script used to load unconditionally in index.html, which let
 * it place ads on every screen of this SPA - including the loading spinner,
 * login/register/password forms, profile settings, and empty states. Google
 * flagged that as "Google-served ads on screens without publisher-content".
 *
 * To fix it, the script is now only injected into pages that render real
 * content of their own, via renderAdSlot() below. Because the router
 * replaces mainContent's innerHTML on every navigation, the ad element is
 * destroyed the moment the user leaves that page.
 */
const ADSENSE_CLIENT = 'ca-pub-5834909718334305';

// TODO: replace with a real ad unit slot ID from the AdSense dashboard
// (Ads > By ad unit > Display ads) before this ships. Auto ads should also
// be turned off for the site so it can't place ads outside this slot.
const ADSENSE_SLOT = 'REPLACE_WITH_AD_UNIT_SLOT_ID';

let adsenseScriptPromise = null;

function loadAdsenseScript() {
  if (!adsenseScriptPromise) {
    adsenseScriptPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
  }
  return adsenseScriptPromise;
}

/**
 * Render an ad into `containerId`. Only call this from pages that have
 * substantial publisher content of their own - never from auth, loading,
 * or other utility screens.
 */
async function renderAdSlot(containerId) {
  if (ADSENSE_SLOT.startsWith('REPLACE_')) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="${ADSENSE_CLIENT}"
         data-ad-slot="${ADSENSE_SLOT}"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  `;

  await loadAdsenseScript();
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.error('AdSense push failed:', error);
  }
}
