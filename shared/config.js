/**
 * POC configuration — update before deploying to a real device.
 *
 * DEEP_LINK_HOST: HTTPS host serving web fallback + AASA (no trailing slash).
 *   GitHub Pages project: https://YOUR_USER.github.io/deeplinkingmini
 *   Custom domain: https://quickcart.demo
 *
 * APPLE_TEAM_ID: 10-character Apple Developer Team ID (for AASA appID).
 */
export const DEEP_LINK_HOST = 'https://YOUR_USER.github.io/deeplinkingmini';

export const CUSTOM_SCHEME = 'quickcart';

export const BUNDLE_IDS = {
  quickCart: 'com.flipkartpoc.quickcart',
  shopCart: 'com.flipkartpoc.shopcart',
};

/** Replace YOUR_APPLE_TEAM_ID in web/.well-known/apple-app-site-association */
export const APPLE_TEAM_ID = 'YOUR_APPLE_TEAM_ID';
