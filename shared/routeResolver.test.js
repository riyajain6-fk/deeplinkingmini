const {resolveDeepLink} = require('./routeResolver');

const cases = [
  {
    url: 'https://quickcart.demo/product/milk-1l',
    app: 'quickcart',
    expect: {screen: 'Product', params: {id: 'milk-1l'}},
  },
  {
    url: 'quickcart://product/milk-1l',
    app: 'quickcart',
    expect: {screen: 'Product', params: {id: 'milk-1l'}},
  },
  {
    url: 'https://quickcart.demo/category/dairy',
    app: 'quickcart',
    expect: {screen: 'Category', params: {id: 'dairy'}},
  },
  {
    url: 'https://quickcart.demo/product/milk-1l',
    app: 'shopcart',
    expect: {screen: 'QuickCartTab', params: {productId: 'milk-1l'}},
  },
  {
    url: 'https://quickcart.demo/quickcart/product/milk-1l',
    app: 'shopcart',
    expect: {screen: 'QuickCartTab', params: {productId: 'milk-1l'}},
  },
];

let passed = 0;
for (const {url, app, expect: expected} of cases) {
  const result = resolveDeepLink(url, app);
  const ok =
    result?.screen === expected.screen &&
    JSON.stringify(result?.params) === JSON.stringify(expected.params);
  if (ok) {
    passed += 1;
    console.log(`✓ ${url} (${app})`);
  } else {
    console.error(`✗ ${url} (${app})`, result, 'expected', expected);
  }
}
console.log(`\n${passed}/${cases.length} passed`);
