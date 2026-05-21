(function () {
  /** GitHub Pages project folder name, or "" for custom domain root */
  const BASE_PATH = window.POC_BASE_PATH || '/deeplinkingmini';

  const CUSTOM_SCHEME = 'quickcart';

  function normalizePath(pathname) {
    let path = pathname || '/';
    if (BASE_PATH && path.startsWith(BASE_PATH)) {
      path = path.slice(BASE_PATH.length) || '/';
    }
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    return path;
  }

  function parseRoute(pathname) {
    const path = normalizePath(pathname);
    const segments = path.split('/').filter(Boolean);

    if (segments[0] === 'product' && segments[1]) {
      return {type: 'product', id: segments[1]};
    }
    if (segments[0] === 'category' && segments[1]) {
      return {type: 'category', id: segments[1]};
    }
    return {type: 'home'};
  }

  function isInAppBrowser() {
    const ua = navigator.userAgent || '';
    return /Instagram|FBAN|FBAV|FB_IAB|Facebook|Line\/|Twitter|LinkedInApp/i.test(
      ua,
    );
  }

  function getProduct(id) {
    return (window.POC_DATA?.products || []).find(p => p.id === id);
  }

  function getCategory(id) {
    return (window.POC_DATA?.categories || []).find(c => c.id === id);
  }

  function buildCustomSchemeUrl(route) {
    if (route.type === 'product') {
      return `${CUSTOM_SCHEME}://product/${route.id}`;
    }
    if (route.type === 'category') {
      return `${CUSTOM_SCHEME}://category/${route.id}`;
    }
    return `${CUSTOM_SCHEME}://home`;
  }

  function renderInterstitial(route) {
    const schemeUrl = buildCustomSchemeUrl(route);
    return `
      <div class="interstitial">
        <h2>Open in QuickCart app</h2>
        <p class="muted">Universal Links often do not work inside Instagram/Facebook in-app browsers. Use the button below.</p>
        <a class="btn btn-primary" href="${schemeUrl}">Open in QuickCart</a>
        <p class="muted" style="margin-top:12px">Or tap ··· and choose <strong>Open in Safari</strong>, then tap the link again for Universal Links.</p>
      </div>
    `;
  }

  function renderHome() {
    const products = window.POC_DATA?.products || [];
    return `
      <div class="card">
        <h2>QuickCart Web Fallback</h2>
        <p class="muted">Scenario C: neither app installed. Install QuickCart, then deferred deep linking (Branch) opens the product.</p>
      </div>
      <div class="link-list card">
        <strong>Demo product links</strong>
        ${products
          .map(
            p =>
              `<a href="${BASE_PATH}/product/${p.id}">${p.name}</a>`,
          )
          .join('')}
      </div>
    `;
  }

  function renderProduct(id) {
    const product = getProduct(id);
    const route = {type: 'product', id};
    const interstitial = isInAppBrowser() ? renderInterstitial(route) : '';

    if (!product) {
      return `<div class="card"><h2>Product not found</h2><p class="muted">${id}</p></div>`;
    }

    return `
      ${interstitial}
      <div class="card">
        <p class="muted">Web fallback · install QuickCart for 10-min delivery</p>
        <h2>${product.name}</h2>
        <p class="price">₹${product.price}</p>
        <p class="muted">ID: ${product.id}</p>
        <a class="btn btn-primary" href="${buildCustomSchemeUrl(route)}">Open in QuickCart</a>
        <p class="muted">After install, Branch restores this destination on first launch (Scenario C).</p>
      </div>
    `;
  }

  function renderCategory(id) {
    const category = getCategory(id);
    const route = {type: 'category', id};
    const interstitial = isInAppBrowser() ? renderInterstitial(route) : '';
    const products = (window.POC_DATA?.products || []).filter(
      p => p.category === id,
    );

    return `
      ${interstitial}
      <div class="card">
        <h2>${category?.name || 'Category'}</h2>
        <p class="muted">${products.length} items</p>
        ${products
          .map(
            p =>
              `<p><a href="${BASE_PATH}/product/${p.id}">${p.name}</a> · ₹${p.price}</p>`,
          )
          .join('')}
      </div>
    `;
  }

  window.POCRouter = {
    BASE_PATH,
    parseRoute,
    isInAppBrowser,
    renderApp() {
      const route = parseRoute(window.location.pathname);
      const content = document.getElementById('app-content');
      if (!content) {
        return;
      }

      let html = '';
      if (route.type === 'product') {
        html = renderProduct(route.id);
      } else if (route.type === 'category') {
        html = renderCategory(route.id);
      } else {
        html = renderHome();
      }

      content.innerHTML = html;
      document.title =
        route.type === 'product'
          ? `QuickCart · ${route.id}`
          : 'QuickCart · Web Fallback';
    },
  };
})();
