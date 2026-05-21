/**
 * Single entry point for all deep link URL parsing.
 * Supports Universal Links (https) and custom scheme (quickcart://).
 *
 * @param {string} urlString - Full URL from native bridge, Branch, or Linking
 * @param {'quickcart' | 'shopcart'} app - Which app is resolving the link
 * @returns {{ screen: string, params: Record<string, string> } | null}
 */
function resolveDeepLink(urlString, app = 'quickcart') {
  if (!urlString || typeof urlString !== 'string') {
    return null;
  }

  let url;
  try {
    const normalized =
      urlString.startsWith('quickcart://') || urlString.startsWith('shopcart://')
        ? urlString.replace(/^shopcart:\/\//, 'quickcart://')
        : urlString;
    url = new URL(
      normalized.includes('://') ? normalized : `https://${normalized}`,
    );
  } catch {
    return null;
  }

  const scheme = url.protocol.replace(':', '');
  const isCustomScheme = scheme === 'quickcart' || scheme === 'shopcart';

  let pathname = url.pathname || '/';
  if (isCustomScheme) {
    pathname = `/${url.host}${pathname}`.replace(/\/+/g, '/');
    if (pathname.endsWith('/') && pathname.length > 1) {
      pathname = pathname.slice(0, -1);
    }
  }

  pathname = decodeURIComponent(pathname);

  const segments = pathname.split('/').filter(Boolean);

  if (app === 'shopcart') {
    return resolveShopCartPath(segments);
  }

  return resolveQuickCartPath(segments);
}

function resolveQuickCartPath(segments) {
  if (segments.length >= 2 && segments[0] === 'product') {
    return {screen: 'Product', params: {id: segments[1]}};
  }
  if (segments.length >= 2 && segments[0] === 'category') {
    return {screen: 'Category', params: {id: segments[1]}};
  }
  if (segments.length === 1 && segments[0] === 'product') {
    return null;
  }
  return {screen: 'Home', params: {}};
}

function resolveShopCartPath(segments) {
  if (
    segments.length >= 3 &&
    segments[0] === 'quickcart' &&
    segments[1] === 'product'
  ) {
    return {
      screen: 'QuickCartTab',
      params: {productId: segments[2]},
    };
  }

  if (segments.length >= 2 && segments[0] === 'product') {
    return {
      screen: 'QuickCartTab',
      params: {productId: segments[1]},
    };
  }

  if (segments.length >= 2 && segments[0] === 'category') {
    return {
      screen: 'Category',
      params: {id: segments[1]},
    };
  }

  return {screen: 'Home', params: {}};
}

module.exports = {resolveDeepLink};
